'use strict'

const ChildProcessRunner = require('./ChildProcessRunner.js')
const InProcessRunner = require('./InProcessRunner.js')
const ServerlessInvokeLocalRunner = require('./ServerlessInvokeLocalRunner.js')
const debugLog = require('../debugLog.js')

const { keys } = Object

module.exports = class HandlerRunner {
  constructor(funOptions, options) {
    this._funOptions = funOptions
    this._options = options
    this._runner = this._getRunner(funOptions, options)
  }

  _cacheInvalidation() {
    const { cacheInvalidationRegex, skipCacheInvalidation } = this._options

    if (!skipCacheInvalidation) {
      debugLog('Invalidating cache...')

      const regExp = new RegExp(cacheInvalidationRegex)

      keys(require.cache).forEach((key) => {
        // Require cache invalidation, brutal and fragile.
        // Might cause errors, if so please submit an issue.
        if (!key.match(regExp)) {
          delete require.cache[key]
        }
      })

      const currentFilePath = __filename

      if (
        require.cache[currentFilePath] &&
        require.cache[currentFilePath].children
      ) {
        const nextChildren = []

        require.cache[currentFilePath].children.forEach((moduleCache) => {
          if (moduleCache.filename.match(regExp)) {
            nextChildren.push(moduleCache)
          }
        })

        require.cache[currentFilePath].children = nextChildren
      }
    }
  }

  _getRunner() {
    const { skipCacheInvalidation, useSeparateProcesses } = this._options

    if (useSeparateProcesses) {
      return new ChildProcessRunner(this._funOptions, skipCacheInvalidation)
    }

    this._cacheInvalidation()

    const { handlerName, handlerPath, runtime } = this._funOptions

    debugLog(`Loading handler... (${handlerPath})`)

    if (runtime.startsWith('nodejs')) {
      return new InProcessRunner(handlerPath, handlerName)
    }

    return new ServerlessInvokeLocalRunner(this._funOptions, this._options)
  }

  run(event, context, callback) {
    return this._runner.run(event, context, callback)
  }
}
