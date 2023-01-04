import assert from 'node:assert'
import { join } from 'desm'
import { setup, teardown } from '../../_testHelpers/index.js'
import { BASE_URL } from '../../config.js'

describe('HttpApi Headers Tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;['GET', 'POST'].forEach((method) => {
    it(`${method} headers`, async () => {
      const url = new URL('/echo-headers', BASE_URL)
      const options = {
        headers: {
          Origin: 'http://www.example.com',
          'X-Webhook-Signature': 'ABCDEF',
        },
        method,
      }

      const response = await fetch(url, options)

      assert.equal(response.status, 200)

      const body = await response.json()

      assert.equal(body.headersReceived.origin, 'http://www.example.com')
      assert.equal(body.headersReceived['x-webhook-signature'], 'ABCDEF')
    })
  })
})
