import HttpEventDefinition from './HttpEventDefinition'
import HttpServer from './HttpServer'

export default class Http {
  private readonly _httpServer: HttpServer

  constructor(service, options, config, lambda) {
    this._httpServer = new HttpServer(service, options, config, lambda)
  }

  start() {
    return this._httpServer.start()
  }

  // stops the server
  stop(timeout: number) {
    return this._httpServer.stop(timeout)
  }

  createEvent(functionKey, functionDefinition, rawHttpEventDefinition) {
    const httpEvent = new HttpEventDefinition(rawHttpEventDefinition)

    this._httpServer.createRoutes(functionKey, functionDefinition, httpEvent)
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
