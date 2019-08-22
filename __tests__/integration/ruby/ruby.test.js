'use strict'

const { resolve } = require('path')
const { URL } = require('url')
const fetch = require('node-fetch')
const { setup, teardown } = require('../_setupTeardown/index.js')
const { detectRuby } = require('../../../src/utils/index.js')

const { AWS_ENPOINT } = process.env
const skip = AWS_ENPOINT != null

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

  const url = new URL(AWS_ENPOINT || 'http://localhost:3000')
  const { pathname } = url

  ;[
    {
      description: 'should work with ruby',
      expected: {
        message: 'Hello Ruby!',
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
