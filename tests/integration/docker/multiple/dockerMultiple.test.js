import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import { satisfies } from 'semver'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

// skipping tests on Linux for now.
// TODO FIXME docker tests currently failing while using node: protocol
const _describe = describe.skip
// const _describe = env.DOCKER_DETECTED ? describe : describe.skip

_describe('Multiple docker containers', function desc() {
  this.timeout(240000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should work with multiple mixed docker containers',
      expected1: {
        message: 'Hello Node.js!',
      },
      expected2: {
        message: 'Hello Node.js!',
      },
      expected3: {
        message: 'Hello Python!',
      },
      path1: '/dev/hello1',
      path2: '/dev/hello2',
      path3: '/dev/hello3',
    },
  ].forEach(
    ({ description, expected1, expected2, expected3, path1, path2, path3 }) => {
      it(description, async () => {
        const url1 = joinUrl(env.TEST_BASE_URL, path1)
        const url2 = joinUrl(env.TEST_BASE_URL, path2)
        const url3 = joinUrl(env.TEST_BASE_URL, path3)

        const [response1, response2, response3] = await Promise.all([
          fetch(url1),
          fetch(url2),
          fetch(url3),
        ])

        const [json1, json2, json3] = await Promise.all([
          response1.json(),
          response2.json(),
          response3.json(),
        ])

        assert.equal(json1.message, expected1.message)
        assert.equal(json2.message, expected2.message)
        assert.equal(json3.message, expected3.message)

        assert.equal(satisfies(json1.version, '12'), true)
        assert.equal(satisfies(json2.version, '10'), true)
      })
    },
  )
})
