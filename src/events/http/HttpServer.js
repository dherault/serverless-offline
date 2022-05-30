import { Buffer } from 'node:buffer'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process, { env, exit } from 'node:process'
import h2o2 from '@hapi/h2o2'
import { Server } from '@hapi/hapi'
import { createRequire } from 'module'
import * as pathUtils from 'node:path'
import authFunctionNameExtractor from '../authFunctionNameExtractor.js'
import authJWTSettingsExtractor from './authJWTSettingsExtractor.js'
import createAuthScheme from './createAuthScheme.js'
import createJWTAuthScheme from './createJWTAuthScheme.js'
import Endpoint from './Endpoint.js'
import {
  LambdaIntegrationEvent,
  LambdaProxyIntegrationEvent,
  renderVelocityTemplateObject,
  VelocityContext,
} from './lambda-events/index.js'
import parseResources from './parseResources.js'
import payloadSchemaValidator from './payloadSchemaValidator.js'
import debugLog from '../../debugLog.js'
import serverlessLog, { logRoutes } from '../../serverlessLog.js'
import {
  detectEncoding,
  getHttpApiCorsConfig,
  jsonPath,
  splitHandlerPathAndName,
  generateHapiPath,
} from '../../utils/index.js'
import LambdaProxyIntegrationEventV2 from './lambda-events/LambdaProxyIntegrationEventV2.js'

const { parse, stringify } = JSON
const { assign, entries, keys } = Object

export default class HttpServer {
  #lambda = null
  #lastRequestOptions = null
  #options = null
  #serverless = null
  #server = null
  #terminalInfo = []

  constructor(serverless, options, lambda, v3Utils) {
    this.#lambda = lambda
    this.#options = options
    this.#serverless = serverless
    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }

    const {
      enforceSecureCookies,
      host,
      httpPort,
      httpsProtocol,
      noStripTrailingSlashInUrl,
    } = this.#options

