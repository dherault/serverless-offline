import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import { Server } from '@hapi/hapi'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

// "Could not find 'Docker', skipping 'Docker' tests."
const _describe = env.DOCKER_DETECTED ? describe : describe.skip

_describe('Access host with Docker tests', function desc() {
  this.timeout(120000)

  let server

  beforeEach(async () => {
    server = new Server({ port: 8080 })
    server.route({
      handler: () => {
        return 'Hello Node.js!'
      },
      method: 'GET',
      path: '/hello',
    })

    await server.start()

    return setup({
      servicePath: resolve(__dirname),
    })
  })

  afterEach(async () => {
    await server.stop()
    return teardown()
  })

  //
  ;[
    {
      description: 'should access host in docker container',
      expected: {
        message: 'Hello Node.js!',
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
