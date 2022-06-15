import assert from 'node:assert'
import { platform } from 'node:os'
import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

// skipping 'Python 3' tests on Windows for now.
// Could not find 'Python 3' executable, skipping 'Python' tests.
const _describe =
  env.PYTHON3_DETECTED && platform() !== 'win32' ? describe : describe.skip

_describe('Python 3 tests', function desc() {
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
      description: 'should work with python in a module',
      expected: {
        message: 'Hello Python Module!',
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
