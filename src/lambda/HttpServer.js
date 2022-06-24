import { exit } from 'node:process'
import { Server } from '@hapi/hapi'
import { log } from '@serverless/utils/log.js'
import { invocationsRoute, invokeAsyncRoute } from './routes/index.js'

export default class HttpServer {
  #lambda = null

  #options = null

  #server = null

  constructor(options, lambda) {
    this.#lambda = lambda
    this.#options = options

    const { host, lambdaPort } = options

    const serverOptions = {
      host,
      port: lambdaPort,
    }

    this.#server = new Server(serverOptions)
  }

  async start() {
    // add routes
    const _invocationsRoute = invocationsRoute(this.#lambda, this.#options)
    const _invokeAsyncRoute = invokeAsyncRoute(this.#lambda, this.#options)

    this.#server.route([_invokeAsyncRoute, _invocationsRoute])

    const { host, httpsProtocol, lambdaPort } = this.#options

    try {
      await this.#server.start()
    } catch (err) {
      log.error(
        `Unexpected error while starting serverless-offline lambda server on port ${lambdaPort}:`,
        err,
      )
      exit(1)
    }

    log.notice(
      `Offline [http for lambda] listening on http${
        httpsProtocol ? 's' : ''
      }://${host}:${lambdaPort}`,
    )

    // Print all the invocation routes to debug
    const basePath = `http${httpsProtocol ? 's' : ''}://${host}:${lambdaPort}`
    const funcNamePairs = this.#lambda.listFunctionNamePairs()

    log.notice(
      [
        `Function names exposed for local invocation by aws-sdk:`,
        ...this.#lambda
          .listFunctionNames()
          .map(
            (functionName) =>
              `           * ${funcNamePairs[functionName]}: ${functionName}`,
          ),
      ].join('\n'),
    )
    log.debug(
      [
        `Lambda Invocation Routes (for AWS SDK or AWS CLI):`,
        ...this.#lambda
          .listFunctionNames()
          .map(
            (functionName) =>
              `           * ${
                _invocationsRoute.method
              } ${basePath}${_invocationsRoute.path.replace(
                '{functionName}',
                functionName,
              )}`,
          ),
      ].join('\n'),
    )

    log.debug(
      [
        `Lambda Async Invocation Routes (for AWS SDK or AWS CLI):`,
        ...this.#lambda
          .listFunctionNames()
          .map(
            (functionName) =>
              `           * ${
                _invokeAsyncRoute.method
              } ${basePath}${_invokeAsyncRoute.path.replace(
                '{functionName}',
                functionName,
              )}`,
          ),
      ].join('\n'),
    )
  }

  // stops the server
  stop(timeout) {
    return this.#server.stop({
      timeout,
    })
  }
}
