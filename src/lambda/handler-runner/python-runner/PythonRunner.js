import { spawn } from "node:child_process"
import { EOL, platform } from "node:os"
import { delimiter, join as pathJoin, relative } from "node:path"
import process, { cwd, nextTick } from "node:process"
import { createInterface } from "node:readline"
import { join } from "desm"
import { log } from "../../../utils/log.js"
import { splitHandlerPathAndName } from "../../../utils/index.js"

const { parse, stringify } = JSON
const { assign, hasOwn } = Object

export default class PythonRunner {
  static #payloadIdentifier = "__offline_payload__"

  #env = null

  #handlerProcess = null

  #runtime = null

  constructor(funOptions, env) {
    const { handler, runtime } = funOptions
    const [handlerPath, handlerName] = splitHandlerPathAndName(handler)

    this.#env = env
    this.#runtime = platform() === "win32" ? "python.exe" : runtime

    if (process.env.VIRTUAL_ENV) {
      const runtimeDir = platform() === "win32" ? "Scripts" : "bin"

      process.env.PATH = [
        pathJoin(process.env.VIRTUAL_ENV, runtimeDir),
        delimiter,
        process.env.PATH,
      ].join("")
    }

    const [pythonExecutable] = this.#runtime.split(".")

    this.#handlerProcess = spawn(
      pythonExecutable,
      [
        "-u",
        join(import.meta.url, "invoke.py"),
        relative(cwd(), handlerPath),
        handlerName,
      ],
      {
        env: assign(process.env, this.#env),
        shell: true,
      },
    )

    this.#handlerProcess.stdout.readline = createInterface({
      input: this.#handlerProcess.stdout,
    })
  }

  // () => void
  cleanup() {
    this.#handlerProcess.kill()
  }

  #parsePayload(value) {
    let payload

    for (const item of value.split(EOL)) {
      let json

      // first check if it's JSON
      try {
        json = parse(item)
        // nope, it's not JSON
      } catch {
        // no-op
      }

      // now let's see if we have a property __offline_payload__
      if (
        json &&
        typeof json === "object" &&
        hasOwn(json, PythonRunner.#payloadIdentifier)
      ) {
        payload = json[PythonRunner.#payloadIdentifier]
        // everything else is print(), logging, ...
      } else {
        log.notice(item)
      }
    }

    return payload
  }

  // invokeLocalPython, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L410
  // invoke.py, based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/invoke.py
  async run(event, context) {
    return new Promise((res, rej) => {
      const input = stringify({
        context,
        event,
      })

      const onErr = (data) => {
        log.notice(data.toString())
      }

      const onLine = (line) => {
        try {
          const parsed = this.#parsePayload(line.toString())
          if (parsed) {
            this.#handlerProcess.stdout.readline.removeListener("line", onLine)
            this.#handlerProcess.stderr.removeListener("data", onErr)
            res(parsed)
          }
        } catch (err) {
          rej(err)
        }
      }

      this.#handlerProcess.stdout.readline.on("line", onLine)
      this.#handlerProcess.stderr.on("data", onErr)

      nextTick(() => {
        this.#handlerProcess.stdin.write(input)
        this.#handlerProcess.stdin.write("\n")
      })
    })
  }
}
