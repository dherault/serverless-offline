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
  #idleTimeouts = new WeakMap()
  #hardTimeouts = new WeakMap()

  constructor(serverless, options, lambda, v3Utils) {
    this.#lambda = lambda
    this.#options = options
    this.#websocketsApiRouteSelectionExpression =
      serverless.service.provider.websocketsApiRouteSelectionExpression ||
      DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION

    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }
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

    return connectionId
  }

  _getWebSocketClient(connectionId) {
    return this.#clients.get(connectionId)
  }

  _addHardTimeout(client, connectionId) {
    const timeoutId = setTimeout(() => {
      if (this.log) {
        this.log.debug(`timeout:hard:${connectionId}`)
      } else {
        debugLog(`timeout:hard:${connectionId}`)
      }
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

    if (this.log) {
      this.log.debug(`timeout:idle:${connectionId}:reset`)
    } else {
      debugLog(`timeout:idle:${connectionId}:reset`)
    }

    const timeoutId = setTimeout(() => {
      if (this.log) {
        this.log.debug(`timeout:idle:${connectionId}:trigger`)
      } else {
        debugLog(`timeout:idle:${connectionId}:trigger`)
      }
      client.close(1001, 'Going away')
    }, this.#options.webSocketIdleTimeout * 1000)
    this.#idleTimeouts.set(client, timeoutId)
  }

  _clearIdleTimeout(client) {
    const timeoutId = this.#idleTimeouts.get(client)
    clearTimeout(timeoutId)
  }

  async verifyClient(connectionId, request) {
    const route = this.#webSocketRoutes.get('$connect')
    if (!route) {
      return { verified: false, statusCode: 502 }
    }

    const connectEvent = new WebSocketConnectEvent(
      connectionId,
      request,
      this.#options,
    ).create()

    const lambdaFunction = this.#lambda.get(route.functionKey)
    lambdaFunction.setEvent(connectEvent)

    try {
      const { statusCode } = await lambdaFunction.runHandler()
      const verified = statusCode >= 200 && statusCode < 300
      return { verified, statusCode }
    } catch (err) {
      if (this.log) {
        this.log.debug(`Error in route handler '${route.functionKey}'`, err)
      } else {
        debugLog(`Error in route handler '${route.functionKey}'`, err)
      }
      return { verified: false, statusCode: 502 }
    }
  }

  async _processEvent(websocketClient, connectionId, routeKey, event) {
    let route = this.#webSocketRoutes.get(routeKey)

    if (!route && routeKey !== '$disconnect') {
      route = this.#webSocketRoutes.get('$default')
    }

    if (!route) {
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

      if (this.log) {
        this.log.debug(`Error in route handler '${route.functionKey}'`, err)
      } else {
        debugLog(`Error in route handler '${route.functionKey}'`, err)
      }
    }

    const lambdaFunction = this.#lambda.get(route.functionKey)

    lambdaFunction.setEvent(event)

    try {
      const { body } = await lambdaFunction.runHandler()
      if (
        body &&
        routeKey !== '$disconnect' &&
        route.definition.routeResponseSelectionExpression === '$default'
      ) {
        // https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-selection-expressions.html#apigateway-websocket-api-route-response-selection-expressions
        // TODO: Once API gateway supports RouteResponses, this will need to change to support that functionality
        // For now, send body back to the client
        this.send(connectionId, body)
      }
    } catch (err) {
      if (this.log) {
        this.log.error(err)
      } else {
        console.log(err)
      }
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

    const routeSelectionExpression =
      this.#websocketsApiRouteSelectionExpression.replace('request.body', '')

    const route = jsonPath(json, routeSelectionExpression)

    if (typeof route !== 'string') {
      return DEFAULT_WEBSOCKETS_ROUTE
    }

    return route || DEFAULT_WEBSOCKETS_ROUTE
  }

  addClient(webSocketClient, connectionId) {
    this._addWebSocketClient(webSocketClient, connectionId)

    webSocketClient.on('close', () => {
      if (this.log) {
        this.log.debug(`disconnect:${connectionId}`)
      } else {
        debugLog(`disconnect:${connectionId}`)
      }

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
      if (this.log) {
        this.log.debug(`message:${message}`)
      } else {
        debugLog(`message:${message}`)
      }

      const route = this._getRoute(message)

      if (this.log) {
        this.log.debug(`route:${route} on connection=${connectionId}`)
      } else {
        debugLog(`route:${route} on connection=${connectionId}`)
      }

      const event = new WebSocketEvent(connectionId, route, message).create()
      this._onWebSocketUsed(connectionId)

      this._processEvent(webSocketClient, connectionId, route, event)
    })
  }

  addRoute(functionKey, definition) {
    // set the route name
    this.#webSocketRoutes.set(definition.route, {
      functionKey,
      definition,
    })

    if (this.log) {
      this.log.notice(`route '${definition}'`)
    } else {
      serverlessLog(`route '${definition}'`)
    }
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
