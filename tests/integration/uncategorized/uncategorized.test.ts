// @ts-nocheck

import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index'

jest.setTimeout(30000)

describe('uncategorized tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  // issue: https://github.com/dherault/serverless-offline/issues/756
  // PR: https://github.com/dherault/serverless-offline/pull/757
  test('Uncategorized 1', async () => {
    const url = joinUrl(TEST_BASE_URL, '/uncategorized-1')
    const response = await fetch(url)
    const json = await response.json()

    expect(json).toEqual({ foo: 'bar' })
  })

  // issue: https://github.com/dherault/serverless-offline/issues/758
  // PR: https://github.com/dherault/serverless-offline/pull/759
  test('Uncategorized 2', async () => {
    const url = joinUrl(TEST_BASE_URL, '/uncategorized-2')
    const response = await fetch(url)
    const json = await response.json()

    expect(json).toEqual({ foo: 'bar' })
  })
})
