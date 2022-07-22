import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../integration/_testHelpers/index.js'
import installNpmModules from '../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('aws golang simple http endpoint', function desc() {
  before(async () => {
    await installNpmModules(
      resolve(__dirname, 'aws-golang-simple-http-endpoint'),
    )
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'aws-golang-simple-http-endpoint'),
    })
  })

  afterEach(() => teardown())

  // We GET /hello multiple times to avoid regression of https://github.com/dherault/serverless-offline/issues/1504
  for (let i = 0; i < 3; i += 1) {
    it('get /hello', async () => {
      const url = joinUrl(env.TEST_BASE_URL, '/hello')
      const response = await fetch(url)
      const json = await response.json()

      const expected = {
        message: 'Go Serverless v1.0! Your function executed successfully!',
      }

      assert.deepEqual(json, expected)
    })
  }

  // We GET /world multiple times to avoid regression of https://github.com/dherault/serverless-offline/issues/1504
  for (let i = 0; i < 3; i += 1) {
    it('get /world', async () => {
      const url = joinUrl(env.TEST_BASE_URL, '/world')
      const response = await fetch(url)
      const json = await response.json()

      const expected = {
        message: 'Okay so your other function also executed successfully!',
      }

      assert.deepEqual(json, expected)
    })
  }
})
