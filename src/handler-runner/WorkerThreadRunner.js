'use strict'

const { resolve } = require('path')
const { MessageChannel, Worker } = require('worker_threads') // eslint-disable-line import/no-unresolved

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

    return new Promise((resolve, reject) => {
      const { port1, port2 } = new MessageChannel()

      port1
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

      this._workerThread.postMessage(
        {
          context,
          event,
          // port1 is part of the payload ...
          port: port2,
        },
        // ... and is required to be part of the transfer list as well
        [port2],
      )
    })
  }
}
