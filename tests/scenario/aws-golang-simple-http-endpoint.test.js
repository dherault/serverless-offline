/* eslint-disable no-await-in-loop */
import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../config.js'
import { setup, teardown } from '../integration/_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('aws golang simple http endpoint', function desc() {
  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'aws-golang-simple-http-endpoint'),
    })
  })

  afterEach(() => teardown())

  it('get /hello', async function it() {
    if (!env.GO1X_DETECTED) {
      this.skip()
    }

    // We GET /hello multiple times to avoid regression of https://github.com/dherault/serverless-offline/issues/1504
    for (let i = 0; i < 3; i += 1) {
      const url = new URL('/hello', BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      const expected = {
        message: 'Go Serverless v1.0! Your function executed successfully!',
      }

      assert.deepEqual(json, expected)
    }
  })

  it('get /world', async function it() {
    if (!env.GO1X_DETECTED) {
      this.skip()
    }

    // We GET /world multiple times to avoid regression of https://github.com/dherault/serverless-offline/issues/1504
    for (let i = 0; i < 3; i += 1) {
      const url = new URL('/world', BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      const expected = {
        message: 'Okay so your other function also executed successfully!',
      }

      assert.deepEqual(json, expected)
    }
  })
})
