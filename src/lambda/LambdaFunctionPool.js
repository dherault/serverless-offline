import LambdaFunction from './LambdaFunction.js'

export default class LambdaFunctionPool {
  constructor(provider, config, options) {
    this._config = config
    this._options = options
    this._provider = provider

    // key (functionKey), value: Array of instances
    this._pool = new Map()

    // start cleaner
    this._startCleanTimer()
  }

  _startCleanTimer() {
    // NOTE: don't use setInterval, as it would schedule always a new run,
    // regardless of function processing time and e.g. user action (debugging)
    this._timerRef = setTimeout(() => {
      // console.log('run cleanup')
      this._pool.forEach((lambdaFunctions) => {
        lambdaFunctions.forEach((lambdaFunction) => {
          const { idleTimeInMinutes, status } = lambdaFunction
          // console.log(idleTimeInMinutes, status)

          if (
            status === 'IDLE' &&
            idleTimeInMinutes >= this._options.maxIdleTime
          ) {
            // console.log(`removed Lambda Function ${lambdaFunction.functionName}`)
            lambdaFunctions.delete(lambdaFunction)
          }
        })
      })

      // schedule new timer
      this._startCleanTimer()
    }, 10000) // TODO: config, or maybe option?
  }

  _cleanupPool() {
    const wait = []

    this._pool.forEach((lambdaFunctions) => {
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
    clearTimeout(this._timerRef)

    return this._cleanupPool()
  }

  get(functionKey, functionObj) {
    const lambdaFunctions = this._pool.get(functionKey)
    let lambdaFunction

    // we don't have any instances
    if (lambdaFunctions == null) {
      lambdaFunction = new LambdaFunction(
        functionKey,
        functionObj,
        this._provider,
        this._config,
        this._options,
      )
      this._pool.set(functionKey, new Set([lambdaFunction]))

      return lambdaFunction
    }

    // console.log(`${lambdaFunctions.size} lambdaFunctions`)

    // find any IDLE ones
    lambdaFunction = Array.from(lambdaFunctions).find(
      ({ status }) => status === 'IDLE',
    )

    // we don't have any IDLE instances
    if (lambdaFunction == null) {
      lambdaFunction = new LambdaFunction(
        functionKey,
        functionObj,
        this._provider,
        this._config,
        this._options,
      )
      lambdaFunctions.add(lambdaFunction)

      // console.log(`${lambdaFunctions.size} lambdaFunctions`)

      return lambdaFunction
    }

    return lambdaFunction
  }
}
