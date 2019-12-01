import { Server } from 'ws'
import debugLog from '../../debugLog'
import serverlessLog from '../../serverlessLog'
import { createUniqueId } from '../../utils/index'
import WebSocketClients from './WebSocketClients'
import { Options } from '../../interfaces'

export default class WebSocketServer {
  private readonly _options: Options
  private readonly _server: Server
  private readonly _webSocketClients: WebSocketClients

  constructor(
    options: Options,
    webSocketClients: WebSocketClients,
    sharedServer,
  ) {
    this._options = options

    this._server = new Server({
      server: sharedServer,
    })

    this._webSocketClients = webSocketClients

    this._server.on('connection', (webSocketClient, request) => {
      console.log('received connection')

      const connectionId = createUniqueId()

      debugLog(`connect:${connectionId}`)

      this._webSocketClients.addClient(webSocketClient, request, connectionId)
    })
  }

  async start() {
    const { host, httpsProtocol, websocketPort } = this._options

    serverlessLog(
      `Offline [websocket] listening on ws${
        httpsProtocol ? 's' : ''
      }://${host}:${websocketPort}`,
    )
  }

  // no-op, we're re-using the http server
  stop() {}

  addRoute(functionKey: string, webSocketEvent) {
    this._webSocketClients.addRoute(functionKey, webSocketEvent.route)

    // serverlessLog(`route '${route}'`)
  }
}
