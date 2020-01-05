import { Server } from '@hapi/hapi'
import { invocationsRoute, invokeAsyncRoute } from './routes/index.js'
import serverlessLog from '../serverlessLog.js'

export default class HttpServer {
  #lambda = null
  #options = null
  #server = null

  constructor(options, lambda) {
    this.#lambda = lambda
    this.#options = options

    const { host, lambdaPort } = options

    const serverOptions = {
      host,
      port: lambdaPort,
    }

    this.#server = new Server(serverOptions)
  }

  async start() {
    // add routes
    const _invocationsRoute = invocationsRoute(this.#lambda)
    const _invokeAsyncRoute = invokeAsyncRoute(this.#lambda)

    this.#server.route([_invokeAsyncRoute, _invocationsRoute])

    const { host, httpsProtocol, lambdaPort } = this.#options

    try {
      await this.#server.start()
    } catch (err) {
      console.error(
        `Unexpected error while starting serverless-offline lambda server on port ${lambdaPort}:`,
        err,
      )
      process.exit(1)
    }

    serverlessLog(
      `Offline [http for lambda] listening on http${
        httpsProtocol ? 's' : ''
      }://${host}:${lambdaPort}`,
    )
  }

  // stops the server
  stop(timeout) {
    return this.#server.stop({
      timeout,
    })
  }
}
