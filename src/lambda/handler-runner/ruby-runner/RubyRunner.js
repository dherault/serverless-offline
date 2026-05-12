import { spawn } from "node:child_process"
import { watch } from "node:fs"
import { EOL, platform } from "node:os"
import { resolve, relative } from "node:path"
import process, { cwd, nextTick } from "node:process"
import { createInterface } from "node:readline"
import { join } from "desm"
import { log } from "../../../utils/log.js"
import { splitHandlerPathAndName } from "../../../utils/index.js"

const { parse, stringify } = JSON
const { hasOwn } = Object

export default class RubyRunner {
  static #payloadIdentifier = "__offline_payload__"

  static #errorIdentifier = "__offline_error__"

  #env = null

  #handlerProcess = null

  #readline = null

  #runtime = null

  #spawnArgs = null

  #spawnError = null

  #spawnOptions = null

  #watchers = []

  #debounceTimer = null

  #busy = false

  #restartQueued = false

  #watchDirs = []

  // Serializes concurrent run() calls so writes to the shared Ruby stdin
  // and reads from stdout cannot interleave.
  #queue = Promise.resolve()

  // Spawn a persistent Ruby process in the constructor (mirrors PythonRunner).
  // The process stays alive across invocations and communicates via stdin/stdout.
  // File changes trigger an automatic restart when rubyWatchDirs is configured.
  constructor(funOptions, env, options = {}) {
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
      env: options.localEnvironment
        ? { ...process.env, ...this.#env }
        : { ...this.#env },
    }

    const rawWatchDirs = options.rubyWatchDirs ?? []
    this.#watchDirs =
      typeof rawWatchDirs === "string"
        ? rawWatchDirs
            .split(",")
            .map((dir) => dir.trim())
            .filter(Boolean)
        : rawWatchDirs

    this.#spawnProcess()

    if (this.#watchDirs.length > 0) {
      this.#setupFileWatcher()
    }
  }

  #spawnProcess() {
    this.#spawnError = null
    this.#readline = null

    this.#handlerProcess = spawn(
      this.#runtime,
      this.#spawnArgs,
      this.#spawnOptions,
    )

