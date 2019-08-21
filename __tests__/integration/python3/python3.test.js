'use strict'

const { platform } = require('os')
const { resolve } = require('path')
const { URL } = require('url')
const fetch = require('node-fetch')
const Serverless = require('serverless')
const ServerlessOffline = require('../../../src/ServerlessOffline.js')
const { detectPython3 } = require('../../../src/utils/index.js')

jest.setTimeout(60000)

describe('Python 3 tests', () => {
  let serverlessOffline

  if (platform() === 'win32') {
    it.only("skipping 'Python' tests on Windows for now.", () => {})
  }

  if (!detectPython3()) {
    it.only("Could not find 'Python 3' executable, skipping 'Python' tests.", () => {})
  }

  // init
  beforeAll(async () => {
    const serverless = new Serverless({
      servicePath: resolve(__dirname),
    })
    await serverless.init()
    serverless.processedInput.commands = ['offline', 'start']
    await serverless.run()
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
      description: 'should work with python 3',
      expected: {
        message: 'Hello Python 3!',
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
