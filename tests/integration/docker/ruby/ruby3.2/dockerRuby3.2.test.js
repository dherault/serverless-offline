import assert from "node:assert"
import { env } from "node:process"
import { join } from "desm"
import { setup, teardown } from "../../../../_testHelpers/index.js"
import { BASE_URL } from "../../../../config.js"

describe("Ruby 3.2 with Docker tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: "should work with ruby3.2 in docker container",
      expected: {
        message: "Hello Ruby 3.2!",
      },
      path: "/dev/hello",
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async function it() {
      // "Could not find 'Docker', skipping tests."
      if (!env.DOCKER_DETECTED) {
        this.skip()
      }

      const url = new URL(path, BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.equal(json.message, expected.message)
    })
  })
})
