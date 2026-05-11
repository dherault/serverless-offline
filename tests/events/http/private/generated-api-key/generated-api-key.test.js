import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../../../_testHelpers/index.js"
import { BASE_URL } from "../../../../config.js"

describe("generated api key tests", function desc() {
  afterEach(() => teardown())
  it("should generate an API key and use it", async () => {
    let stdoutData

    const generatedApiKey = new Promise((res) => {
      stdoutData = (data) => {
        const strData = String(data)

        if (strData.includes("Key with token: '")) {
          const fromIndex = strData.indexOf("'") + 1
          const toIndex = strData.indexOf("'", fromIndex)

          res(strData.substring(fromIndex, toIndex))
        }
      }
    })

    await setup({
      servicePath: join(import.meta.url),
      stdoutData,
    })

    const url = new URL("/dev/foo", BASE_URL)

    const response = await fetch(url, {
      headers: {
        "x-api-key": await generatedApiKey,
      },
    })
    assert.equal(response.status, 200)

    const json = await response.json()
    assert.deepEqual(json, {
      foo: "bar",
    })
  })
})
