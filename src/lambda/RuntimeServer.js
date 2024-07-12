import crypto from "node:crypto"
import { Server } from "@hapi/hapi"
import getPort from "get-port"
import { log } from "../utils/log.js"

/**
 * Lightweight implementation of the AWS Lambda Runtimes API
 *
 * https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html
 */
export default class RuntimeServer {
  #server = null

  #runtimeApi = null

  #requestId = null

  #event = null

  #context = null

  #timeout = null

  #callback = null

  constructor(event, context, timeout) {
    this.#event = event
    this.#context = context
    this.#timeout = timeout
  }

  async start(startCb, payloadCb) {
    this.#callback = payloadCb
    this.#requestId = crypto.randomUUID()

    // add routes
    const nextRoute = this.nextRoute()
    const responseRoute = this.responseRoute()

    // DEVNOTE: Each invocation gets a s short-lived server on a random port
    this.#server = new Server({
      host: "127.0.0.1",
      port: await getPort(),
    })

    // TODO: error route
    this.#server.route([nextRoute, responseRoute])

    try {
      await this.#server.start()
    } catch (err) {
      throw new Error(
        `Unexpected error while starting serverless-offline lambda runtime server: ${err}`,
      )
    }

    this.#runtimeApi = `${this.#server.info.host}:${this.#server.info.port}`

    log.verbose(
      `Offline [http for lambda runtime] listening on http://${this.#runtimeApi}`,
    )

    startCb(this.#runtimeApi)
  }

  stop(timeout) {
    if (!this.#server) {
      return Promise.resolve()
    }

    return this.#server
      .stop({
        timeout,
      })
      .finally(() => {
        log.verbose(
          `Offline [http for lambda rie] stopped listening on http://${this.#runtimeApi}`,
        )
      })
  }

  nextRoute() {
    const requestId = this.#requestId
    const functionArn = this.#context.invokedFunctionArn
    const functionTimeout = this.#timeout

    const getPayload = () => {
      return new Promise((resolve) => {
        const event = this.#event
        if (!event) {
          setTimeout(async () => {
            log.verbose(`[${requestId}] Awaiting event...`)
            resolve(await getPayload())
          }, 100)
        }
        resolve(event)
      })
    }

    return {
      // https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html#runtimes-api-next
      async handler(_, h) {
        log.verbose(`[${requestId}] Handling next request`)
        const payload = await getPayload()
        const statusCode = 200
        const response = h.response(payload).code(statusCode)
        response.header("Lambda-Runtime-Aws-Request-Id", requestId)
        response.header("Lambda-Runtime-Invoked-Function-Arn", functionArn)
        response.header(
          "Lambda-Runtime-Deadline-Ms",
          Date.now() + functionTimeout,
        )
        return response
      },
      method: "GET",
      options: {
        tags: ["runtime"],
      },
      path: "/2018-06-01/runtime/invocation/next",
    }
  }

  responseRoute() {
    const thisRequestId = this.#requestId

    const emitPayload = (payload) => {
      // once a payload is received, the "/next" route should hang indefinitely
      // ref: https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html#runtimes-api-next
      this.#event = null
      this.#callback(payload)
    }

    return {
      async handler(request, h) {
        const {
          payload,
          params: { requestId },
        } = request
        log.verbose(`[${requestId}] Handling response request`)

        if (requestId === thisRequestId) {
          emitPayload(payload)
        }

        return h.response("").code(202)
      },
      method: "POST",
      options: {
        payload: {
          defaultContentType: "application/x-www-form-urlencoded",
          parse: false,
        },
        tags: ["runtime"],
      },
      path: `/2018-06-01/runtime/invocation/{requestId}/response`,
    }
  }
}
