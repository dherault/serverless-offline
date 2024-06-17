export default class AbstractHttpServer {
  #httpServer = null

  #lambda = null

  #port = null

  constructor(lambda, port) {
    this.#lambda = lambda
    this.#port = port
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
