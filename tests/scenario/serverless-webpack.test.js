import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../_testHelpers/index.js'
import { BASE_URL } from '../config.js'
import installNpmModules from '../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('serverless-webpack', function describe() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'serverless-webpack'))
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'serverless-webpack'),
    })
  })

  afterEach(() => teardown())

  it('should work with serverless-webpack', async () => {
    const url = new URL('/dev/serverless-webpack', BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: 'serverless-webpack!',
    }

    assert.deepEqual(json, expected)
  })
})
