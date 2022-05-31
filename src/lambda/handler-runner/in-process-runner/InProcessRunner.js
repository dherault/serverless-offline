import { createRequire } from 'node:module'
import { performance } from 'node:perf_hooks'
import { pathToFileURL } from 'node:url'
import { existsSync, readFileSync } from 'node:fs'
import { extname } from 'node:path'
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
    const handlerExt =
      ['.js', '.cjs', '.mjs'].find((ext) =>
        existsSync(`${this.#handlerPath}${ext}`),
      ) ?? extname(require.resolve(this.#handlerPath))

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

    let handler

    try {
      if (handlerExt === '.mjs') {
        ;({ [this.#handlerName]: handler } = await this.#importHandler(
          handlerExt,
        ))
      } else if (handlerExt === '.cjs') {
        ;({ [this.#handlerName]: handler } = await this.#requireHandler(
          handlerExt,
        ))
      } else if (handlerExt === '.js') {
        let type
        try {
          ;({ type = 'commonjs' } = JSON.parse(
            readFileSync(
              findUp('package.json', `${this.#handlerName}.${handlerExt}`),
            ),
          ))
        } catch {} // eslint-disable-line no-empty

        ;({ [this.#handlerName]: handler } = await (type === 'commonjs'
          ? this.#requireHandler(handlerExt)
          : this.#importHandler(handlerExt)))
      } else {
        // '.ts' for example, unknown handler, try both
        try {
          ;({ [this.#handlerName]: handler } = await this.#importHandler(
            handlerExt,
          ))
        } catch {
          ;({ [this.#handlerName]: handler } = await this.#requireHandler(
            handlerExt,
          ))
        }
      }
    } catch (err) {
      console.log(err)
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

  async #requireHandler(ext) {
    // lazy load handler with first usage
    if (!this.#allowCache) {
      await clearModule(this.#handlerPath, { cleanup: true })
    }

    // eslint-disable-next-line import/no-dynamic-require
    return require(`${this.#handlerPath}${ext}`)
  }

  async #importHandler(ext) {
    return import(pathToFileURL(`${this.#handlerPath}${ext}`).href)
  }
}
