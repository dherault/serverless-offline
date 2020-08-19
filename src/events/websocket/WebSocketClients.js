import { OPEN } from 'ws'
import {
  WebSocketConnectEvent,
  WebSocketDisconnectEvent,
  WebSocketEvent,
} from './lambda-events/index.js'
import debugLog from '../../debugLog.js'
import serverlessLog from '../../serverlessLog.js'
import {
  DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION,
  DEFAULT_WEBSOCKETS_ROUTE,
} from '../../config/index.js'
import { jsonPath } from '../../utils/index.js'

const { parse, stringify } = JSON

export default class WebSocketClients {
  #clients = new Map()
  #lambda = null
  #options = null
  #webSocketRoutes = new Map()
  #websocketsApiRouteSelectionExpression = null

  constructor(serverless, options, lambda) {
    this.#lambda = lambda
    this.#options = options
    this.#websocketsApiRouteSelectionExpression =
      serverless.service.provider.websocketsApiRouteSelectionExpression ||
      DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION
  }

  _addWebSocketClient(client, connectionId) {
    this.#clients.set(client, connectionId)
    this.#clients.set(connectionId, client)
  }

  _removeWebSocketClient(client) {
    const connectionId = this.#clients.get(client)

    this.#clients.delete(client)
    this.#clients.delete(connectionId)

    return connectionId
  }

  _getWebSocketClient(connectionId) {
    return this.#clients.get(connectionId)
  }

  async _processEvent(websocketClient, connectionId, route, event) {
    let functionKey = this.#webSocketRoutes.get(route)

    if (!functionKey && route !== '$connect' && route !== '$disconnect') {
      functionKey = this.#webSocketRoutes.get('$default')
    }

    if (!functionKey) {
      return
    }

    if (!functionKey) {
      websocketClient.send(
        stringify({
          connectionId,
          message: 'Forbidden',
          requestId: '1234567890',
        }),
      )

      debugLog(`Unhandled route '${route}'`)
      return
    }

    const sendError = (err) => {
      if (websocketClient.readyState === OPEN) {
        websocketClient.send(
          stringify({
            connectionId,
            message: 'Internal server error',
            requestId: '1234567890',
          }),
        )
      }

      // mimic AWS behaviour (close connection) when the $connect route handler throws
      if (route === '$connect') {
        websocketClient.close()
      }

      debugLog(`Error in route handler '${functionKey}'`, err)
    }

    const lambdaFunction = this.#lambda.get(functionKey)

    lambdaFunction.setEvent(event)

    try {
      const { body } = await lambdaFunction.runHandler()

      debugLog(`responding:${body}`)
      websocketClient.send(body)
    } catch (err) {
      console.log(err)
      sendError(err)
    }
  }

  _getRoute(value) {
    let json

    try {
      json = parse(value)
    } catch (err) {
      return DEFAULT_WEBSOCKETS_ROUTE
    }

    const routeSelectionExpression = this.#websocketsApiRouteSelectionExpression.replace(
      'request.body',
      '',
    )

    const route = jsonPath(json, routeSelectionExpression)

    if (typeof route !== 'string') {
      return DEFAULT_WEBSOCKETS_ROUTE
    }

    return route || DEFAULT_WEBSOCKETS_ROUTE
  }

  addClient(webSocketClient, request, connectionId) {
    this._addWebSocketClient(webSocketClient, connectionId)

    const connectEvent = new WebSocketConnectEvent(
      connectionId,
      request,
      this.#options,
    ).create()

    this._processEvent(webSocketClient, connectionId, '$connect', connectEvent)

    webSocketClient.on('close', () => {
      debugLog(`disconnect:${connectionId}`)

      this._removeWebSocketClient(webSocketClient)

      const disconnectEvent = new WebSocketDisconnectEvent(
        connectionId,
      ).create()

      this._processEvent(
        webSocketClient,
        connectionId,
        '$disconnect',
        disconnectEvent,
      )
    })

    webSocketClient.on('message', (message) => {
      debugLog(`message:${message}`)

      const route = this._getRoute(message)

      debugLog(`route:${route} on connection=${connectionId}`)

      const event = new WebSocketEvent(connectionId, route, message).create()

      this._processEvent(webSocketClient, connectionId, route, event)
    })
  }

  addRoute(functionKey, route) {
    // set the route name
    this.#webSocketRoutes.set(route, functionKey)

    serverlessLog(`route '${route}'`)
  }

  close(connectionId) {
    const client = this._getWebSocketClient(connectionId)

    if (client) {
      client.close()
      return true
    }

    return false
  }

  send(connectionId, payload) {
    const client = this._getWebSocketClient(connectionId)

    if (client) {
      client.send(payload)
      return true
    }

    return false
  }
}
