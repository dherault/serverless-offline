import process from "node:process"
import { resolve } from "node:path"
import { execa } from "execa"
import { existsSync } from "node:fs"
import { log } from "../../../utils/log.js"
import RuntimeServer from "../../RuntimeServer.js"

const { parse } = JSON

const BOOTSTRAP_PATHS = [
  "bootstrap",
  "node_modules/.bin/bootstrap",
  "/var/runtime/bootstrap",
]

export default class BootstrapRunner {
  #codeDir = null

  #timeout = null

  #env = null

  #bootstrap = null

  #runtimeServer = null

  #payload = null

  #subprocess = Promise.resolve()

  constructor(funOptions, env) {
    const { codeDir, timeout, layers } = funOptions

    if (layers && layers.length > 0) {
      // TODO: Support layers if possible?
      throw new Error(
        "Layers are not supported in local execution, please enable custom.offline.useDocker",
      )
    }

    this.#codeDir = codeDir
    this.#timeout = timeout
    this.#env = env
    this.#bootstrap = this.resolveBootstrap(codeDir)

    if (!this.#bootstrap) {
      throw new Error("Unable to locate boostrap a script", BOOTSTRAP_PATHS)
    }
  }

  resolveBootstrap(codeDir) {
    const path = BOOTSTRAP_PATHS.find((p) => existsSync(resolve(codeDir, p)))

    if (!path) {
      return undefined
    }

    return resolve(codeDir, path)
  }

  async cleanup() {
    if (typeof this.#subprocess.kill === "function") {
      this.#subprocess.kill("SIGTERM")
      this.#subprocess = Promise.resolve()
    }
    if (this.#runtimeServer) {
      await this.#runtimeServer.stop()
      this.#runtimeServer = null
    }
  }

  async run(event, context) {
    this.#runtimeServer = new RuntimeServer(event, context, this.#timeout)

    await this.#runtimeServer.start(
      (runtimeApi) => {
        const subprocess = execa(this.#bootstrap, {
          all: true,
          encoding: "utf8",
          env: {
            ...this.#env,
            AWS_LAMBDA_RUNTIME_API: runtimeApi,
            LAMBDA_TASK_ROOT: this.#codeDir,
            PATH: process.env.PATH,
          },
        })

        subprocess.all.on("data", (data) => {
          log.notice(String(data))
        })

        this.#subprocess = subprocess
      },
      (payload) => {
        this.#subprocess.kill()

        if (payload) {
          this.#payload = parse(payload)
        }
      },
    )

    try {
      await this.#subprocess
    } catch (e) {
      if (e.code === "ENOENT") {
        throw new Error(
          `Couldn't find valid bootstrap(s): [${this.#bootstrap}]`,
        )
      }
      if (e.signal !== "SIGTERM") {
        throw e
      }
    }

    await this.cleanup()

    return this.#payload
  }
}
