import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

// Could not find 'Ruby', skipping 'Ruby' tests.
const _describe = env.RUBY_DETECTED ? describe : describe.skip

_describe('Ruby tests', function desc() {
  this.timeout(60000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should work with ruby',
      expected: {
        message: 'Hello Ruby!',
      },
      path: '/dev/hello',
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
