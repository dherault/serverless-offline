import { log } from '@serverless/utils/log.js'
import WebSocket from 'ws'
import { createUniqueId } from '../../utils/index.js'

export default class WebSocketServer {
  #connectionIds = new Map()
  #options = null
  #webSocketClients = null

  constructor(options, webSocketClients, sharedServer) {
    this.#options = options
    this.#webSocketClients = webSocketClients

    const server = new WebSocket.WebSocketServer({
      server: sharedServer,
      verifyClient: ({ req }, cb) => {
        const connectionId = createUniqueId()
        const key = req.headers['sec-websocket-key']

        log.debug(`verifyClient:${key} ${connectionId}`)

        // Use the websocket key to coorelate connection IDs
        this.#connectionIds[key] = connectionId

        this.#webSocketClients
          .verifyClient(connectionId, req)
          .then(({ verified, statusCode, message, headers }) => {
            try {
              if (!verified) {
                cb(false, statusCode, message, headers)
                return
              }
              cb(true)
            } catch (err) {
              log.debug(`Error verifying`, err)
              cb(false)
            }
          })
      },
    })

    server.on('connection', (webSocketClient, request) => {
      log.notice('received connection')

      const { headers } = request
      const key = headers['sec-websocket-key']

      const connectionId = this.#connectionIds[key]

      log.debug(`connect:${connectionId}`)

      this.#webSocketClients.addClient(webSocketClient, connectionId)
    })
  }

  async start() {
    const { host, httpsProtocol, websocketPort } = this.#options

    log.notice(
      `Offline [websocket] listening on ws${
        httpsProtocol ? 's' : ''
      }://${host}:${websocketPort}`,
    )
  }

  // no-op, we're re-using the http server
  stop() {}

  addRoute(functionKey, webSocketEvent) {
    this.#webSocketClients.addRoute(functionKey, webSocketEvent)
  }
}
