import { EOL } from 'os'
import { promises as fsPromises } from 'fs'
import { sep, resolve, parse as pathParse } from 'path'
import execa, { sync } from 'execa'

const { writeFile, readFile, mkdir, rmdir } = fsPromises
const { parse, stringify } = JSON
const { cwd } = process

const PAYLOAD_IDENTIFIER = 'offline_payload'

export default class GoRunner {
  #env = null
  #handlerPath = null
  #tmpPath = null
  #tmpFile = null
  #goEnv = null

  constructor(funOptions, env, v3Utils) {
    const { handlerPath } = funOptions

    this.#env = env
    this.#handlerPath = handlerPath

    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }

    // Make sure we have the mock-lambda runner
    sync('go', ['get', 'github.com/icarus-sullivan/mock-lambda@e065469'])
  }

  async cleanup() {
    try {
      await rmdir(this.#tmpPath, { recursive: true })
    } catch (e) {
      // @ignore
    }

    this.#tmpFile = null
    this.#tmpPath = null
  }

  _parsePayload(value) {
    const log = []
    let payload

    for (const item of value.split(EOL)) {
      if (item.indexOf(PAYLOAD_IDENTIFIER) === -1) {
        log.push(item)
      } else if (item.indexOf(PAYLOAD_IDENTIFIER) !== -1) {
        try {
          const {
            offline_payload: { success, error },
          } = parse(item)
          if (success) {
            payload = success
          } else if (error) {
            payload = error
          }
        } catch (err) {
          // @ignore
        }
      }
    }

    // Log to console in case engineers want to see the rest of the info
    if (this.log) {
      this.log(log.join(EOL))
    } else {
      console.log(log.join(EOL))
    }

    return payload
  }

  async run(event, context) {
    const { dir } = pathParse(this.#handlerPath)
    const handlerCodeRoot = dir.split(sep).slice(0, -1).join(sep)
    const handlerCode = await readFile(`${this.#handlerPath}.go`, 'utf8')
    this.#tmpPath = resolve(handlerCodeRoot, 'tmp')
    this.#tmpFile = resolve(this.#tmpPath, 'main.go')

    const out = handlerCode.replace(
      '"github.com/aws/aws-lambda-go/lambda"',
      'lambda "github.com/icarus-sullivan/mock-lambda"',
    )

    try {
      await mkdir(this.#tmpPath, { recursive: true })
    } catch (e) {
      // @ignore
    }

    try {
      await writeFile(this.#tmpFile, out, 'utf8')
    } catch (e) {
      // @ignore
    }

    // Get go env to run this locally
    if (!this.#goEnv) {
      const goEnvResponse = await execa('go', ['env'], {
        stdio: 'pipe',
        encoding: 'utf-8',
      })

      const goEnvString = goEnvResponse.stdout || goEnvResponse.stderr
      this.#goEnv = goEnvString.split(EOL).reduce((a, b) => {
        const [k, v] = b.split('="')
        // eslint-disable-next-line no-param-reassign
        a[k] = v ? v.slice(0, -1) : ''
        return a
      }, {})
    }

    // Remove our root, since we want to invoke go relatively
    const cwdPath = `${this.#tmpFile}`.replace(`${cwd()}${sep}`, '')
    const { stdout, stderr } = await execa(`go`, ['run', cwdPath], {
      stdio: 'pipe',
      env: {
        ...this.#env,
        ...this.#goEnv,
        AWS_LAMBDA_LOG_GROUP_NAME: context.logGroupName,
        AWS_LAMBDA_LOG_STREAM_NAME: context.logStreamName,
        AWS_LAMBDA_FUNCTION_NAME: context.functionName,
        AWS_LAMBDA_FUNCTION_MEMORY_SIZE: context.memoryLimitInMB,
        AWS_LAMBDA_FUNCTION_VERSION: context.functionVersion,
        LAMBDA_EVENT: stringify(event),
        LAMBDA_TEST_EVENT: `${event}`,
        LAMBDA_CONTEXT: stringify(context),
        IS_LAMBDA_AUTHORIZER:
          event.type === 'REQUEST' || event.type === 'TOKEN',
        IS_LAMBDA_REQUEST_AUTHORIZER: event.type === 'REQUEST',
        IS_LAMBDA_TOKEN_AUTHORIZER: event.type === 'TOKEN',
        PATH: process.env.PATH,
      },
      encoding: 'utf-8',
    })

    // Clean up after we created the temporary file
    await this.cleanup()

    if (stderr) {
      return stderr
    }

    return this._parsePayload(stdout)
  }
}
