import { exit } from "node:process"
import { log } from "../../utils/log.js"
import AbstractHttpServer from "../../AbstractHttpServer.js"
import { catchAllRoute, connectionsRoutes } from "./http-routes/index.js"

export default class HttpServer extends AbstractHttpServer {
  #options = null

  #webSocketClients = null

  constructor(options, lambda, webSocketClients) {
    super(lambda, options, options.websocketPort)
    this.#options = options
    this.#webSocketClients = webSocketClients
  }

  async createServer() {
    // No-op
  }

  async start() {
    // add routes
    const routes = [
      ...connectionsRoutes(this.#webSocketClients),
      catchAllRoute(),
    ]
    this.httpServer.route(routes)

    const { host, httpsProtocol, websocketPort } = this.#options

    try {
      await super.start()
    } catch (err) {
      log.error(
        `Unexpected error while starting serverless-offline websocket server on port ${websocketPort}:`,
        err,
      )
      exit(1)
    }

    log.notice(
      `Offline [http for websocket] listening on ${
        httpsProtocol ? "https" : "http"
      }://${host}:${websocketPort}`,
    )
  }

  // stops the server
  stop(timeout) {
    return super.stop({
      timeout,
    })
  }

  get server() {
    return this.httpServer.listener
  }
}
