import { join } from 'path'
import ServerlessBuilder from './ServerlessBuilder'
import ServerlessOffline from '../../../src/ServerlessOffline'
import { splitHandlerPathAndName } from '../../../src/utils/index'

export default class OfflineBuilder {
  handlers: any
  options: any
  serverlessBuilder: any

  constructor(serverlessBuilder?: any, options?: any) {
    this.handlers = {}
    this.options = options || {}
    this.serverlessBuilder = serverlessBuilder || new ServerlessBuilder()
  }

  addFunctionConfig(functionKey: any, functionConfig: any, handler?: any) {
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

    serverlessOffline._mergeOptions()

    const { httpEvents, lambdas } = serverlessOffline._getEvents()
    await serverlessOffline._createLambda(lambdas, true)
    await serverlessOffline._createHttp(httpEvents, true)

    return serverlessOffline.getApiGatewayServer()
  }
}
