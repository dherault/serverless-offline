import assert from "node:assert"
import { env } from "node:process"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"

describe("Custom runtime from a layer with Docker tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description:
        "should run the bootstrap of a layer and expose the layer under /opt",
      expected: {
        message: "Hello from a layer!",
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

      assert.deepEqual(json, expected)
    })
  })
})
