import { Server } from 'ws'
import debugLog from '../../debugLog.js'
import serverlessLog from '../../serverlessLog.js'
import { createUniqueId } from '../../utils/index.js'

export default class WebSocketServer {
  #options = null
  #webSocketClients = null
  #connectionIds = new Map()

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
      verifyClient: ({ req }, cb) => {
        const connectionId = createUniqueId()
        const { headers } = req
        const key = headers['sec-websocket-key']

        if (this.log) {
          this.log.debug(`verifyClient:${key} ${connectionId}`)
        } else {
          debugLog(`verifyClient:${key} ${connectionId}`)
        }

        // Use the websocket key to coorelate connection IDs
        this.#connectionIds[key] = connectionId

        this.#webSocketClients
          .verifyClient(connectionId, req)
          .then(({ verified, statusCode }) => {
            try {
              if (!verified) {
                cb(false, statusCode)
                return
              }
              cb(true)
            } catch (e) {
              debugLog(`Error verifying`, e)
              cb(false)
            }
          })
      },
    })

    server.on('connection', (webSocketClient, request) => {
      if (this.log) {
        this.log.notice('received connection')
      } else {
        console.log('received connection')
      }

      const { headers } = request
      const key = headers['sec-websocket-key']

      const connectionId = this.#connectionIds[key]

      if (this.log) {
        this.log.debug(`connect:${connectionId}`)
      } else {
        debugLog(`connect:${connectionId}`)
      }

      this.#webSocketClients.addClient(webSocketClient, connectionId)
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
    this.#webSocketClients.addRoute(functionKey, webSocketEvent)
    // serverlessLog(`route '${route}'`)
  }
}
