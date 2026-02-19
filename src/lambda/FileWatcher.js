import { watch } from "node:fs"
import { log } from "../utils/log.js"

const DEBOUNCE_MS = 300

const IGNORE_PATTERNS = new Set([
  "node_modules",
  ".git",
  ".serverless",
  ".serverless-offline",
  ".build",
  ".esbuild",
  ".webpack",
])

export default class FileWatcher {
  #createWatcher = null

  #debounceTimer = null

  #debounceMs = null

  #flushPromise = Promise.resolve()

  #isStopping = false

  #lambda = null

  #servicePath = null

  #watcher = null

  constructor(servicePath, lambda, { createWatcher, debounceMs } = {}) {
    this.#servicePath = servicePath
    this.#lambda = lambda
    this.#createWatcher = createWatcher ?? watch
    this.#debounceMs = debounceMs ?? DEBOUNCE_MS
  }

  start() {
    log.notice("Watching for file changes in service path...")
    this.#isStopping = false

    try {
      this.#watcher = this.#createWatcher(
        this.#servicePath,
        { recursive: true },
        this.#onChange.bind(this),
      )

      this.#watcher.on("error", (err) => {
        log.warning(
          `File watcher failed (${err.code ?? err.message}). --watch is no longer active. Restart the server to re-enable.`,
        )
        this.#stopWatcher()
      })
    } catch (err) {
      log.warning(
        `Unable to start file watcher: ${err.message}. --watch disabled.`,
      )
    }
  }

  async stop() {
    this.#isStopping = true

    clearTimeout(this.#debounceTimer)

    // close first so no new change callbacks get queued while stopping
    this.#stopWatcher()

    // wait for any in-flight flush to finish
    await this.#flushPromise
  }

  #onChange(eventType, filename) {
    if (
      this.#isStopping ||
      this.#watcher == null ||
      !filename ||
      this.#shouldIgnore(filename)
    ) {
      return
    }

    clearTimeout(this.#debounceTimer)

    this.#debounceTimer = setTimeout(() => {
      if (this.#isStopping || this.#watcher == null) {
        return
      }

      log.notice(
        `File change detected: ${filename}. Reloading Lambda functions...`,
      )

      this.#flushPromise = this.#flushPromise.then(async () => {
        try {
          await this.#lambda.flushPool()
        } catch (err) {
          log.error(`Failed to reload Lambda functions: ${err.message}`)
        }
      })
    }, this.#debounceMs)
  }

  #stopWatcher() {
    if (this.#watcher) {
      this.#watcher.close()
      this.#watcher = null
    }
  }

  #shouldIgnore(filename) {
    const segments = filename.split(/[/\\]/)
    return segments.some((segment) => IGNORE_PATTERNS.has(segment))
  }
}
