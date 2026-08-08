import assert from "node:assert"
import process from "node:process"
import { join } from "desm"
import HandlerRunner from "../HandlerRunner.js"

const servicePath = join(import.meta.url)

function funOptions(handler, runtime = "nodejs20.x") {
  return {
    codeDir: servicePath,
    functionKey: "foo",
    handler,
    runtime,
    servicePath,
    timeout: 30_000,
  }
}

const context = {}

describe("HandlerRunner", () => {
  describe("runner selection", () => {
    it("should run node handlers in a worker thread by default", async () => {
      const handlerRunner = new HandlerRunner(
        funOptions("fixtures/handlerRunner-fixture.runModeHandler"),
        {},
        {},
      )

      const result = await handlerRunner.run({}, context)

      await handlerRunner.cleanup()

      assert.strictEqual(result.isMainThread, false)
    })

    it("should run node handlers in process when useInProcess is set", async () => {
      const handlerRunner = new HandlerRunner(
        funOptions("fixtures/handlerRunner-fixture.runModeHandler"),
        { useInProcess: true },
        {},
      )

      const result = await handlerRunner.run({}, context)

      await handlerRunner.cleanup()

      assert.strictEqual(result.isMainThread, true)
    })

    it("should not report a node runner as a docker runner", async () => {
      const handlerRunner = new HandlerRunner(
        funOptions("fixtures/handlerRunner-fixture.echoHandler"),
        {},
        {},
      )

      await handlerRunner.run({}, context)

      assert.strictEqual(handlerRunner.isDockerRunner(), false)

      await handlerRunner.cleanup()
    })

    it("should throw for an unsupported runtime", async () => {
      const handlerRunner = new HandlerRunner(
        funOptions("fixtures/handlerRunner-fixture.echoHandler", "cobol1.x"),
        {},
        {},
      )

      await assert.rejects(handlerRunner.run({}, context), {
        message: "Unsupported runtime",
      })
    })
  })

  describe("#cleanup", () => {
    it("should be a no-op when no runner has been loaded", async () => {
      const handlerRunner = new HandlerRunner(
        funOptions("fixtures/handlerRunner-fixture.echoHandler"),
        {},
        {},
      )

      await handlerRunner.cleanup()
    })

    // see https://github.com/dherault/serverless-offline/issues/1896
    it("should recreate the runner on the next run", async () => {
      const handlerRunner = new HandlerRunner(
        funOptions("fixtures/handlerRunner-fixture.echoHandler"),
        {},
        {},
      )

      assert.deepStrictEqual(await handlerRunner.run({ foo: "bar" }, context), {
        foo: "bar",
      })

      // terminates the worker thread
      await handlerRunner.cleanup()

      assert.deepStrictEqual(await handlerRunner.run({ foo: "baz" }, context), {
        foo: "baz",
      })

      await handlerRunner.cleanup()
    })

    it("should be idempotent", async () => {
      const handlerRunner = new HandlerRunner(
        funOptions("fixtures/handlerRunner-fixture.echoHandler"),
        {},
        {},
      )

      await handlerRunner.run({}, context)

      await handlerRunner.cleanup()
      await handlerRunner.cleanup()
    })
  })

  describe("#run", () => {
    it("should reuse the runner across invocations", async () => {
      const handlerRunner = new HandlerRunner(
        funOptions("fixtures/handlerRunner-fixture.echoHandler"),
        {},
        {},
      )

      const first = await handlerRunner.run({ n: 1 }, context)
      const second = await handlerRunner.run({ n: 2 }, context)

      await handlerRunner.cleanup()

      assert.deepStrictEqual(first, { n: 1 })
      assert.deepStrictEqual(second, { n: 2 })
    })

    // the worker thread runner opens a MessageChannel per invocation. A message
    // port with a listener attached is a ref'ed handle, so leaving them open
    // leaks one handle per invocation for the lifetime of the offline process
    it("should not leak a message port per invocation", async () => {
      const handlerRunner = new HandlerRunner(
        funOptions("fixtures/handlerRunner-fixture.echoHandler"),
        {},
        {},
      )

      for (let i = 0; i < 50; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await handlerRunner.run({ i }, context)
      }

      const messagePorts = process
        .getActiveResourcesInfo()
        .filter((resource) => resource === "MessagePort").length

      await handlerRunner.cleanup()

      // NOTE: the port of the invocation which just finished may still be
      // around, anything beyond that is a leak
      assert.ok(
        messagePorts <= 1,
        `expected at most 1 open message port, found ${messagePorts}`,
      )
    })

    it("should reject when the handler throws", async () => {
      const handlerRunner = new HandlerRunner(
        funOptions("fixtures/handlerRunner-fixture.doesNotExist"),
        {},
        {},
      )

      await assert.rejects(handlerRunner.run({}, context))

      await handlerRunner.cleanup()
    })
  })
})
