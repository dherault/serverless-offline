'use strict'

const { EOL, platform } = require('os')
const { delimiter, join, relative, resolve } = require('path')
const execa = require('execa')
const { supportedPython, supportedRuby } = require('../config/index.js')

const { parse, stringify } = JSON
const { cwd } = process
const { has } = Reflect

module.exports = class InvokeLocalRunner {
  constructor(funOptions, env) {
    const { handlerName, handlerPath, runtime } = funOptions

    this._env = env
    this._handlerName = handlerName
    this._handlerPath = handlerPath
    this._runtime = runtime
  }

  // no-op
  // () => void
  cleanup() {}

  _parsePayload(value) {
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
        return json.__offline_payload__
      }
    }

    return undefined
  }

  // invokeLocalPython, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L410
  // invoke.py, copy/pasted entirely as is:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/invoke.py
  async _invokeLocalPython(event, context) {
    const runtime = platform() === 'win32' ? 'python.exe' : this._runtime

    const input = stringify({
      context,
      event,
    })

    if (process.env.VIRTUAL_ENV) {
      const runtimeDir = platform() === 'win32' ? 'Scripts' : 'bin'
      process.env.PATH = [
        join(process.env.VIRTUAL_ENV, runtimeDir),
        delimiter,
        process.env.PATH,
      ].join('')
    }

    const [pythonExecutable] = runtime.split('.')

    const python = execa(
      pythonExecutable,
      [
        '-u',
        resolve(__dirname, 'invoke.py'),
        relative(cwd(), this._handlerPath),
        this._handlerName,
      ],
      {
        env: this._env,
        input,
        // shell: true,
      },
    )

    let result

    try {
      result = await python
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

  // invokeLocalRuby, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L556
  // invoke.rb, copy/pasted entirely as is:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/invoke.rb
  async _invokeLocalRuby(event, context) {
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

    const ruby = execa(
      runtime,
      [
        resolve(__dirname, 'invoke.rb'),
        relative(cwd(), this._handlerPath),
        this._handlerName,
      ],
      {
        env: this._env,
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

  run(event, context) {
    if (supportedPython.has(this._runtime)) {
      return this._invokeLocalPython(event, context)
    }

    if (supportedRuby.has(this._runtime)) {
      return this._invokeLocalRuby(event, context)
    }

    // TODO FIXME
    throw new Error('Unsupported runtime')
  }
}
