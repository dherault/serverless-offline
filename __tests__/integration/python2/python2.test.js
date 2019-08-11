'use strict'

const { resolve } = require('path')
const { URL } = require('url')
const fetch = require('node-fetch')
const Serverless = require('serverless')
const ServerlessOffline = require('../../../src/ServerlessOffline.js')
const { detectPython2 } = require('../../../src/utils/index.js')

const endpoint = process.env.npm_config_endpoint

jest.setTimeout(60000)

describe('Python 2 tests', () => {
  let serverlessOffline

  if (!detectPython2()) {
    it.only("Could not find 'Python 2' executable, skipping 'Python' tests.", () => {})
  }

  // init
  beforeAll(async () => {
    if (endpoint) return // if test endpoint is define then don't setup a test endpoint

    const serverless = new Serverless()
    serverless.config.servicePath = resolve(__dirname)
    await serverless.init()
    serverlessOffline = new ServerlessOffline(serverless, {})

    return serverlessOffline.start()
  })

  // cleanup
  afterAll(async () => {
    if (endpoint) return // if test endpoint is define then there's no need for a clean up

    return serverlessOffline.end()
  })

  const url = new URL(endpoint || 'http://localhost:3000')
  const { pathname } = url

  ;[
    {
      description: 'should work with python 2',
      expected: {
        message: 'Hello Python 2!',
      },
      path: 'hello',
    },
  ].forEach(({ description, expected, path }) => {
    test(description, async () => {
      url.pathname = `${pathname}${pathname === '/' ? '' : '/'}${path}`
      const response = await fetch(url)
      const json = await response.json()
      expect(json).toEqual(expected)
    })
  })
})
