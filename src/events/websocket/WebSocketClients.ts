import Serverless from 'serverless'
import { OPEN } from 'ws'
import {
  WebSocketConnectEvent,
  WebSocketDisconnectEvent,
  WebSocketEvent,
} from './lambda-events/index'
import debugLog from '../../debugLog'
import serverlessLog from '../../serverlessLog'
import {
  DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION,
  DEFAULT_WEBSOCKETS_ROUTE,
} from '../../config/index'
import { jsonPath } from '../../utils/index'
import { Options } from '../../interfaces'

const { parse, stringify } = JSON

export default class WebSocketClients {
  private readonly _clients: Map<string, any> & Map<any, string> = new Map()
  private readonly _lambda: any
  private readonly _options: Options
  private readonly _webSocketRoutes: Map<string, any> = new Map()
  private readonly _websocketsApiRouteSelectionExpression: string

  constructor(serverless: Serverless, options: Options, lambda) {
    this._lambda = lambda
    this._options = options
    this._websocketsApiRouteSelectionExpression =
      // @ts-ignore
      serverless.service.provider.websocketsApiRouteSelectionExpression ||
      DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION
  }

  private _addWebSocketClient(client, connectionId: string) {
    this._clients.set(client, connectionId)
    this._clients.set(connectionId, client)
  }

  private _removeWebSocketClient(client) {
    const connectionId = this._clients.get(client)

    this._clients.delete(client)
    this._clients.delete(connectionId)

    return connectionId
  }

  private _getWebSocketClient(connectionId: string) {
    return this._clients.get(connectionId)
  }

  private async _processEvent(
    websocketClient,
    connectionId: string,
    route: string,
    event,
  ) {
    let functionKey = this._webSocketRoutes.get(route)

    if (!functionKey && route !== '$connect' && route !== '$disconnect') {
      functionKey = this._webSocketRoutes.get('$default')
    }

    if (!functionKey) {
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

  private _getRoute(value: string) {
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

  addClient(webSocketClient, request, connectionId: string) {
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

    webSocketClient.on('message', (message: string) => {
      debugLog(`message:${message}`)

      const route = this._getRoute(message)

      debugLog(`route:${route} on connection=${connectionId}`)

      const event = new WebSocketEvent(connectionId, route, message).create()

      this._processEvent(webSocketClient, connectionId, route, event)
    })
  }

  addRoute(functionKey: string, route: string) {
    // set the route name
    this._webSocketRoutes.set(route, functionKey)

    serverlessLog(`route '${route}'`)
  }

  close(connectionId: string) {
    const client = this._getWebSocketClient(connectionId)

    if (client) {
      client.close()
      return true
    }

    return false
  }

  send(connectionId: string, payload) {
    const client = this._getWebSocketClient(connectionId)

    if (client) {
      client.send(payload)
      return true
    }

    return false
  }
}
