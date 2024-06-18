import HttpServer from "./HttpServer.js"
import LambdaFunctionPool from "./LambdaFunctionPool.js"

const { assign } = Object

export default class Lambda {
  #httpServer = null

  #httpServers = new Map()

  #options = null

  #lambdas = new Map()

  #lambdaFunctionNamesKeys = new Map()

  #lambdaFunctionPool = null

  constructor(serverless, options) {
    this.#httpServer = new HttpServer(options, this)
    this.#options = options
    this.#lambdaFunctionPool = new LambdaFunctionPool(serverless, this.#options)
  }

  #createEvent(functionKey, functionDefinition) {
    this.#lambdas.set(functionKey, functionDefinition)
    this.#lambdaFunctionNamesKeys.set(functionDefinition.name, functionKey)
  }

  create(lambdas) {
    lambdas.forEach(({ functionKey, functionDefinition }) => {
      this.#createEvent(functionKey, functionDefinition)
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
      (obj, [key, value]) => assign(obj, { [key]: value }), // Be careful! Maps can have non-String keys; object literals can't.
      {},
    )
    return funcNamePairs
  }

  start() {
    this.#lambdaFunctionPool.start()
    return this.#httpServer.start()
  }

  // stops the server
  stop(timeout) {
    return this.#httpServer.stop(timeout)
  }

  cleanup() {
    return this.#lambdaFunctionPool.cleanup()
  }

  putServer(port, server) {
    this.#httpServers.set(port, server)
  }

  getServer(port) {
    return this.#httpServers.get(port)
  }
}
