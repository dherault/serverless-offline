import assert from "node:assert"
import WebSocketEventDefinition from "../WebSocketEventDefinition.js"

describe("WebSocketEventDefinition", () => {
  describe("with a shorthand string definition", () => {
    it("should use the string as the route", () => {
      const webSocketEventDefinition = new WebSocketEventDefinition("$connect")

      assert.strictEqual(webSocketEventDefinition.route, "$connect")
    })
  })

  describe("with an object definition", () => {
    it("should assign the route", () => {
      const webSocketEventDefinition = new WebSocketEventDefinition({
        route: "$default",
      })

      assert.strictEqual(webSocketEventDefinition.route, "$default")
    })

    it("should copy over any additional property", () => {
      const webSocketEventDefinition = new WebSocketEventDefinition({
        authorizer: {
          identitySource: ["route.request.header.Auth"],
          name: "auth",
        },
        route: "$connect",
        routeResponseSelectionExpression: "$default",
      })

      assert.strictEqual(webSocketEventDefinition.route, "$connect")
      assert.strictEqual(
        webSocketEventDefinition.routeResponseSelectionExpression,
        "$default",
      )
      assert.deepStrictEqual(webSocketEventDefinition.authorizer, {
        identitySource: ["route.request.header.Auth"],
        name: "auth",
      })
    })

    it("should leave the route undefined when not given", () => {
      const webSocketEventDefinition = new WebSocketEventDefinition({
        routeResponseSelectionExpression: "$default",
      })

      assert.strictEqual(webSocketEventDefinition.route, undefined)
    })
  })
})
