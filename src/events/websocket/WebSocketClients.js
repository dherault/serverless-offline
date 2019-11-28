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
  constructor(options, provider, lambda) {
    this._clients = new Map()
    this._lambda = lambda
    this._options = options
    this._webSocketRoutes = new Map()
    this._websocketsApiRouteSelectionExpression =
      provider.websocketsApiRouteSelectionExpression ||
      DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION
  }

  _addWebSocketClient(client, connectionId) {
    this._clients.set(client, connectionId)
    this._clients.set(connectionId, client)
  }

  _removeWebSocketClient(client) {
    const connectionId = this._clients.get(client)

    this._clients.delete(client)
    this._clients.delete(connectionId)

    return connectionId
  }

  _getWebSocketClient(connectionId) {
    return this._clients.get(connectionId)
  }

  async _processEvent(websocketClient, connectionId, route, event) {
    let routeOptions = this._webSocketRoutes.get(route)

    if (!routeOptions && route !== '$connect' && route !== '$disconnect') {
      routeOptions = this._webSocketRoutes.get('$default')
    }

    if (!routeOptions) {
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

      debugLog(`Error in route handler '${routeOptions}'`, err)
    }

    const { functionKey } = routeOptions
    const lambdaFunction = this._lambda.get(functionKey)

    lambdaFunction.setEvent(event)

    // let result

    try {
      /* result = */ await lambdaFunction.runHandler()

      // TODO what to do with "result"?
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

    const routeSelectionExpression = this._websocketsApiRouteSelectionExpression.replace(
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
      this._options,
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

  addRoute(functionKey, functionDefinition, route) {
    // set the route name
    this._webSocketRoutes.set(route, {
      functionDefinition,
      functionKey,
    })

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
