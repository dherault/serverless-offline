import HttpServer from './HttpServer.js'
import WebSocketEventDefinition from './WebSocketEventDefinition.js'
import WebSocketClients from './WebSocketClients.js'
import WebSocketServer from './WebSocketServer.js'

export default class WebSocket {
  #httpServer = null
  #webSocketServer = null

  constructor(serverless, options, lambda, v3Utils) {
    const webSocketClients = new WebSocketClients(
      serverless,
      options,
      lambda,
      v3Utils,
    )

    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }

    this.#httpServer = new HttpServer(options, webSocketClients, this.v3Utils)

    // share server
    this.#webSocketServer = new WebSocketServer(
      options,
      webSocketClients,
      this.#httpServer.server,
      v3Utils,
    )
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
