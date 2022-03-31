import { OPEN } from 'ws'
import {
  WebSocketConnectEvent,
  WebSocketDisconnectEvent,
  WebSocketEvent,
  WebSocketAuthorizerEvent,
} from './lambda-events/index.js'
import debugLog from '../../debugLog.js'
import serverlessLog from '../../serverlessLog.js'
import {
  DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION,
  DEFAULT_WEBSOCKETS_ROUTE,
} from '../../config/index.js'
import { jsonPath } from '../../utils/index.js'
import authFunctionNameExtractor from '../authFunctionNameExtractor.js'
import authCanExecuteResource from '../authCanExecuteResource.js'

const { parse, stringify } = JSON

export default class WebSocketClients {
  #clients = new Map()
  #lambda = null
  #options = null
  #serverless = null
  #webSocketRoutes = new Map()
  #webSocketAuthorizers = new Map()
  #webSocketAuthorizersCache = new Map()
  #websocketsApiRouteSelectionExpression = null
  #idleTimeouts = new WeakMap()
  #hardTimeouts = new WeakMap()

  constructor(serverless, options, lambda, v3Utils) {
    this.#lambda = lambda
    this.#options = options
    this.#serverless = serverless
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
    const routeName = '$connect'
    const route = this.#webSocketRoutes.get(routeName)
    if (!route) {
      return { verified: false, statusCode: 502 }
    }

    const connectEvent = new WebSocketConnectEvent(
      connectionId,
      request,
      this.#options,
    ).create()

    const authFunName = this.#webSocketAuthorizers.get(routeName)

    if (authFunName) {
      const authorizerFunction = this.#lambda.get(authFunName)
      const authorizeEvent = new WebSocketAuthorizerEvent(
        connectionId,
        request,
        this.#serverless.service.provider,
        this.#options,
      ).create()

      authorizerFunction.setEvent(authorizeEvent)

      if (this.log) {
        this.log.notice()
        this.log.notice(
          `Running Authorization function for ${routeName} (λ: ${authFunName})`,
        )
      } else {
        console.log('') // Just to make things a little pretty
        serverlessLog(
          `Running Authorization function for ${routeName} (λ: ${authFunName})`,
        )
      }

      try {
        const result = await authorizerFunction.runHandler()
        if (result === 'Unauthorized')
          return { verified: false, statusCode: 401 }
        const policy = result

        // Validate that the policy document has the principalId set
        if (!policy.principalId) {
          if (this.log) {
            this.log.notice(
              `Authorization response did not include a principalId: (λ: ${authFunName})`,
            )
          } else {
            serverlessLog(
              `Authorization response did not include a principalId: (λ: ${authFunName})`,
            )
          }

          return { verified: false, statusCode: 403 }
        }

        if (
          !authCanExecuteResource(
            policy.policyDocument,
            authorizeEvent.methodArn,
          )
        ) {
          if (this.log) {
            this.log.notice(
              `Authorization response didn't authorize user to access resource: (λ: ${authFunName})`,
            )
          } else {
            serverlessLog(
              `Authorization response didn't authorize user to access resource: (λ: ${authFunName})`,
            )
          }

          return { verified: false, statusCode: 403 }
        }

        if (this.log) {
          this.log.notice(
            `Authorization function returned a successful response: (λ: ${authFunName})`,
          )
        } else {
          serverlessLog(
            `Authorization function returned a successful response: (λ: ${authFunName})`,
          )
        }

        this.#webSocketAuthorizersCache.set(connectionId, {
          identity: {
            apiKey: policy.usageIdentifierKey,
            sourceIp: authorizeEvent.requestContext.sourceIp,
            userAgent: authorizeEvent.headers['user-agent'] || '',
          },
          authorizer: {
            integrationLatency: '42',
            principalId: policy.principalId,
            ...policy.context,
          },
        })
      } catch (err) {
        if (this.log) {
          this.log.debug(
            `Error in route handler '${routeName}' authorizer`,
            err,
          )
        } else {
          debugLog(`Error in route handler '${routeName}' authorizer`, err)
        }
        return { verified: false, statusCode: 500 }
      }
    }

    const authorizerData = this.#webSocketAuthorizersCache.get(connectionId)
    if (authorizerData) {
      connectEvent.identity = authorizerData.identity
      connectEvent.authorizer = authorizerData.authorizer
    }

    const lambdaFunction = this.#lambda.get(route.functionKey)
    lambdaFunction.setEvent(connectEvent)

    try {
      const { statusCode } = await lambdaFunction.runHandler()
      const verified = statusCode >= 200 && statusCode < 300
      return { verified, statusCode }
    } catch (err) {
      this.#webSocketAuthorizersCache.delete(connectionId)
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

      const authorizerData = this.#webSocketAuthorizersCache.get(connectionId)
      if (authorizerData) {
        disconnectEvent.identity = authorizerData.identity
        disconnectEvent.authorizer = authorizerData.authorizer
      }

      this._processEvent(
        webSocketClient,
        connectionId,
        '$disconnect',
        disconnectEvent,
      ).finally(() => this.#webSocketAuthorizersCache.delete(connectionId))
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
      const authorizerData = this.#webSocketAuthorizersCache.get(connectionId)
      if (authorizerData) {
        event.identity = authorizerData.identity
        event.authorizer = authorizerData.authorizer
      }
      this._onWebSocketUsed(connectionId)

      this._processEvent(webSocketClient, connectionId, route, event)
    })
  }

  _extractAuthFunctionName(endpoint) {
    if (
      typeof endpoint.authorizer === 'object' &&
      endpoint.authorizer.type &&
      endpoint.authorizer.type.toUpperCase() === 'TOKEN'
    ) {
      if (this.log) {
        this.log.debug(
          `Websockets does not support the TOKEN authorization type`,
        )
      } else {
        debugLog(
          `WARNING: Websockets does not support the TOKEN authorization type`,
        )
      }
      return null
    }

    const result = authFunctionNameExtractor(endpoint, null, this)

    return result.unsupportedAuth ? null : result.authorizerName
  }

  _configureAuthorization(endpoint, functionKey) {
    if (!endpoint.authorizer) {
      return
    }

    if (endpoint.route === '$connect') {
      const authFunctionName = this._extractAuthFunctionName(endpoint)

      if (!authFunctionName) {
        return
      }

      if (this.log) {
        this.log.notice(
          `Configuring Authorization: ${functionKey} ${authFunctionName}`,
        )
      } else {
        serverlessLog(
          `Configuring Authorization: ${functionKey} ${authFunctionName}`,
        )
      }

      const authFunction =
        this.#serverless.service.getFunction(authFunctionName)

      if (!authFunction) {
        if (this.log) {
          this.log.error(
            `Authorization function ${authFunctionName} does not exist`,
          )
        } else {
          serverlessLog(
            `WARNING: Authorization function ${authFunctionName} does not exist`,
          )
        }
        return
      }

      this.#webSocketAuthorizers.set(endpoint.route, authFunctionName)
      return
    }

    if (this.log) {
      this.log.notice(
        `Configuring Authorization is supported only on $connect route`,
      )
    } else {
      serverlessLog(
        `Configuring Authorization is supported only on $connect route`,
      )
    }
  }

  addRoute(functionKey, definition) {
    // set the route name
    this.#webSocketRoutes.set(definition.route, {
      functionKey,
      definition,
    })

    if (!this.#options.noAuth) {
      this._configureAuthorization(definition, functionKey)
    }

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
