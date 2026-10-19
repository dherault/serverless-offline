import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL, LAMBDA_BASE_URL } from "../../config.js"
import installNpmModules from "../../installNpmModules.js"

const { isArray } = Array
const { parse, stringify } = JSON

describe("Lambda.invoke aws-sdk v3 tests", function desc() {
  before(async () => {
    await installNpmModules(join(import.meta.url, "src"))
  })

  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: "should work asynchronous with invocation type 'Event'",
      expected: {
        Payload: "",
        StatusCode: 202,
      },
      path: "/dev/invocation-type-event",
      status: 200,
    },

    {
      description:
        "should have empty event object with no payload and clientContext should be undefined if not set",
      expected: {
        Payload: stringify({
          event: {},
        }),
        StatusCode: 200,
      },
      path: "/dev/invocation-type-request-response",
      status: 200,
    },

    {
      description: "should return the correct client context and event payload",
      expected: {
        Payload: stringify({
          clientContext: {
            foo: "foo",
          },
          event: {
            bar: "bar",
          },
        }),
        StatusCode: 200,
      },
      path: "/dev/test-handler",
      status: 200,
    },

    {
      description:
        "should return an AWS error type ResourceNotFoundException for non-existent function name",
      expected: {
        error: {
          message: `Function not found: function-does-not-exist`,
          name: "ResourceNotFoundException",
          Type: "User",
        },
      },
      path: "/dev/function-does-not-exist",
      status: 200,
    },
  ].forEach(({ description, expected, path, status }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(json, expected)
    })
  })

  it.skip("should return a successful invocation but with error details for function that throws an error", async () => {
    const expected = {
      FunctionError: "Unhandled",
      Payload: {
        errorMessage: "Unhandled Error message body",
        errorType: "Error",
      },
      StatusCode: 200,
    }
    const path = "/dev/function-with-error"
    const status = 200

    const url = new URL(path, BASE_URL)

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

  it("should answer a CORS preflight request from the aws-sdk in a browser", async () => {
    const url = new URL(
      "/2015-03-31/functions/lambda-invoke-aws-sdk-v3-tests-dev-invokedHandler/invocations",
      LAMBDA_BASE_URL,
    )
    const requestHeaders =
      "amz-sdk-invocation-id,amz-sdk-request,authorization,content-type,x-amz-content-sha256,x-amz-date,x-amz-invocation-type,x-amz-user-agent"

    const response = await fetch(url, {
      headers: {
        "access-control-request-headers": requestHeaders,
        "access-control-request-method": "POST",
        origin: "http://localhost:8080",
      },
      method: "OPTIONS",
    })

    assert.equal(response.status, 200)
    assert.equal(
      response.headers.get("access-control-allow-origin"),
      "http://localhost:8080",
    )
    assert.equal(
      response.headers.get("access-control-allow-headers"),
      requestHeaders,
    )
    assert.equal(response.headers.get("access-control-allow-methods"), "POST")
  })
})
