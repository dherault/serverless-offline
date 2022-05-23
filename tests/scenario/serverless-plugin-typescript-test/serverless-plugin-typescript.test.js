import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

describe('serverless-plugin-typescript', function describe() {
  this.timeout(120000)

  beforeEach(
    () =>
      setup({
        servicePath: resolve(__dirname),
      }),
    110000,
  )

  afterEach(() => teardown())

  it('should work with serverless-plugin-typescript', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/serverless-plugin-typescript')
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: 'serverless-plugin-typescript!',
    }

    assert.deepEqual(json, expected)
  })
})
