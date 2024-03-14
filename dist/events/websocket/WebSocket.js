import HttpServer from './HttpServer.js'
import WebSocketEventDefinition from './WebSocketEventDefinition.js'
import WebSocketClients from './WebSocketClients.js'
import WebSocketServer from './WebSocketServer.js'
export default class WebSocket {
  #httpServer = null
  #webSocketServer = null
  constructor(serverless, options, lambda) {
    const webSocketClients = new WebSocketClients(serverless, options, lambda)
    this.#httpServer = new HttpServer(options, webSocketClients)
    this.#webSocketServer = new WebSocketServer(
      options,
      webSocketClients,
      this.#httpServer.server,
    )
  }
  start() {
    return Promise.all([
      this.#httpServer.start(),
      this.#webSocketServer.start(),
    ])
  }
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
