import HttpServer from './HttpServer.js'

export default class ApiGateway {
  constructor(service, options, config) {
    this._httpServer = new HttpServer(service, options, config)
  }

  async start() {
    await this._httpServer.start()
  }

  // stops the server
  async stop(timeout) {
    await this._httpServer.stop(timeout)
  }

  createRoutes(functionName, functionObj, http) {
    this._httpServer.createRoutes(functionName, functionObj, http)
  }

  createLambdaInvokeRoutes(functionName, functionObj) {
    this._httpServer.createLambdaInvokeRoutes(functionName, functionObj)
  }

  createResourceRoutes() {
    this._httpServer.createResourceRoutes()
  }

  create404Route() {
    this._httpServer.create404Route()
  }

  registerPlugins() {
    return this._httpServer.registerPlugins()
  }

  // TEMP FIXME quick fix to expose gateway server for testing, look for better solution
  getServer() {
    return this._httpServer.getServer()
  }
}
