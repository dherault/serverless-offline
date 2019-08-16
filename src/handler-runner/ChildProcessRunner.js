'use strict'

const { resolve } = require('path')
const { node } = require('execa')
const debugLog = require('../debugLog.js')
const { createUniqueId } = require('../utils/index.js')

const { stringify } = JSON

module.exports = class ChildProcessRunner {
  constructor(funOptions, skipCacheInvalidation) {
    this._funOptions = funOptions
    this._handlerCacheMap = new Map()
    this._messageCallbackMap = new Map()
    this._skipCacheInvalidation = skipCacheInvalidation
  }

  run(event, context, callback) {
    const { handlerPath } = this._funOptions

    let handlerContext = this._handlerCacheMap.get(handlerPath)

    const handleFatal = (error) => {
      debugLog(`External handler received fatal error ${stringify(error)}`)

      handlerContext.inflight.forEach((id) => {
        const callback = this._messageCallbackMap.get(id)
        callback(error)
      })

      handlerContext.inflight.clear()
      this._handlerCacheMap.delete(handlerPath)
    }

    const helperPath = resolve(__dirname, 'childProcessHelper.js')

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

      if (this._skipCacheInvalidation) {
        this._handlerCacheMap.set(handlerPath, handlerContext)
      }

      ipcProcess.on('message', (message) => {
        debugLog(`External handler received message ${stringify(message)}`)

        const { data, error, id } = message

        if (id) {
          const callback = this._messageCallbackMap.get(id)
          callback(error, data)
          handlerContext.inflight.delete(id)
          this._messageCallbackMap.delete(id)
        } else if (error) {
          // Handler died!
          handleFatal(error)
        }

        if (!this._skipCacheInvalidation) {
          handlerContext.process.kill()
          this._handlerCacheMap.delete(handlerPath)
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

    this._messageCallbackMap.set(id, callback)

    handlerContext.inflight.add(id)

    handlerContext.process.send({
      ...this._funOptions,
      context,
      event,
      id,
    })
  }
}
