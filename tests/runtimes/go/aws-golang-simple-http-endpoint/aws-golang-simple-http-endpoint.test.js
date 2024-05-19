/* eslint-disable no-await-in-loop */
import assert from "node:assert"
import { env } from "node:process"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"

describe("aws golang simple http endpoint", function desc() {
  beforeEach(async () => {
    await setup({
      servicePath: join(import.meta.url),
    })
  })

  afterEach(() => teardown())

  it("get /hello", async function it() {
    if (!env.GO1X_DETECTED) {
      this.skip()
    }

    // We GET /hello multiple times to avoid regression of https://github.com/dherault/serverless-offline/issues/1504
    for (let i = 0; i < 3; i += 1) {
      const url = new URL("/hello", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      const expected = {
        message: "Go Serverless v1.0! Your function executed successfully!",
      }

      assert.deepEqual(json, expected)
    }
  })

  it("get /world", async function it() {
    if (!env.GO1X_DETECTED) {
      this.skip()
    }

    // We GET /world multiple times to avoid regression of https://github.com/dherault/serverless-offline/issues/1504
    for (let i = 0; i < 3; i += 1) {
      const url = new URL("/world", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      const expected = {
        message: "Okay so your other function also executed successfully!",
      }

      assert.deepEqual(json, expected)
    }
  })
})
