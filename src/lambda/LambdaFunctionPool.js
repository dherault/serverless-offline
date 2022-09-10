import LambdaFunction from './LambdaFunction.js'

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
    this.#timerRef = setTimeout(() => {
      // console.log('run cleanup')
      this.#pool.forEach((lambdaFunctions) => {
        lambdaFunctions.forEach((lambdaFunction) => {
          const { idleTimeInMillis, status } = lambdaFunction

          if (
            status === 'IDLE' &&
            idleTimeInMillis >= functionCleanupIdleTimeInMillis
          ) {
            // console.log(`removed Lambda Function ${lambdaFunction.functionName}`)
            lambdaFunction.cleanup()
            lambdaFunctions.delete(lambdaFunction)
          }
        })
      })

      // schedule new timer
      this.#startCleanTimer()
    }, functionCleanupIdleTimeInMillis)
  }

  #cleanupPool() {
    const wait = []

    this.#pool.forEach((lambdaFunctions) => {
      lambdaFunctions.forEach((lambdaFunction) => {
        // collect promises
        wait.push(lambdaFunction.cleanup())
        lambdaFunctions.delete(lambdaFunction)
      })
    })

    return Promise.all(wait)
  }

  // TODO make sure to call this
  async cleanup() {
    clearTimeout(this.#timerRef)

    return this.#cleanupPool()
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
        ({ status }) => status === 'IDLE',
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
