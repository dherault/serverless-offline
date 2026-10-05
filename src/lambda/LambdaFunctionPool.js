import { log } from "../utils/log.js"
import LambdaFunction from "./LambdaFunction.js"

export default class LambdaFunctionPool {
  #options = null

  #pool = new Map()

  #serverless = null

  #timerRef = null

  constructor(serverless, options) {
    this.#options = options
    this.#serverless = serverless
  }

  start() {
    // start cleaner
    this.#startCleanTimer()
  }

  #startCleanTimer() {
    const functionCleanupIdleTimeInMillis =
      this.#options.terminateIdleLambdaTime * 1000

    // NOTE: don't use setInterval, as it would schedule always a new run,
    // regardless of function processing time and e.g. user action (debugging)
    this.#timerRef = setTimeout(async () => {
      try {
        const cleanupWait = []

        // console.log('run cleanup')
        this.#pool.forEach((lambdaFunctions, functionKey) => {
          lambdaFunctions.forEach((lambdaFunction) => {
            const { idleTimeInMillis, status } = lambdaFunction

            if (
              status === "IDLE" &&
              idleTimeInMillis >= functionCleanupIdleTimeInMillis
            ) {
              cleanupWait.push(lambdaFunction.cleanup())

              lambdaFunctions.delete(lambdaFunction)
            }
          })

          if (lambdaFunctions.size === 0) {
            this.#pool.delete(functionKey)
          }
        })

        // a failing cleanup (e.g. a docker container which can't be stopped)
        // must not keep the other instances from being cleaned up in the future
        const results = await Promise.allSettled(cleanupWait)

        results.forEach(({ reason, status }) => {
          if (status === "rejected") {
            // NOTE: don't interpolate reason, e.g. a Symbol can't be converted to a string
            log.error("Failed to clean up idle Lambda function:", reason)
          }
        })
      } finally {
        // schedule new timer, unless the pool was stopped in the meantime
        if (this.#timerRef != null) {
          this.#startCleanTimer()
        }
      }
    }, functionCleanupIdleTimeInMillis)
  }

  async #cleanupPool() {
    const lambdaFunctions = Array.from(this.#pool.values()).flatMap(
      (functions) => Array.from(functions),
    )

    // clear the pool before awaiting the cleanup, so instances which are
    // created in the meantime are neither lost nor cleaned up twice
    this.#pool.clear()

    await Promise.all(
      lambdaFunctions.map((lambdaFunction) => lambdaFunction.cleanup()),
    )
  }

  // cleans up all instances, e.g. after the functions have been updated.
  // the cleaner keeps running.
  async cleanup() {
    await this.#cleanupPool()
  }

  // stops the cleaner and cleans up all instances
  async stop() {
    clearTimeout(this.#timerRef)
    this.#timerRef = null

    await this.#cleanupPool()
  }

  get(functionKey, functionDefinition) {
    const lambdaFunctions = this.#pool.get(functionKey)
    let lambdaFunction

    // we don't have any instances
    if (lambdaFunctions == null) {
      lambdaFunction = new LambdaFunction(
        functionKey,
        functionDefinition,
        this.#serverless,
        this.#options,
      )
      this.#pool.set(functionKey, new Set([lambdaFunction]))

      return lambdaFunction
    }

    if (!this.#options.reloadHandler) {
      // find any IDLE
      lambdaFunction = Array.from(lambdaFunctions).find(
        ({ status }) => status === "IDLE",
      )

      if (lambdaFunction != null) {
        return lambdaFunction
      }
    }

    // we don't have any IDLE instances
    lambdaFunction = new LambdaFunction(
      functionKey,
      functionDefinition,
      this.#serverless,
      this.#options,
    )
    lambdaFunctions.add(lambdaFunction)

    return lambdaFunction
  }
}
