'use strict'

const { resolve } = require('path')
const { URL } = require('url')
const fetch = require('node-fetch')
const { setup, teardown } = require('../../_setupTeardown/index.js')
const { detectPython2 } = require('../../../../src/utils/index.js')

const { AWS_ENPOINT } = process.env
const skip = AWS_ENPOINT != null

jest.setTimeout(60000)

describe.skip('Python 2 tests', () => {
  if (!detectPython2()) {
    it.only("Could not find 'Python 2' executable, skipping 'Python' tests.", () => {})
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
      description: 'should work with python 2',
      expected: {
        message: 'Hello Python 2!',
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
