import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(30000)

const { stringify } = JSON

describe('lambda invoke tests', () => {
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
      description:
        'should have empty event object with no payload and clientContext should be undefined if not set',
      expected: {
        Payload: stringify({ event: {} }),
        StatusCode: 200,
      },
      path: '/no-payload',
      status: 200,
    },

    {
      description: '...',
      expected: {
        Payload: stringify({
          clientContext: { foo: 'foo' },
          event: { bar: 'bar' },
        }),
        StatusCode: 200,
      },
      path: '/test-handler',
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
