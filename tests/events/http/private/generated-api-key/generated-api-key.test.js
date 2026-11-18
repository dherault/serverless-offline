import assert from "node:assert"

import { join } from "desm"

import { setup, teardown } from "../../../../_testHelpers/index.js"
import { BASE_URL } from "../../../../config.js"

describe("generated api key tests", function desc() {
  afterEach(() => teardown())
  it("should generate an API key and use it", async () => {
    let output = ""
    let stdoutData

    const generatedApiKey = new Promise((res) => {
      // the key can share a chunk with the earlier "Remember to use 'x-api-key'"
      // line, or be split across chunks, so match against all the output
      stdoutData = (data) => {
        output += String(data)

        const match = /Key with token: '([^']+)'/.exec(output)

        if (match) {
          res(match[1])
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
