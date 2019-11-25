import { resolve } from 'path'
import { node } from 'execa'

const childProcessHelperPath = resolve(__dirname, 'childProcessHelper')

export default class ChildProcessRunner {
  private readonly _env: NodeJS.ProcessEnv
  private readonly _functionKey: string
  private readonly _handlerName: string
  private readonly _handlerPath: string
  private readonly _timeout: number

  constructor(funOptions, env: NodeJS.ProcessEnv) {
    const { functionKey, handlerName, handlerPath, timeout } = funOptions

    this._env = env
    this._functionKey = functionKey
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
      [this._functionKey, this._handlerName, this._handlerPath],
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
