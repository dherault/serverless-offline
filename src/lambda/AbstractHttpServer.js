import { exit } from "node:process"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { Server } from "@hapi/hapi"
import { log } from "../utils/log.js"

function loadCerts(httpsProtocol) {
  return {
    cert: readFileSync(resolve(httpsProtocol, "cert.pem"), "utf8"),
    key: readFileSync(resolve(httpsProtocol, "key.pem"), "utf8"),
  }
}

export default class AbstractHttpServer {
  #lambda = null

  #options = null

  #port = null

  #started = false

  constructor(lambda, options, port) {
    this.#lambda = lambda
    this.#options = options
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

  async start() {
    if (this.#started) {
      return
    }
    this.#started = true

    try {
      await this.httpServer.start()
    } catch (err) {
      log.error(
        `Unexpected error while starting serverless-offline ${this.serverName} server on port ${this.port}:`,
        err,
      )
      exit(1)
    }

    log.notice(
      `Offline [http for ${this.serverName}] listening on ${this.basePath}`,
    )
  }

  stop(timeout) {
    if (!this.#started) {
      return Promise.resolve()
    }
    this.#started = false
    return this.httpServer.stop({ timeout })
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

  get basePath() {
    const { host, httpsProtocol } = this.#options
    return `${httpsProtocol ? "https" : "http"}://${host}:${this.port}`
  }

  get serverName() {
    if (this.port === this.#options.lambdaPort) {
      return "lambda"
    }

    if (this.port === this.#options.httpPort) {
      return "api gateway"
    }

    if (this.port === this.#options.websocketPort) {
      return "websocket"
    }

    if (this.port === this.#options.albPort) {
      return "alb"
    }

    return "unknown"
  }
}
