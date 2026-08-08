import assert from "node:assert"
import jsonPath from "../jsonPath.js"

describe("jsonPath", () => {
  const json = {
    store: {
      book: [
        { author: "Nigel Rees", price: 8.95, title: "Sayings of the Century" },
        { author: "Evelyn Waugh", price: 12.99, title: "Sword of Honour" },
      ],
    },
  }

  it("should return a top level property", () => {
    assert.deepStrictEqual(jsonPath(json, "$.store"), json.store)
  })

  it("should return a nested property", () => {
    assert.strictEqual(
      jsonPath(json, "$.store.book[0].title"),
      "Sayings of the Century",
    )
  })

  it("should return only the first match of a wildcard", () => {
    assert.strictEqual(jsonPath(json, "$.store.book[*].author"), "Nigel Rees")
  })

  it("should return undefined for a path that does not match", () => {
    assert.strictEqual(jsonPath(json, "$.store.magazine"), undefined)
  })

  it("should return undefined for non JSON input", () => {
    assert.strictEqual(jsonPath(null, "$.foo"), undefined)
    assert.strictEqual(jsonPath(undefined, "$.foo"), undefined)
    assert.strictEqual(jsonPath("a string", "$.foo"), undefined)
    assert.strictEqual(jsonPath(42, "$.foo"), undefined)
  })
})
