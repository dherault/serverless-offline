import assert from "node:assert"
import authValidateContext from "../authValidateContext.js"

const authFunName = "authFunction"

function assertInternalServerError(result, message) {
  assert.ok(result.isBoom, "expected a Boom error")
  assert.strictEqual(result.output.statusCode, 500)
  assert.strictEqual(
    result.output.headers["x-amzn-ErrorType"],
    "AuthorizerConfigurationException",
  )
  assert.strictEqual(
    result.output.payload.error,
    "AuthorizerConfigurationException",
  )
  assert.strictEqual(result.output.payload.message, message)
}

describe("authValidateContext", () => {
  describe("with a valid context", () => {
    it("should stringify every value", () => {
      const result = authValidateContext(
        {
          bool: true,
          num: 42,
          str: "foo",
        },
        authFunName,
      )

      assert.deepStrictEqual(result, {
        bool: "true",
        num: "42",
        str: "foo",
      })
    })

    it("should return an empty object for an empty context", () => {
      assert.deepStrictEqual(authValidateContext({}, authFunName), {})
    })

    it("should not mutate the given context", () => {
      const context = { num: 42 }

      authValidateContext(context, authFunName)

      assert.deepStrictEqual(context, { num: 42 })
    })
  })

  describe("with a non object context", () => {
    ;["a string", 42, true].forEach((context) => {
      it(`should return an internal server error for ${typeof context}`, () => {
        assertInternalServerError(
          authValidateContext(context, authFunName),
          "Authorizer response context must be an object",
        )
      })
    })

    it("should return an internal server error for undefined", () => {
      assertInternalServerError(
        authValidateContext(undefined, authFunName),
        "Authorizer response context must be an object",
      )
    })
  })

  describe("with unsupported value types", () => {
    const message =
      "Authorizer response context values must be of type string, number, or boolean"

    it("should reject nested objects", () => {
      assertInternalServerError(
        authValidateContext({ nested: { foo: "bar" } }, authFunName),
        message,
      )
    })

    it("should reject arrays", () => {
      assertInternalServerError(
        authValidateContext({ list: [1, 2] }, authFunName),
        message,
      )
    })

    it("should reject null values", () => {
      assertInternalServerError(
        authValidateContext({ nothing: null }, authFunName),
        message,
      )
    })

    it("should reject undefined values", () => {
      assertInternalServerError(
        authValidateContext({ nothing: undefined }, authFunName),
        message,
      )
    })

    it("should reject functions", () => {
      assertInternalServerError(
        authValidateContext({ fn: () => {} }, authFunName),
        message,
      )
    })
  })
})
