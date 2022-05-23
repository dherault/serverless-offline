import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

const _describe = env.DOCKER_DETECTED ? describe : describe.skip

_describe('docker and serverless-webpack', function describe() {
  this.timeout(120000)

  beforeEach(
    () =>
      setup({
        servicePath: resolve(__dirname),
      }),
    110000,
  )

  afterEach(() => teardown())

  it('should work with docker and serverless-webpack', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/docker-serverless-webpack')
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: 'docker and serverless-webpack!',
    }

    assert.deepEqual(json, expected)
  })
})
