'use strict'

const createExternalHandler = require('./createExternalHandler.js')
const debugLog = require('./debugLog.js')
const runServerlessProxy = require('./runServerlessProxy.js')

const { keys } = Object

// function handler used to simulate Lambda functions
module.exports = function createHandler(funOptions, options) {
  const {
    cacheInvalidationRegex,
    skipCacheInvalidation,
    useSeparateProcesses,
  } = options

  if (useSeparateProcesses) {
    return createExternalHandler(funOptions, options)
  }

  if (!skipCacheInvalidation) {
    debugLog('Invalidating cache...')

    keys(require.cache).forEach((key) => {
      // Require cache invalidation, brutal and fragile.
      // Might cause errors, if so please submit an issue.
      if (!key.match(cacheInvalidationRegex || /node_modules/)) {
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
        if (
          moduleCache.filename.match(cacheInvalidationRegex || /node_modules/)
        ) {
          nextChildren.push(moduleCache)
        }
      })

      require.cache[currentFilePath].children = nextChildren
    }
  }

  const { functionName, handlerName, handlerPath, runtime } = funOptions

  debugLog(`Loading handler... (${handlerPath})`)

  const handler = runtime.startsWith('nodejs')
    ? require(handlerPath)[handlerName] // eslint-disable-line
    : runServerlessProxy(funOptions, options)

  if (typeof handler !== 'function') {
    throw new Error(
      `Serverless-offline: handler for '${functionName}' is not a function`,
    )
  }

  return handler
}
