import assert from "node:assert"
import FileWatcher from "./FileWatcher.js"

class FakeFsWatcher {
  #callback = null

  #events = new Map()

  closed = false

  options = null

  servicePath = null

  constructor(callback) {
    this.#callback = callback
  }

  close() {
    this.closed = true
  }

  emitChange(filename) {
    this.#callback("change", filename)
  }

  on(event, callback) {
    this.#events.set(event, callback)
    return this
  }

  emitError(error) {
    const callback = this.#events.get("error")

    if (callback) {
      callback(error)
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe("FileWatcher", () => {
  let fileWatcher
  let fakeWatcher

  afterEach(async () => {
    if (fileWatcher) {
      await fileWatcher.stop()
      fileWatcher = null
    }
  })

  function createWatcher(servicePath, options, callback) {
    fakeWatcher = new FakeFsWatcher(callback)
    fakeWatcher.servicePath = servicePath
    fakeWatcher.options = options

    return fakeWatcher
  }

  it("should flush lambda pool on file changes", async () => {
    let flushCalls = 0
    const lambda = {
      async flushPool() {
        flushCalls += 1
      },
    }

    fileWatcher = new FileWatcher("/service", lambda, {
      createWatcher,
      debounceMs: 10,
    })

    fileWatcher.start()
    fakeWatcher.emitChange("src/handler.js")
    await sleep(40)

    assert.strictEqual(flushCalls, 1)
    assert.strictEqual(fakeWatcher.servicePath, "/service")
    assert.deepStrictEqual(fakeWatcher.options, { recursive: true })
  })

  it("should ignore configured directories for both path separators", async () => {
    let flushCalls = 0
    const lambda = {
      async flushPool() {
        flushCalls += 1
      },
    }

    fileWatcher = new FileWatcher("/service", lambda, {
      createWatcher,
      debounceMs: 10,
    })

    fileWatcher.start()
    fakeWatcher.emitChange("node_modules/pkg/index.js")
    fakeWatcher.emitChange(String.raw`node_modules\pkg\index.js`)
    fakeWatcher.emitChange(".webpack/main.js")
    await sleep(40)

    assert.strictEqual(flushCalls, 0)
  })

  it("should not enqueue new flushes after stop begins", async () => {
    let flushCalls = 0
    let firstFlushStartedResolve = null
    let releaseFirstFlush = null

    const firstFlushStarted = new Promise((resolve) => {
      firstFlushStartedResolve = resolve
    })

    const firstFlushDone = new Promise((resolve) => {
      releaseFirstFlush = resolve
    })

    const lambda = {
      async flushPool() {
        flushCalls += 1

        if (flushCalls === 1) {
          firstFlushStartedResolve()
          await firstFlushDone
        }
      },
    }

    fileWatcher = new FileWatcher("/service", lambda, {
      createWatcher,
      debounceMs: 10,
    })

    fileWatcher.start()
    fakeWatcher.emitChange("src/one.js")
    await firstFlushStarted

    const stopPromise = fileWatcher.stop()
    fakeWatcher.emitChange("src/two.js")
    releaseFirstFlush()
    await stopPromise
    await sleep(40)

    assert.strictEqual(flushCalls, 1)
    assert.strictEqual(fakeWatcher.closed, true)

    fileWatcher = null
  })
})
