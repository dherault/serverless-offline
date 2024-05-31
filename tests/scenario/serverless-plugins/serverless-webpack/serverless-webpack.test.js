import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"
import installNpmModules from "../../../installNpmModules.js"

describe("serverless-webpack", function describe() {
  before(async () => {
    await installNpmModules(join(import.meta.url, "app"))
  })

  beforeEach(async () => {
    await setup({
      servicePath: join(import.meta.url, "app"),
    })
  })

  afterEach(() => teardown())

  it("should work with serverless-webpack", async () => {
    const url = new URL("/dev/serverless-webpack", BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: "serverless-webpack!",
    }

    assert.deepEqual(json, expected)
  })
})
