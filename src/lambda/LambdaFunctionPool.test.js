import assert from "node:assert"
import LambdaFunctionPool from "./LambdaFunctionPool.js"

function createFakeLambdaFunction(initialStatus = "IDLE") {
  let currentStatus = initialStatus

  return {
    cleanedUp: false,

    cleanup() {
      this.cleanedUp = true
      return Promise.resolve()
    },

    get idleTimeInMillis() {
      return currentStatus === "IDLE" ? 999_999 : 0
    },

    setStatus(val) {
      currentStatus = val
    },

    get status() {
      return currentStatus
    },
  }
}

const BASE_OPTIONS = {
  reloadHandler: false,
  terminateIdleLambdaTime: 9999,
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe("LambdaFunctionPool", () => {
  let pool

  afterEach(async () => {
    if (pool) {
      await pool.cleanup()
    }
  })

  describe("flushPool", () => {
    it("should return a new instance after flush", async () => {
      const instances = []
      const factory = () => {
        const fn = createFakeLambdaFunction()
        instances.push(fn)
        return fn
      }

      pool = new LambdaFunctionPool(null, BASE_OPTIONS, {
        createFunction: factory,
      })
      pool.start()

      pool.get("myFunc", {})
      assert.strictEqual(instances.length, 1)

      await pool.flushPool()

      pool.get("myFunc", {})
      assert.strictEqual(instances.length, 2)
      assert.notStrictEqual(instances[0], instances[1])
    })

    it("should cleanup IDLE instances immediately", async () => {
      const idleFn = createFakeLambdaFunction("IDLE")

      pool = new LambdaFunctionPool(null, BASE_OPTIONS, {
        createFunction: () => idleFn,
      })
      pool.start()
      pool.get("myFunc", {})

      await pool.flushPool()

      assert.strictEqual(idleFn.cleanedUp, true)
    })

    it("should not cleanup BUSY instances during flush", async () => {
      const busyFn = createFakeLambdaFunction("BUSY")

      pool = new LambdaFunctionPool(null, BASE_OPTIONS, {
        createFunction: () => busyFn,
      })
      pool.start()
      pool.get("myFunc", {})

      await pool.flushPool()

      assert.strictEqual(busyFn.cleanedUp, false)
    })

    it("should retire BUSY instances and cleanup on shutdown", async () => {
      const busyFn = createFakeLambdaFunction("BUSY")

      pool = new LambdaFunctionPool(null, BASE_OPTIONS, {
        createFunction: () => busyFn,
      })
      pool.start()
      pool.get("myFunc", {})

      await pool.flushPool()
      assert.strictEqual(busyFn.cleanedUp, false)

      // full cleanup (shutdown) should drain retiring set
      await pool.cleanup()
      assert.strictEqual(busyFn.cleanedUp, true)

      // prevent afterEach double-cleanup
      pool = null
    })

    it("should cleanup retired instances shortly after they become IDLE", async () => {
      const busyFn = createFakeLambdaFunction("BUSY")

      pool = new LambdaFunctionPool(null, BASE_OPTIONS, {
        createFunction: () => busyFn,
        retireCheckIntervalMs: 10,
      })
      pool.start()
      pool.get("myFunc", {})

      await pool.flushPool()
      assert.strictEqual(busyFn.cleanedUp, false)

      busyFn.setStatus("IDLE")
      await sleep(60)

      assert.strictEqual(busyFn.cleanedUp, true)
    })
  })
})
