import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../config.js'
import { setup, teardown } from '../integration/_testHelpers/index.js'
import installNpmModules from '../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('serverless-plugin-typescript', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'serverless-plugin-typescript'))
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'serverless-plugin-typescript'),
    })
  })

  afterEach(() => teardown())

  it('should work with serverless-plugin-typescript', async () => {
    const url = new URL('/dev/serverless-plugin-typescript', BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: 'serverless-plugin-typescript!',
    }

    assert.deepEqual(json, expected)
  })
})
