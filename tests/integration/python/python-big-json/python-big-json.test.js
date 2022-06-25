import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Python 3 tests', function desc() {
  this.timeout(60000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())
  ;[
    // test case for: https://github.com/dherault/serverless-offline/issues/781
    {
      description: 'should work with python returning a big JSON structure',
      expected: Array.from(new Array(1000)).map((_, index) => ({
        a: index,
        b: true,
        c: 1234567890,
        d: 'foo',
      })),
      path: '/dev/hello',
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async function it() {
      // Could not find 'Python 3' executable, skipping 'Python' tests.
      if (!env.PYTHON3_DETECTED) {
        this.skip()
      }

      const url = joinUrl(env.TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
