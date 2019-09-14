import HttpServer from './HttpServer.js'
import WebSocketClients from './WebSocketClients.js'
import WebSocketServer from './WebSocketServer.js'

export default class ApiGatewayWebSocket {
  constructor(service, options, config) {
    const webSocketClients = new WebSocketClients(
      options,
      config,
      service.provider,
    )

    this._httpServer = new HttpServer(options, webSocketClients)

    // share server
    this._webSocketServer = new WebSocketServer(
      options,
      webSocketClients,
      this._httpServer.server,
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

  createEvent(functionName, functionObj, websocket) {
    this._webSocketServer.addRoute(functionName, functionObj, websocket.route)
  }
}
