import { resolve } from 'path'
import { env } from 'process'
import fetch from 'node-fetch'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

jest.setTimeout(120000)

const _describe = env.DOCKER_DETECTED ? describe : describe.skip

_describe('docker and serverless-webpack', () => {
  // init
  beforeAll(
    () =>
      setup({
        servicePath: resolve(__dirname),
      }),
    110000,
  )

  // cleanup
  afterAll(() => teardown())

  // TODO FIXME temporary skip for node.js 18 compatibility
  test.skip('should work with docker and serverless-webpack', async () => {
    const url = joinUrl(TEST_BASE_URL, '/dev/docker-serverless-webpack')
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: 'docker and serverless-webpack!',
    }

    expect(json).toEqual(expected)
  })
})
