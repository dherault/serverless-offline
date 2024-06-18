import AbstractHttpServer from "../../lambda/AbstractHttpServer.js"
import { catchAllRoute, connectionsRoutes } from "./http-routes/index.js"

export default class HttpServer extends AbstractHttpServer {
  #webSocketClients = null

  constructor(options, lambda, webSocketClients) {
    super(lambda, options, options.websocketPort)
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

    await super.start()
  }

  get server() {
    return this.httpServer.listener
  }
}
