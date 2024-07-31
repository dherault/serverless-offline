import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"
import installNpmModules from "../../../installNpmModules.js"

describe("serverless-plugin-typescript", function desc() {
  before(async () => {
    await installNpmModules(join(import.meta.url, "app"))
  })

  beforeEach(async () => {
    await setup({
      servicePath: join(import.meta.url, "app"),
    })
  })

  afterEach(() => teardown())

  it("should work with serverless-plugin-typescript", async () => {
    const url = new URL("/dev/serverless-plugin-typescript", BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: "serverless-plugin-typescript!",
    }

    assert.deepEqual(json, expected)
  })
})
