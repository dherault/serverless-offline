let serverlessOffline

export async function setup(options) {
  const { servicePath } = options

  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  // require lazy, AWS tests will execute faster
  const { default: Serverless } = await import('serverless')
  const { default: ServerlessOffline } = await import(
    '../../../src/ServerlessOffline.js'
  )

  const serverless = new Serverless({ servicePath })

  await serverless.init()
  serverless.processedInput.commands = ['offline', 'start']
  await serverless.run()
  serverlessOffline = new ServerlessOffline(serverless, {})

  await serverlessOffline.start()
}

export async function teardown() {
  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  await serverlessOffline.end()
}
