let serverless

export async function setup(options) {
  const { servicePath } = options

  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  // require lazy, AWS tests will execute faster
  const { default: Serverless } = await import('serverless')

  const { argv } = process

  // just areally hacky way to pass options
  process.argv = [
    '', // '/bin/node',
    '', // '/serverless-offline/node_modules/.bin/serverless',
    'offline',
    'start',
  ]

  serverless = new Serverless({ servicePath })

  await serverless.init()
  await serverless.run()

  // set to original
  process.argv = argv
}

export async function teardown() {
  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  const { plugins } = serverless.pluginManager

  const serverlessOffline = plugins.find(
    (item) => item.constructor.name === 'ServerlessOffline',
  )

  await serverlessOffline.end(true)
}
