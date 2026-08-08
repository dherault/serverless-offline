import assert from "node:assert"
import AlbEventDefinition from "../AlbEventDefinition.js"

describe("AlbEventDefinition", () => {
  describe("with a shorthand string definition", () => {
    it("should split listenerArn, priority and conditions", () => {
      const albEventDefinition = new AlbEventDefinition(
        "arn:aws:elasticloadbalancing:us-east-1:12345:listener/app/my-lb/50dc/f2f7 1 /users",
      )

      assert.strictEqual(
        albEventDefinition.listenerArn,
        "arn:aws:elasticloadbalancing:us-east-1:12345:listener/app/my-lb/50dc/f2f7",
      )
      assert.strictEqual(albEventDefinition.priority, "1")
      assert.strictEqual(albEventDefinition.conditions, "/users")
    })
  })

  describe("with an object definition", () => {
    const listenerArn =
      "arn:aws:elasticloadbalancing:us-east-1:12345:listener/app/my-lb/50dc/f2f7"

    it("should assign listenerArn, priority and conditions", () => {
      const albEventDefinition = new AlbEventDefinition({
        conditions: {
          method: ["POST"],
          path: ["/users"],
        },
        listenerArn,
        priority: 1,
      })

      assert.strictEqual(albEventDefinition.listenerArn, listenerArn)
      assert.strictEqual(albEventDefinition.priority, 1)
      assert.deepStrictEqual(albEventDefinition.conditions, {
        method: ["POST"],
        path: ["/users"],
      })
    })

    it("should copy over any additional property", () => {
      const albEventDefinition = new AlbEventDefinition({
        healthCheck: {
          healthyThresholdCount: 5,
        },
        listenerArn,
        multiValueHeaders: true,
        priority: 2,
      })

      assert.strictEqual(albEventDefinition.multiValueHeaders, true)
      assert.deepStrictEqual(albEventDefinition.healthCheck, {
        healthyThresholdCount: 5,
      })
    })

    it("should leave conditions undefined when not given", () => {
      const albEventDefinition = new AlbEventDefinition({
        listenerArn,
        priority: 1,
      })

      assert.strictEqual(albEventDefinition.conditions, undefined)
    })
  })
})
