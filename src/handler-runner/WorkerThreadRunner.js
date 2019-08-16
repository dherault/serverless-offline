'use strict'

const { resolve } = require('path')
const { Worker } = require('worker_threads') // eslint-disable-line import/no-unresolved

const workerThreadHelperPath = resolve(__dirname, './workerThreadHelper.js')

module.exports = class WorkerThreadRunner {
  constructor(funOptions /* options */) {
    this._funOptions = funOptions
    // this._options = options
    this._workerThread = null
  }

  run(event, context) {
    const { handlerName, handlerPath } = this._funOptions

    if (this._workerThread == null) {
      this._workerThread = new Worker(workerThreadHelperPath, {
        workerData: {
          handlerName,
          handlerPath,
        },
      })
    }

    // cleanup, remove all previously attached listeners
    this._workerThread.removeAllListeners()

    return new Promise((resolve, reject) => {
      this._workerThread
        .on('message', resolve)
        // emitted if the worker thread throws an uncaught exception.
        // In that case, the worker will be terminated.
        .on('error', reject)
        // TODO
        .on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`))
          }
        })

      // FIXME TEMP workaround
      // functions do not serialize
      delete context.done // eslint-disable-line no-param-reassign
      delete context.fail // eslint-disable-line no-param-reassign
      delete context.succeed // eslint-disable-line no-param-reassign
      delete context.getRemainingTimeInMillis // eslint-disable-line no-param-reassign

      this._workerThread.postMessage({
        context,
        event,
      })
    })
  }
}
