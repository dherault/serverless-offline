import HttpEventDefinition from "./HttpEventDefinition.js"
import HttpServer from "./HttpServer.js"

export default class Http {
  #httpServer = null

  #lambda = null

  #options = null

  #serverless = null

  constructor(serverless, options, lambda) {
    this.#lambda = lambda
    this.#options = options
    this.#serverless = serverless
  }

  start() {
    return this.#httpServer.start()
  }

  // stops the server
  stop(timeout) {
    return this.#httpServer.stop(timeout)
  }

  async createServer() {
    this.#httpServer = new HttpServer(
      this.#serverless,
      this.#options,
      this.#lambda,
    )

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
