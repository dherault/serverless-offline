import HttpServer from './HttpServer.js'
import WebSocketClients from './WebSocketClients.js'
import WebSocketServer from './WebSocketServer.js'

export default class WebSocket {
  constructor(service, options, lambda) {
    const webSocketClients = new WebSocketClients(
      options,
      service.provider,
      lambda,
    )

    this._httpServer = new HttpServer(options, webSocketClients)

    // share server
    this._webSocketServer = new WebSocketServer(
      options,
      webSocketClients,
      this._httpServer.server,
      lambda,
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

  createEvent(functionKey, functionObj, websocket) {
    this._webSocketServer.addRoute(functionKey, functionObj, websocket.route)
  }
}
