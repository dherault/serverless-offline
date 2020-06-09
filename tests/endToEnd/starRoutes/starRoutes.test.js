import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../../integration/_testHelpers';

jest.setTimeout(30000)

describe('star routes', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  describe('when a star route is used (and has no path property)', () => {
    test('it should return a payload', async () => {
      const url = joinUrl(TEST_BASE_URL, '/dev')
      const response = await fetch(url)
      const json = await response.json()

      expect(json).toEqual({ foo: 'bar' })
    })
  })
})

