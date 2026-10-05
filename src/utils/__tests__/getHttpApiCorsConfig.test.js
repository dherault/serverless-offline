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
    it("should keep the configured settings", () => {
      const custom = {
        allowCredentials: true,
        allowedHeaders: ["X-Custom"],
        allowedMethods: ["GET"],
        allowedOrigins: ["https://example.com"],
        exposedResponseHeaders: ["X-Exposed"],
        maxAge: 600,
      }

      assert.deepStrictEqual(getHttpApiCorsConfig(custom), custom)
    })

    // a CORS config without origins is rejected by hapi, which crashed the startup
    it("should fall back to the default values for missing settings", () => {
      assert.deepStrictEqual(getHttpApiCorsConfig({ allowCredentials: true }), {
        allowCredentials: true,
        ...getHttpApiCorsConfig(true),
      })
    })

    it("should accept single values instead of lists", () => {
      assert.deepStrictEqual(
        getHttpApiCorsConfig({
          allowedHeaders: "X-Custom",
          allowedMethods: "GET",
          allowedOrigins: "https://example.com",
          exposedResponseHeaders: "X-Exposed",
        }),
        {
          allowedHeaders: ["X-Custom"],
          allowedMethods: ["GET"],
          allowedOrigins: ["https://example.com"],
          exposedResponseHeaders: ["X-Exposed"],
        },
      )
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
