import HttpServer from './HttpServer'
import WebSocketEventDefinition from './WebSocketEventDefinition'
import WebSocketClients from './WebSocketClients'
import WebSocketServer from './WebSocketServer'

export default class WebSocket {
  private readonly _httpServer: HttpServer
  private readonly _webSocketServer: WebSocketServer

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
    )
  }

  start() {
    return Promise.all([
      this._httpServer.start(),
      this._webSocketServer.start(),
    ])
  }

  // stops the server
  stop(timeout: number) {
    return Promise.all([
      this._httpServer.stop(timeout),
      this._webSocketServer.stop(),
    ])
  }

  createEvent(functionKey: string, rawWebSocketEventDefinition) {
    const webSocketEvent = new WebSocketEventDefinition(
      rawWebSocketEventDefinition,
    )

    this._webSocketServer.addRoute(functionKey, webSocketEvent)
  }
}
