import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { Server } from "@hapi/hapi"

function loadCerts(httpsProtocol) {
  return {
    cert: readFileSync(resolve(httpsProtocol, "cert.pem"), "utf8"),
    key: readFileSync(resolve(httpsProtocol, "key.pem"), "utf8"),
  }
}

export default class AbstractHttpServer {
  #lambda = null

  #port = null

  #started = false

  constructor(lambda, options, port) {
    this.#lambda = lambda
    this.#port = port

    if (this.#lambda.getServer(port)) {
      return
    }

    const { host, httpsProtocol, enforceSecureCookies } = options

    const server = new Server({
      host,
      port,
      router: {
        stripTrailingSlash: true,
      },
      state: enforceSecureCookies
        ? {
            isHttpOnly: true,
            isSameSite: false,
            isSecure: true,
          }
        : {
            isHttpOnly: false,
            isSameSite: false,
            isSecure: false,
          },
      ...(httpsProtocol != null && {
        tls: loadCerts(httpsProtocol),
      }),
    })

    this.#lambda.putServer(port, server)
  }

  start() {
    if (this.#started) {
      return Promise.resolve()
    }
    this.#started = true
    return this.httpServer.start()
  }

  stop(timeout) {
    if (!this.#started) {
      return Promise.resolve()
    }
    this.#started = false
    return this.httpServer.stop(timeout)
  }

  get httpServer() {
    return this.#lambda.getServer(this.port)
  }

  get listener() {
    return this.httpServer.listener
  }

  get port() {
    return this.#port
  }
}
