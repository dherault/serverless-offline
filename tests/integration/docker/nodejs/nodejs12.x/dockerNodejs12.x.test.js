import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import semver from 'semver'
import { joinUrl, setup, teardown } from '../../../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Node.js 12.x with Docker tests', function desc() {
  this.timeout(120000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should work with nodejs12.x in docker container',
      expected: {
        message: 'Hello Node.js 12.x!',
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
      assert.equal(semver.satisfies(json.version, '12'), true)
    })
  })
})
