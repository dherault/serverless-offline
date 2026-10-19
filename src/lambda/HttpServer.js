import { exit } from "node:process"
import { Server } from "@hapi/hapi"
import {
  createCorsPreResponseHandler,
  getHttpApiHapiCorsConfig,
} from "../utils/index.js"
import { log } from "../utils/log.js"
import { invocationsRoute, invokeAsyncRoute } from "./routes/index.js"

export default class HttpServer {
  #lambda = null

  #options = null

  #server = null

  #serverless = null

  constructor(serverless, options, lambda) {
    this.#lambda = lambda
    this.#options = options
    this.#serverless = serverless

    const { host, lambdaPort } = options

    const serverOptions = {
      host,
      port: lambdaPort,
    }

    this.#server = new Server(serverOptions)

    // Enable CORS preflight response
    this.#server.ext(
      "onPreResponse",
      createCorsPreResponseHandler(this.#serverless),
    )
  }

  async start() {
    const { httpApi } = this.#serverless.service.provider

    // like the httpApi routes, follow the httpApi cors setting when it is set
    const routeOptions = httpApi?.cors
      ? {
          ...this.#options,
          corsConfig: getHttpApiHapiCorsConfig(httpApi.cors),
        }
      : this.#options

    // add routes
    const invRoute = invocationsRoute(this.#lambda, routeOptions)
    const invAsyncRoute = invokeAsyncRoute(this.#lambda, routeOptions)

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
