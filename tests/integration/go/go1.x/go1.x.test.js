import assert from 'node:assert'
import { platform } from 'node:os'
import { resolve } from 'node:path'
import { env } from 'node:process'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

const _describe =
  env.GO1X_DETECTED && platform() !== 'win32' ? describe : describe.skip

_describe('Go 1.x with GoRunner', function desc() {
  this.timeout(180000)

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
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
