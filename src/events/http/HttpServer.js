import { Buffer } from 'buffer'
import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import h2o2 from '@hapi/h2o2'
import { Server } from '@hapi/hapi'
import inert from '@hapi/inert'
import vision from '@hapi/vision'
// import hapiSwagger from 'hapi-swagger'
import authFunctionNameExtractor from './authFunctionNameExtractor.js'
import createAuthScheme from './createAuthScheme.js'
import Endpoint from './Endpoint.js'
import {
  LambdaIntegrationEvent,
  LambdaProxyIntegrationEvent,
  renderVelocityTemplateObject,
  VelocityContext,
} from './lambda-events/index.js'
import parseResources from './parseResources.js'
import debugLog from '../../debugLog.js'
import serverlessLog, { logRoutes } from '../../serverlessLog.js'
import {
  detectEncoding,
  jsonPath,
  splitHandlerPathAndName,
} from '../../utils/index.js'

const { parse, stringify } = JSON

export default class HttpServer {
  #lambda = null
  #lastRequestOptions = null
  #options = null
  #serverless = null
  #server = null
  #terminalInfo = []

  constructor(serverless, options, lambda) {
    this.#lambda = lambda
    this.#options = options
    this.#serverless = serverless

    const {
      enforceSecureCookies,
      host,
      httpPort,
      httpsProtocol,
    } = this.#options

    const serverOptions = {
      host,
      port: httpPort,
      router: {
        // allows for paths with trailing slashes to be the same as without
        // e.g. : /my-path is the same as /my-path/
        stripTrailingSlash: true,
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

    // Hapijs server creation
    this.#server = new Server(serverOptions)

    // Enable CORS preflight response
    this.#server.ext('onPreResponse', (request, h) => {
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
  }

  async start() {
    const { host, httpPort, httpsProtocol } = this.#options

    try {
      await this.#server.start()
    } catch (err) {
      console.error(
        `Unexpected error while starting serverless-offline server on port ${httpPort}:`,
        err,
      )
      process.exit(1)
    }

    // TODO move the following block
    const server = `${httpsProtocol ? 'https' : 'http'}://${host}:${httpPort}`

    serverlessLog('')
    serverlessLog(`[HTTP] server ready: ${server} 🚀`)
    serverlessLog('')
    // serverlessLog('OpenAPI/Swagger documentation:')
    // logRoute('GET', server, '/documentation')
    // serverlessLog('')
    serverlessLog('Enter "rp" to replay the last request')
    serverlessLog('')

    if (process.env.NODE_ENV !== 'test') {
      process.openStdin().addListener('data', (data) => {
        // note: data is an object, and when converted to a string it will
        // end with a linefeed.  so we (rather crudely) account for that
        // with toString() and then trim()
        if (data.toString().trim() === 'rp') {
          this._injectLastRequest()
        }
      })
    }
  }

  // stops the server
  stop(timeout) {
    return this.#server.stop({
      timeout,
    })
  }

