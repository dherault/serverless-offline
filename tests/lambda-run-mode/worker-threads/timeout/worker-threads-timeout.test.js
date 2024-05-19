import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"

describe("run mode with worker threads", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  it("context.getRemainingTimeInMillis() should return the correct remaining time", async () => {
    const url = new URL("/dev/foo", BASE_URL)

    const response = await fetch(url)
    const json = await response.json()

    assert.equal(response.status, 200)
    assert.equal(json.counter, 1)
    assert.ok(json.remainingTime >= 8800 && json.remainingTime <= 9000)
  })

  it("context.getRemainingTimeInMillis() should return the correct remaining time with multiple instances", async () => {
    const url = new URL("/dev/foo", BASE_URL)

    const responses = await Promise.all(
      Array.from(new Array(10).keys()).map(() => fetch(url)),
    )

    responses.forEach((response) => {
      assert.equal(response.status, 200)
    })

    const jsons = await Promise.all(
      responses.map((response) => response.json()),
    )

    jsons.forEach((json) => {
      assert.equal(json.counter, 1)
      assert.ok(json.remainingTime >= 8800 && json.remainingTime <= 9000)
    })
  })

  it("context.getRemainingTimeInMillis() should return the correct remaining time with the same instance", async () => {
    const url = new URL("/dev/foo", BASE_URL)

    // eslint-disable-next-line no-unused-vars
    for (const i of new Array(5).keys()) {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(url)
      // eslint-disable-next-line no-await-in-loop
      const json = await response.json()

      assert.equal(response.status, 200)
      assert.deepEqual(json.counter, i + 1)
      assert.ok(json.remainingTime >= 8800 && json.remainingTime <= 9000)
    }
  })

  it("lambdas should not timeout (#1592)", async () => {
    const url = new URL("/dev/foo-2", BASE_URL)

    // eslint-disable-next-line no-unused-vars
    for (const i of new Array(5).keys()) {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(url)
      // eslint-disable-next-line no-await-in-loop
      const json = await response.json()

      assert.equal(response.status, 200)
      assert.deepEqual(json.counter, i + 1)
    }
  })
})
