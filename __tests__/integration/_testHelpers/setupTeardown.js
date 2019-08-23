'use strict'

const Serverless = require('serverless')
const ServerlessOffline = require('../../../src/ServerlessOffline.js')

let serverlessOffline

exports.setup = async function setup(options) {
  const { servicePath } = options

  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  const serverless = new Serverless({ servicePath })

  await serverless.init()
  serverless.processedInput.commands = ['offline', 'start']
  await serverless.run()
  serverlessOffline = new ServerlessOffline(serverless, {})

  return serverlessOffline.start()
}

exports.teardown = async function teardown() {
  if (RUN_TEST_AGAINST_AWS) {
    return
  }

  return serverlessOffline.end()
}
