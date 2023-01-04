import { MessageChannel, Worker } from 'node:worker_threads'
import { join } from 'desm'

export default class WorkerThreadRunner {
  #workerThread = null

  constructor(funOptions, env) {
    const { codeDir, functionKey, handler, servicePath, timeout } = funOptions

    this.#workerThread = new Worker(
      join(import.meta.url, 'workerThreadHelper.js'),
      {
        // don't pass process.env from the main process!
        env,
        workerData: {
          codeDir,
          functionKey,
          handler,
          servicePath,
          timeout,
        },
      },
    )
  }

  // () => Promise<number>
  cleanup() {
    // TODO console.log('worker thread cleanup')

    return this.#workerThread.terminate()
  }

  run(event, context) {
    return new Promise((res, rej) => {
      const { port1, port2 } = new MessageChannel()

      port1
        .on('message', (value) => {
          if (value instanceof Error) {
            rej(value)
            return
          }

          res(value)
        })
        // emitted if the worker thread throws an uncaught exception.
        // In that case, the worker will be terminated.
        .on('error', rej)
        // TODO
        .on('exit', (code) => {
          if (code !== 0) {
            rej(new Error(`Worker stopped with exit code ${code}`))
          }
        })

      this.#workerThread.postMessage(
        {
          context,
          event,
          // port2 is part of the payload, for the other side to answer messages
          port: port2,
        },
        // port2 is also required to be part of the transfer list
        [port2],
      )
    })
  }
}
