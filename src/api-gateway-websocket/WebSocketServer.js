import { Server } from 'ws'
import debugLog from '../debugLog.js'
import LambdaFunctionPool from '../lambda/index.js'
import serverlessLog from '../serverlessLog.js'
import { createUniqueId } from '../utils/index.js'

export default class WebSocketServer {
  constructor(options, webSocketClients, sharedServer) {
    this._lambdaFunctionPool = new LambdaFunctionPool()
    this._options = options

    this._server = new Server({
      server: sharedServer,
    })

    this._webSocketClients = webSocketClients

    this._init()
  }

  _init() {
    this._server.on('connection', (webSocketClient /* request */) => {
      console.log('received connection')

      const connectionId = createUniqueId()

      debugLog(`connect:${connectionId}`)

      this._webSocketClients.addClient(webSocketClient, connectionId)
    })
  }

  addRoute(functionName, functionObj, route) {
    this._webSocketClients.addRoute(functionName, functionObj, route)
    // serverlessLog(`route '${route}'`)
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
}
