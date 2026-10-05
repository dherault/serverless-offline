import assert from "node:assert"
import toSafeString from "../toSafeString.js"

describe("toSafeString", () => {
  ;[
    { description: "a string", expected: "foo", value: "foo" },
    {
      description: "an Error",
      expected: "Error: boom",
      value: new Error("boom"),
    },
    {
      description: "a Symbol",
      expected: "Symbol(boom)",
      value: Symbol("boom"),
    },
    { description: "null", expected: "null", value: null },
    { description: "undefined", expected: "undefined", value: undefined },
    {
      description: "an object without a prototype",
      expected: "[object Object]",
      value: Object.create(null),
    },
    {
      description: "an object whose Symbol.toPrimitive throws",
      expected: "[object Object]",
      value: {
        [Symbol.toPrimitive]() {
          throw new Error("boom")
        },
      },
    },
    {
      description: "a proxy which throws on every access",
      expected: "[value which can't be converted to a string]",
      value: new Proxy(
        {},
        {
          get() {
            throw new Error("boom")
          },
        },
      ),
    },
  ].forEach(({ description, expected, value }) => {
    it(`should convert ${description}`, () => {
      assert.strictEqual(toSafeString(value), expected)
    })
  })
})
