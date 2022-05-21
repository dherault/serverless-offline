import { resolve } from 'node:path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(30000)

describe('HttpApi Headers Tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  test.each(['GET', 'POST'])('%s headers', async (method) => {
    const url = joinUrl(TEST_BASE_URL, '/echo-headers')
    const options = {
      method,
      headers: {
        Origin: 'http://www.example.com',
        'X-Webhook-Signature': 'ABCDEF',
      },
    }

    const response = await fetch(url, options)
    expect(response.status).toEqual(200)

    const body = await response.json()

    expect(body.headersReceived).toMatchObject({
      origin: 'http://www.example.com',
      'x-webhook-signature': 'ABCDEF',
    })
  })
})
