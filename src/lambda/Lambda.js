import LambdaFunctionPool from './LambdaFunctionPool.js'

export default class Lambda {
  constructor(provider, options, config) {
    this._lambdas = new Map()
    this._lambdaFunctionPool = new LambdaFunctionPool(provider, config, options)
  }

  add(functionDefinition) {
    this._lambdas.set(functionDefinition.name, functionDefinition)
  }

  get(functionName) {
    const functionDefinition = this._lambdas.get(functionName)

    return this._lambdaFunctionPool.get(functionName, functionDefinition)
  }

  cleanup() {
    return this._lambdaFunctionPool.cleanup()
  }
}
