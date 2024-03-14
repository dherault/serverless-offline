import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MessageChannel, Worker } from 'node:worker_threads'
const __dirname = dirname(fileURLToPath(import.meta.url))
const workerThreadHelperPath = resolve(__dirname, './workerThreadHelper.js')
export default class WorkerThreadRunner {
  #workerThread = null
  constructor(funOptions, env) {
    const { functionKey, handlerName, handlerPath, timeout } = funOptions
    this.#workerThread = new Worker(workerThreadHelperPath, {
      env,
      workerData: {
        functionKey,
        handlerName,
        handlerPath,
        timeout,
      },
    })
  }
  cleanup() {
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
        .on('error', rej)
        .on('exit', (code) => {
          if (code !== 0) {
            rej(new Error(`Worker stopped with exit code ${code}`))
          }
        })
      this.#workerThread.postMessage(
        {
          context,
          event,
          port: port2,
        },
        [port2],
      )
    })
  }
}
