import { WebSocket } from "ws"
import { isBoom } from "@hapi/boom"
import { log } from "../../utils/log.js"
import {
  WebSocketAuthorizerEvent,
  WebSocketConnectEvent,
  WebSocketDisconnectEvent,
  WebSocketEvent,
} from "./lambda-events/index.js"
import authCanExecuteResource from "../authCanExecuteResource.js"
import authFunctionNameExtractor from "../authFunctionNameExtractor.js"
import authValidateContext from "../authValidateContext.js"
import {
  DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION,
  DEFAULT_WEBSOCKETS_ROUTE,
} from "../../config/index.js"
import { jsonPath } from "../../utils/index.js"

const { parse, stringify } = JSON

export default class WebSocketClients {
  #clients = new Map()

  #hardTimeouts = new WeakMap()

  #idleTimeouts = new WeakMap()

  #lambda = null

  #options = null

  #serverless = null

  #webSocketAuthorizers = new Map()

  #webSocketAuthorizersCache = new Map()

  #webSocketRoutes = new Map()

  #websocketsApiRouteSelectionExpression = null

  constructor(serverless, options, lambda) {
    this.#lambda = lambda
    this.#options = options
    this.#serverless = serverless
    this.#websocketsApiRouteSelectionExpression =
      serverless.service.provider.websocketsApiRouteSelectionExpression ||
      DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION
  }

