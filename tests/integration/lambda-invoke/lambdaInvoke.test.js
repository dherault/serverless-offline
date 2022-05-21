import { resolve } from 'node:path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(30000)

const { isArray } = Array
const { parse, stringify } = JSON

describe('Lambda.invoke tests', () => {
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
      description: "should work asynchronous with invocation type 'Event'",
      expected: {
        Payload: '',
        StatusCode: 202,
      },
      path: '/dev/invocation-type-event',
      status: 200,
    },

    {
      description:
        'should have empty event object with no payload and clientContext should be undefined if not set',
      expected: {
        Payload: stringify({ event: {} }),
        StatusCode: 200,
      },
      path: '/dev/invocation-type-request-response',
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
      path: '/dev/test-handler',
      status: 200,
    },

    {
      description:
        'should return an AWS error type ResourceNotFoundException for non-existent function name',
      expected: {
        error: {
          code: 'ResourceNotFoundException',
          message: `Function not found: function-does-not-exist`,
          statusCode: 404,
        },
      },
      path: '/dev/function-does-not-exist',
      status: 404,
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
  test('should return a successful invocation but with error details for function that throws an error', async () => {
    const expected = {
      Payload: {
        errorType: 'Error',
        errorMessage: 'Unhandled Error message body',
      },
      FunctionError: 'Unhandled',
      StatusCode: 200,
    }
    const path = '/dev/function-with-error'
    const status = 200

    const url = joinUrl(TEST_BASE_URL, path)

    const response = await fetch(url)
    expect(response.status).toEqual(status)

    const json = await response.json()
    expect(json.StatusCode).toEqual(expected.StatusCode)
    expect(json.FunctionError).toEqual(expected.FunctionError)

    const responsePayload = parse(json.Payload)
    expect(responsePayload.errorType).toEqual(expected.Payload.errorType)
    expect(responsePayload.errorMessage).toEqual(expected.Payload.errorMessage)
    expect(isArray(responsePayload.trace)).toBeTruthy()
  })
})
