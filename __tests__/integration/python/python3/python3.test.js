'use strict'

const { platform } = require('os')
const { resolve } = require('path')
const { URL } = require('url')
const fetch = require('node-fetch')
const { setup, teardown } = require('../../_setupTeardown/index.js')
const { detectPython3 } = require('../../../../src/utils/index.js')

const { AWS_ENPOINT } = process.env
const skip = AWS_ENPOINT != null

jest.setTimeout(60000)

describe('Python 3 tests', () => {
  if (platform() === 'win32') {
    it.only("skipping 'Python' tests on Windows for now.", () => {})
  }

  if (!detectPython3()) {
    it.only("Could not find 'Python 3' executable, skipping 'Python' tests.", () => {})
  }

  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
      skip,
    }),
  )

  // cleanup
  afterAll(() => teardown({ skip }))

  const url = new URL(AWS_ENPOINT || 'http://localhost:3000')

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
