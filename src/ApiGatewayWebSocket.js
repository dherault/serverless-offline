'use strict'

const { readFileSync } = require('fs')
const { resolve } = require('path')
const { Server } = require('@hapi/hapi')
const hapiPluginWebsocket = require('hapi-plugin-websocket')
const authFunctionNameExtractor = require('./authFunctionNameExtractor.js')
const debugLog = require('./debugLog.js')
const LambdaFunctionPool = require('./LambdaFunctionPool.js')
const serverlessLog = require('./serverlessLog.js')
const {
  createUniqueId,
  parseQueryStringParameters,
} = require('./utils/index.js')
const {
  createConnectEvent,
  createDisconnectEvent,
  createEvent,
} = require('./websocketHelpers.js')

const { stringify } = JSON

module.exports = class ApiGatewayWebSocket {
  constructor(service, options, config) {
    this._actions = {}
    this._clients = new Map()
    this._config = config
    this._lambdaFunctionPool = new LambdaFunctionPool()
    this._options = options
    this._provider = service.provider
    this._server = null
    this._service = service
    this._websocketsApiRouteSelectionExpression =
      this._provider.websocketsApiRouteSelectionExpression ||
      '$request.body.action'

    this._init()
  }

  _printBlankLine() {
    if (process.env.NODE_ENV !== 'test') {
      console.log()
    }
  }

  _init() {
    // start COPY PASTE FROM HTTP SERVER CODE
    const {
      enforceSecureCookies,
      host,
      httpsProtocol,
      preserveTrailingSlash,
      websocketPort,
    } = this._options

    const serverOptions = {
      host,
      port: websocketPort,
      router: {
        // removes trailing slashes on incoming paths
        stripTrailingSlash: !preserveTrailingSlash,
      },
      state: enforceSecureCookies
        ? {
            isHttpOnly: true,
            isSameSite: false,
            isSecure: true,
          }
        : {
            isHttpOnly: false,
            isSameSite: false,
            isSecure: false,
          },
    }

    // HTTPS support
    if (typeof httpsProtocol === 'string' && httpsProtocol.length > 0) {
      serverOptions.tls = {
        cert: readFileSync(resolve(httpsProtocol, 'cert.pem'), 'ascii'),
        key: readFileSync(resolve(httpsProtocol, 'key.pem'), 'ascii'),
      }
    }

    // Hapijs server
    this._server = new Server(serverOptions)

    // Enable CORS preflight response
    this._server.ext('onPreResponse', (request, h) => {
      if (request.headers.origin) {
        const response = request.response.isBoom
          ? request.response.output
          : request.response

        response.headers['access-control-allow-origin'] = request.headers.origin
        response.headers['access-control-allow-credentials'] = 'true'

        if (request.method === 'options') {
          response.statusCode = 200
          response.headers['access-control-expose-headers'] =
            'content-type, content-length, etag'
          response.headers['access-control-max-age'] = 60 * 10

          if (request.headers['access-control-request-headers']) {
            response.headers['access-control-allow-headers'] =
              request.headers['access-control-request-headers']
          }

          if (request.headers['access-control-request-method']) {
            response.headers['access-control-allow-methods'] =
              request.headers['access-control-request-method']
          }
        }
      }

      return h.continue
    })
    // end COPY PASTE FROM HTTP SERVER CODE
  }

  async createServer() {
    const doAction = async (ws, connectionId, name, event, doDefaultAction) => {
      let action = this._actions[name]

      if (!action && doDefaultAction) action = this._actions.$default
      if (!action) return

      const sendError = (err) => {
        if (ws.readyState === /* OPEN */ 1) {
          ws.send(
            stringify({
              connectionId,
              message: 'Internal server error',
              requestId: '1234567890',
            }),
          )
        }

        // mimic AWS behaviour (close connection) when the $connect action handler throws
        if (name === '$connect') {
          ws.close()
        }

        debugLog(`Error in handler of action ${action}`, err)
      }

      const { functionName, functionObj } = action

      const lambdaFunction = this._lambdaFunctionPool.get(
        functionName,
        functionObj,
        this._provider,
        this._config,
        this._options,
      )

      const requestId = createUniqueId()

      lambdaFunction.setEvent(event)
      lambdaFunction.setRequestId(requestId)

      // let result

      try {
        /* result = */ await lambdaFunction.runHandler()

        const {
          billedExecutionTimeInMillis,
          executionTimeInMillis,
        } = lambdaFunction

        serverlessLog(
          `(λ: ${functionName}) RequestId: ${requestId}  Duration: ${executionTimeInMillis.toFixed(
            2,
          )} ms  Billed Duration: ${billedExecutionTimeInMillis} ms`,
        )

        // TODO what to do with "result"?
      } catch (err) {
        sendError(err)
      }
    }

    this._server.route({
      method: 'POST',
      path: '/',
      options: {
        payload: {
          allow: 'application/json',
          output: 'data',
          parse: true,
        },
        plugins: {
          websocket: {
            initially: false,
            only: true,
            connect: ({ ws, req }) => {
              const queryStringParameters = parseQueryStringParameters(req.url)
              const connection = {
                connectionId: createUniqueId(),
                connectionTime: Date.now(),
              }

              debugLog(`connect:${connection.connectionId}`)

              this._clients.set(ws, connection)

              let event = createConnectEvent(
                '$connect',
                'CONNECT',
                connection,
                this._options,
              )

              if (Object.keys(queryStringParameters || {}).length > 0) {
                event = { queryStringParameters, ...event }
              }

              doAction(ws, connection.connectionId, '$connect', event, false)
            },
            disconnect: ({ ws }) => {
              const connection = this._clients.get(ws)

              debugLog(`disconnect:${connection.connectionId}`)

              this._clients.delete(ws)

              const event = createDisconnectEvent(
                '$disconnect',
                'DISCONNECT',
                connection,
              )

              doAction(ws, connection.connectionId, '$disconnect', event, false)
            },
          },
        },
      },
      handler: (request, h) => {
        const { initially, ws } = request.websocket()

        if (!request.payload || initially) {
          return h.response().code(204)
        }

        const connection = this._clients.get(ws)
        let actionName = null

        if (
          this._websocketsApiRouteSelectionExpression.startsWith(
            '$request.body.',
          )
        ) {
          actionName = request.payload

          if (typeof actionName === 'object') {
            this._websocketsApiRouteSelectionExpression
              .replace('$request.body.', '')
              .split('.')
              .forEach((key) => {
                if (actionName) {
                  actionName = actionName[key]
                }
              })
          } else actionName = null
        }

        if (typeof actionName !== 'string') {
          actionName = null
        }

        const action = actionName || '$default'

        debugLog(`action:${action} on connection=${connection.connectionId}`)

        const event = createEvent(
          action,
          'MESSAGE',
          connection,
          request.payload,
        )

        doAction(ws, connection.connectionId, action, event, true)

        return h.response().code(204)
      },
    })

    this._server.route({
      handler: (request, h) => h.response().code(426),
      method: 'GET',
      path: '/{path*}',
    })

    this._server.route({
      method: 'POST',
      path: '/@connections/{connectionId}',
      options: {
        payload: {
          parse: false,
        },
      },
      handler: (request, h) => {
        debugLog(`got POST to ${request.url}`)

        const ws = this._getByConnectionId(request.params.connectionId)

        if (!ws) return h.response().code(410)
        if (!request.payload) return ''

        ws.send(request.payload.toString())

        debugLog(`sent data to connection:${request.params.connectionId}`)

        return ''
      },
    })

    this._server.route({
      options: {
        payload: {
          parse: false,
        },
      },
      method: 'DELETE',
      path: '/@connections/{connectionId}',
      handler: (request, h) => {
        debugLog(`got DELETE to ${request.url}`)

        const ws = this._getByConnectionId(request.params.connectionId)

        if (!ws) return h.response().code(410)

        ws.close()

        debugLog(`closed connection:${request.params.connectionId}`)

        return ''
      },
    })
  }

  _getByConnectionId(connectionId) {
    for (const [key, connection] of this._clients.entries()) {
      if (connection.connectionId === connectionId) return key
    }

    return undefined
  }

  createWsAction(functionName, functionObj, websocket) {
    this._printBlankLine()

    const actionName = websocket.route
    const action = {
      functionName,
      functionObj,
    }

    this._actions[actionName] = action
    serverlessLog(`Action '${websocket.route}'`)
  }

  _extractAuthFunctionName(endpoint) {
    const result = authFunctionNameExtractor(endpoint, serverlessLog)

    return result.unsupportedAuth ? null : result.authorizerName
  }

  async registerPlugins() {
    try {
      await this._server.register(hapiPluginWebsocket)
    } catch (e) {
      serverlessLog(e)
    }
  }

  async start() {
    const { host, httpsProtocol, websocketPort } = this._options

    try {
      await this._server.start()
    } catch (error) {
      console.error(
        `Unexpected error while starting serverless-offline websocket server on port ${websocketPort}:`,
        error,
      )
      process.exit(1)
    }

    this._printBlankLine()
    serverlessLog(
      `Offline [websocket] listening on ws${
        httpsProtocol ? 's' : ''
      }://${host}:${websocketPort}`,
    )
  }

  // stops the hapi server
  stop(timeout) {
    return this._server.stop({
      timeout,
    })
  }
}