    const serverOptions = {
      host,
      port: httpPort,
      router: {
        // allows for paths with trailing slashes to be the same as without
        // e.g. : /my-path is the same as /my-path/
        stripTrailingSlash: !noStripTrailingSlashInUrl,
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

        const explicitlySetHeaders = { ...response.headers }

        if (
          this.#serverless.service.provider.httpApi &&
          this.#serverless.service.provider.httpApi.cors
        ) {
          const httpApiCors = getHttpApiCorsConfig(
            this.#serverless.service.provider.httpApi.cors,
            this,
          )

          if (request.method === 'options') {
            response.statusCode = 204
            const allowAllOrigins =
              httpApiCors.allowedOrigins.length === 1 &&
              httpApiCors.allowedOrigins[0] === '*'
            if (
              !allowAllOrigins &&
              !httpApiCors.allowedOrigins.includes(request.headers.origin)
            ) {
              return h.continue
            }
          }

          response.headers['access-control-allow-origin'] =
            request.headers.origin
          if (httpApiCors.allowCredentials) {
            response.headers['access-control-allow-credentials'] = 'true'
          }
          if (httpApiCors.maxAge) {
            response.headers['access-control-max-age'] = httpApiCors.maxAge
          }
          if (httpApiCors.exposedResponseHeaders) {
            response.headers['access-control-expose-headers'] =
              httpApiCors.exposedResponseHeaders.join(',')
          }
          if (httpApiCors.allowedMethods) {
            response.headers['access-control-allow-methods'] =
              httpApiCors.allowedMethods.join(',')
          }
          if (httpApiCors.allowedHeaders) {
            response.headers['access-control-allow-headers'] =
              httpApiCors.allowedHeaders.join(',')
          }
        } else {
          response.headers['access-control-allow-origin'] =
            request.headers.origin
          response.headers['access-control-allow-credentials'] = 'true'

          if (request.method === 'options') {
            response.statusCode = 200

            if (request.headers['access-control-expose-headers']) {
              response.headers['access-control-expose-headers'] =
                request.headers['access-control-expose-headers']
            } else {
              response.headers['access-control-expose-headers'] =
                'content-type, content-length, etag'
            }
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

          // Override default headers with headers that have been explicitly set
          keys(explicitlySetHeaders).forEach((key) => {
            const value = explicitlySetHeaders[key]
            if (value) {
              response.headers[key] = value
            }
          })
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
      if (this.log) {
        this.log.error(
          `Unexpected error while starting serverless-offline server on port ${httpPort}:`,
          err,
        )
      } else {
        console.error(
          `Unexpected error while starting serverless-offline server on port ${httpPort}:`,
          err,
        )
      }
      exit(1)
    }

    // TODO move the following block
    const server = `${httpsProtocol ? 'https' : 'http'}://${host}:${httpPort}`

    if (this.log) {
      this.log.notice(`Server ready: ${server} 🚀`)
      this.log.notice()
      this.log.notice('Enter "rp" to replay the last request')
    } else {
      serverlessLog(`[HTTP] server ready: ${server} 🚀`)

      serverlessLog('')
      // serverlessLog('OpenAPI/Swagger documentation:')
      // logRoute('GET', server, '/documentation')
      // serverlessLog('')
      serverlessLog('Enter "rp" to replay the last request')
    }

    if (env.NODE_ENV !== 'test') {
      process.openStdin().addListener('data', (data) => {
        // note: data is an object, and when converted to a string it will
        // end with a linefeed.  so we (rather crudely) account for that
        // with toString() and then trim()
        if (data.toString().trim() === 'rp') {
          this.#injectLastRequest()
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
      await this.#server.register([h2o2])
    } catch (err) {
      if (this.log) {
        this.log.error(err)
      } else {
        serverlessLog(err)
      }
    }
  }

  // // TODO unused:
  // get server() {
  //   return this.#server.listener
  // }

  #printBlankLine() {
    if (env.NODE_ENV !== 'test') {
      if (this.log) {
        this.log.notice()
      } else {
        console.log()
      }
    }
  }

  #logPluginIssue() {
    if (this.log) {
      this.log.notice(
        'If you think this is an issue with the plugin please submit it, thanks!\nhttps://github.com/dherault/serverless-offline/issues',
      )
      this.log.notice()
    } else {
      serverlessLog(
        'If you think this is an issue with the plugin please submit it, thanks!',
      )
      serverlessLog('https://github.com/dherault/serverless-offline/issues')
    }
  }

  #extractJWTAuthSettings(endpoint) {
    const result = authJWTSettingsExtractor(
      endpoint,
      this.#serverless.service.provider,
      this.#options.ignoreJWTSignature,
      this,
    )

    return result.unsupportedAuth ? null : result
  }

  #configureJWTAuthorization(endpoint, functionKey, method, path) {
    if (!endpoint.authorizer) {
      return null
    }

    // right now _configureJWTAuthorization only handles AWS HttpAPI Gateway JWT
    // authorizers that are defined in the serverless file
    if (
      this.#serverless.service.provider.name !== 'aws' ||
      !endpoint.isHttpApi
    ) {
      return null
    }

    const jwtSettings = this.#extractJWTAuthSettings(endpoint)
    if (!jwtSettings) {
      return null
    }

    if (this.log) {
      this.log.notice(`Configuring JWT Authorization: ${method} ${path}`)
    } else {
      serverlessLog(`Configuring JWT Authorization: ${method} ${path}`)
    }

    // Create a unique scheme per endpoint
    // This allows the methodArn on the event property to be set appropriately
    const authKey = `${functionKey}-${jwtSettings.authorizerName}-${method}-${path}`
    const authSchemeName = `scheme-${authKey}`
    const authStrategyName = `strategy-${authKey}` // set strategy name for the route config

    if (this.log) {
      this.log.debug(`Creating Authorization scheme for ${authKey}`)
    } else {
      debugLog(`Creating Authorization scheme for ${authKey}`)
    }

    // Create the Auth Scheme for the endpoint
    const scheme = createJWTAuthScheme(jwtSettings, this)

    // Set the auth scheme and strategy on the server
    this.#server.auth.scheme(authSchemeName, scheme)
    this.#server.auth.strategy(authStrategyName, authSchemeName)

    return authStrategyName
  }

  #extractAuthFunctionName(endpoint) {
    const result = authFunctionNameExtractor(endpoint, null, this)

    return result.unsupportedAuth ? null : result.authorizerName
  }

