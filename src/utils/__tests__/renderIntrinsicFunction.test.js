import assert from "node:assert"
import renderIntrinsicFunction from "../renderIntrinsicFunction.js"

describe("renderIntrinsicFunction", () => {
  it("should process Fn::Join correctly", () => {
    const input = { "Fn::Join": [":", ["a", "b", "c"]] }
    const result = renderIntrinsicFunction(input)
    assert.strictEqual(result, "a:b:c")
  })

  it("should process !Join correctly", () => {
    const input = { "!Join": [":", ["a", "b", "c"]] }
    const result = renderIntrinsicFunction(input)
    assert.strictEqual(result, "a:b:c")
  })

  it("should process Fn::Sub correctly", () => {
    const input = {
      "Fn::Sub": ["The name is ${name}", { name: "CloudFormation" }], // eslint-disable-line no-template-curly-in-string
    }
    const result = renderIntrinsicFunction(input)
    assert.strictEqual(result, "The name is CloudFormation")
  })

  it("should process !Sub correctly", () => {
    const input = { "!Sub": ["Hello ${name}", { name: "World" }] } // eslint-disable-line no-template-curly-in-string
    const result = renderIntrinsicFunction(input)
    assert.strictEqual(result, "Hello World")
  })

  it("should process nested Join correctly", () => {
    const input = {
      "Fn::Join": ["-", [{ "!Join": [":", ["a", "b", "c"]] }, "d"]],
    }
    const result = renderIntrinsicFunction(input)
    assert.strictEqual(result, "a:b:c-d")
  })

  it("should process plain strings without modification", () => {
    const input = "This is a plain string"
    const result = renderIntrinsicFunction(input)
    assert.strictEqual(result, "This is a plain string")
  })

  it("should process numbers without modification", () => {
    const input = 42
    const result = renderIntrinsicFunction(input)
    assert.strictEqual(result, 42)
  })

  it("should process arrays without intrinsic functions", () => {
    const input = ["a", "b", "c"]
    const result = renderIntrinsicFunction(input)
    assert.deepStrictEqual(result, ["a", "b", "c"])
  })

  it("should process nested intrinsic functions in arrays", () => {
    const input = ["a", { "Fn::Join": [":", ["b", "c"]] }, "d"]
    const result = renderIntrinsicFunction(input)
    assert.deepStrictEqual(result, ["a", "b:c", "d"])
  })

  it("should throw an error for unsupported intrinsic functions", () => {
    const input = { "Fn::UnsupportedFunction": "Value" }
    const result = renderIntrinsicFunction(input)
    assert.deepStrictEqual(result, { "Fn::UnsupportedFunction": "Value" })
  })

  it("should throw an error for unsupported shorthand intrinsic functions", () => {
    const input = { "!UnsupportedFunction": "Value" }
    const result = renderIntrinsicFunction(input)
    assert.deepStrictEqual(result, { "!UnsupportedFunction": "Value" })
  })

  it("should process nested arrays with intrinsic functions", () => {
    const input = ["a", ["b", { "!Join": [":", ["c", "d"]] }]]
    const result = renderIntrinsicFunction(input)
    assert.deepStrictEqual(result, ["a", ["b", "c:d"]])
  })
})
