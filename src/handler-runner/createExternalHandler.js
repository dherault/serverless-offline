'use strict'

const { resolve } = require('path')
const { node } = require('execa')
const debugLog = require('../debugLog.js')
const { createUniqueId } = require('../utils/index.js')

const { stringify } = JSON

const handlerCacheMap = new Map()
const messageCallbackMap = new Map()

module.exports = function createExternalHandler(funOptions, options) {
  const { handlerPath } = funOptions
  const { skipCacheInvalidation } = options

  let handlerContext = handlerCacheMap.get(handlerPath)

  function handleFatal(error) {
    debugLog(`External handler received fatal error ${stringify(error)}`)
    handlerContext.inflight.forEach((id) => {
      const callback = messageCallbackMap.get(id)
      callback(error)
    })
    handlerContext.inflight.clear()
    handlerCacheMap.delete(handlerPath)
  }

  const helperPath = resolve(__dirname, 'ipcHelper.js')

  return (event, context, callback) => {
    if (!handlerContext) {
      debugLog(`Loading external handler... (${handlerPath})`)

      const ipcProcess = node(helperPath, [handlerPath], {
        env: process.env,
        stdio: [0, 1, 2, 'ipc'],
      })

      handlerContext = {
        inflight: new Set(),
        process: ipcProcess,
      }

      if (skipCacheInvalidation) {
        handlerCacheMap.set(handlerPath, handlerContext)
      }

      ipcProcess.on('message', (message) => {
        debugLog(`External handler received message ${stringify(message)}`)

        const { data, error, id } = message

        if (id) {
          const callback = messageCallbackMap.get(id)
          callback(error, data)
          handlerContext.inflight.delete(id)
          messageCallbackMap.delete(id)
        } else if (error) {
          // Handler died!
          handleFatal(error)
        }

        if (!skipCacheInvalidation) {
          handlerContext.process.kill()
          handlerCacheMap.delete(handlerPath)
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

    messageCallbackMap.set(id, callback)

    handlerContext.inflight.add(id)

    handlerContext.process.send({
      ...funOptions,
      context,
      event,
      id,
    })
  }
}
