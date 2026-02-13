import { spawn } from "node:child_process"
import { readdirSync, statSync, watch } from "node:fs"
import { EOL, platform } from "node:os"
import { resolve, relative } from "node:path"
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

  #runtime = null

  #spawnArgs = null

  #spawnOptions = null

  #watchers = []

  #debounceTimer = null

  #pollTimer = null

  #maxMtime = 0

  #busy = false

  #restartQueued = false

  // Spawn a persistent Ruby process in the constructor (mirrors PythonRunner).
  // The process stays alive across invocations and communicates via stdin/stdout.
  // File changes in app/ and layers/ directories trigger an automatic restart.
  constructor(funOptions, env) {
    const [handlerPath, handlerName] = splitHandlerPathAndName(
      funOptions.handler,
    )

    this.#env = env
    this.#runtime = platform() === "win32" ? "ruby.exe" : "ruby"

    this.#spawnArgs = [
      join(import.meta.url, "invoke.rb"),
      relative(cwd(), handlerPath),
      handlerName,
    ]

    this.#spawnOptions = {
      env: assign(process.env, this.#env),
    }

    this.#spawnProcess()
    this.#setupFileWatcher()
  }

  #spawnProcess() {
    this.#handlerProcess = spawn(
      this.#runtime,
      this.#spawnArgs,
      this.#spawnOptions,
    )

    this.#handlerProcess.stdout.readline = createInterface({
      input: this.#handlerProcess.stdout,
    })
  }

  #setupFileWatcher() {
    const watchDirs = ["app", "layers"].map((dir) => resolve(cwd(), dir))

    // inotify-based watching (works natively and on some Docker setups)
    for (const dir of watchDirs) {
      try {
        const watcher = watch(
          dir,
          { recursive: true },
          (_eventType, filename) => {
            if (!filename?.endsWith(".rb")) {
              return
            }

            this.#onFileChanged(filename)
          },
        )

        this.#watchers.push(watcher)
      } catch {
        // Directory may not exist, skip
      }
    }

    // Polling fallback for Docker volume mounts where inotify events
    // from the host are not propagated to the container.
    this.#maxMtime = this.#getMaxMtime(watchDirs)
    this.#pollTimer = setInterval(() => this.#pollForChanges(watchDirs), 2000)
  }

  #getMaxMtime(watchDirs) {
    let maxMtime = 0

    for (const dir of watchDirs) {
      try {
        const files = readdirSync(dir, { recursive: true })

        for (const file of files) {
          if (typeof file !== "string" || !file.endsWith(".rb")) {
            continue
          }

          try {
            const { mtimeMs } = statSync(resolve(dir, file))

            if (mtimeMs > maxMtime) {
              maxMtime = mtimeMs
            }
          } catch {
            // File may have been deleted
          }
        }
      } catch {
        // Directory may not exist
      }
    }

    return maxMtime
  }

  #pollForChanges(watchDirs) {
    const currentMaxMtime = this.#getMaxMtime(watchDirs)

    if (currentMaxMtime > this.#maxMtime) {
      this.#maxMtime = currentMaxMtime
      this.#onFileChanged("(detected via polling)")
    }
  }

  #onFileChanged(filename) {
    if (this.#debounceTimer) {
      clearTimeout(this.#debounceTimer)
    }

    this.#debounceTimer = setTimeout(() => {
      log.notice(`Ruby file changed: ${filename}, reloading handler...`)
      this.#scheduleRestart()
    }, 100)
  }

  #scheduleRestart() {
    if (this.#busy) {
      // Defer restart until the current invocation completes
      this.#restartQueued = true
    } else {
      this.#restartProcess()
    }
  }

  #restartProcess() {
    this.#handlerProcess.kill()
    this.#spawnProcess()
  }

  // () => void
  cleanup() {
    for (const watcher of this.#watchers) {
      watcher.close()
    }

    this.#watchers = []

    if (this.#debounceTimer) {
      clearTimeout(this.#debounceTimer)
    }

    if (this.#pollTimer) {
      clearInterval(this.#pollTimer)
    }

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
    this.#busy = true

    try {
      return await new Promise((res, rej) => {
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
              this.#handlerProcess.stdout.readline.removeListener(
                "line",
                onLine,
              )
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
    } finally {
      this.#busy = false

      if (this.#restartQueued) {
        this.#restartQueued = false
        this.#restartProcess()
      }
    }
  }
}
