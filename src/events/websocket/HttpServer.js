import { exit } from 'node:process'
import { Server } from '@hapi/hapi'
import { catchAllRoute, connectionsRoutes } from './http-routes/index.js'

export default class HttpServer {
  #options = null
  #server = null
  #webSocketClients = null

  constructor(options, webSocketClients, v3Utils) {
    this.#options = options
    this.#webSocketClients = webSocketClients

    this.log = v3Utils.log
    this.v3Utils = v3Utils

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

    this.#server = new Server(serverOptions)
  }

  async start() {
    // add routes
    const routes = [
      ...connectionsRoutes(this.#webSocketClients, this.v3Utils),
      catchAllRoute(this.v3Utils),
    ]
    this.#server.route(routes)

    const { host, httpsProtocol, websocketPort } = this.#options

    try {
      await this.#server.start()
    } catch (err) {
      this.log.error(
        `Unexpected error while starting serverless-offline websocket server on port ${websocketPort}:`,
        err,
      )
      exit(1)
    }

    this.log.notice(
      `Offline [http for websocket] listening on http${
        httpsProtocol ? 's' : ''
      }://${host}:${websocketPort}`,
    )
  }

  // stops the server
  stop(timeout) {
    return this.#server.stop({
      timeout,
    })
  }

  get server() {
    return this.#server.listener
  }
}
