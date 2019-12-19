import HttpServer from './HttpServer.js'
import LambdaFunctionPool from './LambdaFunctionPool.js'

export default class Lambda {
  constructor(serverless, options) {
    this._httpServer = new HttpServer(options, this)
    this._lambdas = new Map()
    this._lambdaFunctionNamesKeys = new Map()
    this._lambdaFunctionPool = new LambdaFunctionPool(serverless, options)
  }

  _create(functionKey, functionDefinition) {
    this._lambdas.set(functionKey, functionDefinition)
    this._lambdaFunctionNamesKeys.set(functionDefinition.name, functionKey)
  }

  create(lambdas) {
    lambdas.forEach(({ functionKey, functionDefinition }) => {
      this._create(functionKey, functionDefinition)
    })
  }

  get(functionKey) {
    const functionDefinition = this._lambdas.get(functionKey)
    return this._lambdaFunctionPool.get(functionKey, functionDefinition)
  }

  getByFunctionName(functionName) {
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
