import { Buffer } from 'buffer'
import { Server } from '@hapi/hapi'
import serverlessLog, { logRoutes } from '../../serverlessLog.js'
import { generateHapiPath, detectEncoding } from '../../utils/index.js'
import LambdaALBRequestEvent from './lambda-events/LambdaALBRequestEvent.js'
import debugLog from '../../debugLog.js'

export default class HttpServer {
  #lambda = null
  #server = null
  #lastRequestOptions = null
  #options = null
  #serverless = null
  #terminalInfo = []

  constructor(serverless, options, lambda) {
    this.#lambda = lambda
    this.#options = options
    this.#serverless = serverless

    const { host, httpPort } = options

    // Hapijs server creation
    this.#server = new Server({
      host,
      port: httpPort,
    })
  }

  async start() {
    const { host, httpPort } = this.#options

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
    const server = `http://${host}:${httpPort}`

    serverlessLog(`[HTTP] server ready: ${server} 🚀`)
    serverlessLog('')
    serverlessLog('Enter "rp" to replay the last request')
  }

  // stops the server
  stop(timeout) {
    return this.#server.stop({
      timeout,
    })
  }

  createRoutes(functionKey, albEvent) {
    const method = albEvent.conditions.method[0].toUpperCase()
    const { path } = albEvent.conditions
    const hapiPath = generateHapiPath(path[0], this.#options, this.#serverless)

    const stage = this.#options.stage || this.#serverless.service.provider.stage
    const { host, httpPort } = this.#options
    const server = `http://${host}:${httpPort}`

    this.#terminalInfo.push({
      method,
      path: hapiPath,
      server,
      stage: this.#options.noPrependStageInUrl ? null : stage,
      invokePath: `/2015-03-31/functions/${functionKey}/invocations`,
    })

    const hapiMethod = method === 'ANY' ? '*' : method
    const hapiOptions = {}

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

    const hapiHandler = async (request, h) => {
      // Here we go
      // Store current request as the last one
      this.#lastRequestOptions = {
        headers: request.headers,
        method: request.method,
        payload: request.payload,
        url: request.url.href,
      }

      // Payload processing
      const encoding = detectEncoding(request)

      request.payload = request.payload && request.payload.toString(encoding)

      // Incomming request message
      this._printBlankLine()
      serverlessLog(`${method} ${request.path} (λ: ${functionKey})`)

      const event = new LambdaALBRequestEvent(request).create()

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

      const response = h.response()

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
          return this._reply502(
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
      }

      let statusCode = 200
      if (err) {
        statusCode = errorStatusCode
      }
      response.statusCode = statusCode

      if (typeof result === 'string') {
        response.source = JSON.stringify(result)
      } else if (result && typeof result.body !== 'undefined') {
        if (result.isBase64Encoded) {
          response.encoding = 'binary'
          response.source = Buffer.from(result.body, 'base64')
          response.variety = 'buffer'
        } else {
          if (result && result.body && typeof result.body !== 'string') {
            return this._reply502(
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

    this.#server.route({
      handler: hapiHandler,
      method: hapiMethod,
      options: hapiOptions,
      path: hapiPath,
    })
  }

  writeRoutesTerminal() {
    logRoutes(this.#terminalInfo)
  }

  _printBlankLine() {
    if (process.env.NODE_ENV !== 'test') {
      console.log()
    }
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
}
