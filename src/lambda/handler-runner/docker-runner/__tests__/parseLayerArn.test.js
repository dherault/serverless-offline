import assert from "node:assert"
import parseLayerArn from "../parseLayerArn.js"

describe("parseLayerArn", () => {
  it("should split a layer version ARN into a layer name and a version", () => {
    assert.deepEqual(
      parseLayerArn("arn:aws:lambda:us-east-1:744348701589:layer:bash:8"),
      {
        name: "bash",
        unversionedArn: "arn:aws:lambda:us-east-1:744348701589:layer:bash",
        version: 8,
      },
    )
  })

  it("should work with a partition other than aws", () => {
    assert.deepEqual(
      parseLayerArn(
        "arn:aws-us-gov:lambda:us-gov-east-1:123456789012:layer:a:1",
      ).unversionedArn,
      "arn:aws-us-gov:lambda:us-gov-east-1:123456789012:layer:a",
    )
  })

  it("should return null for an ARN without a version", () => {
    assert.equal(
      parseLayerArn("arn:aws:lambda:us-east-1:744348701589:layer:bash"),
      null,
    )
  })

  it("should return null for an ARN which is not a layer ARN", () => {
    assert.equal(
      parseLayerArn("arn:aws:lambda:us-east-1:744348701589:function:foo"),
      null,
    )
  })

  it("should return null for anything which is not a string", () => {
    assert.equal(parseLayerArn({ Ref: "MyLayer" }), null)
    assert.equal(parseLayerArn(undefined), null)
  })
})
