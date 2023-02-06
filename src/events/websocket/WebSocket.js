import HttpServer from './HttpServer.js'
import WebSocketEventDefinition from './WebSocketEventDefinition.js'
import WebSocketClients from './WebSocketClients.js'
import WebSocketServer from './WebSocketServer.js'

export default class WebSocket {
  #httpServer = null

  #lambda = null

  #options = null

  #serverless = null

  #webSocketServer = null

  constructor(serverless, options, lambda) {
    this.#lambda = lambda
    this.#options = options
    this.#serverless = serverless
  }

  async createServer() {
    const webSocketClients = new WebSocketClients(
      this.#serverless,
      this.#options,
      this.#lambda,
    )

    this.#httpServer = new HttpServer(this.#options, webSocketClients)

    await this.#httpServer.createServer()

    // share server
    this.#webSocketServer = new WebSocketServer(
      this.#options,
      webSocketClients,
      this.#httpServer.server,
    )

    await this.#webSocketServer.createServer()
  }

  start() {
    return Promise.all([
      this.#httpServer.start(),
      this.#webSocketServer.start(),
    ])
  }

  // stops the server
  stop(timeout) {
    return Promise.all([
      this.#httpServer.stop(timeout),
      this.#webSocketServer.stop(),
    ])
  }

  #createEvent(functionKey, rawWebSocketEventDefinition) {
    const webSocketEvent = new WebSocketEventDefinition(
      rawWebSocketEventDefinition,
    )

    this.#webSocketServer.addRoute(functionKey, webSocketEvent)
  }

  create(events) {
    events.forEach(({ functionKey, websocket }) => {
      this.#createEvent(functionKey, websocket)
    })
  }
}
