import assert from "node:assert"
import { env } from "node:process"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"

describe("Go 1.x with GoRunner", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: "should work with go1.x",
      expected: {
        message: "Hello Go 1.x!",
      },
      path: "/dev/hello",
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async function it() {
      if (!env.GO1X_DETECTED) {
        this.skip()
      }

      const url = new URL(path, BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
