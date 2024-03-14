import { EOL, platform } from 'node:os'
import { dirname, relative, resolve } from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'
import { log } from '@serverless/utils/log.js'
import { execa } from 'execa'
const { parse, stringify } = JSON
const { has } = Reflect
const __dirname = dirname(fileURLToPath(import.meta.url))
export default class RubyRunner {
  #env = null
  #handlerName = null
  #handlerPath = null
  constructor(funOptions, env) {
    const { handlerName, handlerPath } = funOptions
    this.#env = env
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
  }
  cleanup() {}
  #parsePayload(value) {
    let payload
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
        payload = json.__offline_payload__
      } else {
        log.notice(item)
      }
    }
    return payload
  }
  async run(event, context) {
    const runtime = platform() === 'win32' ? 'ruby.exe' : 'ruby'
    const { callbackWaitsForEmptyEventLoop, ..._context } = context
    const input = stringify({
      context: _context,
      event,
    })
    const ruby = execa(
      runtime,
      [
        resolve(__dirname, 'invoke.rb'),
        relative(cwd(), this.#handlerPath),
        this.#handlerName,
      ],
      {
        env: this.#env,
        input,
      },
    )
    const result = await ruby
    const { stderr, stdout } = result
    if (stderr) {
      log.notice(stderr)
    }
    return this.#parsePayload(stdout)
  }
}
