import { platform } from 'os'
import { relative, resolve } from 'path'
import execa from 'execa'

import Runner from '../Runner.js'

const { stringify } = JSON
const { cwd } = process

export default class RubyRunner extends Runner {
  #env = null
  #handlerName = null
  #handlerPath = null
  #allowCache = false

  constructor(funOptions, env, allowCache) {
    super()

    const { handlerName, handlerPath } = funOptions

    this.#env = env
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#allowCache = allowCache
  }

  // no-op
  // () => void
  cleanup() {}

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

    let result

    try {
      result = await ruby
    } catch (err) {
      // TODO
      console.log(err)

      throw err
    }

    const { stderr, stdout } = result

    if (stderr) {
      // TODO
      console.log(stderr)

      return stderr
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
