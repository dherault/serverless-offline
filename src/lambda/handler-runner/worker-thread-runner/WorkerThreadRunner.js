import { MessageChannel, Worker } from "node:worker_threads"
import { join, pathToFileURL } from "desm"
import { versions, env as nodeEnv } from "node:process"
import { createRequire } from "node:module"
import { statSync } from "node:fs"

const IS_NODE_20 = Number(versions.node.split(".")[0]) >= 20

const isFile = (path) => {
  try {
    return !!statSync(path, { throwIfNoEntry: false })?.isFile()
  } catch {
    /* istanbul ignore next */
    return false
  }
}

export default class WorkerThreadRunner {
  #workerThread = null

  constructor(funOptions, env) {
    const { codeDir, functionKey, handler, servicePath, timeout } = funOptions
    // Resolve the PnP loader path if Yarn PnP is in use
    let pnpLoaderPath
    let execArgv
    if (versions.pnp) {
      const nodeOptions = nodeEnv.NODE_OPTIONS?.split(/\s+/)
      const cjsRequire = createRequire(import.meta.url)
      let pnpApiPath
      try {
        /** @see https://github.com/facebook/jest/issues/9543 */
        pnpApiPath = cjsRequire.resolve("pnpapi")
      } catch {
        /* empty */
      }
      if (
        pnpApiPath &&
        !nodeOptions?.some(
          (option, index) =>
            ["-r", "--require"].includes(option) &&
            pnpApiPath === cjsRequire.resolve(nodeOptions[index + 1]),
        )
      ) {
        execArgv = ["-r", pnpApiPath]
        pnpLoaderPath = join(pnpApiPath, "../.pnp.loader.mjs")
        if (isFile(pnpLoaderPath)) {
          const experimentalLoader = pathToFileURL(pnpLoaderPath).toString()
          execArgv = ["--experimental-loader", experimentalLoader, ...execArgv]
        }
      }
    }

    const workerOptions = {
      env,
      execArgv,
      workerData: {
        codeDir,
        functionKey,
        handler,
        pnpLoaderPath,
        servicePath,
        timeout,
      },
    }

    if (pnpLoaderPath && !IS_NODE_20) {
      workerOptions.execArgv.push(
        "--experimental-loader",
        pathToFileURL(pnpLoaderPath).toString(),
      )
    }

    this.#workerThread = new Worker(
      join(import.meta.url, "workerThreadHelper.js"),
      workerOptions,
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
        .on("message", (value) => {
          if (value instanceof Error) {
            rej(value)
            return
          }

          res(value)
        })
        // emitted if the worker thread throws an uncaught exception.
        // In that case, the worker will be terminated.
        .on("error", rej)
        // TODO
        .on("exit", (code) => {
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
