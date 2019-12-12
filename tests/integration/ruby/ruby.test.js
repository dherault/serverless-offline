import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(60000)

// Could not find 'Ruby', skipping 'Ruby' tests.
const _describe = process.env.RUBY_DETECTED ? describe : describe.skip

_describe('Ruby tests', () => {
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
      description: 'should work with ruby',
      expected: {
        message: 'Hello Ruby!',
      },
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
