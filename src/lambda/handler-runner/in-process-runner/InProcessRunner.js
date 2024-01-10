import { join } from "node:path"
import { performance } from "node:perf_hooks"
import process from "node:process"
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

  async run(event, context) {
    // process.env should be available in the handler module scope as well as in the handler function scope
    // NOTE: Don't use Object spread (...) here!
    // otherwise the values of the attached props are not coerced to a string
    // e.g. process.env.foo = 1 should be coerced to '1' (string)
    assign(process.env, this.#env)

    const handler = await load(
      this.#servicePath,
      join(this.#codeDir, this.#handler),
    )

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
}
