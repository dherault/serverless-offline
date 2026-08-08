import assert from "node:assert"
import HttpEventDefinition from "../HttpEventDefinition.js"

describe("HttpEventDefinition", () => {
  describe("with a shorthand string definition", () => {
    it("should split method and path", () => {
      const httpEventDefinition = new HttpEventDefinition("GET /users")

      assert.strictEqual(httpEventDefinition.method, "GET")
      assert.strictEqual(httpEventDefinition.path, "/users")
    })

    it("should keep the method casing as written", () => {
      const httpEventDefinition = new HttpEventDefinition("get users/{id}")

      assert.strictEqual(httpEventDefinition.method, "get")
      assert.strictEqual(httpEventDefinition.path, "users/{id}")
    })

    it("should leave the path undefined when only a method is given", () => {
      const httpEventDefinition = new HttpEventDefinition("ANY")

      assert.strictEqual(httpEventDefinition.method, "ANY")
      assert.strictEqual(httpEventDefinition.path, undefined)
    })
  })

  describe("with an object definition", () => {
    it("should assign method and path", () => {
      const httpEventDefinition = new HttpEventDefinition({
        method: "POST",
        path: "/users",
      })

      assert.strictEqual(httpEventDefinition.method, "POST")
      assert.strictEqual(httpEventDefinition.path, "/users")
    })

    it("should copy over any additional property", () => {
      const httpEventDefinition = new HttpEventDefinition({
        authorizer: "authFunction",
        cors: true,
        method: "POST",
        path: "/users",
        private: true,
        request: {
          template: {
            "application/json": "{}",
          },
        },
      })

      assert.strictEqual(httpEventDefinition.authorizer, "authFunction")
      assert.strictEqual(httpEventDefinition.cors, true)
      assert.strictEqual(httpEventDefinition.private, true)
      assert.deepStrictEqual(httpEventDefinition.request, {
        template: {
          "application/json": "{}",
        },
      })
    })

    it("should leave method and path undefined when not given", () => {
      const httpEventDefinition = new HttpEventDefinition({ cors: true })

      assert.strictEqual(httpEventDefinition.method, undefined)
      assert.strictEqual(httpEventDefinition.path, undefined)
      assert.strictEqual(httpEventDefinition.cors, true)
    })
  })
})
