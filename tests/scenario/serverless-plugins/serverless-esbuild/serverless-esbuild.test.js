import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../../_testHelpers/index.js'
import { BASE_URL } from '../../../config.js'
import installNpmModules from '../../../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('serverless-esbuild', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'app'))
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'app'),
    })
  })

  afterEach(() => teardown())

  it('should work with serverless-esbuild', async () => {
    const url = new URL('/dev/serverless-esbuild', BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: 'serverless-esbuild!',
    }

    assert.deepEqual(json, expected)
  })
})
