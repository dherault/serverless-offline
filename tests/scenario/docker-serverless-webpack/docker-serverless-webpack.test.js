import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../_testHelpers/index.js'
import { BASE_URL } from '../../config.js'
import installNpmModules from '../../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('docker and serverless-webpack', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'app'))
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'app'),
    })
  })

  afterEach(() => teardown())

  it('should work with docker and serverless-webpack', async function it() {
    // "Could not find 'Docker', skipping tests."
    if (!env.DOCKER_DETECTED) {
      this.skip()
    }

    const url = new URL('/dev/docker-serverless-webpack', BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: 'docker and serverless-webpack!',
    }

    assert.deepEqual(json, expected)
  })
})
