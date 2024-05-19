import { join } from "node:path"
import ServerlessBuilder from "./ServerlessBuilder.js"
import ServerlessOffline from "../../../src/ServerlessOffline.js"
import { splitHandlerPathAndName } from "../../../src/utils/index.js"

export default class OfflineBuilder {
  #handlers = {}

  #options = null

  #serverlessBuilder = null

  #serverlessOffline = null

  constructor(serverlessBuilder, options) {
    this.#options = options ?? {}
    this.#serverlessBuilder = serverlessBuilder ?? new ServerlessBuilder()
  }

  addCustom(prop, value) {
    this.#serverlessBuilder.addCustom(prop, value)

    return this
  }

  addFunctionConfig(functionKey, functionConfig, handler) {
    this.#serverlessBuilder.addFunction(functionKey, functionConfig)

    const [handlerPath, handlerName] = splitHandlerPathAndName(
      functionConfig.handler,
    )

    const handlerpath = join(".", handlerPath)

    this.#handlers[handlerpath] = {
      [handlerName]: handler,
    }

    return this
  }

  async toObject() {
    this.#serverlessOffline = new ServerlessOffline(
      this.#serverlessBuilder.toObject(),
      this.#options,
      {},
    )

    this.#serverlessOffline.internals().mergeOptions()

    const { httpEvents, lambdas } = this.#serverlessOffline
      .internals()
      .getEvents()
    await this.#serverlessOffline.internals().createLambda(lambdas, true)
    await this.#serverlessOffline.internals().createHttp(httpEvents, true)

    return this.#serverlessOffline.internals().getApiGatewayServer()
  }

  end(skipExit) {
    return this.#serverlessOffline.end(skipExit)
  }
}
