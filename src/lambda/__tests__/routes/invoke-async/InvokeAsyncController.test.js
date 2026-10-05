import assert from "node:assert"
import process from "node:process"
import { setImmediate } from "node:timers/promises"
import InvokeAsyncController from "../../../routes/invoke-async/InvokeAsyncController.js"

describe("InvokeAsyncController", () => {
  it("should not cause an unhandled rejection when the handler fails", async () => {
    const unhandledRejections = []
    const onUnhandledRejection = (reason) => {
      unhandledRejections.push(reason)
    }

    process.on("unhandledRejection", onUnhandledRejection)

    try {
      const invokeAsyncController = new InvokeAsyncController({
        getByFunctionName() {
          return {
            async runHandler() {
              throw new Error("boom")
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
