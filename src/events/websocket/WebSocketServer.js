import { Server } from 'ws'
import debugLog from '../../debugLog.js'
import serverlessLog from '../../serverlessLog.js'
import { createUniqueId } from '../../utils/index.js'

export default class WebSocketServer {
  #options = null
  #webSocketClients = null

  constructor(options, webSocketClients, sharedServer) {
    this.#options = options
    this.#webSocketClients = webSocketClients

    const server = new Server({
      server: sharedServer,
    })

    server.on('connection', (webSocketClient, request) => {
      console.log('received connection')

      const connectionId = createUniqueId()

      debugLog(`connect:${connectionId}`)

      this.#webSocketClients.addClient(webSocketClient, request, connectionId)
    })
  }

  async start() {
    const { host, httpsProtocol, websocketPort } = this.#options

    serverlessLog(
      `Offline [websocket] listening on ws${
        httpsProtocol ? 's' : ''
      }://${host}:${websocketPort}`,
    )
  }

  // no-op, we're re-using the http server
  stop() {}

  addRoute(functionKey, webSocketEvent) {
    this.#webSocketClients.addRoute(
      functionKey,
      webSocketEvent.route,
      this.#options.noAuth ? undefined : webSocketEvent.authorizer,
    )
  }
}
