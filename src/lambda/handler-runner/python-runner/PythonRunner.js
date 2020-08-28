import { EOL, platform } from 'os'
import { delimiter, join, relative, resolve } from 'path'
import { spawn } from 'child_process'
import extend from 'extend'
import readline from 'readline'

const { parse, stringify } = JSON
const { cwd } = process
const { has } = Reflect

export default class PythonRunner {
  #env = null
  #handlerName = null
  #handlerPath = null
  #runtime = null
  #allowCache = false

  constructor(funOptions, env, allowCache) {
    const { handlerName, handlerPath, runtime } = funOptions

    this.#env = env
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#runtime = platform() === 'win32' ? 'python.exe' : runtime
    this.#allowCache = allowCache

    if (process.env.VIRTUAL_ENV) {
      const runtimeDir = platform() === 'win32' ? 'Scripts' : 'bin'
      process.env.PATH = [
        join(process.env.VIRTUAL_ENV, runtimeDir),
        delimiter,
        process.env.PATH,
      ].join('')
    }

    const [pythonExecutable] = this.#runtime.split('.')

    this.handlerProcess = spawn(
      pythonExecutable,
      [
        '-u',
        resolve(__dirname, 'invoke.py'),
        relative(cwd(), this.#handlerPath),
        this.#handlerName,
      ],
      {
        env: extend(process.env, this.#env),
        shell: true,
      },
    )

    this.handlerProcess.stdout.readline = readline.createInterface({
      input: this.handlerProcess.stdout,
    })
  }

  // () => void
  cleanup() {
    this.handlerProcess.kill()
  }

  _parsePayload(value) {
    let payload

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
        payload = json.__offline_payload__
        // everything else is print(), logging, ...
      } else {
        console.log(item)
      }
    }

    return payload
  }

  // invokeLocalPython, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L410
  // invoke.py, based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/invoke.py
  async run(event, context) {
    return new Promise((accept, reject) => {
      const input = stringify({
        context,
        event,
        allowCache: this.#allowCache,
      })

      const onErr = (data) => {
        // TODO
        console.log(data.toString())
      }

      const onLine = (line) => {
        try {
          const parsed = this._parsePayload(line.toString())
          if (parsed) {
            this.handlerProcess.stdout.readline.removeListener('line', onLine)
            this.handlerProcess.stderr.removeListener('data', onErr)
            return accept(parsed)
          }
          return null
        } catch (err) {
          return reject(err)
        }
      }

      this.handlerProcess.stdout.readline.on('line', onLine)
      this.handlerProcess.stderr.on('data', onErr)

      process.nextTick(() => {
        this.handlerProcess.stdin.write(input)
        this.handlerProcess.stdin.write('\n')
      })
    })
  }
}
