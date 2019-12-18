import { resolve } from 'path'
import fetch from 'node-fetch'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

jest.setTimeout(120000)

describe('serverless-plugin-typescript', () => {
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

  test('should work with serverless-plugin-typescript', async () => {
    const url = joinUrl(TEST_BASE_URL, '/dev/serverless-plugin-typescript')
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: 'serverless-plugin-typescript!',
    }

    expect(json).toEqual(expected)
  })
})
