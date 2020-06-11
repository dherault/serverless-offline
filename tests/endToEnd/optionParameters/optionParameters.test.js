import { resolve } from 'path'
import fetch from 'node-fetch'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

jest.setTimeout(30000)

describe('noPrependStageInUrl option', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
      args: ['--noPrependStageInUrl'],
    }),
  )

  // cleanup
  afterAll(() => teardown())

  describe('when --noPrependStageInUrl is used, and the stage isnt in the url', () => {
    test('it should return a payload', async () => {
      const url = joinUrl(TEST_BASE_URL, '/hello')
      const response = await fetch(url)
      const json = await response.json()

      expect(json).toEqual({ foo: 'bar' })
    })
  })

  describe('when --noPrependStageInUrl is used, and the stage isnt in the url', () => {
    test('noPrependStageInUrl 2', async () => {
      const url = joinUrl(TEST_BASE_URL, '/dev/hello')
      const response = await fetch(url)
      const json = await response.json()

      expect(json.statusCode).toEqual(404)
    })
  })
})

describe('prefix option', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
      args: ['--prefix', 'someprefix'],
    }),
  )

  // cleanup
  afterAll(() => teardown())

  describe('when the --prefix option is used', () => {
    test('the prefixed path should return a payload', async () => {
      const url = joinUrl(TEST_BASE_URL, '/someprefix/dev/hello')
      const response = await fetch(url)
      const json = await response.json()

      expect(json).toEqual({ foo: 'bar' })
    })
  })
})
