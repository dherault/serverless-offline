import process from "node:process"
import { resolve } from "node:path"
import { execa } from "execa"
import { log } from "../utils/log.js"
import RuntimeServer from "../../RuntimeServer.js"

const { parse } = JSON

export default class BootstrapRunner {
  #codeDir = null

  #timeout = null

  #env = null

  #bootstrap = null

  #runtimeServer = null

  #payload = null

  #subprocess = null

  constructor(funOptions, env) {
    const { codeDir, timeout } = funOptions

    this.#codeDir = codeDir
    this.#timeout = timeout
    this.#env = env
    this.#bootstrap = resolve(codeDir, "./bootstrap")
  }

  async cleanup() {
    if (this.#subprocess && typeof this.#subprocess.kill === "function") {
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
