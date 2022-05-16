import { resolve } from 'path'
import { env } from 'process'
import fetch from 'node-fetch'
import { satisfies } from 'semver'
import { joinUrl, setup, teardown } from '../../../_testHelpers/index.js'

jest.setTimeout(120000)

// "Could not find 'Docker', skipping 'Docker' tests."
const _describe = env.DOCKER_DETECTED ? describe : describe.skip

_describe('Node.js 10.x with Docker tests', () => {
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
      description: 'should work with nodejs10.x in docker container',
      expected: {
        message: 'Hello Node.js 10.x!',
      },
      path: '/dev/hello',
    },
  ].forEach(({ description, expected, path }) => {
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      expect(json.message).toEqual(expected.message)
      expect(satisfies(json.version, '10')).toEqual(true)
    })
  })
})
