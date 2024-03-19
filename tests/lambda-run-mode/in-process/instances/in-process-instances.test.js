import assert from "node:assert"
import { setTimeout } from "node:timers/promises"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"

describe("run mode with in-process", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  it("does not create a new lambda instance, instead uses same", async () => {
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
      assert.deepEqual(json, 10)
    })
  })

  it("re-uses existing lambda instance when idle", async () => {
    const url = new URL("/dev/foo", BASE_URL)

    const results = []

    // eslint-disable-next-line no-unused-vars
    for (const _ of new Array(5)) {
      // eslint-disable-next-line no-await-in-loop
      await setTimeout(2000)
      results.push(fetch(url))
    }

    const responses = await Promise.all(results)

    responses.forEach((response) => {
      assert.equal(response.status, 200)
    })

    const jsons = await Promise.all(
      responses.map((response) => response.json()),
    )

    let sort = 0

    jsons.sort().forEach((json) => {
      sort += 1
      assert.deepEqual(json, sort)
    })
  })
})
