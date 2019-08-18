'use strict'

const debugLog = require('../debugLog.js')
const serverlessLog = require('../serverlessLog.js')
const { satisfiesVersionRange } = require('../utils/index.js')

const { keys } = Object

module.exports = class HandlerRunner {
  constructor(funOptions, options, stage) {
    this._funOptions = funOptions
    this._options = options
    this._runner = this._getRunner(funOptions, options)
    this._stage = stage
  }

  _getRunner() {
    const {
      skipCacheInvalidation,
      useSeparateProcesses,
      useWorkerThreads,
    } = this._options

    if (useWorkerThreads) {
      // worker threads
      this._verifyNodejsVersionCompatibility()

      const WorkerThreadRunner = require('./WorkerThreadRunner.js') // eslint-disable-line global-require
      return new WorkerThreadRunner(
        this._funOptions /* skipCacheInvalidation */,
      )
    }

    if (useSeparateProcesses) {
      const ChildProcessRunner = require('./ChildProcessRunner.js') // eslint-disable-line global-require
      return new ChildProcessRunner(this._funOptions, skipCacheInvalidation)
    }

    this._cacheInvalidation()

    const { functionName, handlerName, handlerPath, runtime } = this._funOptions

    debugLog(`Loading handler... (${handlerPath})`)

    if (runtime.startsWith('nodejs')) {
      const InProcessRunner = require('./InProcessRunner.js') // eslint-disable-line global-require
      return new InProcessRunner(functionName, handlerPath, handlerName)
    }

    const ServerlessInvokeLocalRunner = require('./ServerlessInvokeLocalRunner.js') // eslint-disable-line global-require
    return new ServerlessInvokeLocalRunner(this._funOptions, this._stage)
  }

  _verifyNodejsVersionCompatibility() {
    const { node: currentVersion } = process.versions
    const requiredVersionRange = '>=11.7.0'

    const versionIsSatisfied = satisfiesVersionRange(
      currentVersion,
      requiredVersionRange,
    )

    // we're happy
    if (!versionIsSatisfied) {
      serverlessLog(
        `"worker threads" require node.js version ${requiredVersionRange}, but found version ${currentVersion}.
         To use this feature you have to update node.js to a later version.
        `,
        'serverless-offline',
        { color: 'red' },
      )

      throw new Error(
        '"worker threads" are not supported with this node.js version',
      )
    }
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

  run(event, context, callback) {
    return this._runner.run(event, context, callback)
  }
}
