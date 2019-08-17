'use strict'

const { resolve } = require('path')
const { URL } = require('url')
const fetch = require('node-fetch')
const Serverless = require('serverless')
const ServerlessOffline = require('../../../src/ServerlessOffline.js')
const { detectPython3 } = require('../../../src/utils/index.js')

jest.setTimeout(60000)

describe('Python 3 tests', () => {
  let serverlessOffline

  if (!detectPython3()) {
    it.only("Could not find 'Python 3' executable, skipping 'Python' tests.", () => {})
  }

  // init
  beforeAll(async () => {
    const serverless = new Serverless()
    serverless.config.servicePath = resolve(__dirname)
    await serverless.init()
    serverlessOffline = new ServerlessOffline(serverless, {})

    return serverlessOffline.start()
  })

  // cleanup
  afterAll(async () => {
    return serverlessOffline.end()
  })

  const url = new URL('http://localhost:3000')

  const expected = Array.from(new Array(1000)).map((_, index) => ({
    a: index,
    b: true,
    c: 1234567890,
    d: 'foo',
  }))

  ;[
    // test case for: https://github.com/dherault/serverless-offline/issues/781
    {
      description: 'should work with python returning a big JSON structure',
      expected,
      path: 'hello',
    },
  ].forEach(({ description, expected, path }) => {
    test(description, async () => {
      url.pathname = path
      const response = await fetch(url)
      const json = await response.json()
      expect(json).toEqual(expected)
    })
  })
})
