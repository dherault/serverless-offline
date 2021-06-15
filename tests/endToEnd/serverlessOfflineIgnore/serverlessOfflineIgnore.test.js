import { resolve } from 'path'
import fetch from 'node-fetch'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

jest.setTimeout(30000)

describe('serverlessOfflineIgnore option', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  describe('serverless-offline-ignore is in the function definition', () => {
    test('it should return a 404', async () => {
      const url = joinUrl(TEST_BASE_URL, '/dev/ignored-function')
      const response = await fetch(url)
      const json = await response.json()

      expect(json.statusCode).toEqual(404)
    })
  })

  describe('serverless-offline-ignore is not in the function definition', () => {
    test('it should return a 200', async () => {
      const url = joinUrl(TEST_BASE_URL, '/dev/legit-function')
      const response = await fetch(url)
      const json = await response.json()

      expect(json).toEqual({foo: 'bar'})
    })
  })
})
