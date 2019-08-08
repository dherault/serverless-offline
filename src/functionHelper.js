'use strict'

const { fork } = require('child_process')
const { join, resolve } = require('path')
const debugLog = require('./debugLog.js')
const runServerlessProxy = require('./runServerlessProxy.js')
const { createUniqueId, splitHandlerPathAndName } = require('./utils/index.js')

const { stringify } = JSON
const { keys, values } = Object

const handlerCache = {}
const messageCallbacks = {}

exports.getFunctionOptions = function getFunctionOptions(
  functionName,
  functionObj,
  servicePath,
  serviceRuntime,
) {
  const { handler, memorySize, name, runtime, timeout } = functionObj
  const [handlerPath, handlerName] = splitHandlerPathAndName(handler)

  return {
    functionName,
    handlerName, // i.e. run
    handlerPath: join(servicePath, handlerPath),
    lambdaName: name,
    memorySize,
    runtime: runtime || serviceRuntime,
    timeout: (timeout || 30) * 1000,
  }
}

function createExternalHandler(funOptions, options) {
  const { handlerPath } = funOptions
  const { skipCacheInvalidation } = options

  let handlerContext = handlerCache[handlerPath]

  function handleFatal(error) {
    debugLog(`External handler received fatal error ${stringify(error)}`)
    handlerContext.inflight.forEach((id) => {
      messageCallbacks[id](error)
    })
    handlerContext.inflight.clear()
    delete handlerCache[handlerPath]
  }

  const helperPath = resolve(__dirname, 'ipcHelper.js')

  return (event, context, callback) => {
    if (!handlerContext) {
      debugLog(`Loading external handler... (${handlerPath})`)

      const ipcProcess = fork(helperPath, [handlerPath], {
        env: process.env,
        stdio: [0, 1, 2, 'ipc'],
      })

      handlerContext = {
        inflight: new Set(),
        process: ipcProcess,
      }

      if (skipCacheInvalidation) {
        handlerCache[handlerPath] = handlerContext
      }

      ipcProcess.on('message', (message) => {
        debugLog(`External handler received message ${stringify(message)}`)

        const { error, id, ret } = message

        if (id && messageCallbacks[id]) {
          messageCallbacks[id](error, ret)
          handlerContext.inflight.delete(id)
          delete messageCallbacks[id]
        } else if (error) {
          // Handler died!
          handleFatal(error)
        }

        if (!options.skipCacheInvalidation) {
          handlerContext.process.kill()
          delete handlerCache[handlerPath]
        }
      })

      ipcProcess.on('error', (error) => {
        handleFatal(error)
      })

      ipcProcess.on('exit', (code) => {
        handleFatal(`Handler process exited with code ${code}`)
      })
    } else {
      debugLog(`Using existing external handler for ${handlerPath}`)
    }

    const id = createUniqueId()

    messageCallbacks[id] = callback
    handlerContext.inflight.add(id)

    handlerContext.process.send({
      ...funOptions,
      context,
      event,
      id,
    })
  }
}

// function handler used to simulate Lambda functions
exports.createHandler = function createHandler(funOptions, options) {
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

exports.functionCacheCleanup = function functionCacheCleanup() {
  values(handlerCache).forEach((value) => {
    value.process.kill()
  })
}
