import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import { satisfies } from 'semver'
import { joinUrl, setup, teardown } from '../../../_testHelpers/index.js'

// "Could not find 'Docker', skipping 'Docker' tests."
const _describe = env.DOCKER_DETECTED ? describe : describe.skip

_describe('Ruby 2.5 with Docker tests', function desc() {
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
      description: 'should work with ruby2.5 in docker container',
      expected: {
        message: 'Hello Ruby 2.5!',
      },
      path: '/dev/hello',
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      assert.equal(json.message, expected.message)
      assert.equal(satisfies(json.version, '2.5'), true)
    })
  })
})
