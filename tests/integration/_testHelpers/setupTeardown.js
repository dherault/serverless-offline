import { dirname, resolve } from 'node:path'
import process, { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { node } from 'execa'

let serverlessProcess

const __dirname = dirname(fileURLToPath(import.meta.url))

const serverlessPath = resolve(
  __dirname,
  '../../../node_modules/serverless/bin/serverless',
)

const shouldPrintOfflineOutput = env.PRINT_OFFLINE_OUTPUT

export async function setup(options) {
  const { args = [], servicePath } = options

  if (env.RUN_TEST_AGAINST_AWS) {
    return
  }

  serverlessProcess = node(serverlessPath, ['offline', 'start', ...args], {
    cwd: servicePath,
  })

  await new Promise((res, reject) => {
    let stdData = ''
    serverlessProcess.on('close', (code) => {
      if (code) {
        console.error(`Output: ${stdData}`)
        reject(new Error('serverless offline crashed'))
      } else {
        reject(new Error('serverless offline ended prematurely'))
      }
    })
    serverlessProcess.stderr.on('data', (data) => {
      if (shouldPrintOfflineOutput) process._rawDebug(String(data))
      stdData += data
      if (String(data).includes('Server ready:')) {
        res()
      }
    })
    serverlessProcess.stdout.on('data', (data) => {
      if (shouldPrintOfflineOutput) process._rawDebug(String(data))
      stdData += data
      if (String(data).includes('Server ready:')) {
        res()
      }
    })
  })
}

export async function teardown() {
  if (env.RUN_TEST_AGAINST_AWS) {
    return
  }

  serverlessProcess.cancel()

  try {
    await serverlessProcess
  } catch {
    //
  }
}
