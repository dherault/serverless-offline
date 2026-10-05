import { spawn } from "node:child_process"
import { EOL, platform } from "node:os"
import { delimiter, join as pathJoin, relative } from "node:path"
import process, { cwd, nextTick } from "node:process"
import { createInterface } from "node:readline"
import { join } from "desm"
import { log } from "../../../utils/log.js"
import { splitHandlerPathAndName } from "../../../utils/index.js"

const { parse, stringify } = JSON
const { hasOwn } = Object

export default class PythonRunner {
  static #errorIdentifier = "__offline_error__"

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
        env: { ...process.env, ...this.#env },
        shell: true,
      },
    )

    this.#handlerProcess.stdout.readline = createInterface({
      input: this.#handlerProcess.stdout,
    })

    // e.g. EPIPE when writing to a process which exited. Without a listener
    // the error would crash the process, the invocation is rejected on 'exit'.
    this.#handlerProcess.stdin.on("error", (err) => {
      log.debug(`Error writing to the python process: ${err}`)
    })
  }

  // () => void
  cleanup() {
    this.#handlerProcess.kill()
  }

  // (string) => { error?: object, payload?: any }
  #parsePayload(value) {
    let error
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

      // now let's see if we have a property __offline_payload__ or __offline_error__
      if (
        json &&
        typeof json === "object" &&
        hasOwn(json, PythonRunner.#payloadIdentifier)
      ) {
        payload = json[PythonRunner.#payloadIdentifier]
      } else if (
        json &&
        typeof json === "object" &&
        hasOwn(json, PythonRunner.#errorIdentifier)
      ) {
        error = json[PythonRunner.#errorIdentifier]
        // everything else is print(), logging, ...
      } else {
        log.notice(item)
      }
    }

    return {
      error,
      payload,
    }
  }

  // invokeLocalPython, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L410
  // invoke.py, based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/invoke.py
  async run(event, context) {
    const handlerProcess = this.#handlerProcess

    // e.g. the handler module could not be imported
    if (handlerProcess.exitCode != null || handlerProcess.signalCode != null) {
      throw new Error(
        `Python process exited (code=${handlerProcess.exitCode}, signal=${handlerProcess.signalCode})`,
      )
    }

    return new Promise((res, rej) => {
      const input = stringify({
        context,
        event,
      })

      const { readline } = handlerProcess.stdout

      let onErr
      let onLine
      let onProcessError
      let onProcessExit

      const settle = (fn, value) => {
        readline.removeListener("line", onLine)
        handlerProcess.stderr.removeListener("data", onErr)
        handlerProcess.removeListener("error", onProcessError)
        handlerProcess.removeListener("exit", onProcessExit)

        fn(value)
      }

      onErr = (data) => {
        // TODO

        log.notice(data.toString())
      }

      onLine = (line) => {
        try {
          const { error, payload } = this.#parsePayload(line.toString())

          if (error !== undefined) {
            const err = new Error(error.errorMessage)
            err.name = error.errorType
            err.stack = `${err.name}: ${err.message}\n${error.stackTrace.join("")}`

            settle(rej, err)
            return
          }

          // NOTE: a handler might return None, which is null
          if (payload !== undefined) {
            settle(res, payload)
          }
        } catch (err) {
          settle(rej, err)
        }
      }

      onProcessError = (err) => {
        settle(rej, err)
      }

      // e.g. sys.exit() in the handler
      onProcessExit = (code, signal) => {
        settle(
          rej,
          new Error(
            `Python process exited unexpectedly (code=${code}, signal=${signal}) before responding`,
          ),
        )
      }

      readline.on("line", onLine)
      handlerProcess.stderr.on("data", onErr)
      handlerProcess.once("error", onProcessError)
      handlerProcess.once("exit", onProcessExit)

      nextTick(() => {
        handlerProcess.stdin.write(input)
        handlerProcess.stdin.write("\n")
      })
    })
  }
}
