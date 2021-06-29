import AlbEventDefinition from './AlbEventDefinition.js'
import HttpServer from './HttpServer.js'

export default class Alb {
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

  _create(functionKey, rawALBEventDefinition, handler) {
    const httpEvent = new AlbEventDefinition(rawALBEventDefinition)

    this.#httpServer.createRoutes(functionKey, httpEvent, handler)
  }

  create(events) {
    events.forEach(({ functionKey, handler, alb }) => {
      this._create(functionKey, alb, handler)
    })

    this.#httpServer.writeRoutesTerminal()
  }
}
