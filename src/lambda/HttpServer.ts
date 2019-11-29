import { Server } from '@hapi/hapi'
import { invokeRoute } from './routes/index'
import serverlessLog from '../serverlessLog'

export default class HttpServer {
  private readonly _lambda: any
  private readonly _options: any
  private readonly _server: Server

  constructor(options, lambda) {
    this._lambda = lambda
    this._options = options

    const { host, lambdaPort } = options

    const serverOptions = {
      host,
      port: lambdaPort,
    }

    this._server = new Server(serverOptions)
  }

  async start() {
    // add routes
    const route = invokeRoute(this._lambda)
    this._server.route(route)

    console.log('hier')

    const { host, httpsProtocol, lambdaPort } = this._options

    try {
      await this._server.start()
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
  stop(timeout: number) {
    return this._server.stop({
      timeout,
    })
  }
}
