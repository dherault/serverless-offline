// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('HttpApi Cors Default Tests', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  it('Fetch OPTIONS with any origin', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/user')
    const options = {
      headers: {
        'access-control-request-headers': 'authorization,content-type',
        'access-control-request-method': 'GET',
        origin: 'http://www.mytestapp.com',
      },
      method: 'OPTIONS',
    }

    const response = await fetch(url, options)
    assert.equal(response.status, 204)

    assert.equal(
      response.headers.get('access-control-allow-origin'),
      'http://www.mytestapp.com',
    )
    assert.equal(
      response.headers.get('access-control-allow-methods'),
      'DELETE,GET,OPTIONS,PATCH,POST,PUT',
    )
    assert.equal(
      response.headers.get('access-control-allow-headers'),
      'Authorization,Content-Type,X-Amz-Date,X-Amz-Security-Token,X-Amz-User-Agent,X-Api-Key',
    )
  })
})
