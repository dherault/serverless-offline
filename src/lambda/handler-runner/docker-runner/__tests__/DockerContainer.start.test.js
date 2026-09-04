import assert from "node:assert"
import {
  copyFile,
  chmod,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { delimiter, join } from "node:path"
import process from "node:process"
import { mock } from "node:test"
import { fileURLToPath } from "node:url"
import DockerContainer from "../DockerContainer.js"
import DockerImage from "../DockerImage.js"

describe("DockerContainer start", () => {
  let directory
  let container
  let originalPath
  let originalLog

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "offline-docker-start-"))
    const fixture = fileURLToPath(
      new URL("fixtures/docker-fixture.cjs", import.meta.url),
    )
    const executable = join(directory, "docker")
    await copyFile(fixture, executable)
    await chmod(executable, 0o755)
    await writeFile(
      join(directory, "docker.cmd"),
      `@"${process.execPath}" "${fixture}" %*\r\n`,
    )
    originalPath = process.env.PATH
    originalLog = process.env.DOCKER_TEST_LOG
    process.env.PATH = `${directory}${delimiter}${originalPath}`
    process.env.DOCKER_TEST_LOG = join(directory, "commands.jsonl")
    mock.method(DockerImage.prototype, "pull", async () => {})
    container = new DockerContainer(
      {},
      "handler.handler",
      "provided.al2023",
      "arm64",
      [],
      { name: "aws" },
      directory,
      { host: "127.0.0.1" },
    )
  })

  afterEach(async () => {
    await container.stop()
    mock.restoreAll()
    process.env.PATH = originalPath
    if (originalLog === undefined) {
      delete process.env.DOCKER_TEST_LOG
    } else {
      process.env.DOCKER_TEST_LOG = originalLog
    }
    await rm(directory, { force: true, recursive: true })
  })

  it("should wait for the listener after the startup log before invoking", async () => {
    let ready = false
    const probes = []
    mock.method(globalThis, "fetch", async (url, options) => {
      if (options?.method === "post") {
        if (!ready) throw new TypeError("fetch failed: ECONNREFUSED")
        return Response.json({ invoked: true })
      }
      // the readiness loop swallows what a probe throws, recording them keeps a
      // wrong url or an early running state from surfacing as a timeout
      probes.push({ isRunning: container.isRunning, url })
      if (probes.length === 1) throw new TypeError("fetch failed: ECONNREFUSED")
      ready = true
      // Any HTTP response proves the listener is up; GET / is not a Lambda invocation.
      return new Response(null, { status: 404 })
    })

    await container.start(directory)

    assert.deepStrictEqual(probes, [
      { isRunning: false, url: "http://127.0.0.1:12345/" },
      { isRunning: false, url: "http://127.0.0.1:12345/" },
    ])
    assert.deepStrictEqual(await container.request({}), { invoked: true })
  })

  it("should remove a container whose listener never becomes ready", async function test() {
    this.timeout(10_000)
    mock.method(globalThis, "fetch", async () => {
      throw new TypeError("fetch failed: ECONNREFUSED")
    })

    await assert.rejects(
      container.start(directory),
      /Docker container did not become ready/,
    )
    assert.strictEqual(container.isRunning, false)
    const commands = (await readFile(process.env.DOCKER_TEST_LOG, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line))
    assert.ok(
      commands.some(
        (args) =>
          args[0] === "rm" &&
          args.includes("--force") &&
          args.includes("test-container"),
      ),
    )
  })

  it("should time out a probe that connects but never returns headers", async function test() {
    this.timeout(10_000)
    mock.method(
      globalThis,
      "fetch",
      (url, { signal }) =>
        new Promise((resolve, reject) => {
          signal.addEventListener("abort", () => reject(signal.reason), {
            once: true,
          })
        }),
    )

    await assert.rejects(
      container.start(directory),
      /Docker container did not become ready/,
    )
    assert.strictEqual(container.isRunning, false)
  })
})
