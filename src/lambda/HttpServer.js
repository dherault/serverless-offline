import { exit } from "node:process"
import { Server } from "@hapi/hapi"
import { log } from "../utils/log.js"
import { invocationsRoute, invokeAsyncRoute } from "./routes/index.js"

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
    const invRoute = invocationsRoute(this.#lambda, this.#options)
    const invAsyncRoute = invokeAsyncRoute(this.#lambda, this.#options)

    this.#server.route([invAsyncRoute, invRoute])

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
      `Offline [http for lambda] listening on ${
        httpsProtocol ? "https" : "http"
      }://${host}:${lambdaPort}`,
    )

    // Print all the invocation routes to debug
    const basePath = `${
      httpsProtocol ? "https" : "http"
    }://${host}:${lambdaPort}`
    const funcNamePairs = this.#lambda.listFunctionNamePairs()

    log.notice(
      [
        `Function names exposed for local invocation by aws-sdk:`,
        ...this.#lambda
          .listFunctionNames()
          .map(
            (functionName) =>
              `   * ${funcNamePairs[functionName]}: ${functionName}`,
          ),
      ].join("\n"),
    )
    log.debug(
      [
        `Lambda Invocation Routes (for AWS SDK or AWS CLI):`,
        ...this.#lambda
          .listFunctionNames()
          .map(
            (functionName) =>
              `   * ${invRoute.method} ${basePath}${invRoute.path.replace(
                "{functionName}",
                functionName,
              )}`,
          ),
      ].join("\n"),
    )

    log.debug(
      [
        `Lambda Async Invocation Routes (for AWS SDK or AWS CLI):`,
        ...this.#lambda
          .listFunctionNames()
          .map(
            (functionName) =>
              `   * ${
                invAsyncRoute.method
              } ${basePath}${invAsyncRoute.path.replace(
                "{functionName}",
                functionName,
              )}`,
          ),
      ].join("\n"),
    )
  }

  // stops the server
  stop(timeout) {
    return this.#server.stop({
      timeout,
    })
  }
}
