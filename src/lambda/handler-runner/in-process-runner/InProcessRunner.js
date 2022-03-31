import { performance } from 'perf_hooks'
import * as path from 'path'
import * as fs from 'fs'

const clearModule = (fP, opts) => {
  const options = opts ?? {}
  let filePath = fP
  if (!require.cache[filePath]) {
    const dirname = path.dirname(filePath)
    for (const fn of fs.readdirSync(dirname)) {
      const fullPath = path.resolve(dirname, fn)
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
      // Unload any non node_modules children
      if (!c.filename.match(/node_modules/)) {
        clearModule(c.id, { ...options, cleanup: false })
      }
    }
    if (opts.cleanup) {
      // Cleanup any node_modules that are orphans
      let cleanup = false
      do {
        cleanup = false
        for (const fn of Object.keys(require.cache)) {
          if (
            require.cache[fn] &&
            require.cache[fn].id !== '.' &&
            require.cache[fn].parent &&
            require.cache[fn].parent.id !== '.' &&
            !require.cache[require.cache[fn].parent.id]
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
  #handlerModuleNesting = null
  #timeout = null
  #allowCache = false

  constructor(
    functionKey,
    handlerPath,
    handlerName,
    handlerModuleNesting,
    env,
    timeout,
    allowCache,
  ) {
    this.#env = env
    this.#functionKey = functionKey
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#handlerModuleNesting = handlerModuleNesting
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
    Object.assign(process.env, this.#env)

    // lazy load handler with first usage
    if (!this.#allowCache) {
      clearModule(this.#handlerPath, { cleanup: true })
    }

    let handler
    try {
      const handlerPathExport = await import(this.#handlerPath)
      // this supports handling of nested handler paths like <pathToFile>/<fileName>.object1.object2.object3.handler
      // a use case for this, is when the handler is further down the export tree or in nested objects
      // NOTE: this feature is supported in AWS Lambda
      handler = this.#handlerModuleNesting.reduce(
        (obj, key) => obj[key],
        handlerPathExport,
      )
    } catch (error) {
      throw new Error(
        `offline: one of the module nesting ${
          this.#handlerModuleNesting
        } for handler ${this.#handlerName} is undefined or not exported`,
      )
    }

    if (typeof handler !== 'function') {
      throw new Error(
        `offline: handler '${this.#handlerName}' in ${
          this.#handlerPath
        } is not a function`,
      )
    }

    let callback

    const callbackCalled = new Promise((resolve, reject) => {
      callback = (err, data) => {
        if (err === 'Unauthorized') {
          resolve('Unauthorized')
          return
        }
        if (err) {
          reject(err)
          return
        }
        resolve(data)
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
