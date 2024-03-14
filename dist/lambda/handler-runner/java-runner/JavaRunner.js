import { EOL } from 'node:os'
import process from 'node:process'
import { log } from '@serverless/utils/log.js'
import { invokeJavaLocal } from 'java-invoke-local'
const { parse, stringify } = JSON
const { has } = Reflect
export default class JavaRunner {
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
  cleanup() {}
  #parsePayload(value) {
    for (const item of value.split(EOL)) {
      let json
      try {
        json = parse(item)
      } catch {}
      if (
        json &&
        typeof json === 'object' &&
        has(json, '__offline_payload__')
      ) {
        return json.__offline_payload__
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
      method: 'POST',
    }
    const port = process.env.JAVA_OFFLINE_SERVER || 8080
    let result
    try {
      const response = await fetch(
        `http://localhost:${port}/invoke`,
        httpOptions,
      )
      result = await response.text()
    } catch {
      log.notice(
        'Local java server not running. For faster local invocations, run "java-invoke-local --server" in your project directory',
      )
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
      log.notice(result)
    }
    return this.#parsePayload(result)
  }
}
