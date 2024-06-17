import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { exit } from "node:process"
import { Server } from "@hapi/hapi"
import { log } from "../../utils/log.js"
import AbstractHttpServer from "../../AbstractHttpServer.js"
import { catchAllRoute, connectionsRoutes } from "./http-routes/index.js"

export default class HttpServer extends AbstractHttpServer {
  #options = null

  #webSocketClients = null

  constructor(options, lambda, webSocketClients) {
    super(lambda, options.websocketPort)
    this.#options = options
    this.#webSocketClients = webSocketClients
  }

  async #loadCerts(httpsProtocol) {
    const [cert, key] = await Promise.all([
      readFile(resolve(httpsProtocol, "cert.pem"), "utf8"),
      readFile(resolve(httpsProtocol, "key.pem"), "utf8"),
    ])

    return {
      cert,
      key,
    }
  }

  async createServer() {
    const { host, httpsProtocol, websocketPort } = this.#options

    const serverOptions = {
      host,
      port: websocketPort,
      router: {
        stripTrailingSlash: true,
      },
      // https support
      ...(httpsProtocol != null && {
        tls: await this.#loadCerts(httpsProtocol),
      }),
    }

    this.httpServer = new Server(serverOptions)
  }

  async start() {
    // add routes
    const routes = [
      ...connectionsRoutes(this.#webSocketClients),
      catchAllRoute(),
    ]
    this.httpServer.route(routes)

    const { host, httpsProtocol, websocketPort } = this.#options

    try {
      await this.httpServer.start()
    } catch (err) {
      log.error(
        `Unexpected error while starting serverless-offline websocket server on port ${websocketPort}:`,
        err,
      )
      exit(1)
    }

    log.notice(
      `Offline [http for websocket] listening on ${
        httpsProtocol ? "https" : "http"
      }://${host}:${websocketPort}`,
    )
  }

  // stops the server
  stop(timeout) {
    return this.httpServer.stop({
      timeout,
    })
  }

  get server() {
    return this.httpServer.listener
  }
}
