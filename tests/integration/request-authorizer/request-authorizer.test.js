// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import assert from "node:assert"
import { join } from "desm"
import { BASE_URL } from "../../config.js"
import { setup, teardown } from "../../_testHelpers/index.js"

describe("request authorizer tests", () => {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  function doTest(params) {
    const { description, expected, options, path, status } = params
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url, options)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(json, expected)
    })
  }

  describe("authorizer with payload format 1.0 and header identity source", () => {
    ;[
      {
        description: "should respond with Allow policy",
        expected: {
          hasAuthorizer: true,
          status: "Authorized",
        },
        options: {
          headers: {
            Authorization: "Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a",
          },
        },
        path: "/user1-header",
        status: 200,
      },

      {
        description: "should respond with Deny policy",
        expected: {
          error: "Forbidden",
          message: "User is not authorized to access this resource",
          statusCode: 403,
        },
        options: {
          headers: {
            Authorization: "Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b",
          },
        },
        path: "/user1-header",
        status: 403,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is explicitly not handled",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {
          headers: {
            Authorization: "Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5c",
          },
        },
        path: "/user1-header",
        status: 401,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is not present on the request",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {},
        path: "/user1-header",
        status: 401,
      },
    ].forEach(doTest)
  })

  describe("authorizer with payload format 1.0 and querystring identity source", () => {
    ;[
      {
        description: "should respond with Allow policy",
        expected: {
          hasAuthorizer: true,
          status: "Authorized",
        },
        options: {},
        path: "/user1-querystring?query1=fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a",
        status: 200,
      },

      {
        description: "should respond with Deny policy",
        expected: {
          error: "Forbidden",
          message: "User is not authorized to access this resource",
          statusCode: 403,
        },
        options: {},
        path: "/user1-querystring?query1=fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b",
        status: 403,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is explicitly not handled",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {},
        path: "/user1-querystring?query1=fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5c",
        status: 401,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is not present on the request",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {},
        path: "/user1-querystring",
        status: 401,
      },
    ].forEach(doTest)
  })

  describe("authorizer with payload format 2.0 and header identity source", () => {
    ;[
      {
        description: "should respond with Allow policy",
        expected: {
          hasAuthorizer: true,
          status: "Authorized",
        },
        options: {
          headers: {
            Authorization: "Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a",
          },
        },
        path: "/user2-header",
        status: 200,
      },

      {
        description: "should respond with Deny policy",
        expected: {
          error: "Forbidden",
          message: "User is not authorized to access this resource",
          statusCode: 403,
        },
        options: {
          headers: {
            Authorization: "Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b",
          },
        },
        path: "/user2-header",
        status: 403,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is explicitly not handled",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {
          headers: {
            Authorization: "Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5c",
          },
        },
        path: "/user2-header",
        status: 401,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is not present on the request",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {},
        path: "/user2-header",
        status: 401,
      },
    ].forEach(doTest)
  })

  describe("authorizer with payload format 2.0 and querystring identity source", () => {
    ;[
      {
        description: "should respond with Allow policy",
        expected: {
          hasAuthorizer: true,
          status: "Authorized",
        },
        options: {},
        path: "/user2-querystring?query2=fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a",
        status: 200,
      },

      {
        description: "should respond with Deny policy",
        expected: {
          error: "Forbidden",
          message: "User is not authorized to access this resource",
          statusCode: 403,
        },
        options: {},
        path: "/user2-querystring?query2=fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b",
        status: 403,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is explicitly not handled",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {},
        path: "/user2-querystring?query2=fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5c",
        status: 401,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is not present on the request",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {},
        path: "/user2-querystring",
        status: 401,
      },
    ].forEach(doTest)
  })

  describe("authorizer with payload format 2.0 with simple responses enabled and header identity source", () => {
    ;[
      {
        description: "should respond with isAuthorized true",
        expected: {
          hasAuthorizer: true,
          status: "Authorized",
        },
        options: {
          headers: {
            AuthorizationSimple: "Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a",
          },
        },
        path: "/user2simple-header",
        status: 200,
      },

      {
        description: "should respond with isAuthorized false",
        expected: {
          error: "Forbidden",
          message: "User is not authorized to access this resource",
          statusCode: 403,
        },
        options: {
          headers: {
            AuthorizationSimple: "Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b",
          },
        },
        path: "/user2simple-header",
        status: 403,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is explicitly not handled",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {
          headers: {
            AuthorizationSimple: "Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5c",
          },
        },
        path: "/user2simple-header",
        status: 401,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is not present on the request",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {},
        path: "/user2simple-header",
        status: 401,
      },
    ].forEach(doTest)
  })

  describe("authorizer with payload format 2.0 with simple responses enabled and querystring identity source", () => {
    ;[
      {
        description: "should respond with Allow policy",
        expected: {
          hasAuthorizer: true,
          status: "Authorized",
        },
        options: {},
        path: "/user2simple-querystring?query2simple=fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a",
        status: 200,
      },

      {
        description: "should respond with Deny policy",
        expected: {
          error: "Forbidden",
          message: "User is not authorized to access this resource",
          statusCode: 403,
        },
        options: {},
        path: "/user2simple-querystring?query2simple=fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b",
        status: 403,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is explicitly not handled",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {},
        path: "/user2simple-querystring?query2simple=fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5c",
        status: 401,
      },

      {
        description:
          "should fail with an Unauthorized error when identity source is not present on the request",
        expected: {
          error: "Unauthorized",
          message: "Unauthorized",
          statusCode: 401,
        },
        options: {},
        path: "/user2simple-querystring",
        status: 401,
      },
    ].forEach(doTest)
  })

  describe("no authorizer configured", () => {
    ;[
      {
        description:
          "should respond authorized with no authorizer with payload 1.0",
        expected: {
          hasAuthorizer: false,
          status: "Authorized",
        },
        options: {
          headers: {
            Authorization: "Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a",
          },
        },
        path: "/user1-no-authorizer",
        status: 200,
      },
      {
        description:
          "should respond authorized with no authorizer with payload 2.0",
        expected: {
          hasAuthorizer: false,
          status: "Authorized",
        },
        options: {
          headers: {
            Authorization: "Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a",
          },
        },
        path: "/user2-no-authorizer",
        status: 200,
      },
    ].forEach(doTest)
  })
})
