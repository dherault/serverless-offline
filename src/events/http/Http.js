import HttpEventDefinition from './HttpEventDefinition.js'
import HttpServer from './HttpServer.js'

export default class Http {
  #httpServer = null

  constructor(serverless, options, lambda) {
    this.#httpServer = new HttpServer(serverless, options, lambda)
  }

  start() {
    return this.#httpServer.start()
  }

  // stops the server
  stop(timeout) {
    return this.#httpServer.stop(timeout)
  }

  async createServer() {
    await this.#httpServer.createServer()
  }

  #createEvent(functionKey, rawHttpEventDefinition, handler) {
    const httpEvent = new HttpEventDefinition(rawHttpEventDefinition)

    this.#httpServer.createRoutes(functionKey, httpEvent, handler)
  }

  create(events) {
    events.forEach(({ functionKey, handler, http }) => {
      this.#createEvent(functionKey, http, handler)
    })

    this.#httpServer.writeRoutesTerminal()
  }

  createResourceRoutes() {
    this.#httpServer.createResourceRoutes()
  }

  create404Route() {
    this.#httpServer.create404Route()
  }

  // TEMP FIXME quick fix to expose gateway server for testing, look for better solution
  getServer() {
    return this.#httpServer.getServer()
  }
}
