import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import {
  joinUrl,
  buildInContainer,
  setup,
  teardown,
} from '../../../_testHelpers/index.js'

// "Could not find 'Docker', skipping 'Docker' tests."
const _describe = env.DOCKER_DETECTED ? describe : describe.skip

_describe('Go 1.x with Docker tests', function desc() {
  this.timeout(180000)

  beforeEach(async () => {
    await buildInContainer('go1.x', resolve(__dirname), '/go/src/handler', [
      'make',
      'clean',
      'build',
    ])
    return setup({
      servicePath: resolve(__dirname),
    })
  })

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should work with go1.x in docker container',
      expected: {
        message: 'Hello Go 1.x!',
      },
      path: '/dev/hello',
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
