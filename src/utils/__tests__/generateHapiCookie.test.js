import assert from "node:assert"
import generateHapiCookie from "../generateHapiCookie.js"

describe("generateHapiCookie", () => {
  describe("when cookie string has no equals sign", () => {
    it("should return cookie with name only and empty value", () => {
      const result = generateHapiCookie("session")

      assert.equal(result.name, "session")
      assert.equal(result.value, "")
      assert.equal(result.options.ttl, undefined)
      assert.equal(result.options.isSecure, false)
      assert.equal(result.options.isHttpOnly, false)
      assert.equal(result.options.path, undefined)
      assert.equal(result.options.domain, undefined)
      assert.equal(result.options.isSameSite, false)
      assert.equal(result.options.encoding, "none")
      assert.equal(result.options.strictHeader, false)
    })
  })

  describe("when cookie string has name and value only", () => {
    it("should parse basic cookie", () => {
      const result = generateHapiCookie("session=abc123")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.ttl, undefined)
      assert.equal(result.options.isSecure, undefined)
      assert.equal(result.options.isHttpOnly, undefined)
      assert.equal(result.options.path, undefined)
      assert.equal(result.options.domain, undefined)
      assert.equal(result.options.isSameSite, false)
      assert.equal(result.options.encoding, "none")
      assert.equal(result.options.strictHeader, false)
    })
  })

  describe("when cookie string has attributes", () => {
    it("should parse cookie with max-age", () => {
      const result = generateHapiCookie("session=abc123; max-age=3600")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.ttl, 3600 * 1000)
    })

    it("should parse cookie with secure attribute", () => {
      const result = generateHapiCookie("session=abc123; secure")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.isSecure, true)
    })

    it("should parse cookie with httponly attribute", () => {
      const result = generateHapiCookie("session=abc123; httponly")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.isHttpOnly, true)
    })

    it("should parse cookie with path attribute", () => {
      const result = generateHapiCookie("session=abc123; path=/")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.path, "/")
    })

    it("should parse cookie with domain attribute", () => {
      const result = generateHapiCookie("session=abc123; domain=example.com")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.domain, "example.com")
    })

    it("should parse cookie with samesite attribute", () => {
      const result = generateHapiCookie("session=abc123; samesite=strict")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.isSameSite, "strict")
    })
  })

  describe("when cookie string has multiple attributes", () => {
    it("should parse all attributes correctly", () => {
      const result = generateHapiCookie(
        "session=abc123; max-age=7200; secure; httponly; path=/api; domain=example.com; samesite=lax",
      )

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.ttl, 7200 * 1000)
      assert.equal(result.options.isSecure, true)
      assert.equal(result.options.isHttpOnly, true)
      assert.equal(result.options.path, "/api")
      assert.equal(result.options.domain, "example.com")
      assert.equal(result.options.isSameSite, "lax")
      assert.equal(result.options.encoding, "none")
      assert.equal(result.options.strictHeader, false)
    })
  })

  describe("edge cases", () => {
    it("should handle cookie with empty value", () => {
      const result = generateHapiCookie("session=")

      assert.equal(result.name, "session")
      assert.equal(result.value, "")
    })

    it("should handle cookie with spaces around attributes", () => {
      const result = generateHapiCookie("session=abc123;  secure ;  httponly")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.isSecure, true)
      assert.equal(result.options.isHttpOnly, true)
    })

    it("should handle cookie with mixed case attribute names", () => {
      const result = generateHapiCookie("session=abc123; Secure; HTTPONLY")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.isSecure, true)
      assert.equal(result.options.isHttpOnly, true)
    })

    it("should handle invalid max-age value", () => {
      const result = generateHapiCookie("session=abc123; max-age=invalid")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.ttl, undefined)
    })

    it("should handle max-age with infinity", () => {
      const result = generateHapiCookie("session=abc123; max-age=Infinity")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      assert.equal(result.options.ttl, undefined)
    })

    it("should handle attribute without value", () => {
      const result = generateHapiCookie("session=abc123; unknownattr")

      assert.equal(result.name, "session")
      assert.equal(result.value, "abc123")
      // The unknownattr should be set to true in the attributes map
      // but not mapped to any specific option
    })
  })

  describe("complex cookie examples", () => {
    it("should handle typical session cookie", () => {
      const cookieString =
        "sessionId=38afes7a8; Path=/; Domain=example.com; Secure; HttpOnly; SameSite=Lax; Max-Age=3600"
      const result = generateHapiCookie(cookieString)

      assert.equal(result.name, "sessionId")
      assert.equal(result.value, "38afes7a8")
      assert.equal(result.options.ttl, 3600 * 1000)
      assert.equal(result.options.isSecure, true)
      assert.equal(result.options.isHttpOnly, true)
      assert.equal(result.options.path, "/")
      assert.equal(result.options.domain, "example.com")
      assert.equal(result.options.isSameSite, "Lax")
    })

    it("should handle cookie with value containing special characters", () => {
      const result = generateHapiCookie(
        "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9; secure",
      )

      assert.equal(result.name, "auth_token")
      assert.equal(result.value, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
      assert.equal(result.options.isSecure, true)
    })
  })
})
