import assert from "node:assert"
import matchAlbConditions from "../matchAlbConditions.js"

function request({ headers = {}, query = {} } = {}) {
  return { headers, query }
}

describe("matchAlbConditions", () => {
  it("should match when there is no condition to evaluate", () => {
    assert.equal(matchAlbConditions(undefined, request()), true)
    assert.equal(matchAlbConditions({}, request()), true)
  })

  it("should not evaluate the path, the method and the ip conditions", () => {
    const conditions = {
      ip: ["10.0.0.0/8"],
      method: ["POST"],
      path: ["/api/order"],
    }

    assert.equal(matchAlbConditions(conditions, request()), true)
  })

  describe("header conditions", () => {
    const conditions = {
      header: {
        name: "x-function",
        values: ["CREATE"],
      },
    }

    it("should match a header value", () => {
      assert.equal(
        matchAlbConditions(
          conditions,
          request({ headers: { "x-function": "CREATE" } }),
        ),
        true,
      )
    })

    it("should match a header value case insensitively", () => {
      assert.equal(
        matchAlbConditions(
          conditions,
          request({ headers: { "x-function": "create" } }),
        ),
        true,
      )
    })

    it("should match a header name case insensitively", () => {
      assert.equal(
        matchAlbConditions(
          { header: { name: "X-Function", values: ["CREATE"] } },
          request({ headers: { "x-function": "CREATE" } }),
        ),
        true,
      )
    })

    it("should not match another header value", () => {
      assert.equal(
        matchAlbConditions(
          conditions,
          request({ headers: { "x-function": "CANCEL" } }),
        ),
        false,
      )
    })

    it("should not match a missing header", () => {
      assert.equal(matchAlbConditions(conditions, request()), false)
    })

    it("should match any of the values of a condition", () => {
      const anyOf = {
        header: { name: "x-function", values: ["CREATE", "CANCEL"] },
      }

      assert.equal(
        matchAlbConditions(
          anyOf,
          request({ headers: { "x-function": "CANCEL" } }),
        ),
        true,
      )
    })

    it("should match all of the header conditions", () => {
      const allOf = {
        header: [
          { name: "x-function", values: ["CREATE"] },
          { name: "x-tenant", values: ["acme"] },
        ],
      }

      assert.equal(
        matchAlbConditions(
          allOf,
          request({ headers: { "x-function": "CREATE", "x-tenant": "acme" } }),
        ),
        true,
      )
      assert.equal(
        matchAlbConditions(
          allOf,
          request({ headers: { "x-function": "CREATE" } }),
        ),
        false,
      )
    })

    it("should support wildcards", () => {
      assert.equal(
        matchAlbConditions(
          { header: { name: "x-function", values: ["CRE*"] } },
          request({ headers: { "x-function": "CREATE" } }),
        ),
        true,
      )
      assert.equal(
        matchAlbConditions(
          { header: { name: "x-function", values: ["CREAT?"] } },
          request({ headers: { "x-function": "CREATE" } }),
        ),
        true,
      )
      assert.equal(
        matchAlbConditions(
          { header: { name: "x-function", values: ["CREAT?"] } },
          request({ headers: { "x-function": "CREATED" } }),
        ),
        false,
      )
    })

    it("should not treat a value as a regular expression", () => {
      assert.equal(
        matchAlbConditions(
          { header: { name: "x-function", values: ["a.c"] } },
          request({ headers: { "x-function": "abc" } }),
        ),
        false,
      )
    })

    it("should search repeated headers in order", () => {
      assert.equal(
        matchAlbConditions(
          conditions,
          request({ headers: { "x-function": "CANCEL, CREATE" } }),
        ),
        true,
      )
    })
  })

  describe("host conditions", () => {
    it("should match the host header, ignoring the port", () => {
      assert.equal(
        matchAlbConditions(
          { host: ["api.example.com"] },
          request({ headers: { host: "api.example.com:3003" } }),
        ),
        true,
      )
    })

    it("should support wildcards", () => {
      assert.equal(
        matchAlbConditions(
          { host: ["*.example.com"] },
          request({ headers: { host: "api.example.com" } }),
        ),
        true,
      )
    })

    it("should not match another host", () => {
      assert.equal(
        matchAlbConditions(
          { host: ["api.example.com"] },
          request({ headers: { host: "www.example.com" } }),
        ),
        false,
      )
    })
  })

  describe("query conditions", () => {
    it("should match when one of the key/value pairs is found", () => {
      const conditions = { query: { action: "create", version: "2" } }

      assert.equal(
        matchAlbConditions(conditions, request({ query: { version: "2" } })),
        true,
      )
      assert.equal(
        matchAlbConditions(conditions, request({ query: { version: "3" } })),
        false,
      )
    })

    it("should support wildcards", () => {
      assert.equal(
        matchAlbConditions(
          { query: { action: "create*" } },
          request({ query: { action: "created" } }),
        ),
        true,
      )
    })

    it("should match a repeated query string parameter", () => {
      assert.equal(
        matchAlbConditions(
          { query: { action: "create" } },
          request({ query: { action: ["cancel", "create"] } }),
        ),
        true,
      )
    })
  })
})
