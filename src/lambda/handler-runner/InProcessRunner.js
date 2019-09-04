import { performance } from 'perf_hooks'

const { assign } = Object

export default class InProcessRunner {
  constructor(functionName, handlerPath, handlerName, env, timeout) {
    this._env = env
    this._functionName = functionName
    this._handlerName = handlerName
    this._handlerPath = handlerPath
    this._timeout = timeout
  }

  // no-op
  // () => void
  cleanup() {}

  async run(event, context) {
    // check if the handler module path exists
    if (!require.resolve(this._handlerPath)) {
      throw new Error(
        `Could not find handler module '${this._handlerPath}' for function '${this._functionName}'.`,
      )
    }

    // process.env should be available in the handler module scope as well as in the handler function scope
    // NOTE: Don't use Object spread (...) here!
    // otherwise the values of the attached props are not coerced to a string
    // e.g. process.env.foo = 1 should be coerced to '1' (string)
    assign(process.env, this._env)

    // lazy load handler with first usage

    // TODO FIXME rollup bug https://github.com/rollup/rollup/issues/3092
    const handlerPath = this._handlerPath
    const { [this._handlerName]: handler } = await import(handlerPath)

    if (typeof handler !== 'function') {
      throw new Error(
        `offline: handler '${this._handlerName}' in ${this._handlerPath} is not a function`,
      )
    }

    let callback

    const callbackCalled = new Promise((resolve, reject) => {
      callback = (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      }
    })

    const executionTimeout = performance.now() + this._timeout * 1000

    // attach doc-deprecated functions
    // create new immutable object
    const lambdaContext = {
      ...context,
      getRemainingTimeInMillis: () => {
        const timeLeft = executionTimeout - performance.now()

        // just return 0 for now if we are beyond alotted time (timeout)
        return timeLeft > 0 ? timeLeft : 0
      },
      done: (err, data) => callback(err, data),
      fail: (err) => callback(err),
      succeed: (res) => callback(null, res),
    }

    let result

    // execute (run) handler
    try {
      result = handler(event, lambdaContext, callback)
    } catch (err) {
      // this only executes when we have an exception caused by synchronous code
      // TODO logging
      console.log(err)
      throw new Error(`Uncaught error in '${this._functionName}' handler.`)
    }

    // // not a Promise, which is not supported by aws
    // if (result == null || typeof result.then !== 'function') {
    //   throw new Error(`Synchronous function execution is not supported.`)
    // }

    const callbacks = [callbackCalled]

    // Promise was returned
    if (result != null && typeof result.then === 'function') {
      callbacks.push(result)
    }

    let callbackResult

    try {
      callbackResult = await Promise.race(callbacks)
    } catch (err) {
      // TODO logging
      console.log(err)
      throw err
    }

    return callbackResult
  }
}
