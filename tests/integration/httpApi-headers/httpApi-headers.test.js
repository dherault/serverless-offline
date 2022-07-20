import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

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
      const url = joinUrl(env.TEST_BASE_URL, '/echo-headers')
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
