import { log } from '@serverless/utils/log.js'
import HttpEventDefinition from './HttpEventDefinition.js'
import HttpServer from './HttpServer.js'
import { orange } from '../../config/colors.js'
import { createApiKey } from '../../utils/index.js'

export default class Http {
  #hasPrivateHttpEvent = false

  #httpServer = null

  #options = null

  constructor(serverless, options, lambda) {
    this.#httpServer = new HttpServer(serverless, options, lambda)
    this.#options = options
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
    events.forEach(({ functionKey, handler, http, private: priv }) => {
      this.#createEvent(functionKey, http, handler)

      if (priv) {
        this.#hasPrivateHttpEvent = true
      }
    })

    if (this.#hasPrivateHttpEvent) {
      if (this.#options.apiKey) {
        log.notice()
        log.warning(
          orange(`'--apiKey' is deprecated and will be removed in the next major version.
  Please define the apiKey value in the 'provider.apiGateway.apiKeys' section of the serverless config.
  If you are experiencing any issues please let us know: https://github.com/dherault/serverless-offline/issues`),
        )
        log.notice()
      } else {
        this.#options.apiKey = createApiKey()
      }

      log.notice(`Key with token: ${this.#options.apiKey}`)

      if (this.#options.noAuth) {
        log.notice(
          `Authorizers are turned off. You do not need to use 'x-api-key' header.`,
        )
      } else {
        log.notice(`Remember to use 'x-api-key' on the request headers.`)
      }
    }

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
