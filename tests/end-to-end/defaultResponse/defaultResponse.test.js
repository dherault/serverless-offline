import assert from "node:assert"
import { join } from "desm"
import { BASE_URL } from "../../config.js"
import { setup, teardown } from "../../_testHelpers/index.js"

describe("default response", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url, "src"),
    }),
  )

  afterEach(() => teardown())

  it("when no default response is provided", async () => {
    const url = new URL("/dev/product_without_default", BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    assert.deepEqual(json, {
      foo: "bar",
    })
  })

  it("when default response is provided", async () => {
    const url = new URL("/dev/product_with_default", BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    assert.deepEqual(json, {
      foo: "bar",
    })
  })
})
