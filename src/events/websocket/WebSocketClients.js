import { OPEN } from 'ws'
import {
  WebSocketConnectEvent,
  WebSocketDisconnectEvent,
  WebSocketEvent,
} from './lambda-events/index.js'
import authFunctionNameExtractor from '../authorizer/authFunctionNameExtractor.js'
import { extractAuthResult } from '../authorizer/createAuthScheme.js'
import debugLog from '../../debugLog.js'
import serverlessLog from '../../serverlessLog.js'
import {
  DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION,
  DEFAULT_WEBSOCKETS_ROUTE,
} from '../../config/index.js'
import { jsonPath } from '../../utils/index.js'

const { parse, stringify } = JSON

const makeClientContextKey = (connectionId) => `CONTEXT/${connectionId}`

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
    this.#clients.delete(makeClientContextKey(connectionId))

    return connectionId
  }

  _getWebSocketClient(connectionId) {
    return this.#clients.get(connectionId)
  }

  _getWebSocketClientContext(connectionId) {
    return this.#clients.get(makeClientContextKey(connectionId)) ?? {}
  }

  _setWebSocketClientContext(connectionId, context) {
    this.#clients.set(makeClientContextKey(connectionId), context)
  }

  _extractAuthFunctionName(authorizer) {
    const result = authFunctionNameExtractor(authorizer)

    return result.unsupportedAuth ? null : result.authorizerName
  }

  async _processEvent(websocketClient, connectionId, route, e) {
    const event = e

    let { functionKey } = this.#webSocketRoutes.get(route) ?? {}
    const { authorizer } = this.#webSocketRoutes.get(route) ?? {}

    if (!functionKey && route !== '$connect' && route !== '$disconnect') {
      functionKey = this.#webSocketRoutes.get('$default')?.functionKey
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

    if (route === '$connect' && authorizer) {
      const authFunctionName = this._extractAuthFunctionName(authorizer)
      if (authFunctionName) {
        const authorizerFunction = this.#lambda.get(authFunctionName)
        authorizerFunction.setEvent(event)
        try {
          serverlessLog(
            `Running Authorization function (λ: ${authFunctionName}) for WS route ${route}`,
          )

          const policy = await authorizerFunction.runHandler()
          const authResult = extractAuthResult(policy, authFunctionName, event)
          if (authResult.isBoom) {
            return
          }

          serverlessLog(
            `Authorization function for WS route ${route} returned a successful response`,
          )
          this._setWebSocketClientContext(connectionId, {
            authorizer: authResult.authorizer,
          })
        } catch (err) {
          console.log(err)
          sendError(err)
          return
        }
      }
    }

    // Simulate AWS behaviour pass authorizer context to future events
    event.requestContext = {
      ...event.requestContext,
      ...this._getWebSocketClientContext(connectionId),
    }

    const lambdaFunction = this.#lambda.get(functionKey)

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

      const disconnectEvent = new WebSocketDisconnectEvent(
        connectionId,
      ).create()

      this._processEvent(
        webSocketClient,
        connectionId,
        '$disconnect',
        disconnectEvent,
      )

      this._removeWebSocketClient(webSocketClient)
    })

    webSocketClient.on('message', (message) => {
      debugLog(`message:${message}`)

      const route = this._getRoute(message)

      debugLog(`route:${route} on connection=${connectionId}`)

      const event = new WebSocketEvent(connectionId, route, message).create()

      this._processEvent(webSocketClient, connectionId, route, event)
    })
  }

  addRoute(functionKey, route, authorizer) {
    // set the route definition
    const functionDefinition = { functionKey }

    if (authorizer) functionDefinition.authorizer = authorizer

    this.#webSocketRoutes.set(route, functionDefinition)

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
