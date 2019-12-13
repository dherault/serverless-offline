import { resolve } from 'path'
import fetch from 'node-fetch'
import {
  joinUrl,
  buildInContainer,
  setup,
  teardown,
} from '../../../_testHelpers/index.js'

jest.setTimeout(180000)

describe('Go 1.x with Docker tests', () => {
  if (!process.env.DOCKER_DETECTED) {
    test.only("Could not find 'Docker' executable, skipping 'Docker' tests.", () => {})
  } else {
    // init
    beforeAll(async () => {
      await buildInContainer('go1.x', resolve(__dirname), '/go/src/handler', [
        'make',
        'clean',
        'build',
      ])
      return setup({
        servicePath: resolve(__dirname),
      })
    })

    // cleanup
    afterAll(() => teardown())
  }

  //
  ;[
    {
      description: 'should work with go1.x in docker container',
      expected: {
        message: 'Hello Go 1.x!',
      },
      path: '/hello',
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
