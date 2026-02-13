import { spawn } from "node:child_process"
import { EOL, platform } from "node:os"
import { relative } from "node:path"
import process, { cwd, nextTick } from "node:process"
import { createInterface } from "node:readline"
import { join } from "desm"
import { log } from "../../../utils/log.js"
import { splitHandlerPathAndName } from "../../../utils/index.js"

const { parse, stringify } = JSON
const { assign, hasOwn } = Object

export default class RubyRunner {
  static #payloadIdentifier = "__offline_payload__"

  #env = null

  #handlerProcess = null

  // Spawn a persistent Ruby process in the constructor (mirrors PythonRunner).
  // The process stays alive across invocations and communicates via stdin/stdout.
  constructor(funOptions, env) {
    const [handlerPath, handlerName] = splitHandlerPathAndName(
      funOptions.handler,
    )

    this.#env = env

    const runtime = platform() === "win32" ? "ruby.exe" : "ruby"

    this.#handlerProcess = spawn(
      runtime,
      [
        join(import.meta.url, "invoke.rb"),
        relative(cwd(), handlerPath),
        handlerName,
      ],
      {
        env: assign(process.env, this.#env),
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
        hasOwn(json, RubyRunner.#payloadIdentifier)
      ) {
        payload = json[RubyRunner.#payloadIdentifier]
      } else {
        log.notice(item)
      }
    }

    return payload
  }

  // invokeLocalRuby, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L556
  async run(event, context) {
    return new Promise((res, rej) => {
      // https://docs.aws.amazon.com/lambda/latest/dg/ruby-context.html
      // exclude callbackWaitsForEmptyEventLoop, don't mutate context
      const { callbackWaitsForEmptyEventLoop, ..._context } = context

      const input = stringify({
        context: _context,
        event,
      })

      const onErr = (data) => {
        // TODO

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
