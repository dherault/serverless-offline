import { resolve } from 'path'
import { node } from 'execa'

const childProcessHelperPath = resolve(__dirname, 'childProcessHelper.js')

export default class ChildProcessRunner {
  #env = null
  #functionKey = null
  #handlerName = null
  #handlerPath = null
  #timeout = null
  #allowCache = false
  #options = null

  constructor(funOptions, env, allowCache, options) {
    const { functionKey, handlerName, handlerPath, timeout } = funOptions

    this.#env = env
    this.#functionKey = functionKey
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#timeout = timeout
    this.#allowCache = allowCache
    this.#options = options
  }

  // no-op
  // () => void
  cleanup() {}

  async run(event, context) {
    const handlerPath = this.#options?.overrideCodeDir ?? this.#handlerPath

    const childProcess = node(
      childProcessHelperPath,
      [this.#functionKey, this.#handlerName, handlerPath],
      {
        env: this.#env,
        stdio: 'inherit',
      },
    )

    childProcess.send({
      context,
      event,
      allowCache: this.#allowCache,
      timeout: this.#timeout,
      options: this.#options,
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
