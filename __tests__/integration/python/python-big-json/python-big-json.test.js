'use strict'

const { platform } = require('os')
const { resolve } = require('path')
const fetch = require('node-fetch')
const { joinUrl, setup, teardown } = require('../../_testHelpers/index.js')
const { detectPython3 } = require('../../../../src/utils/index.js')

const { AWS_ENDPOINT } = process.env
const skip = AWS_ENDPOINT != null
const baseUrl = AWS_ENDPOINT || 'http://localhost:3000'

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
      path: '/hello',
    },
  ].forEach(({ description, expected, path }) => {
    test(description, async () => {
      const url = joinUrl(baseUrl, path)
      const response = await fetch(url)
      const json = await response.json()

      expect(json).toEqual(expected)
    })
  })
})
