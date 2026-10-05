import { MessageChannel, Worker } from "node:worker_threads"
import { join } from "desm"
import { log } from "../../../utils/log.js"

export default class WorkerThreadRunner {
  #env = null

  #workerData = null

  // { pending: Map<MessagePort, reject>, workerThread: Worker }
  #worker = null

  constructor(funOptions, env) {
    const { codeDir, functionKey, handler, servicePath, timeout } = funOptions

    this.#env = env
    this.#workerData = {
      codeDir,
      functionKey,
      handler,
      servicePath,
      timeout,
    }
    this.#worker = this.#createWorker()
  }

  #createWorker() {
    // invocations waiting for a result from this worker thread
    const pending = new Map()

    const workerThread = new Worker(
      join(import.meta.url, "workerThreadHelper.js"),
      {
        // don't pass process.env from the main process!
        env: this.#env,
        workerData: this.#workerData,
      },
    )

    const worker = {
      pending,
      workerThread,
    }

    // (Error) => boolean
    const retire = (err) => {
      // a new worker thread is created on the next run
      if (this.#worker === worker) {
        this.#worker = null
      }

      const hadPending = pending.size > 0

      pending.forEach((reject, port) => {
        port.close()
        reject(err)
      })
      pending.clear()

      return hadPending
    }

    workerThread
      // emitted if the worker thread throws an uncaught exception, e.g. from a
      // timer or an unhandled rejection. The worker thread is terminated, and
      // without a listener the error would crash the main process.
      .on("error", (err) => {
        if (!retire(err)) {
          log.error(
            `Uncaught exception in handler '${this.#workerData.functionKey}'.`,
          )
          log.error(err)
        }
      })
      .on("exit", (code) => {
        retire(new Error(`Worker stopped with exit code ${code}`))
      })

    return worker
  }

  // () => Promise<number> | undefined
  cleanup() {
    // TODO console.log('worker thread cleanup')
    const worker = this.#worker

    this.#worker = null

    return worker?.workerThread.terminate()
  }

  run(event, context) {
    if (this.#worker == null) {
      this.#worker = this.#createWorker()
    }

    const { pending, workerThread } = this.#worker

    return new Promise((res, rej) => {
      const { port1, port2 } = new MessageChannel()

      const settle = (fn, value) => {
        pending.delete(port1)

        // a message port with a listener attached is a ref'ed handle, so an
        // unclosed channel keeps the event loop alive for every invocation
        port1.close()

        fn(value)
      }

      pending.set(port1, rej)

      port1.on("message", ({ type, value }) => {
        settle(type === "error" ? rej : res, value)
      })

      try {
        workerThread.postMessage(
          {
            context,
            event,
            // port2 is part of the payload, for the other side to answer messages
            port: port2,
          },
          // port2 is also required to be part of the transfer list
          [port2],
        )
      } catch (err) {
        settle(rej, err)
      }
    })
  }
}
