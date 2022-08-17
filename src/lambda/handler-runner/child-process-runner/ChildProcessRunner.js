import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { log } from '@serverless/utils/log.js'
import { execaNode } from 'execa'

const __dirname = dirname(fileURLToPath(import.meta.url))
const childProcessHelperPath = resolve(__dirname, 'childProcessHelper.js')

export default class ChildProcessRunner {
  #codeDir = null

  #env = null

  #functionKey = null

  #handler = null

  #servicePath = null

  #timeout = null

  constructor(funOptions, env) {
    const { codeDir, functionKey, handler, servicePath, timeout } = funOptions

    this.#codeDir = codeDir
    this.#env = env
    this.#functionKey = functionKey
    this.#handler = handler
    this.#servicePath = servicePath
    this.#timeout = timeout
  }

  // no-op
  // () => void
  cleanup() {}

  async run(event, context) {
    const childProcess = execaNode(
      childProcessHelperPath,
      [this.#functionKey, this.#handler, this.#servicePath, this.#codeDir],
      {
        env: this.#env,
        stdio: 'inherit',
      },
    )

    childProcess.send({
      context,
      event,
      timeout: this.#timeout,
    })

    let result

    try {
      result = await new Promise((res, rej) => {
        childProcess.on('message', (data) => {
          if (data.error) {
            rej(data.error)
            return
          }
          res(data.result)
        })
      })
    } catch (err) {
      // TODO
      log.error(err)
      throw err
    } finally {
      childProcess.kill()
    }

    return result
  }
}
