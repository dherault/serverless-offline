import assert from "node:assert"

// uses the same tests as parseMultiValueQueryStringParameters
import tests from "./parseMultiValueQueryStringParameters.test.js"
import parseQueryStringParametersForPayloadV2 from "../parseQueryStringParametersForPayloadV2.js"
import { BASE_URL_PLACEHOLDER } from "../../config/index.js"

describe("parseQueryStringParametersForPayloadV2", () => {
  tests.forEach(({ description, expected, expectedV2, param }) => {
    const url = `/foo?${param}`
    const { searchParams } = new URL(url, BASE_URL_PLACEHOLDER)

    it(`should return ${description}`, () => {
      const result = parseQueryStringParametersForPayloadV2(searchParams)
      if (expectedV2) {
        assert.deepEqual(result, expectedV2)
      } else {
        assert.deepEqual(result, expected)
      }
    })
  })
})
