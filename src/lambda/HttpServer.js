import { log } from "../utils/log.js"
import { invocationsRoute, invokeAsyncRoute } from "./routes/index.js"
import AbstractHttpServer from "./AbstractHttpServer.js"

export default class HttpServer extends AbstractHttpServer {
  #lambda = null

  #options = null

  constructor(lambda, options) {
    super(lambda, options, options.lambdaPort)

    this.#lambda = lambda
    this.#options = options

    // disable the default stripTrailingSlash
    this.httpServer.settings.router.stripTrailingSlash = false
  }

  async start() {
    // add routes
    const invRoute = invocationsRoute(this.#lambda, this.#options)
    const invAsyncRoute = invokeAsyncRoute(this.#lambda, this.#options)

    this.httpServer.route([invAsyncRoute, invRoute])

    await super.start()

    // Print all the invocation routes to debug
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
      ].join("\n"),
    )
    log.debug(
      [
        `Lambda Invocation Routes (for AWS SDK or AWS CLI):`,
        ...this.#lambda
          .listFunctionNames()
          .map(
            (functionName) =>
              `           * ${
                invRoute.method
              } ${this.basePath}${invRoute.path.replace(
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
              `           * ${
                invAsyncRoute.method
              } ${this.basePath}${invAsyncRoute.path.replace(
                "{functionName}",
                functionName,
              )}`,
          ),
      ].join("\n"),
    )
  }
}
