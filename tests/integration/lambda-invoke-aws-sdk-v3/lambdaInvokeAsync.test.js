import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"
import installNpmModules from "../../installNpmModules.js"

describe("Lambda.invokeAsync aws-sdk v3 tests", function desc() {
  before(async () => {
    await installNpmModules(join(import.meta.url, "src"))
  })

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
        "should invoke the asynchronous function and return status 202",
      expected: {
        Payload: {},
        StatusCode: 202,
      },
      path: "/dev/invoke-async",
      status: 200,
    },
  ].forEach(({ description, expected, path, status }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(json, expected)
    })
  })
})
