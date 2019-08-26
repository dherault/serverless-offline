'use strict'

let serverlessOffline

exports.setup = async function setup(options) {
  const { servicePath } = options

  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  // require lazy, AWS tests will execute faster
  const Serverless = require('serverless') // eslint-disable-line global-require
  const ServerlessOffline = require('../../../src/ServerlessOffline.js') // eslint-disable-line global-require

  const serverless = new Serverless({ servicePath })

  await serverless.init()
  serverless.processedInput.commands = ['offline', 'start']
  await serverless.run()
  serverlessOffline = new ServerlessOffline(serverless, {})

  await serverlessOffline.start()
}

exports.teardown = async function teardown() {
  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  await serverlessOffline.end()
}
