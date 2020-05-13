import { EOL, platform } from 'os'
import execa from 'execa'
import { resolve } from 'path'

const { parse, stringify } = JSON
const { has } = Reflect

export default class DotnetcoreRunner {
  #env = null
  #handlerName = null
  #handlerPath = null
  #runtime = null

  constructor(funOptions, env) {
    const { handlerName, handlerPath, runtime } = funOptions

    this.#env = env
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#runtime = runtime
  }

  // no-op
  // () => void
  cleanup() {}

  _parsePayload(value) {
    let payload

    for (const item of value.split(EOL)) {
      let json

      // first check if it's JSON
      try {
        json = parse(item)
        // nope, it's not JSON
      } catch (err) {
        // no-op
      }

      // now let's see if we have a property __offline_payload__
      if (
        json &&
        typeof json === 'object' &&
        has(json, '__offline_payload__')
      ) {
        payload = json.__offline_payload__
        console.log(payload)
        // everything else is print(), logging, ...
      } else {
        console.log(item)
      }
    }

    return payload
  }

  async run(event, context) {
    const cmd = platform() === 'win32' ? 'dotnet.exe' : 'dotnet'
    const input = stringify({
      context,
      event,
    })

    const dotnet = execa(
      cmd,
      [
        resolve(
          __dirname,
          `executors-binaries/${this.#runtime}/${this.#runtime}.dll`,
        ),
        this.#handlerName,
        this.#handlerPath,
      ],
      {
        env: this.#env,
        input,
        // shell: true,
      },
    )

    let result

    try {
      result = await dotnet
    } catch (err) {
      // TODO
      console.log(err)

      throw err
    }

    const { stderr, stdout } = result

    if (stderr) {
      // TODO
      console.log(stderr)
    }

    try {
      return this._parsePayload(stdout)
    } catch (err) {
      // TODO
      console.log('No JSON')

      // TODO return or re-throw?
      return err
    }
  }
}
