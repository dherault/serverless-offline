import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

const { stringify } = JSON

jest.setTimeout(30000)

describe('lambda integration tests', () => {
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
      description: 'should return JSON',
      expected: {
        foo: 'bar',
      },
      path: '/dev/lambda-integration-json',
      status: 200,
    },

    {
      description: 'should return stringified JSON',
      expected: stringify({
        foo: 'bar',
      }),
      path: '/dev/lambda-integration-stringified',
      status: 200,
    },
  ].forEach(({ description, expected, path, status }) => {
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)

      const response = await fetch(url)
      expect(response.status).toEqual(status)

      const json = await response.json()
      expect(json).toEqual(expected)
    })
  })
})
