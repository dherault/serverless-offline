import { resolve } from 'path'
import { MessageChannel, Worker } from 'worker_threads' // eslint-disable-line import/no-unresolved

const workerThreadHelperPath = resolve(__dirname, './workerThreadHelper.js')

export default class WorkerThreadRunner {
  #workerThread = null
  #allowCache = false

  constructor(funOptions /* options */, env, allowCache) {
    // this._options = options

    const {
      functionKey,
      handlerName,
      handlerPath,
      handlerModuleNesting,
      timeout,
    } = funOptions

    this.#allowCache = allowCache
    this.#workerThread = new Worker(workerThreadHelperPath, {
      // don't pass process.env from the main process!
      env,
      workerData: {
        functionKey,
        handlerName,
        handlerPath,
        handlerModuleNesting,
        timeout,
      },
    })
  }

  // () => Promise<number>
  cleanup() {
    // TODO console.log('worker thread cleanup')

    // NOTE: terminate returns a Promise with exit code in node.js v12.5+
    return this.#workerThread.terminate()
  }

  run(event, context) {
    return new Promise((_resolve, reject) => {
      const { port1, port2 } = new MessageChannel()

      port1
        .on('message', _resolve)
        // emitted if the worker thread throws an uncaught exception.
        // In that case, the worker will be terminated.
        .on('error', reject)
        // TODO
        .on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`))
          }
        })

      this.#workerThread.postMessage(
        {
          context,
          event,
          allowCache: this.#allowCache,
          // port2 is part of the payload, for the other side to answer messages
          port: port2,
        },
        // port2 is also required to be part of the transfer list
        [port2],
      )
    })
  }
}
