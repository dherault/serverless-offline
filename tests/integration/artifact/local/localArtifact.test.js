import assert from "node:assert"
import { join } from "desm"
import { BASE_URL } from "../../../config.js"
import {
  compressArtifact,
  setup,
  teardown,
} from "../../../_testHelpers/index.js"

describe("Local artifact tests", function desc() {
  beforeEach(async () => {
    await Promise.all([
      compressArtifact(join(import.meta.url), "artifacts/hello1.zip", [
        "src/handler1.js",
        "src/package.json",
      ]),
      compressArtifact(join(import.meta.url), "artifacts/hello2.zip", [
        "src/handler2.js",
        "src/package.json",
      ]),
    ])

    await setup({
      servicePath: join(import.meta.url),
    })
  })

  afterEach(() => teardown())

  //
  ;[
    {
      description: "should work with service artifact",
      expected: {
        message: "handler1: Hello Node.js!",
      },
      path: "/dev/hello1",
    },
    {
      description: "should work with function artifact",
      expected: {
        message: "handler2: Hello Node.js!",
      },
      path: "/dev/hello2",
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
