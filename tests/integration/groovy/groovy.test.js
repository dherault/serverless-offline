import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

// Could not find 'Java', skipping 'Java' tests.
const _describe = env.JAVA_DETECTED ? describe : describe.skip

_describe('Groovy tests', function desc() {
  this.timeout(120000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should work with groovy',
      expected: {
        message: 'Go Serverless v1.x! Your function executed successfully!',
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
