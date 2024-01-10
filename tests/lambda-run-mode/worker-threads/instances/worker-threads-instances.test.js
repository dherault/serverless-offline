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

  it("should create a new lambda instance", async () => {
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
      assert.deepEqual(json, 1)
    })
  })

  it("should re-use existing lambda instance when idle", async () => {
    const url = new URL("/dev/foo", BASE_URL)

    // eslint-disable-next-line no-unused-vars
    for (const i of new Array(5).keys()) {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(url)
      // eslint-disable-next-line no-await-in-loop
      const json = await response.json()

      assert.equal(response.status, 200)
      assert.deepEqual(json, i + 1)
    }
  })
})
