import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../_testHelpers/index.js'
import { BASE_URL } from '../../config.js'
import installNpmModules from '../../installNpmModules.js'

const { stringify } = JSON

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('vendia-serverless-express', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'app'))
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'app'),
    })
  })

  afterEach(() => teardown())

  it('get', async () => {
    const url = new URL('/dev/foo', BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      foo: 'bar',
    }

    assert.equal(response.status, 200)
    assert.deepEqual(json, expected)
  })

  it('get with param, 404', async () => {
    const url = new URL('/dev/users/1', BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {}

    assert.equal(response.status, 404)
    assert.deepEqual(json, expected)
  })

  it('post', async () => {
    const url = new URL('/dev/users', BASE_URL)
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

    assert.equal(response.status, 201)
    assert.deepEqual(json, expected)
  })
})
