import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../integration/_testHelpers/index.js'
import installNpmModules from '../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('serverless-esbuild', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'serverless-esbuild-test'))
  })

  beforeEach(async () => {
    await installNpmModules(resolve(__dirname, 'serverless-esbuild-test'))

    await setup({
      servicePath: resolve(__dirname, 'serverless-esbuild-test'),
    })
  })

  afterEach(() => teardown())

  it('should work with serverless-esbuild', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/serverless-esbuild')
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: 'serverless-esbuild!',
    }

    assert.deepEqual(json, expected)
  })
})