  #addWebSocketClient(client, connectionId) {
    this.#clients.set(client, connectionId)
    this.#clients.set(connectionId, client)
    this.#onWebSocketUsed(connectionId)
    this.#addHardTimeout(client, connectionId)
  }

  #removeWebSocketClient(client) {
    const connectionId = this.#clients.get(client)

    this.#clients.delete(client)
    this.#clients.delete(connectionId)

    return connectionId
  }

  #getWebSocketClient(connectionId) {
    return this.#clients.get(connectionId)
  }

  #addHardTimeout(client, connectionId) {
    const timeoutId = setTimeout(() => {
      log.debug(`timeout:hard:${connectionId}`)

      client.close(1001, "Going away")
    }, this.#options.webSocketHardTimeout * 1000)

    this.#hardTimeouts.set(client, timeoutId)
  }

  #clearHardTimeout(client) {
    const timeoutId = this.#hardTimeouts.get(client)
    clearTimeout(timeoutId)
  }

  #onWebSocketUsed(connectionId) {
    const client = this.#getWebSocketClient(connectionId)
    this.#clearIdleTimeout(client)

    log.debug(`timeout:idle:${connectionId}:reset`)

    const timeoutId = setTimeout(() => {
      log.debug(`timeout:idle:${connectionId}:trigger`)
      client.close(1001, "Going away")
    }, this.#options.webSocketIdleTimeout * 1000)
    this.#idleTimeouts.set(client, timeoutId)
  }

  #clearIdleTimeout(client) {
    const timeoutId = this.#idleTimeouts.get(client)
    clearTimeout(timeoutId)
  }

  async verifyClient(connectionId, request) {
    const routeName = "$connect"
    const route = this.#webSocketRoutes.get(routeName)
    if (!route) {
      return {
        statusCode: 502,
        verified: false,
      }
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

      log.notice()
      log.notice(
        `Running Authorization function for ${routeName} (λ: ${authFunName})`,
      )

      try {
        const result = await authorizerFunction.runHandler()
        if (result === "Unauthorized") {
          return {
            statusCode: 401,
            verified: false,
          }
        }

        const policy = result

        // Validate that the policy document has the principalId set
        if (!policy.principalId) {
          log.notice(
            `Authorization response did not include a principalId: (λ: ${authFunName})`,
          )

          return {
            statusCode: 403,
            verified: false,
          }
        }

        if (
          !authCanExecuteResource(
            policy.policyDocument,
            authorizeEvent.methodArn,
          )
        ) {
          log.notice(
            `Authorization response didn't authorize user to access resource: (λ: ${authFunName})`,
          )

          return {
            statusCode: 403,
            verified: false,
          }
        }

        log.notice(
          `Authorization function returned a successful response: (λ: ${authFunName})`,
        )

        if (policy.context) {
          const validatedContext = authValidateContext(
            policy.context,
            authorizerFunction,
          )
          if (validatedContext instanceof Error) throw validatedContext
          policy.context = validatedContext
        }

        this.#webSocketAuthorizersCache.set(connectionId, {
          authorizer: {
            integrationLatency: "42",
            principalId: policy.principalId,
            ...policy.context,
          },
          identity: {
            apiKey: policy.usageIdentifierKey,
            sourceIp: authorizeEvent.requestContext.sourceIp,
            userAgent: authorizeEvent.headers["user-agent"] || "",
          },
        })
      } catch (err) {
        log.debug(`Error in route handler '${routeName}' authorizer`, err)

        let headers = []
        let message

        if (isBoom(err)) {
          headers = err.output.headers
          message = err.output.payload.message
        }

        return {
          headers,
          message,
          statusCode: 500,
          verified: false,
        }
      }
    }

    const authorizerData = this.#webSocketAuthorizersCache.get(connectionId)
    if (authorizerData) {
      connectEvent.requestContext.identity = authorizerData.identity
      connectEvent.requestContext.authorizer = authorizerData.authorizer
    }

    const lambdaFunction = this.#lambda.get(route.functionKey)
    lambdaFunction.setEvent(connectEvent)

    try {
      const { statusCode } = await lambdaFunction.runHandler()
      const verified = statusCode >= 200 && statusCode < 300

      return {
        statusCode,
        verified,
      }
    } catch (err) {
      this.#webSocketAuthorizersCache.delete(connectionId)

      log.debug(`Error in route handler '${route.functionKey}'`, err)

      return {
        statusCode: 502,
        verified: false,
      }
    }
  }

  async #processEvent(websocketClient, connectionId, routeKey, event) {
    let route = this.#webSocketRoutes.get(routeKey)

    if (!route && routeKey !== "$disconnect") {
      route = this.#webSocketRoutes.get("$default")
    }

    if (!route) {
      return
    }

    const sendError = (err) => {
      if (websocketClient.readyState === WebSocket.OPEN) {
        websocketClient.send(
          stringify({
            connectionId,
            message: "Internal server error",
            requestId: "1234567890",
          }),
        )
      }

      log.debug(`Error in route handler '${route.functionKey}'`, err)
    }

    const authorizerData = this.#webSocketAuthorizersCache.get(connectionId)
    let authorizedEvent

    if (authorizerData) {
      authorizedEvent = event
      authorizedEvent.requestContext.identity = authorizerData.identity
      authorizedEvent.requestContext.authorizer = authorizerData.authorizer
    }

    const lambdaFunction = this.#lambda.get(route.functionKey)
    lambdaFunction.setEvent(authorizedEvent || event)

    try {
      const { body } = await lambdaFunction.runHandler()
      if (
        body &&
        routeKey !== "$disconnect" &&
        route.definition.routeResponseSelectionExpression === "$default"
      ) {
        // https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-selection-expressions.html#apigateway-websocket-api-route-response-selection-expressions
        // TODO: Once API gateway supports RouteResponses, this will need to change to support that functionality
        // For now, send body back to the client
        this.send(connectionId, body)
      }
    } catch (err) {
      log.error(err)

      sendError(err)
    }
  }

  #getRoute(value) {
    let json

    try {
      json = parse(value)
    } catch {
      return DEFAULT_WEBSOCKETS_ROUTE
    }

    const routeSelectionExpression =
      this.#websocketsApiRouteSelectionExpression.replace("request.body", "")

    const route = jsonPath(json, routeSelectionExpression)

    if (typeof route !== "string") {
      return DEFAULT_WEBSOCKETS_ROUTE
    }

    return route || DEFAULT_WEBSOCKETS_ROUTE
  }

  addClient(webSocketClient, connectionId) {
    this.#addWebSocketClient(webSocketClient, connectionId)

    webSocketClient.on("close", () => {
      log.debug(`disconnect:${connectionId}`)

      this.#removeWebSocketClient(webSocketClient)

      const disconnectEvent = new WebSocketDisconnectEvent(
        connectionId,
      ).create()

      this.#clearHardTimeout(webSocketClient)
      this.#clearIdleTimeout(webSocketClient)

      const authorizerData = this.#webSocketAuthorizersCache.get(connectionId)
      if (authorizerData) {
        disconnectEvent.requestContext.identity = authorizerData.identity
        disconnectEvent.requestContext.authorizer = authorizerData.authorizer
      }

      this.#processEvent(
        webSocketClient,
        connectionId,
        "$disconnect",
        disconnectEvent,
      ).finally(() => this.#webSocketAuthorizersCache.delete(connectionId))
    })

    webSocketClient.on("message", (data, isBinary) => {
      const message = isBinary ? data : String(data)

      log.debug(`message:${message}`)

      const route = this.#getRoute(message)

      log.debug(`route:${route} on connection=${connectionId}`)

      const event = new WebSocketEvent(connectionId, route, message).create()
      const authorizerData = this.#webSocketAuthorizersCache.get(connectionId)
      if (authorizerData) {
        event.requestContext.identity = authorizerData.identity
        event.requestContext.authorizer = authorizerData.authorizer
      }
      this.#onWebSocketUsed(connectionId)

      this.#processEvent(webSocketClient, connectionId, route, event)
    })
  }

  #extractAuthFunctionName(endpoint) {
    if (
      typeof endpoint.authorizer === "object" &&
      endpoint.authorizer.type &&
      endpoint.authorizer.type.toUpperCase() === "TOKEN"
    ) {
      log.debug(`Websockets does not support the TOKEN authorization type`)

      return null
    }

    const result = authFunctionNameExtractor(endpoint)

    return result.unsupportedAuth ? null : result.authorizerName
  }

  #configureAuthorization(endpoint, functionKey) {
    if (!endpoint.authorizer) {
      return
    }

    if (endpoint.route === "$connect") {
      const authFunctionName = this.#extractAuthFunctionName(endpoint)

      if (!authFunctionName) {
        return
      }

      log.notice(
        `Configuring Authorization: ${functionKey} ${authFunctionName}`,
      )

      const authFunction =
        this.#serverless.service.getFunction(authFunctionName)

      if (!authFunction) {
        log.error(`Authorization function ${authFunctionName} does not exist`)

        return
      }

      this.#webSocketAuthorizers.set(endpoint.route, authFunctionName)
      return
    }

    log.notice(`Configuring Authorization is supported only on $connect route`)
  }

  addRoute(functionKey, definition) {
    // set the route name
    this.#webSocketRoutes.set(definition.route, {
      definition,
      functionKey,
    })

    if (!this.#options.noAuth) {
      this.#configureAuthorization(definition, functionKey)
    }

    log.notice(`route '${definition.route} (λ: ${functionKey})'`)
  }

  close(connectionId) {
    const client = this.#getWebSocketClient(connectionId)

    if (client) {
      client.close()
      return true
    }

    return false
  }

  send(connectionId, payload) {
    const client = this.#getWebSocketClient(connectionId)

    if (client) {
      this.#onWebSocketUsed(connectionId)
      client.send(payload)
      return true
    }

    return false
  }
}
