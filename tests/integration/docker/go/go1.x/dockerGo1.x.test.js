import assert from 'node:assert'
import { platform } from 'node:os'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  buildInContainer,
  setup,
  teardown,
} from '../../../../_testHelpers/index.js'
import { BASE_URL } from '../../../../config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Go 1.x with Docker tests', function desc() {
  beforeEach(async () => {
    await setup({
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
    it(description, async function it() {
      // "Could not find 'Docker', skipping tests."
      // TODO FIXME tests on windows
      if (!env.DOCKER_DETECTED || platform() === 'win32') {
        this.skip()
      }

      await buildInContainer('go1.x', resolve(__dirname), '/go/src/handler', [
        'make',
        'clean',
        'build',
      ])

      const url = new URL(path, BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
