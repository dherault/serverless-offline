import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

const { isArray } = Array
const { parse, stringify } = JSON

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Lambda.invoke tests', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

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
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)

      const response = await fetch(url)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(json, expected)
    })
  })

  it('should return a successful invocation but with error details for function that throws an error', async () => {
    const expected = {
      FunctionError: 'Unhandled',
      Payload: {
        errorMessage: 'Unhandled Error message body',
        errorType: 'Error',
      },
      StatusCode: 200,
    }
    const path = '/dev/function-with-error'
    const status = 200

    const url = joinUrl(env.TEST_BASE_URL, path)

    const response = await fetch(url)

    assert.equal(response.status, status)

    const json = await response.json()

    assert.equal(json.StatusCode, expected.StatusCode)
    assert.equal(json.FunctionError, expected.FunctionError)

    const responsePayload = parse(json.Payload)

    assert.equal(responsePayload.errorType, expected.Payload.errorType)
    assert.equal(responsePayload.errorMessage, expected.Payload.errorMessage)
    assert.equal(isArray(responsePayload.trace), true)
  })
})
