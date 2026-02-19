import LambdaFunction from "./LambdaFunction.js"

const RETIRE_CHECK_INTERVAL_MS = 250

export default class LambdaFunctionPool {
  #createFunction = null

  #options = null

  #pool = new Map()

  #retiring = new Set()

  #retireCheckIntervalMs = null

  #retireSweepPromise = Promise.resolve()

  #retireTimerRef = null

  #timerRef = null

  constructor(
    serverless,
    options,
    { createFunction, retireCheckIntervalMs } = {},
  ) {
    this.#options = options
    this.#retireCheckIntervalMs =
      retireCheckIntervalMs ?? RETIRE_CHECK_INTERVAL_MS
    this.#createFunction =
      createFunction ??
      ((functionKey, functionDefinition) =>
        new LambdaFunction(
          functionKey,
          functionDefinition,
          serverless,
          options,
        ))
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

      await Promise.all(cleanupWait)
      await this.#enqueueRetiringSweep()

      // schedule new timer
      this.#startCleanTimer()
    }, functionCleanupIdleTimeInMillis)
  }

  async #cleanupPool() {
    const cleanupWait = []

    this.#pool.forEach((lambdaFunctions) => {
      lambdaFunctions.forEach((lambdaFunction) => {
        cleanupWait.push(lambdaFunction.cleanup())
      })
    })

    await Promise.all(cleanupWait)

    this.#pool.clear()
  }

  async flushPool() {
    const cleanupWait = []

    this.#pool.forEach((lambdaFunctions) => {
      lambdaFunctions.forEach((lambdaFunction) => {
        if (lambdaFunction.status === "IDLE") {
          cleanupWait.push(lambdaFunction.cleanup())
        } else {
          // BUSY — retire so it gets cleaned up when it finishes
          this.#retiring.add(lambdaFunction)
        }
      })
    })

    await Promise.all(cleanupWait)

    this.#pool.clear()
    this.#scheduleRetiringCleanup()
  }

  // TODO make sure to call this
  async cleanup() {
    clearTimeout(this.#timerRef)
    clearTimeout(this.#retireTimerRef)

    await this.#retireSweepPromise

    // drain retiring instances
    const retiredCleanup = []

    for (const lambdaFunction of this.#retiring) {
      retiredCleanup.push(lambdaFunction.cleanup())
    }

    this.#retiring.clear()

    await Promise.all(retiredCleanup)

    await this.#cleanupPool()
  }

  async #cleanupRetiringIdle() {
    const cleanupWait = []

    for (const lambdaFunction of this.#retiring) {
      if (lambdaFunction.status === "IDLE") {
        this.#retiring.delete(lambdaFunction)
        cleanupWait.push(lambdaFunction.cleanup())
      }
    }

    await Promise.all(cleanupWait)
  }

  #enqueueRetiringSweep() {
    this.#retireSweepPromise = this.#retireSweepPromise.then(() =>
      this.#cleanupRetiringIdle(),
    )

    return this.#retireSweepPromise
  }

  #scheduleRetiringCleanup() {
    if (this.#retireTimerRef || this.#retiring.size === 0) {
      return
    }

    this.#retireTimerRef = setTimeout(async () => {
      this.#retireTimerRef = null

      await this.#enqueueRetiringSweep()

      this.#scheduleRetiringCleanup()
    }, this.#retireCheckIntervalMs)
  }

  get(functionKey, functionDefinition) {
    const lambdaFunctions = this.#pool.get(functionKey)
    let lambdaFunction

    // we don't have any instances
    if (lambdaFunctions == null) {
      lambdaFunction = this.#createFunction(functionKey, functionDefinition)
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
    lambdaFunction = this.#createFunction(functionKey, functionDefinition)
    lambdaFunctions.add(lambdaFunction)

    return lambdaFunction
  }
}
