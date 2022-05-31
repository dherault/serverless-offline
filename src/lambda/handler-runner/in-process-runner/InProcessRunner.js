import { createRequire } from 'node:module'
import { performance } from 'node:perf_hooks'
import { pathToFileURL } from 'node:url'
import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'
import { findUpSync as findUp } from 'find-up'
import clearModule from './clearModule.js'

const { assign } = Object

const require = createRequire(import.meta.url)

export default class InProcessRunner {
  #allowCache = false
  #env = null
  #functionKey = null
  #handlerName = null
  #handlerPath = null
  #timeout = null

  constructor(functionKey, handlerPath, handlerName, env, timeout, allowCache) {
    this.#allowCache = allowCache
    this.#env = env
    this.#functionKey = functionKey
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#timeout = timeout
  }

  // no-op
  // () => void
  cleanup() {}

  async run(event, context) {
    // check if the handler module path exists
    const handlerExt = ['js', 'cjs', 'mjs'].find((ext) =>
      existsSync(`${this.#handlerPath}.${ext}`),
    )

    if (!handlerExt) {
      throw new Error(
        `Could not find handler module '${this.#handlerPath}' for function '${
          this.#functionKey
        }'.`,
      )
    }

    // process.env should be available in the handler module scope as well as in the handler function scope
    // NOTE: Don't use Object spread (...) here!
    // otherwise the values of the attached props are not coerced to a string
    // e.g. process.env.foo = 1 should be coerced to '1' (string)
    assign(process.env, this.#env)

    let type

    if (handlerExt === 'mjs') {
      type = 'module'
    } else if (handlerExt === 'cjs') {
      type = 'commonjs'
    } else {
      try {
        ;({ type = 'commonjs' } = JSON.parse(
          readFileSync(
            findUp('package.json', `${this.#handlerName}.${handlerExt}`),
          ),
        ))
      } catch {
        type = 'module'
      }
    }

    // lazy load handler with first usage
    if (type === 'commonjs' && !this.#allowCache) {
      await clearModule(this.#handlerPath, { cleanup: true })
    }

    let handler

    if (type === 'commonjs') {
      // eslint-disable-next-line import/no-dynamic-require
      ;({ [this.#handlerName]: handler } = require(`${
        this.#handlerPath
      }.${handlerExt}`))
    } else {
      try {
        ;({ [this.#handlerName]: handler } = await import(
          pathToFileURL(`${this.#handlerPath}.${handlerExt}`).href
        ))
      } catch (err) {
        console.log(err)
      }
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

    // attach doc-deprecated functions
    // create new immutable object
    const lambdaContext = {
      ...context,
      done: (err, data) => callback(err, data),
      fail: (err) => callback(err),
      getRemainingTimeInMillis: () => {
        const timeLeft = executionTimeout - performance.now()

        // just return 0 for now if we are beyond alotted time (timeout)
        return timeLeft > 0 ? timeLeft : 0
      },
      succeed: (res) => callback(null, res),
    }

    let result

    // execute (run) handler
    try {
      result = handler(event, lambdaContext, callback)
    } catch {
      throw new Error(`Uncaught error in '${this.#functionKey}' handler.`)
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

    const callbackResult = await Promise.race(callbacks)

    return callbackResult
  }
}
