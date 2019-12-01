import { Server } from '@hapi/hapi'
import { catchAllRoute, connectionsRoutes } from './http-routes/index'
import WebSocketClients from './WebSocketClients'
import serverlessLog from '../../serverlessLog'
import { Options } from '../../interfaces'

export default class HttpServer {
  private readonly _options: Options
  private readonly _server: Server
  private readonly _webSocketClients: WebSocketClients

  constructor(options: Options, webSocketClients: WebSocketClients) {
    this._options = options
    this._webSocketClients = webSocketClients

    const { host, websocketPort } = options

    const serverOptions = {
      host,
      port: websocketPort,
      router: {
        // allows for paths with trailing slashes to be the same as without
        // e.g. : /my-path is the same as /my-path/
        stripTrailingSlash: true,
      },
    }

    this._server = new Server(serverOptions)
  }

  async start() {
    // add routes
    const routes = [
      ...connectionsRoutes(this._webSocketClients),
      catchAllRoute(),
    ]
    this._server.route(routes)

    const { host, httpsProtocol, websocketPort } = this._options

    try {
      await this._server.start()
    } catch (err) {
      console.error(
        `Unexpected error while starting serverless-offline websocket server on port ${websocketPort}:`,
        err,
      )
      process.exit(1)
    }

    serverlessLog(
      `Offline [http for websocket] listening on http${
        httpsProtocol ? 's' : ''
      }://${host}:${websocketPort}`,
    )
  }

  // stops the server
  stop(timeout: number) {
    return this._server.stop({
      timeout,
    })
  }

  get server() {
    return this._server.listener
  }
}
