import assert from "node:assert"
import getHttpApiCorsConfig from "../getHttpApiCorsConfig.js"

describe("getHttpApiCorsConfig", () => {
  describe("when cors is set to true", () => {
    it("should return the AWS default policy", () => {
      assert.deepStrictEqual(getHttpApiCorsConfig(true), {
        allowedHeaders: [
          "Authorization",
          "Content-Type",
          "X-Amz-Date",
          "X-Amz-Security-Token",
          "X-Amz-User-Agent",
          "X-Api-Key",
        ],
        allowedMethods: ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"],
        allowedOrigins: ["*"],
      })
    })

    it("should return a fresh object on every call", () => {
      const first = getHttpApiCorsConfig(true)
      const second = getHttpApiCorsConfig(true)

      assert.notStrictEqual(first, second)

      first.allowedOrigins.push("https://example.com")

      assert.deepStrictEqual(second.allowedOrigins, ["*"])
    })
  })

  describe("when cors is a custom object", () => {
    it("should return the object untouched", () => {
      const custom = {
        allowCredentials: true,
        allowedHeaders: ["X-Custom"],
        allowedMethods: ["GET"],
        allowedOrigins: ["https://example.com"],
        maxAge: 600,
      }

      assert.strictEqual(getHttpApiCorsConfig(custom), custom)
    })
  })

  describe("when cors is not set", () => {
    it("should return undefined", () => {
      assert.strictEqual(getHttpApiCorsConfig(undefined), undefined)
    })

    it("should return false", () => {
      assert.strictEqual(getHttpApiCorsConfig(false), false)
    })
  })
})
