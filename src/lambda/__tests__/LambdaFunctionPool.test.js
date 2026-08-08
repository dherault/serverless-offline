import assert from "node:assert"
import { setTimeout } from "node:timers/promises"
import { join } from "desm"
import LambdaFunctionPool from "../LambdaFunctionPool.js"

const serverless = {
  config: {
    serverlessPath: "",
    servicePath: join(import.meta.url),
  },
  service: {
    provider: {
      runtime: "nodejs20.x",
    },
    service: "some-service",
  },
}

const functionDefinition = {
  handler: "fixtures/lambdaFunction-fixture.promiseHandlerDeferred",
}

const otherFunctionDefinition = {
  handler: "fixtures/lambdaFunction-fixture.asyncFunctionHandler",
}

describe("LambdaFunctionPool", () => {
  let pool

  afterEach(async () => {
    await pool.cleanup()
  })

  describe("#get", () => {
    it("should create an instance for an unknown function key", () => {
      pool = new LambdaFunctionPool(serverless, {})

      const lambdaFunction = pool.get("foo", functionDefinition)

      assert.ok(lambdaFunction)
      assert.strictEqual(lambdaFunction.status, "IDLE")
    })

    it("should reuse an IDLE instance", () => {
      pool = new LambdaFunctionPool(serverless, {})

      const first = pool.get("foo", functionDefinition)
      const second = pool.get("foo", functionDefinition)

      assert.strictEqual(first, second)
    })

    it("should create a new instance while the pooled one is BUSY", async () => {
      pool = new LambdaFunctionPool(serverless, {})

      const first = pool.get("foo", functionDefinition)
      first.setEvent({})

      // NOTE: runHandler() flips the status to BUSY synchronously, so no await
      // may happen between the call and the second get()
      const invocation = first.runHandler()

      assert.strictEqual(first.status, "BUSY")

      const second = pool.get("foo", functionDefinition)

      assert.notStrictEqual(first, second)
      assert.strictEqual(second.status, "IDLE")

      await invocation

      // once the first one is IDLE again, it is a reuse candidate
      assert.strictEqual(first.status, "IDLE")
      assert.ok([first, second].includes(pool.get("foo", functionDefinition)))
    })

    it("should keep instances of different function keys apart", () => {
      pool = new LambdaFunctionPool(serverless, {})

      const foo = pool.get("foo", functionDefinition)
      const bar = pool.get("bar", otherFunctionDefinition)

      assert.notStrictEqual(foo, bar)
      assert.strictEqual(pool.get("foo", functionDefinition), foo)
      assert.strictEqual(pool.get("bar", otherFunctionDefinition), bar)
    })

    describe("when the reloadHandler option is set", () => {
      it("should never reuse an instance", () => {
        pool = new LambdaFunctionPool(serverless, { reloadHandler: true })

        const first = pool.get("foo", functionDefinition)
        const second = pool.get("foo", functionDefinition)
        const third = pool.get("foo", functionDefinition)

        assert.notStrictEqual(first, second)
        assert.notStrictEqual(second, third)
        assert.notStrictEqual(first, third)
      })
    })
  })

  describe("#start", () => {
    it("should terminate instances which have been idle for too long", async () => {
      pool = new LambdaFunctionPool(serverless, {
        terminateIdleLambdaTime: 0.05,
      })
      pool.start()

      const first = pool.get("foo", functionDefinition)

      await setTimeout(300)

      const second = pool.get("foo", functionDefinition)

      assert.notStrictEqual(first, second)
    })

    it("should not terminate an instance which is still BUSY", async () => {
      pool = new LambdaFunctionPool(serverless, {
        terminateIdleLambdaTime: 0.05,
      })
      pool.start()

      const first = pool.get("foo", {
        handler: "fixtures/lambdaFunction-fixture.sleepHandler",
      })
      first.setEvent({ ms: 600 })

      const invocation = first.runHandler()

      await setTimeout(300)

      assert.strictEqual(first.status, "BUSY")

      await invocation
    })
  })
})
