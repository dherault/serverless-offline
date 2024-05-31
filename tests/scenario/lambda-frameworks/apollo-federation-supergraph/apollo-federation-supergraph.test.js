import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"
import installNpmModules from "../../../installNpmModules.js"

const { stringify } = JSON

describe("apollo federation supergraph", function desc() {
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
          me {
            id
            username
          }
          
          allProducts {
            id
            dimensions {
              size
            }
            delivery {
              estimatedDelivery
            }
          }
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
        allProducts: [
          {
            delivery: {
              estimatedDelivery: "6/25/2021",
            },
            dimensions: {
              size: "1",
            },
            id: "apollo-federation",
          },
          {
            delivery: {
              estimatedDelivery: "6/25/2021",
            },
            dimensions: {
              size: "1",
            },
            id: "apollo-studio",
          },
        ],
        me: {
          id: "1",
          username: "@ava",
        },
      },
    }

    assert.deepEqual(json, expected)
  })
})
