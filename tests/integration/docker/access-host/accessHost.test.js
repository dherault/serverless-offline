import { resolve } from 'path'
import { Server } from '@hapi/hapi'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

jest.setTimeout(120000)

// "Could not find 'Docker', skipping 'Docker' tests."
const _describe = process.env.DOCKER_DETECTED ? describe : describe.skip

_describe('Access host with Docker tests', () => {
  let server

  // init
  beforeAll(async () => {
    server = new Server({ port: 8080 })
    server.route({
      method: 'GET',
      path: '/hello',
      handler: () => {
        return 'Hello Node.js!'
      },
    })

    await server.start()

    return setup({
      servicePath: resolve(__dirname),
    })
  })

  // cleanup
  afterAll(async () => {
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
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      expect(json).toEqual(expected)
    })
  })
})
