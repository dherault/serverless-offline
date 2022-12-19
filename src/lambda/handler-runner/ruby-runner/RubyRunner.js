import { EOL, platform } from 'os'
import { relative, resolve } from 'path'
import { cwd } from 'process'
import execa from 'execa'

const { parse, stringify } = JSON
const { has } = Reflect

export default class RubyRunner {
  #env = null
  #handlerName = null
  #handlerPath = null
  #allowCache = false

  constructor(funOptions, env, allowCache, v3Utils) {
    const { handlerName, handlerPath } = funOptions

    this.#env = env
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#allowCache = allowCache

    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }
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
      } else if (this.log) {
        this.log.notice(item)
      } else {
        console.log(item) // log non-JSON stdout to console (puts, p, logger.info, ...)
      }
    }

    return payload
  }

  // invokeLocalRuby, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L556
  // invoke.rb, copy/pasted entirely as is:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/invoke.rb
  async run(event, context) {
    const runtime = platform() === 'win32' ? 'ruby.exe' : 'ruby'

    // https://docs.aws.amazon.com/lambda/latest/dg/ruby-context.html

    // https://docs.aws.amazon.com/lambda/latest/dg/ruby-context.html
    // exclude callbackWaitsForEmptyEventLoop, don't mutate context
    const { callbackWaitsForEmptyEventLoop, ..._context } = context

    const input = stringify({
      context: _context,
      event,
      allowCache: this.#allowCache,
    })

    // console.log(input)

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
        // shell: true,
      },
    )

    const result = await ruby

    const { stderr, stdout } = result

    if (stderr) {
      // TODO

      if (this.log) {
        this.log.notice(stderr)
      } else {
        console.log(stderr)
      }
    }

    return this._parsePayload(stdout)
  }
}
