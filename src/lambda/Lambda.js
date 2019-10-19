import LambdaFunctionPool from './LambdaFunctionPool.js'

export default class Lambda {
  constructor(provider, options, config) {
    this._lambdas = new Map()
    this._lambdaFunctionPool = new LambdaFunctionPool(provider, config, options)
  }

  add(functionObj) {
    this._lambdas.set(functionObj.name, functionObj)
  }

  get(functionName) {
    const functionObj = this._lambdas.get(functionName)

    return this._lambdaFunctionPool.get(functionName, functionObj)
  }

  cleanup() {
    return this._lambdaFunctionPool.cleanup()
  }
}
