import assert from "node:assert"
import { env } from "node:process"
import { join } from "desm"
import {
  compressArtifact,
  setup,
  teardown,
} from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"

describe("Artifact with docker tests", function desc() {
  beforeEach(async () => {
    await compressArtifact(join(import.meta.url), "artifacts/hello.zip", [
      "handler.js",
    ])
    return setup({
      servicePath: join(import.meta.url),
    })
  })

  afterEach(() => teardown())
  ;[
    {
      description: "should work with artifact in docker container",
      expected: {
        message: "Hello Node.js!",
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
