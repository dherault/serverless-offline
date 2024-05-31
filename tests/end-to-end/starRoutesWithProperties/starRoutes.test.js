import assert from "node:assert"
import { join } from "desm"
import { BASE_URL } from "../../config.js"
import { setup, teardown } from "../../_testHelpers/index.js"

describe("star routes with properties", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url, "src"),
    }),
  )

  afterEach(() => teardown())

  describe("when a catch-all route is defined with path and method", () => {
    it("it should return a payload", async () => {
      const url = new URL("/dev", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, { foo: "bar" })
    })
  })
})
