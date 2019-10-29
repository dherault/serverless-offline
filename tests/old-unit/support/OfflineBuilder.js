import { join } from 'path'
import ServerlessBuilder from './ServerlessBuilder.js'
import ServerlessOffline from '../../../src/ServerlessOffline.js'
import { splitHandlerPathAndName } from '../../../src/utils/index.js'

export default class OfflineBuilder {
  constructor(serverlessBuilder, options) {
    this.handlers = {}
    this.options = options || {}
    this.serverlessBuilder = serverlessBuilder || new ServerlessBuilder()
  }

  addFunctionConfig(functionKey, functionConfig, handler) {
    this.serverlessBuilder.addFunction(functionKey, functionConfig)

    const [handlerPath, handlerName] = splitHandlerPathAndName(
      functionConfig.handler,
    )

    const _handlerPath = join('.', handlerPath)

    this.handlers[_handlerPath] = {
      [handlerName]: handler,
    }

    return this
  }

  addCustom(prop, value) {
    this.serverlessBuilder.addCustom(prop, value)

    return this
  }

  addApiKeys(keys) {
    this.serverlessBuilder.addApiKeys(keys)

    return this
  }

  async toObject() {
    const serverlessOffline = new ServerlessOffline(
      this.serverlessBuilder.toObject(),
      this.options,
    )

    serverlessOffline.mergeOptions()

    const { httpEvents, lambdas } = serverlessOffline._getEvents()
    await serverlessOffline._createLambda(lambdas)
    await serverlessOffline._createApiGateway(httpEvents, true)

    return serverlessOffline.getApiGatewayServer()
  }
}
