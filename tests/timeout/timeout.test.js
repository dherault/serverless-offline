import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../_testHelpers/index.js"
import { BASE_URL } from "../config.js"

describe("handler payload tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: "http code 504 after timeout",
      // expected: 'foo',
      path: "/dev/timeout-handler",
      status: 504,
    },
  ].forEach(({ description, path, status }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url)
      assert.equal(response.status, status)
    })
  })
})
