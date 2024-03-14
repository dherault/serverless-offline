import { createRequire } from 'node:module'
import { performance } from 'node:perf_hooks'
import process from 'node:process'
import { log } from '@serverless/utils/log.js'
const { assign } = Object
const require = createRequire(import.meta.url)
export default class InProcessRunner {
  #env = null
  #functionKey = null
  #handlerName = null
  #handlerPath = null
  #timeout = null
  constructor(functionKey, handlerPath, handlerName, env, timeout) {
    this.#env = env
    this.#functionKey = functionKey
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#timeout = timeout
  }
  cleanup() {}
  async run(event, context) {
    if (!require.resolve(this.#handlerPath)) {
      throw new Error(
        `Could not find handler module '${this.#handlerPath}' for function '${
          this.#functionKey
        }'.`,
      )
    }
    assign(process.env, this.#env)
    let handler
    try {
      ;({ [this.#handlerName]: handler } = require(this.#handlerPath))
    } catch (err) {
      log.error(err)
    }
    if (typeof handler !== 'function') {
      throw new Error(
        `offline: handler '${this.#handlerName}' in ${
          this.#handlerPath
        } is not a function`,
      )
    }
    let callback
    const callbackCalled = new Promise((res, rej) => {
      callback = (err, data) => {
        if (err === 'Unauthorized') {
          res('Unauthorized')
          return
        }
        if (err) {
          rej(err)
          return
        }
        res(data)
      }
    })
    const executionTimeout = performance.now() + this.#timeout
    const lambdaContext = {
      ...context,
      done: (err, data) => callback(err, data),
      fail: (err) => callback(err),
      getRemainingTimeInMillis: () => {
        const timeLeft = executionTimeout - performance.now()
        return timeLeft > 0 ? timeLeft : 0
      },
      succeed: (res) => callback(null, res),
    }
    let result
    try {
      result = handler(event, lambdaContext, callback)
    } catch {
      throw new Error(`Uncaught error in '${this.#functionKey}' handler.`)
    }
    const callbacks = [callbackCalled]
    if (result != null && typeof result.then === 'function') {
      callbacks.push(result)
    }
    const callbackResult = await Promise.race(callbacks)
    return callbackResult
  }
}
