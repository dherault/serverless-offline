import assert from 'node:assert'
import fetch from 'node-fetch'
import { resolve } from 'node:path'
import { env } from 'node:process'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

describe('custom authentication serverless-offline variable tests', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description:
        'should return custom payload from injected authentication provider',
      path: '/echo',
      status: 200,
    },
  ].forEach(({ description, path, status }) => {
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)

      const response = await fetch(url)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(
        json.event.requestContext.authorizer.expected,
        'it works',
      )
    })
  })
})
