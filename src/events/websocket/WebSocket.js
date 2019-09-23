import HttpServer from './HttpServer.js'
import WebSocketClients from './WebSocketClients.js'
import WebSocketServer from './WebSocketServer.js'

export default class WebSocket {
  constructor(service, options, config, lambda) {
    const webSocketClients = new WebSocketClients(
      options,
      config,
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

  async start() {
    await this._httpServer.start()
    await this._webSocketServer.start()
  }

  // stops the server
  async stop(timeout) {
    await this._httpServer.stop(timeout)
    await this._webSocketServer.stop()
  }

  createEvent(functionKey, functionObj, websocket) {
    this._webSocketServer.addRoute(functionKey, functionObj, websocket.route)
  }
}
