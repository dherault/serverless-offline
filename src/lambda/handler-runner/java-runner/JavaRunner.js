import { EOL } from "node:os"
import process from "node:process"
import { invokeJavaLocal } from "java-invoke-local"
import { log } from "../../../utils/log.js"

const { parse, stringify } = JSON
const { hasOwn } = Object

export default class JavaRunner {
  static #payloadIdentifier = "__offline_payload__"

  #deployPackage = null

  #env = null

  #functionName = null

  #handler = null

  constructor(funOptions, env) {
    const { functionName, handler, servicePackage, functionPackage } =
      funOptions

    this.#deployPackage = functionPackage || servicePackage
    this.#env = env
    this.#functionName = functionName
    this.#handler = handler
  }

  // no-op
  // () => void
  cleanup() {}

  #parsePayload(value) {
    for (const item of value.split(EOL)) {
      let json

      // first check if it's JSON
      try {
        json = parse(item)
        // nope, it's not JSON
      } catch {
        // no-op
      }

      // now let's see if we have a property __offline_payload__
      if (
        json &&
        typeof json === "object" &&
        hasOwn(json, JavaRunner.#payloadIdentifier)
      ) {
        return json[JavaRunner.#payloadIdentifier]
      }
    }

    return undefined
  }

  async run(event, context) {
    const input = stringify({
      context,
      event,
    })

    const data = stringify({
      artifact: this.#deployPackage,
      data: input,
      function: this.#functionName,
      handler: this.#handler,
      jsonOutput: true,
      serverlessOffline: true,
    })

    const httpOptions = {
      body: data,
      method: "POST",
    }

    const port = process.env.JAVA_OFFLINE_SERVER || 8080

    let result

    try {
      // Assume java-invoke-local server is running

      const response = await fetch(
        `http://localhost:${port}/invoke`,
        httpOptions,
      )
      result = await response.text()
    } catch {
      log.notice(
        'Local java server not running. For faster local invocations, run "java-invoke-local --server" in your project directory',
      )

      // Fallback invocation
      const args = [
        "-c",
        this.#handler,
        "-a",
        this.#deployPackage,
        "-f",
        this.#functionName,
        "-d",
        input,
        "--json-output",
        "--serverless-offline",
      ]
      result = invokeJavaLocal(args, this.#env)

      log.notice(result)
    }

    return this.#parsePayload(result)
  }
}
