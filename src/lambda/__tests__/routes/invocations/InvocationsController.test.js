import assert from "node:assert"
import process from "node:process"
import { setImmediate } from "node:timers/promises"
import InvocationsController from "../../../routes/invocations/InvocationsController.js"
import LambdaFunctionThatReturnsJSONObject from "../../fixtures/Lambda/LambdaFunctionThatReturnsJSONObject-fixture.js"
import LambdaFunctionThatReturnsNativeString from "../../fixtures/Lambda/LambdaFunctionThatReturnsNativeString-fixture.js"

// a lambda whose single function settles runHandler() with the given promise
function fakeLambda(runHandler) {
  return {
    getByFunctionName() {
      return {
        runHandler,
        setClientContext() {},
        setEvent() {},
      }
    },
    listFunctionNames() {
      return ["foo"]
    },
  }
}

describe("InvocationController", () => {
  const functionName = "foo"

  describe('when event type is "RequestResponse"', () => {
    const eventType = "RequestResponse"

    it("should return json object if lambda response is json", async () => {
      const expected = {
        Payload: {
          foo: "bar",
        },
        StatusCode: 200,
      }

      const lambdaFunction = new LambdaFunctionThatReturnsJSONObject()
      const invocationController = new InvocationsController(lambdaFunction)
      const result = await invocationController.invoke(functionName, eventType)
      await lambdaFunction.cleanup()

      assert.deepEqual(result, expected)
    })

    it('should wrap native string responses with ""', async () => {
      const expected = {
        Payload: '"foo"',
        StatusCode: 200,
      }

      const lambdaFunction = new LambdaFunctionThatReturnsNativeString()
      const invocationController = new InvocationsController(lambdaFunction)
      const result = await invocationController.invoke(functionName, eventType)
      await lambdaFunction.cleanup()

      assert.deepEqual(result, expected)
    })
  })

  describe("when the result is a string", () => {
    ;["", "foo", 'He said "hi"', "line\nbreak", String.raw`back\slash`].forEach(
      (value) => {
        it(`should return valid JSON for ${JSON.stringify(value)}`, async () => {
          const invocationController = new InvocationsController(
            fakeLambda(async () => value),
          )

          const { Payload } = await invocationController.invoke(
            functionName,
            "RequestResponse",
          )

          assert.strictEqual(JSON.parse(Payload), value)
        })
      },
    )
  })

  describe("when the handler fails", () => {
    it("should return the error type, message and trace of an Error", async () => {
      class CustomError extends Error {
        name = "CustomError"
      }

      const invocationController = new InvocationsController(
        fakeLambda(async () => {
          throw new CustomError("boom")
        }),
      )

      const result = await invocationController.invoke(
        functionName,
        "RequestResponse",
      )

      assert.strictEqual(result.StatusCode, 200)
      assert.strictEqual(result.UnhandledError, true)
      assert.strictEqual(result.Payload.errorMessage, "boom")
      assert.strictEqual(result.Payload.errorType, "CustomError")
      assert.ok(Array.isArray(result.Payload.trace))
    })

    it("should return an error payload when the handler fails with a non Error", async () => {
      const invocationController = new InvocationsController(
        // e.g. callback("string error")
        fakeLambda(() => Promise.reject("string error")), // eslint-disable-line prefer-promise-reject-errors
      )

      const result = await invocationController.invoke(
        functionName,
        "RequestResponse",
      )

      assert.deepStrictEqual(result, {
        Payload: {
          errorMessage: "string error",
          errorType: "string",
          trace: [],
        },
        StatusCode: 200,
        UnhandledError: true,
      })
    })
  })

  describe("when the handler fails with a Symbol", () => {
    it("should return an error payload", async () => {
      const invocationController = new InvocationsController(
        fakeLambda(() => Promise.reject(Symbol("boom"))), // eslint-disable-line prefer-promise-reject-errors
      )

      const result = await invocationController.invoke(
        functionName,
        "RequestResponse",
      )

      assert.deepStrictEqual(result.Payload, {
        errorMessage: "Symbol(boom)",
        errorType: "symbol",
        trace: [],
      })
    })
  })

  describe('when event type is "Event"', () => {
    ;[
      { description: "an Error", reason: new Error("boom") },
      { description: "a string", reason: "string error" },
      // can't be converted to a string implicitly
      { description: "a Symbol", reason: Symbol("boom") },
      { description: "null", reason: null },
    ].forEach(({ description, reason }) => {
      it(`should not cause an unhandled rejection when the handler fails with ${description}`, async () => {
        const unhandledRejections = []
        const onUnhandledRejection = (unhandledReason) => {
          unhandledRejections.push(unhandledReason)
        }

        process.on("unhandledRejection", onUnhandledRejection)

        try {
          const invocationController = new InvocationsController(
            fakeLambda(() => Promise.reject(reason)),
          )

          const result = await invocationController.invoke(
            functionName,
            "Event",
          )

          // unhandled rejections are reported after the microtask queue drained
          await setImmediate()

          assert.deepStrictEqual(result, {
            Payload: "",
            StatusCode: 202,
          })
          assert.deepStrictEqual(unhandledRejections, [])
        } finally {
          process.off("unhandledRejection", onUnhandledRejection)
        }
      })
    })
  })
})
