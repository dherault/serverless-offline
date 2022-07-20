import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Go 1.x with GoRunner', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should work with go1.x',
      expected: {
        message: 'Hello Go 1.x!',
      },
      path: '/dev/hello',
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async function it() {
      if (!env.GO1X_DETECTED) {
        this.skip()
      }

      const url = joinUrl(env.TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
