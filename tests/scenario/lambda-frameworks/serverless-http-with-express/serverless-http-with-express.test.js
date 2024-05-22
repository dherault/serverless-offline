import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"
import installNpmModules from "../../../installNpmModules.js"

const { stringify } = JSON

describe("serverless-http with express", function desc() {
  before(async () => {
    await installNpmModules(join(import.meta.url, "app"))
  })

  beforeEach(async () => {
    await setup({
      servicePath: join(import.meta.url, "app"),
    })
  })

  afterEach(() => teardown())

  it("get", async () => {
    const url = new URL("/dev/api/info", BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      application: "sample-app",
      foo: "bar",
    }

    assert.deepEqual(json, expected)
  })

  it("post", async () => {
    const url = new URL("/dev/api/foo", BASE_URL)
    const response = await fetch(url, {
      body: stringify({
        foo: "bar",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })

    const json = await response.json()

    const expected = {
      foo: "bar",
    }

    assert.deepEqual(json, expected)
  })
})
