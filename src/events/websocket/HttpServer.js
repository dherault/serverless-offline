import AbstractHttpServer from "../../lambda/AbstractHttpServer.js"
import { catchAllRoute, connectionsRoutes } from "./http-routes/index.js"

export default class HttpServer extends AbstractHttpServer {
  #options = null

  #lambda = null

  #webSocketClients = null

  constructor(options, lambda, webSocketClients) {
    super(lambda, options, options.websocketPort)
    this.#options = options
    this.#lambda = lambda
    this.#webSocketClients = webSocketClients
  }

  async createServer() {
    // No-op
  }

  async start() {
    // add routes
    this.httpServer.route(connectionsRoutes(this.#webSocketClients))

    if (this.#options.websocketPort !== this.#options.httpPort) {
      this.httpServer.route([catchAllRoute()])
    }

    await super.start()
  }

  async stop(timeout) {
    if (this.#options.websocketPort === this.#options.httpPort) {
      return
    }

    await super.stop(timeout)
  }

  get listener() {
    return this.#lambda.getServer(this.#options.websocketPort).listener
  }

  get httpServer() {
    return this.#lambda.getServer(
      this.#options.websocketPort === this.#options.httpPort
        ? this.#options.lambdaPort
        : this.#options.websocketPort,
    )
  }

  get serverName() {
    return "websocket"
  }

  get port() {
    return this.#options.websocketPort === this.#options.httpPort
      ? this.#options.lambdaPort
      : this.#options.websocketPort
  }
}
