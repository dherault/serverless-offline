import { Buffer } from "node:buffer"
import { join } from "node:path"
import { performance } from "node:perf_hooks"
import process from "node:process"
import { PassThrough } from "node:stream"
import { load } from "./aws-lambda-ric/UserFunction.js"

const { floor } = Math
const { assign } = Object

export default class InProcessRunner {
  #codeDir = null

  #env = null

  #handler = null

  #servicePath = null

  #timeout = null

  constructor(funOptions, env) {
    const { codeDir, handler, servicePath, timeout } = funOptions

    this.#codeDir = codeDir
    this.#env = env
    this.#handler = handler
    this.#servicePath = servicePath
    this.#timeout = timeout
  }

  // no-op
  // () => void
  cleanup() {}

  #setupAwsLambdaGlobal() {
    // Provide the awslambda global object to simulate AWS Lambda runtime
    if (!globalThis.awslambda) {
      globalThis.awslambda = {
        streamifyResponse: (handler) => {
          const wrappedHandler = (event, context, callback) => {
            return handler(event, context, callback)
          }
          // eslint-disable-next-line no-underscore-dangle
          wrappedHandler._streamingHandler = handler
          return wrappedHandler
        },
      }
    }
  }

  async run(event, context, isStreamingResponse = false) {
    // process.env should be available in the handler module scope as well as in the handler function scope
    // NOTE: Don't use Object spread (...) here!
    // otherwise the values of the attached props are not coerced to a string
    // e.g. process.env.foo = 1 should be coerced to '1' (string)
    assign(process.env, this.#env)

    // Provide awslambda global object for streaming support
    this.#setupAwsLambdaGlobal()

    const handler = await load(
      this.#servicePath,
      join(this.#codeDir, this.#handler),
    )

    // Handle streaming responses
    if (isStreamingResponse) {
      return this.#runStreamingHandler(handler, event, context)
    }

    let callback

    const callbackWrapper = new Promise((res, rej) => {
      callback = (err, data) => {
        if (err === "Unauthorized") {
          res("Unauthorized")
          return
        }
        if (err) {
          rej(err)
          return
        }
        res(data)
      }
    })

    const executionTimeout = performance.now() + this.#timeout

    // attach doc-deprecated functions
    // create new immutable object
    const lambdaContext = {
      ...context,
      done(err, data) {
        callback(err, data)
      },
      fail(err) {
        callback(err)
      },
      getRemainingTimeInMillis() {
        const timeLeft = executionTimeout - performance.now()

        // just return 0 for now if we are beyond alotted time (timeout)
        return timeLeft > 0 ? floor(timeLeft) : 0
      },
      succeed(res) {
        callback(null, res)
      },
    }

    // execute (run) handler
    // no try/catch so that errors bubble up and are logged with root stack traces
    const result = handler(event, lambdaContext, callback)

    const responses = [callbackWrapper]

    // Promise was returned
    if (result != null && typeof result.then === "function") {
      responses.push(result)
    }

    return Promise.race(responses)
  }

  async #runStreamingHandler(handler, event, context) {
    const executionTimeout = performance.now() + this.#timeout

    const passThrough = new PassThrough()
    const headers = {}
    let statusCode = 200

    let metadataResolve
    const metadataReady = new Promise((resolve) => {
      metadataResolve = resolve
    })

    const responseStream = {
      end(chunk) {
        metadataResolve()
        if (chunk === undefined) {
          passThrough.end()
        } else {
          let buf
          if (typeof chunk === "string") {
            buf = Buffer.from(chunk, "utf8")
          } else if (Buffer.isBuffer(chunk)) {
            buf = chunk
          } else {
            buf = Buffer.from(String(chunk), "utf8")
          }
          passThrough.end(buf)
        }
      },
      setContentType(contentType) {
        headers["Content-Type"] = contentType
      },
      setStatusCode(code) {
        statusCode = code
      },
      write(chunk) {
        metadataResolve()
        if (typeof chunk === "string") {
          passThrough.write(Buffer.from(chunk, "utf8"))
        } else if (Buffer.isBuffer(chunk)) {
          passThrough.write(chunk)
        } else {
          passThrough.write(Buffer.from(String(chunk), "utf8"))
        }
      },
    }

    const lambdaContext = {
      ...context,
      getRemainingTimeInMillis() {
        const timeLeft = executionTimeout - performance.now()
        return timeLeft > 0 ? floor(timeLeft) : 0
      },
    }

    let actualHandler = handler
    // eslint-disable-next-line no-underscore-dangle
    if (handler._streamingHandler) {
      // eslint-disable-next-line no-underscore-dangle
      actualHandler = handler._streamingHandler
    }

    // Start handler execution without awaiting - it writes to stream asynchronously
    actualHandler(event, responseStream, lambdaContext).catch((err) => {
      passThrough.destroy(err)
    })

    // Wait for first write so metadata (content type, etc.) is set
    await metadataReady

    return {
      // eslint-disable-next-line no-underscore-dangle
      _isStreamingResponse: true,
      headers,
      statusCode,
      stream: passThrough,
    }
  }
}
