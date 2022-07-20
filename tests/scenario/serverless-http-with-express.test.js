import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../integration/_testHelpers/index.js'
import installNpmModules from '../installNpmModules.js'

const { stringify } = JSON

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('serverless-http with express', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'serverless-http-with-express'))
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'serverless-http-with-express'),
    })
  })

  afterEach(() => teardown())

  it('get', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/api/info')
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      application: 'sample-app',
      foo: 'bar',
    }

    assert.deepEqual(json, expected)
  })

  it('post', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/api/foo')
    const response = await fetch(url, {
      body: stringify({
        foo: 'bar',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const json = await response.json()

    const expected = {
      foo: 'bar',
    }

    assert.deepEqual(json, expected)
  })
})
