import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

describe('uncategorized tests', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  // issue: https://github.com/dherault/serverless-offline/issues/756
  // PR: https://github.com/dherault/serverless-offline/pull/757
  it('Uncategorized 1', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/uncategorized-1')
    const response = await fetch(url)
    const json = await response.json()

    assert.deepEqual(json, { foo: 'bar' })
  })

  // issue: https://github.com/dherault/serverless-offline/issues/758
  // PR: https://github.com/dherault/serverless-offline/pull/759
  it('Uncategorized 2', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/uncategorized-2')
    const response = await fetch(url)
    const json = await response.json()

    assert.deepEqual(json, { foo: 'bar' })
  })
})
