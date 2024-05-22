import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"
import installNpmModules from "../../../installNpmModules.js"

const { stringify } = JSON

describe("apollo server integrations", function desc() {
  before(async () => {
    await installNpmModules(join(import.meta.url, "app"))
  })

  beforeEach(async () => {
    await setup({
      servicePath: join(import.meta.url, "app"),
    })
  })

  afterEach(() => teardown())

  it("apollo server lambda tests", async () => {
    const url = new URL("/dev/graphql", BASE_URL)

    const response = await fetch(url, {
      body: stringify({
        query: `query test {
          hello
        }`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
    const json = await response.json()

    const expected = {
      data: {
        hello: "Hello graphql!",
      },
    }

    assert.deepEqual(json, expected)
  })
})
