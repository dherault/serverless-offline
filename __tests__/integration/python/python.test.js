'use strict'

const { resolve } = require('path')
const { URL } = require('url')
const fetch = require('node-fetch')
const Serverless = require('serverless')
const ServerlessOffline = require('../../../src/ServerlessOffline.js')
const { detectPython } = require('../../../src/utils/index.js')

jest.setTimeout(60000)

describe('Python tests', () => {
  let serverlessOffline

  if (detectPython()) {
    it.only("Could not find 'Python', skipping 'Python' tests.", () => {})
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

  ;[
    {
      description: 'should work with python',
      expected: {
        message: 'Hello Python!',
      },
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
