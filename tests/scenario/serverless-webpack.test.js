import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../integration/_testHelpers/index.js'
import installNpmModules from '../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('serverless-webpack', function describe() {
  this.timeout(120000)

  beforeEach(async () => {
    await installNpmModules(resolve(__dirname, 'serverless-webpack-test'))

    await setup({
      servicePath: resolve(__dirname, 'serverless-webpack-test'),
    })
  })

  afterEach(() => teardown())

  it('should work with serverless-webpack', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/serverless-webpack')
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: 'serverless-webpack!',
    }

    assert.deepEqual(json, expected)
  })
})
