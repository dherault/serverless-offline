import assert from "node:assert"
import getApiKeysValues from "../getApiKeysValues.js"

describe("getApiKeysValues", () => {
  it("should handle objects and strings", () => {
    const result = getApiKeysValues([
      {
        name: "MY_FIRST_KEY_NAME",
        value: "MY_FIRST_KEY_VALUE",
      },
      "MY_SECOND_KEY_VALUE",
    ])
    assert.deepEqual(
      result,
      new Set(["MY_FIRST_KEY_VALUE", "MY_SECOND_KEY_VALUE"]),
    )
  })
})
