import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../_testHelpers/index.js'
import { BASE_URL } from '../../config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('HttpApi Headers Tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
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
