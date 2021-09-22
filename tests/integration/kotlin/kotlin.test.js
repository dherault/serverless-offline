import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(120000)

// Could not find 'Java', skipping 'Java' tests.
const _describe = process.env.JAVA_DETECTED ? describe : describe.skip

_describe('Kotlin tests', () => {
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
      description: 'should work with kotlin',
      expected: {
        message: 'Go Serverless v1.x! Your function executed successfully!',
      },
      path: '/dev/hello',
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
