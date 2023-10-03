import { mkdir, readFile, rm, rmdir, writeFile } from 'node:fs/promises'
import { EOL } from 'node:os'
import process, { chdir, cwd } from 'node:process'
import { parse as pathParse, resolve, sep } from 'node:path'
import { log } from '@serverless/utils/log.js'
import { execa } from 'execa'
import { splitHandlerPathAndName } from '../../../utils/index.js'

const { parse, stringify } = JSON

export default class GoRunner {
  static #payloadIdentifier = 'offline_payload'

  #codeDir = null

  #env = null

  #goEnv = null

  #handlerPath = null

  #tmpFile = null

  #tmpPath = null

  constructor(funOptions, env) {
    const { handler, codeDir } = funOptions
    const [handlerPath] = splitHandlerPathAndName(handler)

    this.#codeDir = codeDir
    this.#env = env
    this.#handlerPath = handlerPath
  }

  async cleanup() {
    try {
      // refresh go.mod
      await rm(this.#tmpFile)
      await execa('go', ['mod', 'tidy'])

      if (this.workspace && this.#tmpPath) {
        const workPath = `${this.#codeDir}/go.work`
        const workFile = await readFile(workPath, 'utf8')

        const out = workFile.replace(this.#tmpPath, '')

        try {
          await writeFile(workPath, out, 'utf8')
        } catch {
          // @ignore
        }

        await execa('go', ['work', 'sync'])
      }

      await rmdir(this.#tmpPath, {
        recursive: true,
      })
    } catch {
      // @ignore
    }

    this.#tmpFile = null
    this.#tmpPath = null
  }

  #parsePayload(value) {
    const logs = []
    let payload

    for (const item of value.split(EOL)) {
      if (item.includes(GoRunner.#payloadIdentifier)) {
        try {
          const {
            [GoRunner.#payloadIdentifier]: { error, success },
          } = parse(item)

          if (success) {
            payload = success
          } else if (error) {
            payload = error
          }
        } catch {
          // @ignore
        }
      } else {
        logs.push(item)
      }
    }

    // Log to console in case engineers want to see the rest of the info
    log(logs.join(EOL))

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
    } catch {
      // @ignore
    }

    try {
      await writeFile(this.#tmpFile, out, 'utf8')
    } catch {
      // @ignore
    }

    // Get go env to run this locally
    if (!this.#goEnv) {
      const goEnvResponse = await execa('go', ['env'], {
        encoding: 'utf8',
        stdio: 'pipe',
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

    try {
      chdir(cwdPath.substring(0, cwdPath.indexOf('main.go')))

      if (this.workspace) {
        /**
         * We need to initialize the module, as in the case of a workspace it will not already exist
         */
        await execa('go', ['mod', 'init', 'tmp'])
        await execa('go', ['work', 'use', this.#tmpPath])
      }

      // Make sure we have the mock-lambda runner
      await execa('go', [
        'get',
        'github.com/icarus-sullivan/mock-lambda@e065469',
      ])
      await execa('go', ['build'])
    } catch {
      // @ignore
    }

    const { stdout, stderr } = await execa(`./tmp`, {
      encoding: 'utf8',
      env: {
        ...this.#env,
        ...this.#goEnv,
        AWS_LAMBDA_FUNCTION_MEMORY_SIZE: context.memoryLimitInMB,
        AWS_LAMBDA_FUNCTION_NAME: context.functionName,
        AWS_LAMBDA_FUNCTION_VERSION: context.functionVersion,
        AWS_LAMBDA_LOG_GROUP_NAME: context.logGroupName,
        AWS_LAMBDA_LOG_STREAM_NAME: context.logStreamName,
        IS_LAMBDA_AUTHORIZER:
          event.type === 'REQUEST' || event.type === 'TOKEN',
        IS_LAMBDA_REQUEST_AUTHORIZER: event.type === 'REQUEST',
        IS_LAMBDA_TOKEN_AUTHORIZER: event.type === 'TOKEN',
        LAMBDA_CONTEXT: stringify(context),
        LAMBDA_EVENT: stringify(event),
        LAMBDA_TEST_EVENT: `${event}`,
        PATH: process.env.PATH,
      },
      stdio: 'pipe',
    })

    await this.cleanup()

    if (stderr) {
      return stderr
    }

    try {
      chdir(this.#codeDir)
    } catch {
      // @ignore
    }

    return this.#parsePayload(stdout)
  }

  get workspace() {
    return this.#goEnv.GOWORK && this.#goEnv.GOWORK.length > 0
  }
}
