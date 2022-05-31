import { Server } from '@hapi/hapi'
import { exit } from 'node:process'
import { invocationsRoute, invokeAsyncRoute } from './routes/index.js'
import debugLog from '../debugLog.js'
import serverlessLog from '../serverlessLog.js'

export default class HttpServer {
  #lambda = null
  #options = null
  #server = null

  constructor(options, lambda, v3Utils) {
    this.#lambda = lambda
    this.#options = options

    const { host, lambdaPort } = options

    const serverOptions = {
      host,
      port: lambdaPort,
    }

    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }

    this.#server = new Server(serverOptions)
  }

  async start() {
    // add routes
    const _invocationsRoute = invocationsRoute(
      this.#lambda,
      this.#options,
      this.v3Utils,
    )
    const _invokeAsyncRoute = invokeAsyncRoute(this.#lambda, this.#options)

    this.#server.route([_invokeAsyncRoute, _invocationsRoute])

    const { host, httpsProtocol, lambdaPort } = this.#options

    try {
      await this.#server.start()
    } catch (err) {
      if (this.log) {
        this.log.error(
          `Unexpected error while starting serverless-offline lambda server on port ${lambdaPort}:`,
          err,
        )
      } else {
        console.error(
          `Unexpected error while starting serverless-offline lambda server on port ${lambdaPort}:`,
          err,
        )
      }
      exit(1)
    }

    if (this.log) {
      this.log.notice(
        `Offline [http for lambda] listening on http${
          httpsProtocol ? 's' : ''
        }://${host}:${lambdaPort}`,
      )
    } else {
      serverlessLog(
        `Offline [http for lambda] listening on http${
          httpsProtocol ? 's' : ''
        }://${host}:${lambdaPort}`,
      )
    }
    // Print all the invocation routes to debug
    const basePath = `http${httpsProtocol ? 's' : ''}://${host}:${lambdaPort}`
    const funcNamePairs = this.#lambda.listFunctionNamePairs()

    if (this.log) {
      this.log.notice(
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
      this.log.debug(
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

      this.log.debug(
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
    } else {
      serverlessLog(
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
      debugLog(
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
      debugLog(
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
  }

  // stops the server
  stop(timeout) {
    return this.#server.stop({
      timeout,
    })
  }
}
