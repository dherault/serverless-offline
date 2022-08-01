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

  stop(timeout) {
    return this.#httpServer.stop(timeout)
  }

  #createEvent(functionKey, rawAlbEventDefinition) {
    const albEvent = new AlbEventDefinition(rawAlbEventDefinition)

    this.#httpServer.createRoutes(functionKey, albEvent)
  }

  create(events) {
    events.forEach(({ functionKey, alb }) => {
      this.#createEvent(functionKey, alb)
    })

    this.#httpServer.writeRoutesTerminal()
  }
}
