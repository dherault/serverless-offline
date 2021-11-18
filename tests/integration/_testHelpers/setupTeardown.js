import { node } from 'execa'
import { resolve } from 'path'

let serverlessProcess

const serverlessPath = resolve(
  __dirname,
  '../../../node_modules/serverless/bin/serverless',
)

export async function setup(options) {
  const { args = [], servicePath } = options

  if (RUN_TEST_AGAINST_AWS) {
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
      stdData += data
    })
    serverlessProcess.stdout.on('data', (data) => {
      stdData += data
      if (String(data).includes('[HTTP] server ready')) {
        res()
      }
    })
  })
}

export async function teardown() {
  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  serverlessProcess.cancel()

  await serverlessProcess
}
