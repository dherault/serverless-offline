import { spawn } from 'node:child_process'
import { EOL, platform } from 'node:os'
import { delimiter, dirname, join, relative, resolve } from 'node:path'
import process, { cwd } from 'node:process'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'
import { log } from '@serverless/utils/log.js'

const { parse, stringify } = JSON
const { assign, hasOwn } = Object

const __dirname = dirname(fileURLToPath(import.meta.url))

export default class PythonRunner {
  static #payloadIdentifier = '__offline_payload__'

  #env = null

  #handlerName = null

  #handlerPath = null

  #runtime = null

  constructor(funOptions, env) {
    const { handlerName, handlerPath, runtime } = funOptions

    this.#env = env
    this.#handlerName = handlerName
    this.#handlerPath = handlerPath
    this.#runtime = platform() === 'win32' ? 'python.exe' : runtime

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
        env: assign(process.env, this.#env),
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

  #parsePayload(value) {
    let payload

    for (const item of value.split(EOL)) {
      let json

      // first check if it's JSON
      try {
        json = parse(item)
        // nope, it's not JSON
      } catch {
        // no-op
      }

      // now let's see if we have a property __offline_payload__
      if (
        json &&
        typeof json === 'object' &&
        hasOwn(json, PythonRunner.#payloadIdentifier)
      ) {
        payload = json[PythonRunner.#payloadIdentifier]
        // everything else is print(), logging, ...
      } else {
        log.notice(item)
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
      })

      const onErr = (data) => {
        // TODO

        log.notice(data.toString())
      }

      const onLine = (line) => {
        try {
          const parsed = this.#parsePayload(line.toString())
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
