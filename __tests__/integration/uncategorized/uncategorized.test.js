'use strict'

const { resolve } = require('path')
const fetch = require('node-fetch')
const { joinUrl, setup, teardown } = require('../_setupTeardown/index.js')

const { AWS_ENDPOINT } = process.env
const skip = AWS_ENDPOINT != null
const baseUrl = AWS_ENDPOINT || 'http://localhost:3000'

jest.setTimeout(30000)

describe('uncategorized tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
      skip,
    }),
  )

  // cleanup
  afterAll(() => teardown({ skip }))

  // issue: https://github.com/dherault/serverless-offline/issues/756
  // PR: https://github.com/dherault/serverless-offline/pull/757
  test('Uncategorized 1', async () => {
    const url = joinUrl(baseUrl, '/uncategorized-1')
    const response = await fetch(url)
    const json = await response.json()

    expect(json).toEqual({ foo: 'bar' })
  })

  // issue: https://github.com/dherault/serverless-offline/issues/758
  // PR: https://github.com/dherault/serverless-offline/pull/759
  test('Uncategorized 2', async () => {
    const url = joinUrl(baseUrl, '/uncategorized-2')
    const response = await fetch(url)
    const json = await response.json()

    expect(json).toEqual({ foo: 'bar' })
  })
})
