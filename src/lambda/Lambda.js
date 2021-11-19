import HttpServer from './HttpServer.js'
import LambdaFunctionPool from './LambdaFunctionPool.js'

export default class Lambda {
  #httpServer = null
  #lambdas = new Map()
  #lambdaFunctionNamesKeys = new Map()
  #lambdaFunctionPool = null

  constructor(serverless, options, v3Utils) {
    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }

    this.#httpServer = new HttpServer(options, this, v3Utils)
    this.#lambdaFunctionPool = new LambdaFunctionPool(
      serverless,
      options,
      v3Utils,
    )
  }

  _create(functionKey, functionDefinition) {
    this.#lambdas.set(functionKey, functionDefinition)
    this.#lambdaFunctionNamesKeys.set(functionDefinition.name, functionKey)
  }

  create(lambdas) {
    lambdas.forEach(({ functionKey, functionDefinition }) => {
      this._create(functionKey, functionDefinition)
    })
  }

  get(functionKey) {
    const functionDefinition = this.#lambdas.get(functionKey)
    return this.#lambdaFunctionPool.get(functionKey, functionDefinition)
  }

  getByFunctionName(functionName) {
    const functionKey = this.#lambdaFunctionNamesKeys.get(functionName)
    return this.get(functionKey)
  }

  listFunctionNames() {
    const functionNames = Array.from(this.#lambdaFunctionNamesKeys.keys())
    return functionNames
  }

  listFunctionNamePairs() {
    const funcNamePairs = Array.from(this.#lambdaFunctionNamesKeys).reduce(
      (obj, [key, value]) => Object.assign(obj, { [key]: value }), // Be careful! Maps can have non-String keys; object literals can't.
      {},
    )
    return funcNamePairs
  }

  start() {
    return this.#httpServer.start()
  }

  // stops the server
  stop(timeout) {
    return this.#httpServer.stop(timeout)
  }

  cleanup() {
    return this.#lambdaFunctionPool.cleanup()
  }
}
