import { exit } from 'node:process'
import { Server } from '@hapi/hapi'
import { log } from '@serverless/utils/log.js'
import { catchAllRoute, connectionsRoutes } from './http-routes/index.js'

export default class HttpServer {
  #options = null

  #server = null

  #webSocketClients = null

  constructor(options, webSocketClients) {
    this.#options = options
    this.#webSocketClients = webSocketClients

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
      ...connectionsRoutes(this.#webSocketClients),
      catchAllRoute(),
    ]
    this.#server.route(routes)

    const { host, httpsProtocol, websocketPort } = this.#options

    try {
      await this.#server.start()
    } catch (err) {
      log.error(
        `Unexpected error while starting serverless-offline websocket server on port ${websocketPort}:`,
        err,
      )
      exit(1)
    }

    log.notice(
      `Offline [http for websocket] listening on ${
        httpsProtocol ? 'https' : 'http'
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