  async registerPlugins() {
    try {
      await this.#server.register([
        h2o2,
        inert,
        vision,
        // {
        //   plugin: hapiSwagger,
        //   options: {
        //     info: {
        //       title: 'API Gateway documentation',
        //       // TODO file bug, version information can't be omitted
        //       version: '0.0.0', // TEMP
        //     },
        //   },
        // },
      ])
    } catch (err) {
      serverlessLog(err)
    }
  }

  // // TODO unused:
  // get server() {
  //   return this.#server.listener
  // }

  _printBlankLine() {
    if (process.env.NODE_ENV !== 'test') {
      console.log()
    }
  }

  _logPluginIssue() {
    serverlessLog(
      'If you think this is an issue with the plugin please submit it, thanks!',
    )
    serverlessLog('https://github.com/dherault/serverless-offline/issues')
  }

  _extractAuthFunctionName(endpoint) {
    const result = authFunctionNameExtractor(endpoint)

    return result.unsupportedAuth ? null : result.authorizerName
  }

  _configureAuthorization(endpoint, functionKey, method, path) {
    if (!endpoint.authorizer) {
      return null
    }

    const authFunctionName = this._extractAuthFunctionName(endpoint)

    if (!authFunctionName) {
      return null
    }

    serverlessLog(`Configuring Authorization: ${path} ${authFunctionName}`)

    const authFunction = this.#serverless.service.getFunction(authFunctionName)

    if (!authFunction)
      return serverlessLog(
        `WARNING: Authorization function ${authFunctionName} does not exist`,
      )

    const authorizerOptions = {
      identitySource: 'method.request.header.Authorization',
      identityValidationExpression: '(.*)',
      resultTtlInSeconds: '300',
    }

    if (typeof endpoint.authorizer === 'string') {
      authorizerOptions.name = authFunctionName
    } else {
      Object.assign(authorizerOptions, endpoint.authorizer)
    }

    // Create a unique scheme per endpoint
    // This allows the methodArn on the event property to be set appropriately
    const authKey = `${functionKey}-${authFunctionName}-${method}-${path}`
    const authSchemeName = `scheme-${authKey}`
    const authStrategyName = `strategy-${authKey}` // set strategy name for the route config

    debugLog(`Creating Authorization scheme for ${authKey}`)

    // Create the Auth Scheme for the endpoint
    const scheme = createAuthScheme(
      authorizerOptions,
      this.#serverless.service.provider,
      this.#lambda,
    )

    // Set the auth scheme and strategy on the server
    this.#server.auth.scheme(authSchemeName, scheme)
    this.#server.auth.strategy(authStrategyName, authSchemeName)

    return authStrategyName
  }

  createRoutes(functionKey, httpEvent, handler) {
    const [handlerPath] = splitHandlerPathAndName(handler)
    const method = httpEvent.method.toUpperCase()

    const endpoint = new Endpoint(
      join(this.#serverless.config.servicePath, handlerPath),
      httpEvent,
    )

    const { path } = httpEvent
    // path must start with '/'
    let hapiPath = path.startsWith('/') ? path : `/${path}`

    const _path = hapiPath

    // prepend stage to path
    const stage = this.#options.stage || this.#serverless.service.provider.stage

    // prepend stage to path
    hapiPath = `/${stage}${hapiPath}`

    // but must not end with '/'
    if (hapiPath !== '/' && hapiPath.endsWith('/')) {
      hapiPath = hapiPath.slice(0, -1)
    }

    hapiPath = hapiPath.replace(/\+}/g, '*}')

    const protectedRoutes = []

    if (httpEvent.private) {
      protectedRoutes.push(`${method}#${hapiPath}`)
    }

    const { host, httpPort, httpsProtocol } = this.#options
    const server = `${httpsProtocol ? 'https' : 'http'}://${host}:${httpPort}`

    this.#terminalInfo.push({
      method,
      path: _path,
      server,
      stage,
    })

    // If the endpoint has an authorization function, create an authStrategy for the route
    const authStrategyName = this.#options.noAuth
      ? null
      : this._configureAuthorization(endpoint, functionKey, method, path)

    let cors = null
    if (endpoint.cors) {
      cors = {
        credentials:
          endpoint.cors.credentials || this.#options.corsConfig.credentials,
        exposedHeaders: this.#options.corsConfig.exposedHeaders,
        headers: endpoint.cors.headers || this.#options.corsConfig.headers,
        origin: endpoint.cors.origins || this.#options.corsConfig.origin,
      }
    }

    const hapiMethod = method === 'ANY' ? '*' : method

    const state = this.#options.disableCookieValidation
      ? {
          failAction: 'ignore',
          parse: false,
        }
      : {
          failAction: 'error',
          parse: true,
        }

    const hapiOptions = {
      auth: authStrategyName,
      cors,
      state,
      timeout: { socket: false },
    }

    // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
    // for more details, check https://github.com/dherault/serverless-offline/issues/204
    if (hapiMethod === 'HEAD') {
      serverlessLog(
        'HEAD method event detected. Skipping HAPI server route mapping ...',
      )

      return
    }

    if (hapiMethod !== 'HEAD' && hapiMethod !== 'GET') {
      // maxBytes: Increase request size from 1MB default limit to 10MB.
      // Cf AWS API GW payload limits.
      hapiOptions.payload = {
        maxBytes: 1024 * 1024 * 10,
        parse: false,
      }
    }

    hapiOptions.tags = ['api']

    const hapiHandler = async (request, h) => {
      // Here we go
      // Store current request as the last one
      this.#lastRequestOptions = {
        headers: request.headers,
        method: request.method,
        payload: request.payload,
        url: request.url.href,
      }

      if (request.auth.credentials && request.auth.strategy) {
        this.#lastRequestOptions.auth = request.auth
      }

      // Payload processing
      const encoding = detectEncoding(request)

      request.payload = request.payload && request.payload.toString(encoding)
      request.rawPayload = request.payload

      // Incomming request message
      this._printBlankLine()
      serverlessLog(`${method} ${request.path} (λ: ${functionKey})`)

      // Check for APIKey
      if (
        (protectedRoutes.includes(`${hapiMethod}#${hapiPath}`) ||
          protectedRoutes.includes(`ANY#${hapiPath}`)) &&
        !this.#options.noAuth
      ) {
        const errorResponse = () =>
          h
            .response({ message: 'Forbidden' })
            .code(403)
            .type('application/json')
            .header('x-amzn-ErrorType', 'ForbiddenException')

        const requestToken = request.headers['x-api-key']

        if (requestToken) {
          if (requestToken !== this.#options.apiKey) {
            debugLog(
              `Method ${method} of function ${functionKey} token ${requestToken} not valid`,
            )

            return errorResponse()
          }
        } else if (
          request.auth &&
          request.auth.credentials &&
          request.auth.credentials.usageIdentifierKey
        ) {
          const { usageIdentifierKey } = request.auth.credentials

          if (usageIdentifierKey !== this.#options.apiKey) {
            debugLog(
              `Method ${method} of function ${functionKey} token ${usageIdentifierKey} not valid`,
            )

            return errorResponse()
          }
        } else {
          debugLog(`Missing x-api-key on private function ${functionKey}`)

          return errorResponse()
        }
      }

      const response = h.response()
      const contentType = request.mime || 'application/json' // default content type

      const { integration, requestTemplates } = endpoint

      // default request template to '' if we don't have a definition pushed in from serverless or endpoint
      const requestTemplate =
        typeof requestTemplates !== 'undefined' && integration === 'AWS'
          ? requestTemplates[contentType]
          : ''

      // https://hapijs.com/api#route-configuration doesn't seem to support selectively parsing
      // so we have to do it ourselves
      const contentTypesThatRequirePayloadParsing = [
        'application/json',
        'application/vnd.api+json',
      ]

      if (
        contentTypesThatRequirePayloadParsing.includes(contentType) &&
        request.payload &&
        request.payload.length > 1
      ) {
        try {
          if (!request.payload || request.payload.length < 1) {
            request.payload = '{}'
          }

          request.payload = parse(request.payload)
        } catch (err) {
          debugLog('error in converting request.payload to JSON:', err)
        }
      }

      debugLog('contentType:', contentType)
      debugLog('requestTemplate:', requestTemplate)
      debugLog('payload:', request.payload)

      /* REQUEST TEMPLATE PROCESSING (event population) */

      let event = {}

      if (integration === 'AWS') {
        if (requestTemplate) {
          try {
            debugLog('_____ REQUEST TEMPLATE PROCESSING _____')

            event = new LambdaIntegrationEvent(
              request,
              this.#serverless.service.provider.stage,
              requestTemplate,
              _path,
            ).create()
          } catch (err) {
            return this._reply500(
              response,
              `Error while parsing template "${contentType}" for ${functionKey}`,
              err,
            )
          }
        } else if (typeof request.payload === 'object') {
          event = request.payload || {}
        }
      } else if (integration === 'AWS_PROXY') {
        const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
          request,
          this.#serverless.service.provider.stage,
          _path,
        )

        event = lambdaProxyIntegrationEvent.create()
      }

      debugLog('event:', event)

      const lambdaFunction = this.#lambda.get(functionKey)

      lambdaFunction.setEvent(event)

      let result
      let err

      try {
        result = await lambdaFunction.runHandler()
      } catch (_err) {
        err = _err
      }

      // const processResponse = (err, data) => {
      // Everything in this block happens once the lambda function has resolved
      debugLog('_____ HANDLER RESOLVED _____')

      let responseName = 'default'
      const { contentHandling, responseContentType } = endpoint

      /* RESPONSE SELECTION (among endpoint's possible responses) */

      // Failure handling
      let errorStatusCode = '502'
      if (err) {
        // Since the --useChildProcesses option loads the handler in
        // a separate process and serverless-offline communicates with it
        // over IPC, we are unable to catch JavaScript unhandledException errors
        // when the handler code contains bad JavaScript. Instead, we "catch"
        // it here and reply in the same way that we would have above when
        // we lazy-load the non-IPC handler function.
        if (this.#options.useChildProcesses && err.ipcException) {
          return this._reply500(
            response,
            `Error while loading ${functionKey}`,
            err,
          )
        }

        const errorMessage = (err.message || err).toString()

        const re = /\[(\d{3})]/
        const found = errorMessage.match(re)

        if (found && found.length > 1) {
          ;[, errorStatusCode] = found
        } else {
          errorStatusCode = '502'
        }

        // Mocks Lambda errors
        result = {
          errorMessage,
          errorType: err.constructor.name,
          stackTrace: this._getArrayStackTrace(err.stack),
        }

        serverlessLog(`Failure: ${errorMessage}`)

        if (!this.#options.hideStackTraces) {
          console.error(err.stack)
        }

        for (const [key, value] of Object.entries(endpoint.responses)) {
          if (
            key !== 'default' &&
            errorMessage.match(`^${value.selectionPattern || key}$`)
          ) {
            responseName = key
            break
          }
        }
      }

      debugLog(`Using response '${responseName}'`)
      const chosenResponse = endpoint.responses[responseName]

      /* RESPONSE PARAMETERS PROCCESSING */

      const { responseParameters } = chosenResponse

      if (responseParameters) {
        const responseParametersKeys = Object.keys(responseParameters)

        debugLog('_____ RESPONSE PARAMETERS PROCCESSING _____')
        debugLog(
          `Found ${responseParametersKeys.length} responseParameters for '${responseName}' response`,
        )

        // responseParameters use the following shape: "key": "value"
        Object.entries(responseParameters).forEach(([key, value]) => {
          const keyArray = key.split('.') // eg: "method.response.header.location"
          const valueArray = value.split('.') // eg: "integration.response.body.redirect.url"

          debugLog(`Processing responseParameter "${key}": "${value}"`)

          // For now the plugin only supports modifying headers
          if (key.startsWith('method.response.header') && keyArray[3]) {
            const headerName = keyArray.slice(3).join('.')
            let headerValue
            debugLog('Found header in left-hand:', headerName)

            if (value.startsWith('integration.response')) {
              if (valueArray[2] === 'body') {
                debugLog('Found body in right-hand')
                headerValue = valueArray[3]
                  ? jsonPath(result, valueArray.slice(3).join('.'))
                  : result
                if (
                  typeof headerValue === 'undefined' ||
                  headerValue === null
                ) {
                  headerValue = ''
                } else {
                  headerValue = headerValue.toString()
                }
              } else {
                this._printBlankLine()
                serverlessLog(
                  `Warning: while processing responseParameter "${key}": "${value}"`,
                )
                serverlessLog(
                  `Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" instead. Skipping.`,
                )
                this._logPluginIssue()
                this._printBlankLine()
              }
            } else {
              headerValue = value.match(/^'.*'$/) ? value.slice(1, -1) : value // See #34
            }
            // Applies the header;
            if (headerValue === '') {
              serverlessLog(
                `Warning: empty value for responseParameter "${key}": "${value}", it won't be set`,
              )
            } else {
              debugLog(`Will assign "${headerValue}" to header "${headerName}"`)
              response.header(headerName, headerValue)
            }
          } else {
            this._printBlankLine()
            serverlessLog(
              `Warning: while processing responseParameter "${key}": "${value}"`,
            )
            serverlessLog(
              `Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`,
            )
            this._logPluginIssue()
            this._printBlankLine()
          }
        })
      }

      let statusCode = 200

      if (integration === 'AWS') {
        const endpointResponseHeaders =
          (endpoint.response && endpoint.response.headers) || {}

        Object.entries(endpointResponseHeaders)
          .filter(
            ([, value]) => typeof value === 'string' && /^'.*?'$/.test(value),
          )
          .forEach(([key, value]) => response.header(key, value.slice(1, -1)))

        /* LAMBDA INTEGRATION RESPONSE TEMPLATE PROCCESSING */

        // If there is a responseTemplate, we apply it to the result
        const { responseTemplates } = chosenResponse

        if (typeof responseTemplates === 'object') {
          const responseTemplatesKeys = Object.keys(responseTemplates)

          if (responseTemplatesKeys.length) {
            // BAD IMPLEMENTATION: first key in responseTemplates
            const responseTemplate = responseTemplates[responseContentType]

            if (responseTemplate && responseTemplate !== '\n') {
              debugLog('_____ RESPONSE TEMPLATE PROCCESSING _____')
              debugLog(`Using responseTemplate '${responseContentType}'`)

              try {
                const reponseContext = new VelocityContext(
                  request,
                  this.#serverless.service.provider.stage,
                  result,
                ).getContext()

                result = renderVelocityTemplateObject(
                  { root: responseTemplate },
                  reponseContext,
                ).root
              } catch (error) {
                serverlessLog(
                  `Error while parsing responseTemplate '${responseContentType}' for lambda ${functionKey}:`,
                )
                console.log(error.stack)
              }
            }
          }
        }

        /* LAMBDA INTEGRATION HAPIJS RESPONSE CONFIGURATION */
        statusCode = chosenResponse.statusCode || 200

        if (err) {
          statusCode = errorStatusCode
        }

        if (!chosenResponse.statusCode) {
          this._printBlankLine()
          serverlessLog(
            `Warning: No statusCode found for response "${responseName}".`,
          )
        }

        response.header('Content-Type', responseContentType, {
          override: false, // Maybe a responseParameter set it already. See #34
        })

        response.statusCode = statusCode

        if (contentHandling === 'CONVERT_TO_BINARY') {
          response.encoding = 'binary'
          response.source = Buffer.from(result, 'base64')
          response.variety = 'buffer'
        } else if (result && result.body && typeof result.body !== 'string') {
          return this._reply500(
            response,
            'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object',
            {},
          )
        } else {
          response.source = result
        }
      } else if (integration === 'AWS_PROXY') {
        /* LAMBDA PROXY INTEGRATION HAPIJS RESPONSE CONFIGURATION */

        if (result && !result.errorType) {
          statusCode = result.statusCode || 200
        } else {
          statusCode = 502
        }

        response.statusCode = statusCode

        const headers = {}
        if (result && result.headers) {
          Object.keys(result.headers).forEach((header) => {
            headers[header] = (headers[header] || []).concat(
              result.headers[header],
            )
          })
        }
        if (result && result.multiValueHeaders) {
          Object.keys(result.multiValueHeaders).forEach((header) => {
            headers[header] = (headers[header] || []).concat(
              result.multiValueHeaders[header],
            )
          })
        }

        debugLog('headers', headers)

        Object.keys(headers).forEach((header) => {
          if (header.toLowerCase() === 'set-cookie') {
            headers[header].forEach((headerValue) => {
              const cookieName = headerValue.slice(0, headerValue.indexOf('='))
              const cookieValue = headerValue.slice(
                headerValue.indexOf('=') + 1,
              )
              h.state(cookieName, cookieValue, {
                encoding: 'none',
                strictHeader: false,
              })
            })
          } else {
            headers[header].forEach((headerValue) => {
              // it looks like Hapi doesn't support multiple headers with the same name,
              // appending values is the closest we can come to the AWS behavior.
              response.header(header, headerValue, { append: true })
            })
          }
        })

        response.header('Content-Type', 'application/json', {
          duplicate: false,
          override: false,
        })

        if (result && typeof result.body !== 'undefined') {
          if (result.isBase64Encoded) {
            response.encoding = 'binary'
            response.source = Buffer.from(result.body, 'base64')
            response.variety = 'buffer'
          } else {
            if (result && result.body && typeof result.body !== 'string') {
              return this._reply500(
                response,
                'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object',
                {},
              )
            }
            response.source = result.body
          }
        }
      }

      // Log response
      let whatToLog = result

      try {
        whatToLog = stringify(result)
      } catch (error) {
        // nothing
      } finally {
        if (this.#options.printOutput)
          serverlessLog(
            err ? `Replying ${statusCode}` : `[${statusCode}] ${whatToLog}`,
          )
      }

      // Bon voyage!
      return response
    }

    this.#server.route({
      handler: hapiHandler,
      method: hapiMethod,
      options: hapiOptions,
      path: hapiPath,
    })
  }

  // Bad news
  _reply500(response, message, error) {
    serverlessLog(message)

    console.error(error)

    response.header('Content-Type', 'application/json')

    response.statusCode = 502 // APIG replies 502 by default on failures;
    response.source = {
      errorMessage: message,
      errorType: error.constructor.name,
      offlineInfo:
        'If you believe this is an issue with serverless-offline please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
      stackTrace: this._getArrayStackTrace(error.stack),
    }

    return response
  }

  createResourceRoutes() {
    if (!this.#options.resourceRoutes) {
      return
    }

    const resourceRoutesOptions = this.#options.resourceRoutes
    const resourceRoutes = parseResources(this.#serverless.service.resources)

    if (!resourceRoutes || !Object.keys(resourceRoutes).length) {
      return
    }

    this._printBlankLine()
    serverlessLog('Routes defined in resources:')

    Object.entries(resourceRoutes).forEach(([methodId, resourceRoutesObj]) => {
      const {
        isProxy,
        method,
        path,
        pathResource,
        proxyUri,
      } = resourceRoutesObj

      if (!isProxy) {
        serverlessLog(
          `WARNING: Only HTTP_PROXY is supported. Path '${pathResource}' is ignored.`,
        )
        return
      }
      if (!path) {
        serverlessLog(`WARNING: Could not resolve path for '${methodId}'.`)
        return
      }

      let hapiPath = path.startsWith('/') ? path : `/${path}`

      // prepend stage to path
      hapiPath = `/${this.#options.stage ||
        this.#serverless.service.provider.stage}${hapiPath}`

      if (hapiPath !== '/' && hapiPath.endsWith('/')) {
        hapiPath = hapiPath.slice(0, -1)
      }

      hapiPath = hapiPath.replace(/\+}/g, '*}')

      const proxyUriOverwrite = resourceRoutesOptions[methodId] || {}
      const proxyUriInUse = proxyUriOverwrite.Uri || proxyUri

      if (!proxyUriInUse) {
        serverlessLog(`WARNING: Could not load Proxy Uri for '${methodId}'`)
        return
      }

      const hapiMethod = method === 'ANY' ? '*' : method
      const hapiOptions = { cors: this.#options.corsConfig }

      // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
      // for more details, check https://github.com/dherault/serverless-offline/issues/204
      if (hapiMethod === 'HEAD') {
        serverlessLog(
          'HEAD method event detected. Skipping HAPI server route mapping ...',
        )

        return
      }

      if (hapiMethod !== 'HEAD' && hapiMethod !== 'GET') {
        hapiOptions.payload = { parse: false }
      }

      serverlessLog(`${method} ${hapiPath} -> ${proxyUriInUse}`)

      // hapiOptions.tags = ['api']

      const hapiHandler = (request, h) => {
        const { params } = request
        let resultUri = proxyUriInUse

        Object.entries(params).forEach(([key, value]) => {
          resultUri = resultUri.replace(`{${key}}`, value)
        })

        if (request.url.search !== null) {
          resultUri += request.url.search // search is empty string by default
        }

        serverlessLog(
          `PROXY ${request.method} ${request.url.path} -> ${resultUri}`,
        )

        return h.proxy({
          passThrough: true,
          uri: resultUri,
        })
      }

      this.#server.route({
        handler: hapiHandler,
        method: hapiMethod,
        options: hapiOptions,
        path: hapiPath,
      })
    })
  }

  create404Route() {
    // If a {proxy+} route exists, don't conflict with it
    if (this.#server.match('*', '/{p*}')) {
      return
    }

    const hapiHandler = (request, h) => {
      const response = h.response({
        currentRoute: `${request.method} - ${request.path}`,
        error: 'Serverless-offline: route not found.',
        existingRoutes: this.#server
          .table()
          .filter((route) => route.path !== '/{p*}') // Exclude this (404) route
          .sort((a, b) => (a.path <= b.path ? -1 : 1)) // Sort by path
          .map((route) => `${route.method} - ${route.path}`), // Human-friendly result
        statusCode: 404,
      })
      response.statusCode = 404

      return response
    }

    this.#server.route({
      handler: hapiHandler,
      method: '*',
      options: {
        cors: this.#options.corsConfig,
      },
      path: '/{p*}',
    })
  }

  _getArrayStackTrace(stack) {
    if (!stack) return null

    const splittedStack = stack.split('\n')

    return splittedStack
      .slice(
        0,
        splittedStack.findIndex((item) =>
          item.match(/server.route.handler.LambdaContext/),
        ),
      )
      .map((line) => line.trim())
  }

  _injectLastRequest() {
    if (this.#lastRequestOptions) {
      serverlessLog('Replaying HTTP last request')
      this.#server.inject(this.#lastRequestOptions)
    } else {
      serverlessLog('No last HTTP request to replay!')
    }
  }

  writeRoutesTerminal() {
    logRoutes(this.#terminalInfo)
  }

  // TEMP FIXME quick fix to expose gateway server for testing, look for better solution
  getServer() {
    return this.#server
  }
}
