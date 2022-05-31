import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('handler extensions', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      noPrependStageInUrl: false,
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should prefer js handler',
      expected: 'js',
      path: '/dev/handle',
      status: 200,
    },

    {
      description: 'should resolve to mjs handler',
      expected: 'mjs',
      path: '/dev/handle-mjs',
      status: 200,
    },

    {
      description: 'should resolve to cjs handler',
      expected: 'cjs',
      path: '/dev/handle-cjs',
      status: 200,
    },

    {
      description: 'should resolve to ts handler',
      expected: 'ts',
      path: '/dev/handle-ts',
      status: 200,
    },
  ].forEach(({ description, expected, path, status }) => {
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)

      const response = await fetch(url)
      assert.equal(response.status, status)

      if (expected) {
        const json = await response.json()
        assert.deepEqual(json, expected)
      }
    })
  })
})
