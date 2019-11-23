import { node } from 'execa'
import { resolve } from 'path'

let serverlessProcess

const serverlessPath = resolve(
  __dirname,
  '../../../node_modules/serverless/bin/serverless',
)

export async function setup(options) {
  const { servicePath } = options

  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  serverlessProcess = node(serverlessPath, ['offline', 'start'], {
    cwd: servicePath,
  })

  await new Promise((res) => {
    serverlessProcess.stdout.on('data', (data) => {
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
