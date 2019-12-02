import Serverless from 'serverless'
import HttpEventDefinition from './HttpEventDefinition'
import HttpServer from './HttpServer'
import { Options } from '../../types'
import Lambda from '../../lambda/index'

export default class Http {
  private readonly _httpServer: HttpServer

  constructor(serverless: Serverless, options: Options, lambda: Lambda) {
    this._httpServer = new HttpServer(serverless, options, lambda)
  }

  start() {
    return this._httpServer.start()
  }

  // stops the server
  stop(timeout: number) {
    return this._httpServer.stop(timeout)
  }

  createEvent(functionKey: string, rawHttpEventDefinition, handler: string) {
    const httpEvent = new HttpEventDefinition(rawHttpEventDefinition)

    this._httpServer.createRoutes(functionKey, httpEvent, handler)
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
