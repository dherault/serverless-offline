import LambdaFunctionPool from './LambdaFunctionPool'

export default class Lambda {
  private readonly _lambdas: Map<string, any>
  private readonly _lambdaFunctionNamesKeys: Map<string, any>
  private readonly _lambdaFunctionPool: LambdaFunctionPool

  constructor(provider, options, config) {
    this._lambdas = new Map()
    this._lambdaFunctionNamesKeys = new Map()
    this._lambdaFunctionPool = new LambdaFunctionPool(provider, config, options)
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

  cleanup() {
    return this._lambdaFunctionPool.cleanup()
  }
}
