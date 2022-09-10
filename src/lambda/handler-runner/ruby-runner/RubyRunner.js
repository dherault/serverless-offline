import { EOL, platform } from 'node:os'
import { dirname, relative, resolve } from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'
import { log } from '@serverless/utils/log.js'
import { execa } from 'execa'
import { splitHandlerPathAndName } from '../../../utils/index.js'

const { parse, stringify } = JSON
const { hasOwn } = Object

const __dirname = dirname(fileURLToPath(import.meta.url))

export default class RubyRunner {
  static #payloadIdentifier = '__offline_payload__'

  #env = null

  #handlerName = null

  #handlerPath = null

  constructor(funOptions, env) {
    const [handlerPath, handlerName] = splitHandlerPathAndName(
      funOptions.handler,
    )

    this.#env = env
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
  }

  // no-op
  // () => void
  cleanup() {}

  #parsePayload(value) {
    let payload

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
        typeof json === 'object' &&
        hasOwn(json, RubyRunner.#payloadIdentifier)
      ) {
        payload = json[RubyRunner.#payloadIdentifier]
      } else {
        log.notice(item)
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
    })

    // console.log(input)

    const { stderr, stdout } = await execa(
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

    if (stderr) {
      // TODO

      log.notice(stderr)
    }

    return this.#parsePayload(stdout)
  }
}
