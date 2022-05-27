import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

// Could not find 'Python 2' executable, skipping 'Python' tests.
const _describe = env.PYTHON2_DETECTED ? describe : describe.skip

_describe('Python 2 tests', function desc() {
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
      description: 'should work with python 2',
      expected: {
        message: 'Hello Python 2!',
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
