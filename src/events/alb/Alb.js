import { log } from '@serverless/utils/log.js'
import AlbEventDefinition from './AlbEventDefinition.js'
import HttpServer from './HttpServer.js'

export default class Alb {
  #httpServer = null

  #lambda = null

  #options = null

  #serverless = null

  constructor(serverless, options, lambda) {
    this.#lambda = lambda
    this.#options = options
    this.#serverless = serverless

    log.warning(`
Application Load Balancer (ALB) support in serverless-offline is experimental.
Please file an issue for any bugs, missing features or other feedback: https://github.com/dherault/serverless-offline/issues
    `)
  }

  start() {
    return this.#httpServer.start()
  }

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
