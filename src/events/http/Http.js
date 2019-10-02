import HttpServer from './HttpServer.js'

export default class Http {
  constructor(service, options, config, lambda) {
    this._httpServer = new HttpServer(service, options, config, lambda)
  }

  async start() {
    await this._httpServer.start()
  }

  // stops the server
  async stop(timeout) {
    await this._httpServer.stop(timeout)
  }

  createEvent(functionKey, functionObj, http) {
    this._httpServer.createRoutes(functionKey, functionObj, http)
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
