import path from 'node:path'
import { execaNode } from 'execa'

const childProcessHelperPath = path.resolve(__dirname, 'childProcessHelper.js')

export default class ChildProcessRunner {
  #allowCache = false
  #env = null
  #functionKey = null
  #handlerName = null
  #handlerPath = null
  #timeout = null

  constructor(funOptions, env, allowCache, v3Utils) {
    const { functionKey, handlerName, handlerPath, timeout } = funOptions

    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }

    this.#allowCache = allowCache
    this.#env = env
    this.#functionKey = functionKey
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#timeout = timeout
  }

  // no-op
  // () => void
  cleanup() {}

  async run(event, context) {
    const childProcess = execaNode(
      childProcessHelperPath,
      [this.#functionKey, this.#handlerName, this.#handlerPath],
      {
        env: this.#env,
        stdio: 'inherit',
      },
    )

    const message = new Promise((resolve, reject) => {
      childProcess.on('message', (data) => {
        if (data.error) reject(data.error)
        else resolve(data)
      })
    }).finally(() => {
      childProcess.kill()
    })

    childProcess.send({
      allowCache: this.#allowCache,
      context,
      event,
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
