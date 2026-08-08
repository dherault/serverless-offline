import assert from "node:assert"
import getRawQueryParams from "../getRawQueryParams.js"

describe("getRawQueryParams", () => {
  it("should return an empty string when there is no query string", () => {
    assert.strictEqual(getRawQueryParams("/foo"), "")
  })

  it("should return an empty string when the query string is empty", () => {
    assert.strictEqual(getRawQueryParams("/foo?"), "")
  })

  it("should return a single parameter", () => {
    assert.strictEqual(getRawQueryParams("/foo?bar=baz"), "bar=baz")
  })

  it("should join multiple parameters with an ampersand", () => {
    assert.strictEqual(getRawQueryParams("/foo?a=1&b=2&c=3"), "a=1&b=2&c=3")
  })

  it("should keep parameters without a value", () => {
    assert.strictEqual(getRawQueryParams("/foo?bar"), "bar=")
    assert.strictEqual(getRawQueryParams("/foo?bar="), "bar=")
  })

  // NOTE: parseQueryStringParameters is backed by URLSearchParams, which keeps
  // only the last occurrence of a repeated key
  it("should keep the last value of a repeated key", () => {
    assert.strictEqual(getRawQueryParams("/foo?a=1&a=2"), "a=2")
  })

  // NOTE: values come back percent-decoded, they are not re-encoded
  it("should return decoded values", () => {
    assert.strictEqual(getRawQueryParams("/foo?bar=a%20b"), "bar=a b")
  })
})
