'use strict'

const { resolve } = require('path')
const fetch = require('node-fetch')
const { joinUrl, setup, teardown } = require('../../_testHelpers/index.js')
const { detectPython3 } = require('../../../../src/utils/index.js')

jest.setTimeout(60000)

describe('Python 3 tests', () => {
  if (process.platform === 'win32') {
    it.only("skipping 'Python' tests on Windows for now.", () => {})
  }

  if (!detectPython3()) {
    it.only("Could not find 'Python 3' executable, skipping 'Python' tests.", () => {})
  }

  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())
  ;[
    // test case for: https://github.com/dherault/serverless-offline/issues/781
    {
      description: 'should work with python returning a big JSON structure',
      expected: Array.from(new Array(1000)).map((_, index) => ({
        a: index,
        b: true,
        c: 1234567890,
        d: 'foo',
      })),
      path: '/hello',
    },
  ].forEach(({ description, expected, path }) => {
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      expect(json).toEqual(expected)
    })
  })
})
