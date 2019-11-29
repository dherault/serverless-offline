import HttpServer from './HttpServer'
import LambdaFunctionPool from './LambdaFunctionPool'

export default class Lambda {
  private readonly _lambdas: Map<string, any>
  private readonly _lambdaFunctionNamesKeys: Map<string, string>
  private readonly _lambdaFunctionPool: LambdaFunctionPool
  private readonly _httpServer: HttpServer

  constructor(provider, options, config) {
    this._lambdas = new Map()
    this._lambdaFunctionNamesKeys = new Map()
    this._lambdaFunctionPool = new LambdaFunctionPool(provider, config, options)

    this._httpServer = new HttpServer(options, this)
  }

  add(functionKey: string, functionDefinition) {
    this._lambdas.set(functionKey, functionDefinition)
    this._lambdaFunctionNamesKeys.set(functionDefinition.name, functionKey)
  }

  get(functionKey: string) {
    const functionDefinition = this._lambdas.get(functionKey)
    return this._lambdaFunctionPool.get(functionKey, functionDefinition)
  }

  getByFunctionName(functionName: string) {
    const functionKey = this._lambdaFunctionNamesKeys.get(functionName)
    return this.get(functionKey)
  }

  start() {
    return this._httpServer.start()
  }

  // stops the server
  stop(timeout) {
    return this._httpServer.stop(timeout)
  }

  cleanup() {
    return this._lambdaFunctionPool.cleanup()
  }
}
