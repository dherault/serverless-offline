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
    this.#startCleanTimer()
  }
  #startCleanTimer() {
    this.#timerRef = setTimeout(() => {
      this.#pool.forEach((lambdaFunctions) => {
        lambdaFunctions.forEach((lambdaFunction) => {
          const { idleTimeInMinutes, status } = lambdaFunction
          if (
            status === 'IDLE' &&
            idleTimeInMinutes >=
              this.#options.functionCleanupIdleTimeSeconds / 60
          ) {
            lambdaFunction.cleanup()
            lambdaFunctions.delete(lambdaFunction)
          }
        })
      })
      this.#startCleanTimer()
    }, (this.#options.functionCleanupIdleTimeSeconds * 1000) / 2)
  }
  #cleanupPool() {
    const wait = []
    this.#pool.forEach((lambdaFunctions) => {
      lambdaFunctions.forEach((lambdaFunction) => {
        wait.push(lambdaFunction.cleanup())
        lambdaFunctions.delete(lambdaFunction)
      })
    })
    return Promise.all(wait)
  }
  async cleanup() {
    clearTimeout(this.#timerRef)
    return this.#cleanupPool()
  }
  get(functionKey, functionDefinition) {
    const lambdaFunctions = this.#pool.get(functionKey)
    let lambdaFunction
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
      lambdaFunction = Array.from(lambdaFunctions).find(
        ({ status }) => status === 'IDLE',
      )
      if (lambdaFunction != null) {
        return lambdaFunction
      }
    }
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
