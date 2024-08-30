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
      description: "should return 'bar' for namespace-export-1 endpoint",
      expected: "bar",
      path: "/dev/namespace-export-1",
      status: 200,
    },

    {
      description: "should return 'foobar' for namespace-export-2 endpoint",
      expected: "foobar",
      path: "/dev/namespace-export-2",
      status: 200,
    },

    {
      description: "should return 'static' for namespace-export-3 endpoint",
      expected: "static",
      path: "/dev/namespace-export-3",
      status: 200,
    },

    {
      description: "should return 'prototype' for namespace-export-4 endpoint",
      expected: "prototype",
      path: "/dev/namespace-export-4",
      status: 200,
    },

    {
      description: "should return 'foo' for js-extension endpoint",
      expected: "foo",
      path: "/dev/js-extension",
      status: 200,
    },

    {
      description: "should return 'foo' for cjs-extension endpoint",
      expected: "foo",
      path: "/dev/cjs-extension",
      status: 200,
    },

    {
      description: "should return 'foo' for package-type endpoint",
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
