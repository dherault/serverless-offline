import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import semver from 'semver'
import { joinUrl, setup, teardown } from '../../../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Ruby 2.7 with Docker tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should work with ruby2.7 in docker container',
      expected: {
        message: 'Hello Ruby 2.7!',
      },
      path: '/dev/hello',
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async function it() {
      // "Could not find 'Docker', skipping tests."
      if (!env.DOCKER_DETECTED) {
        this.skip()
      }

      const url = joinUrl(env.TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      assert.equal(json.message, expected.message)
      assert.equal(semver.satisfies(json.version, '2.7'), true)
    })
  })
})
