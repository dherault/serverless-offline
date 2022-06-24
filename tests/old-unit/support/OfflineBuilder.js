import { join } from 'node:path'
import ServerlessBuilder from './ServerlessBuilder.js'
import ServerlessOffline from '../../../src/ServerlessOffline.js'
import { splitHandlerPathAndName } from '../../../src/utils/index.js'

export default class OfflineBuilder {
  #handlers = {}

  #options = null

  #serverlessBuilder = null

  #serverlessOffline = null

  constructor(serverlessBuilder, options) {
    this.#options = options ?? {}
    this.#serverlessBuilder = serverlessBuilder ?? new ServerlessBuilder()
  }

  addApiKeys(keys) {
    this.#serverlessBuilder.addApiKeys(keys)

    return this
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

    const _handlerPath = join('.', handlerPath)

    this.#handlers[_handlerPath] = {
      [handlerName]: handler,
    }

    return this
  }

  async toObject() {
    this.#serverlessOffline = new ServerlessOffline(
      this.#serverlessBuilder.toObject(),
      this.#options,
    )

    this.#serverlessOffline._mergeOptions()

    const { httpEvents, lambdas } = this.#serverlessOffline._getEvents()
    await this.#serverlessOffline._createLambda(lambdas, true)
    await this.#serverlessOffline._createHttp(httpEvents, true)

    return this.#serverlessOffline.getApiGatewayServer()
  }

  end(skipExit) {
    return this.#serverlessOffline.end(skipExit)
  }
}
