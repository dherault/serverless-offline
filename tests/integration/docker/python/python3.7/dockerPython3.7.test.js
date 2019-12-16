import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../../../_testHelpers/index.js'

jest.setTimeout(120000)

// "Could not find 'Docker', skipping 'Docker' tests."
const _describe = process.env.DOCKER_DETECTED ? describe : describe.skip

_describe('Python 3.7 with Docker tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  //
  ;[
    {
      description: 'should work with python3.7 in docker container',
      expected: {
        message: 'Hello Python 3.7!',
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
