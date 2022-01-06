import { Server } from 'ws'
import debugLog from '../../debugLog.js'
import serverlessLog from '../../serverlessLog.js'
import { createUniqueId } from '../../utils/index.js'

export default class WebSocketServer {
  #options = null
  #webSocketClients = null

  constructor(options, webSocketClients, sharedServer, v3Utils) {
    this.#options = options
    this.#webSocketClients = webSocketClients

    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }

    const server = new Server({
      server: sharedServer,
    })

    server.on('connection', (webSocketClient, request) => {
      if (this.log) {
        this.log.notice('received connection')
      } else {
        console.log('received connection')
      }

      const connectionId = createUniqueId()

      if (this.log) {
        this.log.debug(`connect:${connectionId}`)
      } else {
        debugLog(`connect:${connectionId}`)
      }

      this.#webSocketClients.addClient(webSocketClient, request, connectionId)
    })
  }

  async start() {
    const { host, httpsProtocol, websocketPort } = this.#options

    if (this.log) {
      this.log.notice(
        `Offline [websocket] listening on ws${
          httpsProtocol ? 's' : ''
        }://${host}:${websocketPort}`,
      )
    } else {
      serverlessLog(
        `Offline [websocket] listening on ws${
          httpsProtocol ? 's' : ''
        }://${host}:${websocketPort}`,
      )
    }
  }

  // no-op, we're re-using the http server
  stop() {}

  addRoute(functionKey, webSocketEvent) {
    this.#webSocketClients.addRoute(functionKey, webSocketEvent.route)
    // serverlessLog(`route '${route}'`)
  }
}