  #configureAuthorization(endpoint, functionKey, method, path) {
    if (!endpoint.authorizer) {
      return null
    }

    const authFunctionName = this.#extractAuthFunctionName(endpoint)

    if (!authFunctionName) {
      return null
    }

    if (this.log) {
      this.log.notice(`Configuring Authorization: ${path} ${authFunctionName}`)
    } else {
      serverlessLog(`Configuring Authorization: ${path} ${authFunctionName}`)
    }

    const authFunction = this.#serverless.service.getFunction(authFunctionName)

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
      return null
    }

    const authorizerOptions = {
      identitySource: 'method.request.header.Authorization',
      identityValidationExpression: '(.*)',
      resultTtlInSeconds: '300',
    }

    if (typeof endpoint.authorizer === 'string') {
      authorizerOptions.name = authFunctionName
    } else {
      assign(authorizerOptions, endpoint.authorizer)
    }

    // Create a unique scheme per endpoint
    // This allows the methodArn on the event property to be set appropriately
    const authKey = `${functionKey}-${authFunctionName}-${method}-${path}`
    const authSchemeName = `scheme-${authKey}`
    const authStrategyName = `strategy-${authKey}` // set strategy name for the route config

    if (this.log) {
      this.log.debug(`Creating Authorization scheme for ${authKey}`)
    } else {
      debugLog(`Creating Authorization scheme for ${authKey}`)
    }

    // Create the Auth Scheme for the endpoint
    const scheme = createAuthScheme(
      authorizerOptions,
      this.#serverless.service.provider,
      this.#lambda,
      this,
    )

    // Set the auth scheme and strategy on the server
    this.#server.auth.scheme(authSchemeName, scheme)
    this.#server.auth.strategy(authStrategyName, authSchemeName)

    return authStrategyName
  }

  #setAuthorizationStrategy(endpoint, functionKey, method, path) {
    /*
     *  The authentication strategy can be provided outside of this project
     *  by injecting the provider through a custom variable in the serverless.yml.
     *
     *  see the example in the tests for more details
     *    /tests/integration/custom-authentication
     */
    const customizations = this.#serverless.service.custom
    if (
      customizations &&
      customizations.offline?.customAuthenticationProvider
    ) {
      const root = pathUtils.resolve(
        this.#serverless.serviceDir,
        'require-resolver',
      )
      const customRequire = createRequire(root)

      const provider = customRequire(
        customizations.offline.customAuthenticationProvider,
      )

      const strategy = provider(endpoint, functionKey, method, path)
      this.#server.auth.scheme(
        strategy.scheme,
        strategy.getAuthenticateFunction,
      )
      this.#server.auth.strategy(strategy.name, strategy.scheme)
      return strategy.name
    }

    // If the endpoint has an authorization function, create an authStrategy for the route
    const authStrategyName = this.#options.noAuth
      ? null
      : this.#configureJWTAuthorization(endpoint, functionKey, method, path) ||
        this.#configureAuthorization(endpoint, functionKey, method, path)
    return authStrategyName
  }

  createRoutes(functionKey, httpEvent, handler) {
    const [handlerPath] = splitHandlerPathAndName(handler)

    let method
    let path
    let hapiPath

    if (httpEvent.isHttpApi) {
      if (httpEvent.routeKey === '$default') {
        method = 'ANY'
        path = httpEvent.routeKey
        hapiPath = '/{default*}'
      } else {
        ;[method, path] = httpEvent.routeKey.split(' ')
        hapiPath = generateHapiPath(
          path,
          {
            ...this.#options,
            noPrependStageInUrl: true, // Serverless always uses the $default stage
          },
          this.#serverless,
        )
      }
    } else {
      method = httpEvent.method.toUpperCase()
      ;({ path } = httpEvent)
      hapiPath = generateHapiPath(path, this.#options, this.#serverless)
    }

    const endpoint = new Endpoint(
      join(this.#serverless.config.servicePath, handlerPath),
      httpEvent,
      this.v3Utils,
    )

    const stage = endpoint.isHttpApi
      ? '$default'
      : this.#options.stage || this.#serverless.service.provider.stage
    const protectedRoutes = []

    if (httpEvent.private) {
      protectedRoutes.push(`${method}#${hapiPath}`)
    }

    const { host, httpPort, httpsProtocol } = this.#options
    const server = `${httpsProtocol ? 'https' : 'http'}://${host}:${httpPort}`

    this.#terminalInfo.push({
      method,
      path: hapiPath,
      server,
      stage:
        endpoint.isHttpApi || this.#options.noPrependStageInUrl ? null : stage,
      invokePath: `/2015-03-31/functions/${functionKey}/invocations`,
    })

    const authStrategyName = this.#setAuthorizationStrategy(
      endpoint,
      functionKey,
      method,
      path,
    )

    let cors = null
    if (endpoint.cors) {
      cors = {
        credentials:
          endpoint.cors.credentials || this.#options.corsConfig.credentials,
        exposedHeaders: this.#options.corsConfig.exposedHeaders,
        headers: endpoint.cors.headers || this.#options.corsConfig.headers,
        origin: endpoint.cors.origins || this.#options.corsConfig.origin,
      }
    } else if (
      this.#serverless.service.provider.httpApi &&
      this.#serverless.service.provider.httpApi.cors
    ) {
      const httpApiCors = getHttpApiCorsConfig(
        this.#serverless.service.provider.httpApi.cors,
        this,
      )
      cors = {
        origin: httpApiCors.allowedOrigins || [],
        credentials: httpApiCors.allowCredentials,
        exposedHeaders: httpApiCors.exposedResponseHeaders || [],
        maxAge: httpApiCors.maxAge,
        headers: httpApiCors.allowedHeaders || [],
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
      if (this.log) {
        this.log.notice(
          'HEAD method event detected. Skipping HAPI server route mapping',
        )
      } else {
        serverlessLog(
          'HEAD method event detected. Skipping HAPI server route mapping ...',
        )
      }

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

    const additionalRequestContext = {}
    if (httpEvent.operationId) {
      additionalRequestContext.operationName = httpEvent.operationId
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

      const requestPath =
        endpoint.isHttpApi || this.#options.noPrependStageInUrl
          ? request.path
          : request.path.substr(`/${stage}`.length)

      if (request.auth.credentials && request.auth.strategy) {
        this.#lastRequestOptions.auth = request.auth
      }

      // Payload processing
      const encoding = detectEncoding(request)

      request.payload = request.payload && request.payload.toString(encoding)
      request.rawPayload = request.payload

      // Incomming request message
      this.#printBlankLine()

      if (this.log) {
        this.log.notice()
        this.log.notice(`${method} ${request.path} (λ: ${functionKey})`)
      } else {
        serverlessLog(`${method} ${request.path} (λ: ${functionKey})`)
      }

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
          if (this.log) {
            this.log.debug(
              `Missing x-api-key on private function ${functionKey}`,
            )
          } else {
            debugLog(`Missing x-api-key on private function ${functionKey}`)
          }

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

      const schema =
        typeof endpoint?.request?.schema !== 'undefined'
          ? endpoint.request.schema[contentType]
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
          if (this.log) {
            this.log.debug('error in converting request.payload to JSON:', err)
          } else {
            debugLog('error in converting request.payload to JSON:', err)
          }
        }
      }

      if (this.log) {
        this.log.debug('contentType:', contentType)
        this.log.debug('requestTemplate:', requestTemplate)
        this.log.debug('payload:', request.payload)
      } else {
        debugLog('contentType:', contentType)
        debugLog('requestTemplate:', requestTemplate)
        debugLog('payload:', request.payload)
      }

      /* REQUEST PAYLOAD SCHEMA VALIDATION */
      if (schema) {
        if (this.log) {
          this.log.debug('schema:', schema)
        } else {
          debugLog('schema:', schema)
        }
        try {
          payloadSchemaValidator.validate(schema, request.payload)
        } catch (err) {
          return this.#reply400(response, err.message, err)
        }
      }

      /* REQUEST TEMPLATE PROCESSING (event population) */

      let event = {}

      if (integration === 'AWS') {
        if (requestTemplate) {
          try {
            if (this.log) {
              this.log.debug('_____ REQUEST TEMPLATE PROCESSING _____')
            } else {
              debugLog('_____ REQUEST TEMPLATE PROCESSING _____')
            }

            event = new LambdaIntegrationEvent(
              request,
              stage,
              requestTemplate,
              requestPath,
              this.v3Utils,
            ).create()
          } catch (err) {
            return this.#reply502(
              response,
              `Error while parsing template "${contentType}" for ${functionKey}`,
              err,
            )
          }
        } else if (typeof request.payload === 'object') {
          event = request.payload || {}
        }
      } else if (integration === 'AWS_PROXY') {
        const stageVariables = this.#serverless.service.custom
          ? this.#serverless.service.custom.stageVariables
          : null

        const lambdaProxyIntegrationEvent =
          endpoint.isHttpApi && endpoint.payload === '2.0'
            ? new LambdaProxyIntegrationEventV2(
                request,
                stage,
                endpoint.routeKey,
                stageVariables,
                additionalRequestContext,
                this.v3Utils,
              )
            : new LambdaProxyIntegrationEvent(
                request,
                stage,
                requestPath,
                stageVariables,
                endpoint.isHttpApi ? endpoint.routeKey : null,
                additionalRequestContext,
                this.v3Utils,
              )

        event = lambdaProxyIntegrationEvent.create()
      }

      if (this.log) {
        this.log.debug('event:', event)
      } else {
        debugLog('event:', event)
      }

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

      if (this.log) {
        this.log.debug('_____ HANDLER RESOLVED _____')
      } else {
        debugLog('_____ HANDLER RESOLVED _____')
      }

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
          return this.#reply502(
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
          stackTrace: this.#getArrayStackTrace(err.stack),
        }

        if (this.log) {
          this.log.error(errorMessage)
        } else {
          serverlessLog(`Failure: ${errorMessage}`)
        }

        if (!this.#options.hideStackTraces) {
          if (this.log) {
            this.log.error(err.stack)
          } else {
            console.error(err.stack)
          }
        }

        for (const [key, value] of entries(endpoint.responses)) {
          if (
            key !== 'default' &&
            errorMessage.match(`^${value.selectionPattern || key}$`)
          ) {
            responseName = key
            break
          }
        }
      }

      if (this.log) {
        this.log.debug(`Using response '${responseName}'`)
      } else {
        debugLog(`Using response '${responseName}'`)
      }
      const chosenResponse = endpoint.responses[responseName]

      /* RESPONSE PARAMETERS PROCCESSING */

      const { responseParameters } = chosenResponse

      if (responseParameters) {
        const responseParametersKeys = keys(responseParameters)

        if (this.log) {
          this.log.debug('_____ RESPONSE PARAMETERS PROCCESSING _____')
          this.log.debug(
            `Found ${responseParametersKeys.length} responseParameters for '${responseName}' response`,
          )
        } else {
          debugLog('_____ RESPONSE PARAMETERS PROCCESSING _____')
          debugLog()
        }

        // responseParameters use the following shape: "key": "value"
        entries(responseParameters).forEach(([key, value]) => {
          const keyArray = key.split('.') // eg: "method.response.header.location"
          const valueArray = value.split('.') // eg: "integration.response.body.redirect.url"

          if (this.log) {
            this.log.debug(`Processing responseParameter "${key}": "${value}"`)
          } else {
            debugLog(`Processing responseParameter "${key}": "${value}"`)
          }

          // For now the plugin only supports modifying headers
          if (key.startsWith('method.response.header') && keyArray[3]) {
            const headerName = keyArray.slice(3).join('.')
            let headerValue

            if (this.log) {
              this.log.debug('Found header in left-hand:', headerName)
            } else {
              debugLog('Found header in left-hand:', headerName)
            }

            if (value.startsWith('integration.response')) {
              if (valueArray[2] === 'body') {
                if (this.log) {
                  this.log.debug('Found body in right-hand')
                } else {
                  debugLog('Found body in right-hand')
                }
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
                this.#printBlankLine()

                if (this.log) {
                  this.log.warning()
                  this.log.warning(
                    `Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" (for "${key}"") instead. Skipping.`,
                  )
                } else {
                  serverlessLog(
                    `Warning: while processing responseParameter "${key}": "${value}"`,
                  )
                  serverlessLog(
                    `Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" instead. Skipping.`,
                  )
                }
                this.#logPluginIssue()
                this.#printBlankLine()
              }
            } else {
              headerValue = value.match(/^'.*'$/) ? value.slice(1, -1) : value // See #34
            }
            // Applies the header;
            if (headerValue === '') {
              if (this.log) {
                this.log.warning(
                  `Empty value for responseParameter "${key}": "${value}", it won't be set`,
                )
              } else {
                serverlessLog(
                  `Warning: empty value for responseParameter "${key}": "${value}", it won't be set`,
                )
              }
            } else {
              if (this.log) {
                this.log.debug(
                  `Will assign "${headerValue}" to header "${headerName}"`,
                )
              } else {
                debugLog(
                  `Will assign "${headerValue}" to header "${headerName}"`,
                )
              }
              response.header(headerName, headerValue)
            }
          } else {
            this.#printBlankLine()

            if (this.log) {
              this.log.warning()
              this.log.warning(
                `Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`,
              )
            } else {
              serverlessLog(
                `Warning: while processing responseParameter "${key}": "${value}"`,
              )
              serverlessLog(
                `Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`,
              )
            }
            this.#logPluginIssue()
            this.#printBlankLine()
          }
        })
      }

      let statusCode = 200

      if (integration === 'AWS') {
        const endpointResponseHeaders =
          (endpoint.response && endpoint.response.headers) || {}

        entries(endpointResponseHeaders)
          .filter(
            ([, value]) => typeof value === 'string' && /^'.*?'$/.test(value),
          )
          .forEach(([key, value]) => response.header(key, value.slice(1, -1)))

        /* LAMBDA INTEGRATION RESPONSE TEMPLATE PROCCESSING */

        // If there is a responseTemplate, we apply it to the result
        const { responseTemplates } = chosenResponse

        if (typeof responseTemplates === 'object') {
          const responseTemplatesKeys = keys(responseTemplates)

          if (responseTemplatesKeys.length) {
            // BAD IMPLEMENTATION: first key in responseTemplates
            const responseTemplate = responseTemplates[responseContentType]

            if (responseTemplate && responseTemplate !== '\n') {
              if (this.log) {
                this.log.debug('_____ RESPONSE TEMPLATE PROCCESSING _____')
                this.log.debug(
                  `Using responseTemplate '${responseContentType}'`,
                )
              } else {
                debugLog('_____ RESPONSE TEMPLATE PROCCESSING _____')
                debugLog(`Using responseTemplate '${responseContentType}'`)
              }

              try {
                const reponseContext = new VelocityContext(
                  request,
                  stage,
                  result,
                ).getContext()

                result = renderVelocityTemplateObject(
                  { root: responseTemplate },
                  reponseContext,
                  this.v3Utils,
                ).root
              } catch (error) {
                if (this.log) {
                  this.log.error(
                    `Error while parsing responseTemplate '${responseContentType}' for lambda ${functionKey}:\n${error.stack}`,
                  )
                } else {
                  serverlessLog(
                    `Error while parsing responseTemplate '${responseContentType}' for lambda ${functionKey}:`,
                  )
                  console.log(error.stack)
                }
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
          this.#printBlankLine()

          if (this.log) {
            this.log.warning()
            this.log.warning(
              `No statusCode found for response "${responseName}".`,
            )
          } else {
            serverlessLog(
              `Warning: No statusCode found for response "${responseName}".`,
            )
          }
        }

        response.header('Content-Type', responseContentType, {
          override: false, // Maybe a responseParameter set it already. See #34
        })

        response.statusCode = statusCode

        if (contentHandling === 'CONVERT_TO_BINARY') {
          response.encoding = 'binary'
          response.source = Buffer.from(result, 'base64')
          response.variety = 'buffer'
        } else if (typeof result === 'string') {
          response.source = stringify(result)
        } else if (result && result.body && typeof result.body !== 'string') {
          return this.#reply502(
            response,
            'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object',
            {},
          )
        } else {
          response.source = result
        }
      } else if (integration === 'AWS_PROXY') {
        /* LAMBDA PROXY INTEGRATION HAPIJS RESPONSE CONFIGURATION */

        if (
          endpoint.isHttpApi &&
          endpoint.payload === '2.0' &&
          (typeof result === 'string' || !result.statusCode)
        ) {
          const body = typeof result === 'string' ? result : stringify(result)
          result = {
            isBase64Encoded: false,
            statusCode: 200,
            body,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        }

        if (result && !result.errorType) {
          statusCode = result.statusCode || 200
        } else {
          statusCode = 502
        }

        response.statusCode = statusCode

        const headers = {}
        if (result && result.headers) {
          keys(result.headers).forEach((header) => {
            headers[header] = (headers[header] || []).concat(
              result.headers[header],
            )
          })
        }
        if (result && result.multiValueHeaders) {
          keys(result.multiValueHeaders).forEach((header) => {
            headers[header] = (headers[header] || []).concat(
              result.multiValueHeaders[header],
            )
          })
        }

        if (this.log) {
          this.log.debug('headers', headers)
        } else {
          debugLog('headers', headers)
        }

        const parseCookies = (headerValue) => {
          const cookieName = headerValue.slice(0, headerValue.indexOf('='))
          const cookieValue = headerValue.slice(headerValue.indexOf('=') + 1)
          h.state(cookieName, cookieValue, {
            encoding: 'none',
            strictHeader: false,
          })
        }

        keys(headers).forEach((header) => {
          if (header.toLowerCase() === 'set-cookie') {
            headers[header].forEach(parseCookies)
          } else {
            headers[header].forEach((headerValue) => {
              // it looks like Hapi doesn't support multiple headers with the same name,
              // appending values is the closest we can come to the AWS behavior.
              response.header(header, headerValue, { append: true })
            })
          }
        })

        if (
          endpoint.isHttpApi &&
          endpoint.payload === '2.0' &&
          result.cookies
        ) {
          result.cookies.forEach(parseCookies)
        }

        response.header('Content-Type', 'application/json', {
          duplicate: false,
          override: false,
        })

        if (typeof result === 'string') {
          response.source = stringify(result)
        } else if (result && typeof result.body !== 'undefined') {
          if (result.isBase64Encoded) {
            response.encoding = 'binary'
            response.source = Buffer.from(result.body, 'base64')
            response.variety = 'buffer'
          } else {
            if (result && result.body && typeof result.body !== 'string') {
              return this.#reply502(
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
      } catch {
        // nothing
      } finally {
        if (this.#options.printOutput) {
          if (this.log) {
            this.log.notice(
              err ? `Replying ${statusCode}` : `[${statusCode}] ${whatToLog}`,
            )
          } else {
            serverlessLog(
              err ? `Replying ${statusCode}` : `[${statusCode}] ${whatToLog}`,
            )
          }
        }
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

  #replyError(statusCode, response, message, error) {
    serverlessLog(message)

    if (this.log) {
      this.log.error(error)
    } else {
      console.error(error)
    }

    response.header('Content-Type', 'application/json')

    response.statusCode = statusCode
    response.source = {
      errorMessage: message,
      errorType: error.constructor.name,
      offlineInfo:
        'If you believe this is an issue with serverless-offline please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
      stackTrace: this.#getArrayStackTrace(error.stack),
    }

    return response
  }

  // Bad news
  #reply502(response, message, error) {
    // APIG replies 502 by default on failures;
    return this.#replyError(502, response, message, error)
  }

  #reply400(response, message, error) {
    return this.#replyError(400, response, message, error)
  }

  createResourceRoutes() {
    const resourceRoutesOptions = this.#options.resourceRoutes

    if (!resourceRoutesOptions) {
      return
    }

    const resourceRoutes = parseResources(this.#serverless.service.resources)

    if (!resourceRoutes || !keys(resourceRoutes).length) {
      return
    }

    this.#printBlankLine()

    if (this.log) {
      this.log.notice()
      this.log.notice('Routes defined in resources:')
    } else {
      serverlessLog('Routes defined in resources:')
    }

    entries(resourceRoutes).forEach(([methodId, resourceRoutesObj]) => {
      const { isProxy, method, pathResource, proxyUri } = resourceRoutesObj

      if (!isProxy) {
        if (this.log) {
          this.log.warning(
            `Only HTTP_PROXY is supported. Path '${pathResource}' is ignored.`,
          )
        } else {
          serverlessLog(
            `WARNING: Only HTTP_PROXY is supported. Path '${pathResource}' is ignored.`,
          )
        }
        return
      }
      if (!pathResource) {
        if (this.log) {
          this.log.warning(`Could not resolve path for '${methodId}'.`)
        } else {
          serverlessLog(`WARNING: Could not resolve path for '${methodId}'.`)
        }
        return
      }

      const hapiPath = generateHapiPath(
        pathResource,
        this.#options,
        this.#serverless,
      )
      const proxyUriOverwrite = resourceRoutesOptions[methodId] || {}
      const proxyUriInUse = proxyUriOverwrite.Uri || proxyUri

      if (!proxyUriInUse) {
        if (this.log) {
          this.log.warning(`Could not load Proxy Uri for '${methodId}'`)
        } else {
          serverlessLog(`WARNING: Could not load Proxy Uri for '${methodId}'`)
        }
        return
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
        cors: this.#options.corsConfig,
        state,
      }

      // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
      // for more details, check https://github.com/dherault/serverless-offline/issues/204
      if (hapiMethod === 'HEAD') {
        if (this.log) {
          this.log.notice(
            'HEAD method event detected. Skipping HAPI server route mapping',
          )
        } else {
          serverlessLog(
            'HEAD method event detected. Skipping HAPI server route mapping ...',
          )
        }
        return
      }

      if (hapiMethod !== 'GET' && hapiMethod !== 'HEAD') {
        hapiOptions.payload = { parse: false }
      }

      if (this.log) {
        this.log.notice(`${method} ${hapiPath} -> ${proxyUriInUse}`)
      } else {
        serverlessLog(`${method} ${hapiPath} -> ${proxyUriInUse}`)
      }

      // hapiOptions.tags = ['api']
      const { log } = this
      const route = {
        handler(request, h) {
          const { params } = request
          let resultUri = proxyUriInUse

          entries(params).forEach(([key, value]) => {
            resultUri = resultUri.replace(`{${key}}`, value)
          })

          if (request.url.search !== null) {
            resultUri += request.url.search // search is empty string by default
          }

          if (log) {
            log.notice(
              `PROXY ${request.method} ${request.url.pathname} -> ${resultUri}`,
            )
          } else {
            serverlessLog(
              `PROXY ${request.method} ${request.url.pathname} -> ${resultUri}`,
            )
          }

          return h.proxy({
            passThrough: true,
            uri: resultUri,
          })
        },
        method: hapiMethod,
        options: hapiOptions,
        path: hapiPath,
      }

      this.#server.route(route)
    })
  }

  create404Route() {
    // If a {proxy+} or $default route exists, don't conflict with it
    if (this.#server.match('*', '/{p*}')) {
      return
    }

    const existingRoutes = this.#server
      .table()
      // Exclude this (404) route
      .filter((route) => route.path !== '/{p*}')
      // Sort by path
      .sort((a, b) => (a.path <= b.path ? -1 : 1))
      // Human-friendly result
      .map((route) => `${route.method} - ${route.path}`)

    const route = {
      handler(request, h) {
        const response = h.response({
          currentRoute: `${request.method} - ${request.path}`,
          error: 'Serverless-offline: route not found.',
          existingRoutes,
          statusCode: 404,
        })
        response.statusCode = 404

        return response
      },
      method: '*',
      options: {
        cors: this.#options.corsConfig,
      },
      path: '/{p*}',
    }

    this.#server.route(route)
  }

  #getArrayStackTrace(stack) {
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

  #injectLastRequest() {
    if (this.#lastRequestOptions) {
      if (this.log) {
        this.log.notice('Replaying HTTP last request')
        this.#server.inject(this.#lastRequestOptions)
      } else {
        serverlessLog('Replaying HTTP last request')
      }
    } else if (this.log) {
      this.log.notice('No last HTTP request to replay!')
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
