'use strict'

const { resolve } = require('path')
const fetch = require('node-fetch')
const { joinUrl, setup, teardown } = require('../_setupTeardown/index.js')
const { detectRuby } = require('../../../src/utils/index.js')

const { AWS_ENDPOINT } = process.env
const skip = AWS_ENDPOINT != null
const baseUrl = AWS_ENDPOINT || 'http://localhost:3000'

jest.setTimeout(60000)

describe('Ruby tests', () => {
  if (!detectRuby()) {
    it.only("Could not find 'Ruby', skipping 'Ruby' tests.", () => {})
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
  ;[
    {
      description: 'should work with ruby',
      expected: {
        message: 'Hello Ruby!',
      },
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
