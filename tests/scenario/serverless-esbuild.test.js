import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../config.js'
import { setup, teardown } from '../integration/_testHelpers/index.js'
import installNpmModules from '../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('serverless-esbuild', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'serverless-esbuild'))
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'serverless-esbuild'),
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
