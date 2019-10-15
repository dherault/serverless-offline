let serverlessOffline

export async function setup(options) {
  const { servicePath } = options

  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  // require lazy, AWS tests will execute faster
  const { default: Serverless } = await import('serverless')

  const serverless = new Serverless({ servicePath })

  await serverless.init()
  serverless.processedInput.commands = ['offline', 'start']
  await serverless.run()

  serverlessOffline = serverless.pluginManager.plugins.find(
    (item) => item.constructor.name === 'ServerlessOffline',
  )
}

export async function teardown() {
  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  await serverlessOffline.end(true)
}
