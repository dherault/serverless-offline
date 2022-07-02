import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { Server } from '@hapi/hapi'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'
import installNpmModules from '../../../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Access host with Docker tests', function desc() {
  let server

  beforeEach(async () => {
    await installNpmModules(resolve(__dirname, 'src'))

    server = new Server({ port: 8080 })
    server.route({
      handler() {
        return 'Hello Node.js!'
      },
      method: 'GET',
      path: '/hello',
    })

    await server.start()

    await setup({
      servicePath: resolve(__dirname),
    })
  })

  afterEach(async () => {
    await server.stop()
    await teardown()
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
    it(description, async function it() {
      // "Could not find 'Docker', skipping tests."
      if (!env.DOCKER_DETECTED) {
        this.skip()
      }

      const url = joinUrl(env.TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
