'use strict'

const { readFileSync } = require('fs')
const { resolve } = require('path')
const { URL } = require('url')
const { Server } = require('@hapi/hapi')
const hapiPluginWebsocket = require('hapi-plugin-websocket')
const authFunctionNameExtractor = require('./authFunctionNameExtractor.js')
const debugLog = require('./debugLog.js')
const { createHandler, getFunctionOptions } = require('./functionHelper.js')
const LambdaContext = require('./LambdaContext.js')
const serverlessLog = require('./serverlessLog.js')
const {
  createUniqueId,
  parseQueryStringParameters,
} = require('./utils/index.js')
const wsHelpers = require('./websocketHelpers.js')

const { stringify } = JSON

// dummy placeholder url for the WHATWG URL constructor
// https://github.com/nodejs/node/issues/12682
// TODO move to common constants file
const BASE_URL_PLACEHOLDER = 'http://example'

module.exports = class ApiGatewayWebSocket {
  constructor(serverless, options) {
    this._service = serverless.service
    this._options = options
    this._clients = new Map()
    this._actions = {}
    this._websocketsApiRouteSelectionExpression =
      serverless.service.provider.websocketsApiRouteSelectionExpression ||
      '$request.body.action'
    this._hasWebsocketRoutes = false
    this._experimentalWarningNotified = false

    this._server = null

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
    const doAction = (ws, connectionId, name, event, doDefaultAction) => {
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

      let action = this._actions[name]

      if (!action && doDefaultAction) action = this._actions.$default
      if (!action) return

      function callback(err) {
        if (!err) return
        sendError(err)
      }

      // TEMP
      const func = {
        ...action.functionObj,
        name,
      }

      const context = new LambdaContext({
        callback,
        functionName: func.name,
        memorySize: func.memorySize || this._service.provider.memorySize,
        timeout: func.timeout || this._service.provider.timeout,
      })

      let p = null

      try {
        p = action.handler(event, context, callback)
      } catch (err) {
        sendError(err)
      }

      if (p) {
        p.catch((err) => {
          sendError(err)
        })
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
              const { searchParams } = new URL(req.url, BASE_URL_PLACEHOLDER)
              const queryStringParameters = parseQueryStringParameters(
                searchParams,
              )
              const connection = {
                connectionId: createUniqueId(),
                connectionTime: Date.now(),
              }

              debugLog(`connect:${connection.connectionId}`)

              this._clients.set(ws, connection)

              let event = wsHelpers.createConnectEvent(
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

              const event = wsHelpers.createDisconnectEvent(
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

        const event = wsHelpers.createEvent(
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

        const getByConnectionId = (map, searchValue) => {
          for (const [key, connection] of map.entries()) {
            if (connection.connectionId === searchValue) return key
          }

          return undefined
        }

        const ws = getByConnectionId(this._clients, request.params.connectionId)

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

        const getByConnectionId = (map, searchValue) => {
          for (const [key, connection] of map.entries()) {
            if (connection.connectionId === searchValue) return key
          }

          return undefined
        }

        const ws = getByConnectionId(this._clients, request.params.connectionId)

        if (!ws) return h.response().code(410)

        ws.close()

        debugLog(`closed connection:${request.params.connectionId}`)

        return ''
      },
    })
  }

  createWsAction(provider, functionName, functionObj, event, servicePath) {
    const funOptions = getFunctionOptions(
      functionName,
      functionObj,
      servicePath,
      provider.runtime,
    )

    debugLog(`funOptions ${stringify(funOptions, null, 2)} `)
    this._printBlankLine()
    debugLog(functionName, 'runtime', provider.runtime)

    let handler // The lambda function
    Object.assign(process.env, this.originalEnvironment)

    try {
      if (this._options.noEnvironment) {
        // This evict errors in server when we use aws services like ssm
        const baseEnvironment = {
          AWS_REGION: 'dev',
        }

        if (!process.env.AWS_PROFILE) {
          baseEnvironment.AWS_ACCESS_KEY_ID = 'dev'
          baseEnvironment.AWS_SECRET_ACCESS_KEY = 'dev'
        }

        process.env = Object.assign(baseEnvironment, process.env)
      } else {
        Object.assign(
          process.env,
          { AWS_REGION: this._service.provider.region },
          this._service.provider.environment,
          this._service.functions[functionName].environment,
        )
      }

      process.env._HANDLER = functionObj.handler
      handler = createHandler(funOptions, this._options)
    } catch (error) {
      return serverlessLog(`Error while loading ${functionName}`, error)
    }

    const actionName = event.websocket.route
    const action = {
      functionObj,
      functionName,
      funOptions,
      handler,
      servicePath,
    }

    this._actions[actionName] = action
    serverlessLog(`Action '${event.websocket.route}'`)

    this._hasWebsocketRoutes = true

    this._experimentalWebSocketSupportWarning()
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

  // TODO: eventually remove WARNING after release has been deemed stable
  _experimentalWebSocketSupportWarning() {
    // notify only once
    if (this._experimentalWarningNotified) {
      return
    }

    serverlessLog(
      `WebSocket support in "Serverless-Offline is experimental.
       For any bugs, missing features or other feedback file an issue at https://github.com/dherault/serverless-offline/issues
      `,
      'serverless-offline',
      { color: 'magenta' },
    )

    this._experimentalWarningNotified = true
  }
}
