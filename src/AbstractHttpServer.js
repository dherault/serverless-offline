export default class AbstractHttpServer {
  #httpServer = null

  #lambda = null

  #port = null

  #additionalRoutes = []

  #started = false

  constructor(lambda, port) {
    this.#lambda = lambda
    this.#port = port
  }

  start() {
    if (this.#started) {
      return Promise.resolve()
    }
    this.#started = true
    this.#httpServer.route(this.#additionalRoutes)
    return this.#httpServer.start()
  }

  stop(timeout) {
    if (!this.#started) {
      return Promise.resolve()
    }
    this.#started = false
    return this.#httpServer.stop(timeout)
  }

  addRoutes(routes) {
    this.#additionalRoutes = this.#additionalRoutes.push(...routes)
  }

  get httpServer() {
    return this.#httpServer
  }

  set httpServer(httpServer) {
    this.#httpServer = httpServer
    this.#lambda.putServer(this.#port, this.#httpServer)
  }

  get listener() {
    return this.#httpServer.listener
  }

  get port() {
    return this.#port
  }
}
