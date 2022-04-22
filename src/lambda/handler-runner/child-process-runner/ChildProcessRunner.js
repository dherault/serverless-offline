import path from 'path'
import { node } from 'execa'

const childProcessHelperPath = path.resolve(__dirname, 'childProcessHelper.js')

export default class ChildProcessRunner {
  #env = null
  #functionKey = null
  #handlerName = null
  #handlerPath = null
  #handlerModuleNesting = null
  #timeout = null
  #allowCache = false

  constructor(funOptions, env, allowCache, v3Utils) {
    const {
      functionKey,
      handlerName,
      handlerPath,
      handlerModuleNesting,
      timeout,
    } = funOptions

    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }

    this.#env = env
    this.#functionKey = functionKey
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#handlerModuleNesting = handlerModuleNesting
    this.#timeout = timeout
    this.#allowCache = allowCache
  }

  // no-op
  // () => void
  cleanup() {}

  async run(event, context) {
    const childProcess = node(
      childProcessHelperPath,
      [
        this.#functionKey,
        this.#handlerName,
        this.#handlerPath,
        this.#handlerModuleNesting,
      ],
      {
        env: this.#env,
        stdio: 'inherit',
      },
    )

    const message = new Promise((resolve, reject) => {
      childProcess.on('message', (data) => {
        if (data.error) reject(data.error)
        else resolve(data.result)
      })
    }).finally(() => {
      childProcess.kill()
    })

    childProcess.send({
      context,
      event,
      allowCache: this.#allowCache,
      timeout: this.#timeout,
    })

    let result

    try {
      result = await message
    } catch (err) {
      // TODO
      if (this.log) {
        this.log.error(err)
      } else {
        console.log(err)
      }

      throw err
    }

    return result
  }
}
