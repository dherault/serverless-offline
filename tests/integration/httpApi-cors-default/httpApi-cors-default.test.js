// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import fetch from 'node-fetch'
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
      method: 'OPTIONS',
      headers: {
        origin: 'http://www.mytestapp.com',
        'access-control-request-headers': 'authorization,content-type',
        'access-control-request-method': 'GET',
      },
    }

    const response = await fetch(url, options)
    assert.equal(response.status, 204)

    assert.equal(
      response.headers.get('access-control-allow-origin'),
      'http://www.mytestapp.com',
    )
    assert.equal(
      response.headers.get('access-control-allow-methods'),
      'OPTIONS,GET,POST,PUT,DELETE,PATCH',
    )
    assert.equal(
      response.headers.get('access-control-allow-headers'),
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
    )
  })
})
