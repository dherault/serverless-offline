import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"

const { stringify } = JSON

describe("lambda integration tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: "should return JSON",
      expected: {
        foo: "bar",
      },
      path: "/dev/lambda-integration-json",
      status: 200,
    },

    // https://github.com/dherault/serverless-offline/issues/1502
    {
      description: "should return JSON",
      expected: {
        body: {
          foo: "bar",
        },
        statusCode: 200,
      },
      path: "/dev/lambda-integration-json-with-body",
      status: 200,
    },

    {
      description: "should return stringified JSON",
      expected: stringify({
        foo: "bar",
      }),
      path: "/dev/lambda-integration-stringified",
      status: 200,
    },
    {
      description: "should return operation name from request context",
      expected: {
        operationName: "getIntegrationWithOperationName",
      },
      path: "/dev/lambda-integration-with-operation-name",
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
})
