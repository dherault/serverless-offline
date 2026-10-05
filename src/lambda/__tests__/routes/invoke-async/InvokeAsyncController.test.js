import assert from "node:assert"
import process from "node:process"
import { setImmediate } from "node:timers/promises"
import InvokeAsyncController from "../../../routes/invoke-async/InvokeAsyncController.js"

describe("InvokeAsyncController", () => {
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
        const invokeAsyncController = new InvokeAsyncController({
          getByFunctionName() {
            return {
              runHandler() {
                return Promise.reject(reason)
              },
              setEvent() {},
            }
          },
        })

        const result = await invokeAsyncController.invokeAsync("foo", {})

        // unhandled rejections are reported after the microtask queue drained
        await setImmediate()

        assert.deepStrictEqual(result, {
          StatusCode: 202,
        })
        assert.deepStrictEqual(unhandledRejections, [])
      } finally {
        process.off("unhandledRejection", onUnhandledRejection)
      }
    })
  })
})
