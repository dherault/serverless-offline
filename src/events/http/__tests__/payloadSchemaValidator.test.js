import assert from "node:assert"
import payloadSchemaValidator from "../payloadSchemaValidator.js"

describe("payloadSchemaValidator", () => {
  const model = {
    properties: {
      age: {
        minimum: 0,
        type: "integer",
      },
      name: {
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  }

  it("should not throw for a valid payload", () => {
    assert.doesNotThrow(() => {
      payloadSchemaValidator(model, { age: 42, name: "Leonardo" })
    })
  })

  it("should not throw when an optional property is missing", () => {
    assert.doesNotThrow(() => {
      payloadSchemaValidator(model, { name: "Leonardo" })
    })
  })

  it("should throw when a required property is missing", () => {
    assert.throws(
      () => payloadSchemaValidator(model, { age: 42 }),
      (err) => {
        assert.ok(err instanceof Error)
        assert.match(
          err.message,
          /^Request body validation failed: requires property "name"$/,
        )

        return true
      },
    )
  })

  it("should throw when a property has the wrong type", () => {
    assert.throws(
      () => payloadSchemaValidator(model, { age: "old", name: "Leonardo" }),
      /Request body validation failed: is not of a type\(s\) integer/,
    )
  })

  it("should report every validation error", () => {
    assert.throws(
      () => payloadSchemaValidator(model, { age: -1, name: 42 }),
      (err) => {
        assert.strictEqual(err.message.split(", ").length, 2)
        assert.match(err.message, /is not of a type\(s\) string/)
        assert.match(err.message, /must be greater than or equal to 0/)

        return true
      },
    )
  })
})
