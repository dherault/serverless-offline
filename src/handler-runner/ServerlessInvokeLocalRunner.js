'use strict'

const { platform } = require('os')
const { delimiter, join, resolve, relative } = require('path')
const execa = require('execa')

const { parse, stringify } = JSON
const { cwd, env } = process

module.exports = class ServerlessInvokeLocalRunner {
  constructor(funOptions, stage) {
    // this._env = env  TODO
    this._funOptions = funOptions
    this._stage = stage
  }

  // no-op
  // () => void
  cleanup() {}

  // invokeLocalPython, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L410
  // invoke.py, copy/pasted entirely as is:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/invoke.py
  async _invokeLocalPython(event, context) {
    const { handlerName, handlerPath, runtime } = this._funOptions

    const input = stringify({
      event,
      context,
    })

    if (process.env.VIRTUAL_ENV) {
      const runtimeDir = platform() === 'win32' ? 'Scripts' : 'bin'
      env.PATH = [join(env.VIRTUAL_ENV, runtimeDir), delimiter, env.PATH].join(
        '',
      )
    }

    const [pythonExecutable] = runtime.split('.')

    const python = execa(
      pythonExecutable,
      [
        '-u',
        resolve(__dirname, 'invoke.py'),
        relative(cwd(), handlerPath),
        handlerName,
      ],
      {
        env,
        input,
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

    const { stderr: err, stdout: data } = result

    if (err) {
      // TODO
      console.log(err)

      return err
    }

    try {
      return parse(data)
    } catch (err) {
      // TODO
      console.log('No JSON')
    }
  }

  run(event, context) {
    return this._invokeLocalPython(event, context)
  }
}
