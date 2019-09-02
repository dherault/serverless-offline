import { resolve } from 'path'
import { node } from 'execa'

const childProcessHelperPath = resolve(__dirname, 'childProcessHelper.js')

export default class ChildProcessRunner {
  constructor(funOptions, env) {
    const { functionName, handlerName, handlerPath, timeout } = funOptions

    this._env = env
    this._functionName = functionName
    this._handlerName = handlerName
    this._handlerPath = handlerPath
    this._timeout = timeout
  }

  // no-op
  // () => void
  cleanup() {}

  async run(event, context) {
    const childProcess = node(
      childProcessHelperPath,
      [this._functionName, this._handlerName, this._handlerPath],
      {
        env: this._env,
      },
    )

    childProcess.send({
      context,
      event,
      timeout: this._timeout,
    })

    const message = new Promise((_resolve) => {
      childProcess.on('message', _resolve)
      // TODO
      // on error? on exit? ..
    })

    let result

    try {
      result = await message
    } catch (err) {
      // TODO
      console.log(err)

      throw err
    }

    return result
  }
}