    // Persistent error listener so an async spawn failure (e.g., Ruby not
    // on PATH) does not crash serverless-offline with an unhandled "error"
    // event. The stored error is surfaced from the next run() call.
    this.#handlerProcess.on("error", (err) => {
      this.#spawnError = err
      log.error(`Ruby process error: ${err.message}`)
    })

    // When spawn fails synchronously the returned ChildProcess can have
    // null stdio streams. Mark a spawn error immediately so the next run()
    // rejects with a useful message instead of letting createInterface or
    // stderr.on() throw on null streams.
    if (!this.#handlerProcess.stdout || !this.#handlerProcess.stderr) {
      this.#spawnError = new Error(
        `Failed to spawn Ruby process "${this.#runtime}". Is Ruby installed and on PATH?`,
      )
      return
    }

    this.#readline = createInterface({
      input: this.#handlerProcess.stdout,
    })
  }

  #setupFileWatcher() {
    const watchDirs = this.#watchDirs.map((dir) => resolve(cwd(), dir))

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
      } catch (err) {
        log.warning(
          `Ruby hot-reload watcher could not be enabled for "${dir}": ${err.message}. ` +
            "Recursive fs.watch may not be supported on this platform.",
        )
      }
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
    this.#disposeProcess()
    this.#spawnProcess()
  }

  #disposeProcess() {
    if (this.#readline) {
      this.#readline.close()
      this.#readline = null
    }

    if (this.#handlerProcess && this.#handlerProcess.exitCode == null) {
      try {
        this.#handlerProcess.kill()
      } catch (err) {
        if (err.code !== "ESRCH") {
          log.warning(`Failed to kill Ruby process: ${err.message}`)
        }
      }
    }

    this.#handlerProcess = null
  }

  // () => void
  cleanup() {
    for (const watcher of this.#watchers) {
      watcher.close()
    }

    this.#watchers = []

    if (this.#debounceTimer) {
      clearTimeout(this.#debounceTimer)
      this.#debounceTimer = null
    }

    this.#disposeProcess()
  }

  #parsePayload(value) {
    let payload
    let error

    for (const item of value.split(EOL)) {
      let json

      // first check if it's JSON
      try {
        json = parse(item)
        // nope, it's not JSON
      } catch {
        // no-op
      }

      if (json && typeof json === "object") {
        if (hasOwn(json, RubyRunner.#errorIdentifier)) {
          error = json[RubyRunner.#errorIdentifier]
        } else if (hasOwn(json, RubyRunner.#payloadIdentifier)) {
          payload = json[RubyRunner.#payloadIdentifier]
        } else {
          log.notice(item)
        }
      } else {
        log.notice(item)
      }
    }

    return { error, payload }
  }

  // invokeLocalRuby, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L556
  async run(event, context) {
    // Chain onto the queue so each invocation has exclusive access to the
    // shared stdin/stdout channel. Errors in the chain must not poison
    // subsequent runs.
    const result = this.#queue.then(() => this.#runOne(event, context))
    this.#queue = result.then(
      () => {},
      () => {},
    )
    return result
  }

  async #runOne(event, context) {
    // Respawn if the Ruby process died (handler crash, OOM kill, etc.) or
    // failed to spawn previously. Without this, subsequent runs would fail
    // with EPIPE forever.
    if (
      this.#handlerProcess == null ||
      this.#handlerProcess.exitCode != null ||
      this.#spawnError != null ||
      this.#readline == null
    ) {
      this.#disposeProcess()
      this.#spawnProcess()
    }

    // If respawn also failed (e.g., Ruby is still missing), bail out with
    // the stored spawn error rather than touching null streams below.
    if (this.#spawnError != null || this.#readline == null) {
      throw this.#spawnError ?? new Error("Ruby process is not running")
    }

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

        const handlerProcess = this.#handlerProcess
        const readline = this.#readline

        let onLine
        let onErr
        let onProcessError
        let onProcessExit

        const cleanupListeners = () => {
          // Defensive null guards: readline/stderr should be present here
          // because #runOne() bails out before listener attachment when
          // they are null, but a process can crash mid-flight.
          readline?.removeListener("line", onLine)
          handlerProcess.stderr?.removeListener("data", onErr)
          handlerProcess.removeListener("error", onProcessError)
          handlerProcess.removeListener("exit", onProcessExit)
        }

        const settleResolve = (value) => {
          cleanupListeners()
          res(value)
        }

        const settleReject = (err) => {
          cleanupListeners()
          rej(err)
        }

        onErr = (data) => {
          // TODO

          log.notice(data.toString())
        }

        onProcessError = (err) => {
          settleReject(err)
        }

        onProcessExit = (code, signal) => {
          settleReject(
            new Error(
              `Ruby process exited unexpectedly (code=${code}, signal=${signal}) before responding`,
            ),
          )
        }

        onLine = (line) => {
          try {
            const { error, payload } = this.#parsePayload(line.toString())

            if (error !== undefined) {
              const err = new Error(error.errorMessage ?? "Ruby handler error")
              err.name = error.errorType ?? "RubyHandlerError"
              if (error.stackTrace) {
                err.stack = `${err.name}: ${err.message}\n${
                  Array.isArray(error.stackTrace)
                    ? error.stackTrace.join("\n")
                    : error.stackTrace
                }`
              }
              settleReject(err)
              return
            }

            if (payload !== undefined) {
              settleResolve(payload)
            }
          } catch (err) {
            settleReject(err)
          }
        }

        readline.on("line", onLine)
        handlerProcess.stderr.on("data", onErr)
        handlerProcess.once("error", onProcessError)
        handlerProcess.once("exit", onProcessExit)

        nextTick(() => {
          try {
            handlerProcess.stdin.write(input, (writeErr) => {
              if (writeErr) {
                settleReject(writeErr)
                return
              }
              handlerProcess.stdin.write("\n", (nlErr) => {
                if (nlErr) {
                  settleReject(nlErr)
                }
              })
            })
          } catch (err) {
            settleReject(err)
          }
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
