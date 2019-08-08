'use strict'

const { fork } = require('child_process')
const { resolve } = require('path')
const debugLog = require('./debugLog.js')
const { createUniqueId } = require('./utils/index.js')

const { stringify } = JSON
const { values } = Object

const handlerCache = {}
const messageCallbacks = {}

module.exports = function createExternalHandler(funOptions, options) {
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

module.exports.functionCacheCleanup = function functionCacheCleanup() {
  values(handlerCache).forEach((value) => {
    value.process.kill()
  })
}
