import { Buffer } from 'node:buffer'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import process, { exit } from 'node:process'
import h2o2 from '@hapi/h2o2'
import { Server } from '@hapi/hapi'
import { log } from '@serverless/utils/log.js'
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
import LambdaProxyIntegrationEventV2 from './lambda-events/LambdaProxyIntegrationEventV2.js'
import parseResources from './parseResources.js'
import payloadSchemaValidator from './payloadSchemaValidator.js'
import logRoutes from '../../utils/logRoutes.js'
import {
  detectEncoding,
  generateHapiPath,
  getHttpApiCorsConfig,
  jsonPath,
  splitHandlerPathAndName,
} from '../../utils/index.js'
const { parse, stringify } = JSON
const { assign, entries, keys } = Object
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
      noStripTrailingSlashInUrl,
    } = this.#options
    const serverOptions = {
      host,
      port: httpPort,
      router: {
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
    if (typeof httpsProtocol === 'string' && httpsProtocol.length > 0) {
      serverOptions.tls = {
        cert: readFileSync(resolve(httpsProtocol, 'cert.pem'), 'ascii'),
        key: readFileSync(resolve(httpsProtocol, 'key.pem'), 'ascii'),
      }
    }
    this.#server = new Server(serverOptions)
    this.#server.ext('onPreResponse', (request, h) => {
      if (request.headers.origin) {
        const response = request.response.isBoom
          ? request.response.output
          : request.response
        const explicitlySetHeaders = {
          ...response.headers,
        }
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
          entries(explicitlySetHeaders).forEach(([key, value]) => {
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
      log.error(
        `Unexpected error while starting serverless-offline server on port ${httpPort}:`,
        err,
      )
      exit(1)
    }
    const server = `${httpsProtocol ? 'https' : 'http'}://${host}:${httpPort}`
    log.notice(`Server ready: ${server} 🚀`)
    log.notice()
    log.notice('Enter "rp" to replay the last request')
    process.openStdin().addListener('data', (data) => {
      if (data.toString().trim() === 'rp') {
        this.#injectLastRequest()
      }
    })
  }
  stop(timeout) {
    return this.#server.stop({
      timeout,
    })
  }
  async registerPlugins() {
    try {
      await this.#server.register([h2o2])
    } catch (err) {
      log.error(err)
    }
  }
  #logPluginIssue() {
    log.notice(
      'If you think this is an issue with the plugin please submit it, thanks!\nhttps://github.com/dherault/serverless-offline/issues',
    )
    log.notice()
  }
  #extractJWTAuthSettings(endpoint) {
    const result = authJWTSettingsExtractor(
      endpoint,
      this.#serverless.service.provider,
      this.#options.ignoreJWTSignature,
    )
    return result.unsupportedAuth ? null : result
  }
  #configureJWTAuthorization(endpoint, functionKey, method, path) {
    if (!endpoint.authorizer) {
      return null
    }
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
    log.notice(`Configuring JWT Authorization: ${method} ${path}`)
    const authKey = `${functionKey}-${jwtSettings.authorizerName}-${method}-${path}`
    const authSchemeName = `scheme-${authKey}`
    const authStrategyName = `strategy-${authKey}`
    log.debug(`Creating Authorization scheme for ${authKey}`)
    const scheme = createJWTAuthScheme(jwtSettings, this)
    this.#server.auth.scheme(authSchemeName, scheme)
    this.#server.auth.strategy(authStrategyName, authSchemeName)
    return authStrategyName
  }
  #extractAuthFunctionName(endpoint) {
    const result = authFunctionNameExtractor(endpoint)
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
    log.notice(`Configuring Authorization: ${path} ${authFunctionName}`)
    const authFunction = this.#serverless.service.getFunction(authFunctionName)
    if (!authFunction) {
      log.error(`Authorization function ${authFunctionName} does not exist`)
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
    const authKey = `${functionKey}-${authFunctionName}-${method}-${path}`
    const authSchemeName = `scheme-${authKey}`
    const authStrategyName = `strategy-${authKey}`
    log.debug(`Creating Authorization scheme for ${authKey}`)
    const scheme = createAuthScheme(
      authorizerOptions,
      this.#serverless.service.provider,
      this.#lambda,
    )
    this.#server.auth.scheme(authSchemeName, scheme)
    this.#server.auth.strategy(authStrategyName, authSchemeName)
    return authStrategyName
  }
  #setAuthorizationStrategy(endpoint, functionKey, method, path) {
    const customizations = this.#serverless.service.custom
    if (
      customizations &&
      customizations.offline?.customAuthenticationProvider
    ) {
      const root = resolve(this.#serverless.serviceDir, 'require-resolver')
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
            noPrependStageInUrl: true,
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
    ).generate()
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
      invokePath: `/2015-03-31/functions/${functionKey}/invocations`,
      method,
      path: hapiPath,
      server,
      stage:
        endpoint.isHttpApi || this.#options.noPrependStageInUrl ? null : stage,
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
        credentials: httpApiCors.allowCredentials,
        exposedHeaders: httpApiCors.exposedResponseHeaders || [],
        headers: httpApiCors.allowedHeaders || [],
        maxAge: httpApiCors.maxAge,
        origin: httpApiCors.allowedOrigins || [],
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
      timeout: {
        socket: false,
      },
    }
    if (hapiMethod === 'HEAD') {
      log.notice(
        'HEAD method event detected. Skipping HAPI server route mapping',
      )
      return
    }
    if (hapiMethod !== 'HEAD' && hapiMethod !== 'GET') {
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
      const encoding = detectEncoding(request)
      request.payload = request.payload && request.payload.toString(encoding)
      request.rawPayload = request.payload
      log.notice()
      log.notice()
      log.notice(`${method} ${request.path} (λ: ${functionKey})`)
      if (
        (protectedRoutes.includes(`${hapiMethod}#${hapiPath}`) ||
          protectedRoutes.includes(`ANY#${hapiPath}`)) &&
        !this.#options.noAuth
      ) {
        const errorResponse = () =>
          h
            .response({
              message: 'Forbidden',
            })
            .code(403)
            .type('application/json')
            .header('x-amzn-ErrorType', 'ForbiddenException')
        const requestToken = request.headers['x-api-key']
        if (requestToken) {
          if (requestToken !== this.#options.apiKey) {
            log.debug(
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
            log.debug(
              `Method ${method} of function ${functionKey} token ${usageIdentifierKey} not valid`,
            )
            return errorResponse()
          }
        } else {
          log.debug(`Missing x-api-key on private function ${functionKey}`)
          return errorResponse()
        }
      }
      const response = h.response()
      const contentType = request.mime || 'application/json'
      const { integration, requestTemplates } = endpoint
      const requestTemplate =
        typeof requestTemplates !== 'undefined' && integration === 'AWS'
          ? requestTemplates[contentType]
          : ''
      const schemas =
        typeof endpoint?.request?.schemas !== 'undefined'
          ? endpoint.request.schemas[contentType]
          : ''
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
          log.debug('error in converting request.payload to JSON:', err)
        }
      }
      log.debug('contentType:', contentType)
      log.debug('requestTemplate:', requestTemplate)
      log.debug('payload:', request.payload)
      if (schemas) {
        log.debug('schemas:', schemas)
        try {
          payloadSchemaValidator(schemas, request.payload)
        } catch (err) {
          return this.#reply400(response, err.message, err)
        }
      }
      let event = {}
      if (integration === 'AWS') {
        if (requestTemplate) {
          try {
            log.debug('_____ REQUEST TEMPLATE PROCESSING _____')
            event = new LambdaIntegrationEvent(
              request,
              stage,
              requestTemplate,
              requestPath,
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
              )
            : new LambdaProxyIntegrationEvent(
                request,
                stage,
                requestPath,
                stageVariables,
                endpoint.isHttpApi ? endpoint.routeKey : null,
                additionalRequestContext,
              )
        event = lambdaProxyIntegrationEvent.create()
      }
      log.debug('event:', event)
      const lambdaFunction = this.#lambda.get(functionKey)
      lambdaFunction.setEvent(event)
      let result
      let err
      try {
        result = await lambdaFunction.runHandler()
      } catch (_err) {
        err = _err
      }
      log.debug('_____ HANDLER RESOLVED _____')
      let responseName = 'default'
      const { contentHandling, responseContentType } = endpoint
      let errorStatusCode = '502'
      if (err) {
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
        result = {
          errorMessage,
          errorType: err.constructor.name,
          stackTrace: this.#getArrayStackTrace(err.stack),
        }
        log.error(errorMessage)
        if (!this.#options.hideStackTraces) {
          log.error(err.stack)
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
      log.debug(`Using response '${responseName}'`)
      const chosenResponse = endpoint.responses[responseName]
      const { responseParameters } = chosenResponse
      if (responseParameters) {
        log.debug('_____ RESPONSE PARAMETERS PROCCESSING _____')
        log.debug(
          `Found ${
            keys(responseParameters).length
          } responseParameters for '${responseName}' response`,
        )
        entries(responseParameters).forEach(([key, value]) => {
          const keyArray = key.split('.')
          const valueArray = value.split('.')
          log.debug(`Processing responseParameter "${key}": "${value}"`)
          if (key.startsWith('method.response.header') && keyArray[3]) {
            const headerName = keyArray.slice(3).join('.')
            let headerValue
            log.debug('Found header in left-hand:', headerName)
            if (value.startsWith('integration.response')) {
              if (valueArray[2] === 'body') {
                log.debug('Found body in right-hand')
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
                log.notice()
                log.warning()
                log.warning(
                  `Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" (for "${key}"") instead. Skipping.`,
                )
                this.#logPluginIssue()
                log.notice()
              }
            } else {
              headerValue = value.match(/^'.*'$/) ? value.slice(1, -1) : value
            }
            if (headerValue === '') {
              log.warning(
                `Empty value for responseParameter "${key}": "${value}", it won't be set`,
              )
            } else {
              log.debug(
                `Will assign "${headerValue}" to header "${headerName}"`,
              )
              response.header(headerName, headerValue)
            }
          } else {
            log.notice()
            log.warning()
            log.warning(
              `Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`,
            )
            this.#logPluginIssue()
            log.notice()
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
        const { responseTemplates } = chosenResponse
        if (typeof responseTemplates === 'object') {
          if (keys(responseTemplates).length) {
            const responseTemplate = responseTemplates[responseContentType]
            if (responseTemplate && responseTemplate !== '\n') {
              log.debug('_____ RESPONSE TEMPLATE PROCCESSING _____')
              log.debug(`Using responseTemplate '${responseContentType}'`)
              try {
                const reponseContext = new VelocityContext(
                  request,
                  stage,
                  result,
                ).getContext()
                result = renderVelocityTemplateObject(
                  {
                    root: responseTemplate,
                  },
                  reponseContext,
                ).root
              } catch (error) {
                log.error(
                  `Error while parsing responseTemplate '${responseContentType}' for lambda ${functionKey}:\n${error.stack}`,
                )
              }
            }
          }
        }
        statusCode = chosenResponse.statusCode || 200
        if (err) {
          statusCode = errorStatusCode
        }
        if (!chosenResponse.statusCode) {
          log.notice()
          log.warning()
          log.warning(`No statusCode found for response "${responseName}".`)
        }
        response.header('Content-Type', responseContentType, {
          override: false,
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
        if (
          endpoint.isHttpApi &&
          endpoint.payload === '2.0' &&
          (typeof result === 'string' || !result.statusCode)
        ) {
          const body = typeof result === 'string' ? result : stringify(result)
          result = {
            body,
            headers: {
              'Content-Type': 'application/json',
            },
            isBase64Encoded: false,
            statusCode: 200,
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
          entries(result.headers).forEach(([headerKey, headerValue]) => {
            headers[headerKey] = (headers[headerKey] || []).concat(headerValue)
          })
        }
        if (result && result.multiValueHeaders) {
          entries(result.multiValueHeaders).forEach(
            ([headerKey, headerValue]) => {
              headers[headerKey] = (headers[headerKey] || []).concat(
                headerValue,
              )
            },
          )
        }
        log.debug('headers', headers)
        const parseCookies = (headerValue) => {
          const cookieName = headerValue.slice(0, headerValue.indexOf('='))
          const cookieValue = headerValue.slice(headerValue.indexOf('=') + 1)
          h.state(cookieName, cookieValue, {
            encoding: 'none',
            strictHeader: false,
          })
        }
        entries(headers).forEach(([headerKey, headerValue]) => {
          if (headerKey.toLowerCase() === 'set-cookie') {
            headerValue.forEach(parseCookies)
          } else {
            headerValue.forEach((value) => {
              response.header(headerKey, value, {
                append: true,
              })
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
      let whatToLog = result
      try {
        whatToLog = stringify(result)
      } catch {
      } finally {
        if (this.#options.printOutput) {
          log.notice(
            err ? `Replying ${statusCode}` : `[${statusCode}] ${whatToLog}`,
          )
        }
      }
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
    log.notice(message)
    log.error(error)
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
  #reply502(response, message, error) {
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
    log.notice()
    log.notice()
    log.notice('Routes defined in resources:')
    entries(resourceRoutes).forEach(([methodId, resourceRoutesObj]) => {
      const { isProxy, method, pathResource, proxyUri } = resourceRoutesObj
      if (!isProxy) {
        log.warning(
          `Only HTTP_PROXY is supported. Path '${pathResource}' is ignored.`,
        )
        return
      }
      if (!pathResource) {
        log.warning(`Could not resolve path for '${methodId}'.`)
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
        log.warning(`Could not load Proxy Uri for '${methodId}'`)
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
      if (hapiMethod === 'HEAD') {
        log.notice(
          'HEAD method event detected. Skipping HAPI server route mapping',
        )
        return
      }
      if (hapiMethod !== 'GET' && hapiMethod !== 'HEAD') {
        hapiOptions.payload = {
          parse: false,
        }
      }
      log.notice(`${method} ${hapiPath} -> ${proxyUriInUse}`)
      const route = {
        handler(request, h) {
          const { params } = request
          let resultUri = proxyUriInUse
          entries(params).forEach(([key, value]) => {
            resultUri = resultUri.replace(`{${key}}`, value)
          })
          if (request.url.search !== null) {
            resultUri += request.url.search
          }
          log.notice(
            `PROXY ${request.method} ${request.url.pathname} -> ${resultUri}`,
          )
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
    if (this.#server.match('*', '/{p*}')) {
      return
    }
    const existingRoutes = this.#server
      .table()
      .filter((route) => route.path !== '/{p*}')
      .sort((a, b) => (a.path <= b.path ? -1 : 1))
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
      log.notice('Replaying HTTP last request')
      this.#server.inject(this.#lastRequestOptions)
    } else {
      log.notice('No last HTTP request to replay!')
    }
  }
  writeRoutesTerminal() {
    logRoutes(this.#terminalInfo)
  }
  getServer() {
    return this.#server
  }
}
