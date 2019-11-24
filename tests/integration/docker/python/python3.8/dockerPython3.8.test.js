import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../../../_testHelpers/index.js'

jest.setTimeout(120000)

describe('Python 3.8 with Docker tests', () => {
  if (!process.env.DOCKER_DETECTED) {
    it.only("Could not find 'Docker' executable, skipping 'Docker' tests.", () => {})
  } else {
    // init
    beforeAll(() =>
      setup({
        servicePath: resolve(__dirname),
      }),
    )

    // cleanup
    afterAll(() => teardown())
  }

  //
  ;[
    {
      description: 'should work with python3.8 in docker container',
      expected: {
        message: 'Hello Python 3.8!',
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
