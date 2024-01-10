import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"

describe("handler module format: commonjs", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: "...",
      expected: "bar",
      path: "/dev/namespace-export-1",
      status: 200,
    },

    {
      description: "...",
      expected: "foobar",
      path: "/dev/namespace-export-2",
      status: 200,
    },

    {
      description: "...",
      expected: "static",
      path: "/dev/namespace-export-3",
      status: 200,
    },

    {
      description: "...",
      expected: "prototype",
      path: "/dev/namespace-export-4",
      status: 200,
    },

    {
      description: "...",
      expected: "foo",
      path: "/dev/js-extension",
      status: 200,
    },

    {
      description: "...",
      expected: "foo",
      path: "/dev/cjs-extension",
      status: 200,
    },

    {
      description: "...",
      expected: "foo",
      path: "/dev/package-type",
      status: 200,
    },
  ].forEach(({ description, expected, path, status }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url)
      assert.equal(response.status, status)

      if (expected) {
        const json = await response.json()
        assert.deepEqual(json, expected)
      }
    })
  })
})
