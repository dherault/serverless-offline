import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../integration/_testHelpers/index.js'
import installNpmModules from '../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('serverless-plugin-typescript', function desc() {
  this.timeout(120000)

  beforeEach(async () => {
    await installNpmModules(
      resolve(__dirname, 'serverless-plugin-typescript-test'),
    )

    await setup({
      servicePath: resolve(__dirname, 'serverless-plugin-typescript-test'),
    })
  })

  afterEach(() => teardown())

  it('should work with serverless-plugin-typescript', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/serverless-plugin-typescript')
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: 'serverless-plugin-typescript!',
    }

    assert.deepEqual(json, expected)
  })
})
