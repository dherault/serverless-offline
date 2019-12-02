import Serverless, { FunctionDefinition } from 'serverless'
import HttpServer from './HttpServer'
import LambdaFunctionPool from './LambdaFunctionPool'
import { Options } from '../types'

export default class Lambda {
  private readonly _lambdas: Map<string, FunctionDefinition> = new Map()
  private readonly _lambdaFunctionNamesKeys: Map<string, string> = new Map()
  private readonly _lambdaFunctionPool: LambdaFunctionPool
  private readonly _httpServer: HttpServer

  constructor(serverless: Serverless, options: Options) {
    this._httpServer = new HttpServer(options, this)
    this._lambdaFunctionPool = new LambdaFunctionPool(serverless, options)
  }

  add(functionKey: string, functionDefinition: FunctionDefinition) {
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
  stop(timeout: number) {
    return this._httpServer.stop(timeout)
  }

  cleanup() {
    return this._lambdaFunctionPool.cleanup()
  }
}
