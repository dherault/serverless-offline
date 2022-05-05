import fetch from 'node-fetch'
import { invokeJavaLocal } from 'java-invoke-local'

import Runner from '../Runner.js'

const { stringify } = JSON

export default class JavaRunner extends Runner {
  #env = null
  #functionName = null
  #handler = null
  #deployPackage = null
  #allowCache = false

  constructor(funOptions, env, allowCache, v3Utils) {
    super(funOptions, env, allowCache, v3Utils)

    const { functionName, handler, servicePackage, functionPackage } =
      funOptions

    this.#env = env
    this.#functionName = functionName
    this.#handler = handler
    this.#deployPackage = functionPackage || servicePackage
    this.#allowCache = allowCache
  }

  // no-op
  // () => void
  cleanup() {}

  async run(event, context) {
    const input = stringify({
      context,
      event,
    })

    let result
    try {
      // Assume java-invoke-local server is running

      const data = stringify({
        artifact: this.#deployPackage,
        handler: this.#handler,
        data: input,
        function: this.#functionName,
        jsonOutput: true,
        serverlessOffline: true,
      })

      const httpOptions = {
        method: 'POST',
        body: data,
      }

      const port = process.env.JAVA_OFFLINE_SERVER || 8080
      const response = await fetch(
        `http://localhost:${port}/invoke`,
        httpOptions,
      )
      result = await response.text()
    } catch (e) {
      if (this.log) {
        this.log.notice(
          'Local java server not running. For faster local invocations, run "java-invoke-local --server" in your project directory',
        )
      } else {
        console.log(
          'Local java server not running. For faster local invocations, run "java-invoke-local --server" in your project directory',
        )
      }

      // Fallback invocation
      const args = [
        '-c',
        this.#handler,
        '-a',
        this.#deployPackage,
        '-f',
        this.#functionName,
        '-d',
        input,
        '--json-output',
        '--serverless-offline',
      ]
      result = invokeJavaLocal(args, this.#env)

      if (this.log) {
        this.log.notice(result)
      } else {
        console.log(result)
      }
    }

    return this._parsePayload(result)
  }
}
