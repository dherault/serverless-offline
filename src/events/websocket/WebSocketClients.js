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
  #webSocketAuthorizers = new Map()
  #websocketsApiRouteSelectionExpression = null
  #clientAuthorization = new Map()
  #idleTimeouts = new WeakMap()
  #hardTimeouts = new WeakMap()

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
    this._onWebSocketUsed(connectionId)
    this._addHardTimeout(client, connectionId)
  }

  _removeWebSocketClient(client) {
    const connectionId = this.#clients.get(client)

    this.#clients.delete(client)
    this.#clients.delete(connectionId)
    this.#clientAuthorization.delete(connectionId)

    return connectionId
  }

  _getWebSocketClient(connectionId) {
    return this.#clients.get(connectionId)
  }

  _addHardTimeout(client, connectionId) {
    const timeoutId = setTimeout(() => {
      debugLog(`timeout:hard:${connectionId}`)
      client.close(1001, 'Going away')
    }, this.#options.webSocketHardTimeout * 1000)
    this.#hardTimeouts.set(client, timeoutId)
  }

  _clearHardTimeout(client) {
    const timeoutId = this.#hardTimeouts.get(client)
    clearTimeout(timeoutId)
  }

  _onWebSocketUsed(connectionId) {
    const client = this._getWebSocketClient(connectionId)
    this._clearIdleTimeout(client)
    debugLog(`timeout:idle:${connectionId}:reset`)

    const timeoutId = setTimeout(() => {
      debugLog(`timeout:idle:${connectionId}:trigger`)
      client.close(1001, 'Going away')
    }, this.#options.webSocketIdleTimeout * 1000)
    this.#idleTimeouts.set(client, timeoutId)
  }

  _clearIdleTimeout(client) {
    const timeoutId = this.#idleTimeouts.get(client)
    clearTimeout(timeoutId)
  }

  async _processEvent(websocketClient, connectionId, route, event) {
    let functionKey = this.#webSocketRoutes.get(route)

    if (!functionKey && route !== '$connect' && route !== '$disconnect') {
      functionKey = this.#webSocketRoutes.get('$default')
    }

    if (!functionKey) {
      return
    }

    const sendError = (err) => {
      let message
      if (route === '$connect') {
        message = err.message
      } else {
        message = stringify({
          connectionId,
          message: 'Internal server error',
          requestId: '1234567890',
        })
      }

      if (websocketClient.readyState === OPEN) {
        websocketClient.send(message)
      }

      // mimic AWS behaviour (close connection) when the $connect route handler throws
      if (route === '$connect') {
        websocketClient.close()
      }

      debugLog(`Error in route handler '${functionKey}'`, err)
    }

    // let result
    const authorizedEvent = event

    try {
      let authorization = this.#clientAuthorization.get(connectionId)
      const lambdaAuthorizer = this.#webSocketAuthorizers.get(functionKey)

      if (lambdaAuthorizer && !authorization) {
        if (lambdaAuthorizer) {
          const lambdaAuthorizerFunction = this.#lambda.get(
            lambdaAuthorizer.name.toLowerCase(),
          )
          lambdaAuthorizerFunction.setEvent(authorizedEvent)
          authorization = await lambdaAuthorizerFunction.runHandler()
          this.#clientAuthorization.set(connectionId, authorization)
        }
      }

      let authorizerFail = true

      if (lambdaAuthorizer) {
        if (authorization) {
          const policy = authorization.policyDocument
          if (policy && policy.Statement && policy.Statement.length === 1) {
            const statement = policy.Statement[0]
            if (statement.Action === 'execute-api:Invoke') {
              if (statement.Effect === 'allow') {
                authorizedEvent.requestContext.authorizer =
                  authorization.context
                authorizedEvent.requestContext.authorizer.principalId =
                  authorization.principalId
                authorizerFail = false
              }
            }
          }
        }
      } else {
        authorizerFail = false
      }

      if (authorizerFail)
        throw Error(
          'HTTP Authentication failed; no valid credentials available',
        )

      const lambdaFunction = this.#lambda.get(functionKey)

      lambdaFunction.setEvent(authorizedEvent)

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

      this._removeWebSocketClient(webSocketClient)

      const disconnectEvent = new WebSocketDisconnectEvent(
        connectionId,
      ).create()

      this._clearHardTimeout(webSocketClient)
      this._clearIdleTimeout(webSocketClient)

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
      this._onWebSocketUsed(connectionId)

      this._processEvent(webSocketClient, connectionId, route, event)
    })
  }

  addRoute(functionKey, route, authorizer) {
    // set the route name
    this.#webSocketRoutes.set(route, functionKey)

    if (authorizer) {
      this.#webSocketAuthorizers.set(functionKey, authorizer)
    }

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
      this._onWebSocketUsed(connectionId)
      client.send(payload)
      return true
    }

    return false
  }
}
