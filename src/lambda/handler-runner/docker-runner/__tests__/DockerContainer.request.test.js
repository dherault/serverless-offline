import assert from "node:assert"
import { mock } from "node:test"
import DockerContainer from "../DockerContainer.js"

describe("DockerContainer request", () => {
  const container = new DockerContainer(
    {},
    "handler.handler",
    "provided.al2023",
    "arm64",
    [],
    { name: "aws" },
    ".",
    { host: "localhost" },
  )

  afterEach(() => mock.restoreAll())

  it("should accept a successful invocation with an empty body", async () => {
    mock.method(globalThis, "fetch", async () => new Response(null))

    assert.strictEqual(await container.request({}), undefined)
  })

  for (const value of [{ message: "hello" }, null, false, 0, ""]) {
    it(`should preserve a JSON response containing ${JSON.stringify(value)}`, async () => {
      mock.method(globalThis, "fetch", async () => Response.json(value))

      assert.deepStrictEqual(await container.request({}), value)
    })
  }

  it("should still reject a nonempty invalid JSON response", async () => {
    mock.method(globalThis, "fetch", async () => new Response("not json"))

    await assert.rejects(container.request({}), SyntaxError)
  })

  it("should still reject an unsuccessful invocation with an empty body", async () => {
    mock.method(
      globalThis,
      "fetch",
      async () =>
        new Response(null, {
          status: 500,
          statusText: "Internal Server Error",
        }),
    )

    await assert.rejects(container.request({}), /Internal Server Error/)
  })
})
