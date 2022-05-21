import { resolve } from 'node:path'
import fetch from 'node-fetch'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

jest.setTimeout(30000)

describe('star routes with properties', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  describe('when a catch-all route is defined with path and method', () => {
    test('it should return a payload', async () => {
      const url = joinUrl(TEST_BASE_URL, '/dev')
      const response = await fetch(url)
      const json = await response.json()

      expect(json).toEqual({ foo: 'bar' })
    })
  })
})
