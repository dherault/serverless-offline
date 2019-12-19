import HttpServer from './HttpServer.js'
import WebSocketEventDefinition from './WebSocketEventDefinition.js'
import WebSocketClients from './WebSocketClients.js'
import WebSocketServer from './WebSocketServer.js'

export default class WebSocket {
  constructor(serverless, options, lambda) {
    const webSocketClients = new WebSocketClients(serverless, options, lambda)

    this._httpServer = new HttpServer(options, webSocketClients)

    // share server
    this._webSocketServer = new WebSocketServer(
      options,
      webSocketClients,
      this._httpServer.server,
    )
  }

  start() {
    return Promise.all([
      this._httpServer.start(),
      this._webSocketServer.start(),
    ])
  }

  // stops the server
  stop(timeout) {
    return Promise.all([
      this._httpServer.stop(timeout),
      this._webSocketServer.stop(),
    ])
  }

  _create(functionKey, rawWebSocketEventDefinition) {
    const webSocketEvent = new WebSocketEventDefinition(
      rawWebSocketEventDefinition,
    )

    this._webSocketServer.addRoute(functionKey, webSocketEvent)
  }

  create(events) {
    events.forEach(({ functionKey, websocket }) => {
      this._create(functionKey, websocket)
    })
  }
}
