import { resolve } from 'node:path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(30000)

describe('Lambda.invokeAsync tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  //
  ;[
    {
      description: '...',
      expected: {
        Status: 200,
      },
      path: '/dev/invoke-async',
      status: 200,
    },
  ].forEach(({ description, expected, path, status }) => {
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)

      const response = await fetch(url)
      expect(response.status).toEqual(status)

      const json = await response.json()
      expect(json).toEqual(expected)
    })
  })
})
