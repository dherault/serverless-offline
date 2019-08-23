'use strict'

const { URL } = require('url')
const Serverless = require('serverless')
const ServerlessOffline = require('../../../src/ServerlessOffline.js')

let serverlessOffline

exports.setup = async function setup(options) {
  const { servicePath, skip } = options

  if (skip) {
    return
  }

  const serverless = new Serverless({ servicePath })

  await serverless.init()
  serverless.processedInput.commands = ['offline', 'start']
  await serverless.run()
  serverlessOffline = new ServerlessOffline(serverless, {})

  return serverlessOffline.start()
}

exports.teardown = async function teardown(options) {
  const { skip } = options

  if (skip) {
    return
  }

  return serverlessOffline.end()
}

exports.joinUrl = function joinUrl(baseUrl, path) {
  const url = new URL(baseUrl)
  const { pathname } = url

  url.pathname = pathname === '/' ? path : `${pathname}${path}`

  return url
}
