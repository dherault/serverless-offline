import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import process from 'node:process'

const { assign, keys } = Object

const require = createRequire(import.meta.url)

function clearModule(fP, opts) {
  const options = opts ?? {}
  let filePath = fP
  if (!require.cache[filePath]) {
    const dirName = dirname(filePath)
    for (const fn of readdirSync(dirName)) {
      const fullPath = resolve(dirName, fn)
      if (
        fullPath.substr(0, filePath.length + 1) === `${filePath}.` &&
        require.cache[fullPath]
      ) {
        filePath = fullPath
        break
      }
    }
  }
  if (require.cache[filePath]) {
    // Remove file from parent cache
    if (require.cache[filePath].parent) {
      let i = require.cache[filePath].parent.children.length
      if (i) {
        do {
          i -= 1
          if (require.cache[filePath].parent.children[i].id === filePath) {
            require.cache[filePath].parent.children.splice(i, 1)
          }
        } while (i)
      }
    }
    const cld = require.cache[filePath].children
    delete require.cache[filePath]
    for (const c of cld) {
      // Unload any non node_modules and non-binary children
      if (
        !c.filename.match(/\/node_modules\//i) &&
        !c.filename.match(/\.node$/i)
      ) {
        clearModule(c.id, { ...options, cleanup: false })
      }
    }
    if (opts.cleanup) {
      // Cleanup any node_modules that are orphans
      let cleanup = false
      do {
        cleanup = false
        for (const fn of keys(require.cache)) {
          if (
            require.cache[fn] &&
            require.cache[fn].id !== '.' &&
            require.cache[fn].parent &&
            require.cache[fn].parent.id !== '.' &&
            !require.cache[require.cache[fn].parent.id] &&
            !fn.match(/\/node_modules\//i) &&
            !fn.match(/\.node$/i)
          ) {
            delete require.cache[fn]
            cleanup = true
          }
        }
      } while (cleanup)
    }
  }
}

export default class InProcessRunner {
  #env = null
  #functionKey = null
  #handlerName = null
  #handlerPath = null
  #timeout = null
  #allowCache = false

  constructor(functionKey, handlerPath, handlerName, env, timeout, allowCache) {
    this.#env = env
    this.#functionKey = functionKey
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#timeout = timeout
    this.#allowCache = allowCache
  }

  // no-op
  // () => void
  cleanup() {}

  async run(event, context) {
    // check if the handler module path exists
    if (!require.resolve(this.#handlerPath)) {
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

    // lazy load handler with first usage
    if (!this.#allowCache) {
      clearModule(this.#handlerPath, { cleanup: true })
    }

    let handler

    try {
      // const { [this.#handlerName]: handler } = await import(this.#handlerPath)
      // eslint-disable-next-line import/no-dynamic-require
      ;({ [this.#handlerName]: handler } = require(this.#handlerPath))
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
