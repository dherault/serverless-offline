import { Buffer } from 'node:buffer'
import { exit } from 'node:process'
import { Server } from '@hapi/hapi'
import { log } from '@serverless/utils/log.js'
import {
  detectEncoding,
  generateAlbHapiPath,
  getHttpApiCorsConfig,
} from '../../utils/index.js'
import LambdaAlbRequestEvent from './lambda-events/LambdaAlbRequestEvent.js'
import logRoutes from '../../utils/logRoutes.js'

const { stringify } = JSON
const { entries } = Object

export default class HttpServer {
  #lambda = null

  #options = null

  #serverless = null

  #server = null

  #terminalInfo = []

  constructor(serverless, options, lambda) {
    this.#serverless = serverless
    this.#options = options
    this.#lambda = lambda
  }

  async createServer() {
    const { host, albPort } = this.#options

    const serverOptions = {
      host,
      port: albPort,
      router: {
        // allows for paths with trailing slashes to be the same as without
        // e.g. : /my-path is the same as /my-path/
        stripTrailingSlash: true,
      },
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

          // Override default headers with headers that have been explicitly set
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
    const { albPort, host, httpsProtocol } = this.#options

    try {
      await this.#server.start()
    } catch (err) {
      log.error(
        `Unexpected error while starting serverless-offline alb server on port ${albPort}:`,
        err,
      )
      exit(1)
    }

    // TODO move the following block
    const server = `${httpsProtocol ? 'https' : 'http'}://${host}:${albPort}`

    log.notice(`ALB Server ready: ${server} 🚀`)
  }

  stop(timeout) {
    return this.#server.stop({
      timeout,
    })
  }

  get server() {
    return this.#server.listener
  }

  #createHapiHandler(params) {
    const { functionKey, method, stage } = params

    return async (request, h) => {
      const requestPath = this.#options.noPrependStageInUrl
        ? request.path
        : request.path.substr(`/${stage}`.length)

      // Payload processing
      const encoding = detectEncoding(request)

      request.payload = request.payload && request.payload.toString(encoding)
      request.rawPayload = request.payload

      // Incoming request message
      log.notice()

      log.notice()
      log.notice(`${method} ${request.path} (λ: ${functionKey})`)

      const response = h.response()

      let event = {}
      try {
        event = new LambdaAlbRequestEvent(request, stage, requestPath).create()
      } catch (err) {
        return this.#reply502(response, ``, err)
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

      // Failure handling
      let errorStatusCode = '502'

      if (err) {
        const errorMessage = (err.message || err).toString()

        const found = errorMessage.match(/\[(\d{3})]/)

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

        log.error(errorMessage)
      }

      let statusCode = 200

      if (result && !result.errorType) {
        statusCode = result.statusCode || 200
      } else if (err) {
        statusCode = errorStatusCode || 502
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
            headers[headerKey] = (headers[headerKey] || []).concat(headerValue)
          },
        )
      }

      log.debug('headers:', headers)

      response.header('Content-Type', 'application/json', {
        duplicate: false,
        override: false,
      })

      if (typeof result === 'string') {
        response.source = stringify(result)
      } else if (result && result.body !== undefined) {
        if (result.isBase64Encoded) {
          response.encoding = 'binary'
          response.source = Buffer.from(result.body, 'base64')
          response.variety = 'buffer'
        } else {
          if (result && result.body && typeof result.body !== 'string') {
            // FIXME TODO we should probably just write to console instead of returning a payload
            return this.#reply502(
              response,
              'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object',
              {},
            )
          }
          response.source = result.body
        }
      }

      return response
    }
  }

  createRoutes(functionKey, albEvent) {
    const method = albEvent.conditions.method[0].toUpperCase()
    const path = albEvent.conditions.path[0]
    const hapiPath = generateAlbHapiPath(path, this.#options, this.#serverless)

    const stage = this.#options.stage || this.#serverless.service.provider.stage
    const { host, albPort, httpsProtocol } = this.#options
    const server = `${httpsProtocol ? 'https' : 'http'}://${host}:${albPort}`

    this.#terminalInfo.push({
      invokePath: `/2015-03-31/functions/${functionKey}/invocations`,
      method,
      path: hapiPath,
      server,
      stage: this.#options.noPrependStageInUrl ? null : stage,
    })

    const hapiMethod = method === 'ANY' ? '*' : method
    const hapiOptions = {
      response: {
        emptyStatusCode: 200,
      },
    }

    // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
    // for more details, check https://github.com/dherault/serverless-offline/issues/204
    if (hapiMethod === 'HEAD') {
      log.notice(
        'HEAD method event detected. Skipping HAPI server route mapping',
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

    const hapiHandler = this.#createHapiHandler({
      functionKey,
      method,
      stage,
    })

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
    // APIG replies 502 by default on failures;
    return this.#replyError(502, response, message, error)
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

  writeRoutesTerminal() {
    logRoutes(this.#terminalInfo)
  }
}
