import assert from "node:assert"
import process from "node:process"
import { setImmediate } from "node:timers/promises"
import ServerlessOffline from "../ServerlessOffline.js"

const { keys } = Object
const { parse, stringify } = JSON

function createServerless(functions, provider = {}) {
  return {
    service: {
      functions,
      getAllEventsInFunction(functionKey) {
        return this.functions[functionKey].events
      },
      getAllFunctions() {
        return keys(this.functions)
      },
      getFunction(functionKey) {
        return this.functions[functionKey]
      },
      provider: {
        region: "us-east-1",
        stage: "dev",
        ...provider,
      },
    },
  }
}

function getHttpApiEvents(functions, provider) {
  const serverlessOffline = new ServerlessOffline(
    createServerless(functions, provider),
    {},
    {},
  )

  return serverlessOffline.internals().getEvents().httpApiEvents
}

describe("ServerlessOffline", () => {
  describe("#getEvents with httpApi events", () => {
    ;[
      { expected: "$default", httpApi: "*" },
      { expected: "GET /users", httpApi: "GET /users" },
      { expected: "GET /users", httpApi: "get /users" },
      { expected: "ANY /users", httpApi: "* /users" },
      { expected: "$default", httpApi: { method: "*", path: "*" } },
      { expected: "$default", httpApi: { path: "*" } },
      { expected: "POST /users", httpApi: { method: "post", path: "/users" } },
      { expected: "ANY /users", httpApi: { method: "*", path: "/users" } },
    ].forEach(({ expected, httpApi }) => {
      it(`should derive the routeKey '${expected}' from ${stringify(httpApi)}`, () => {
        const [httpApiEvent] = getHttpApiEvents({
          foo: { events: [{ httpApi }], handler: "handler.foo" },
        })

        assert.strictEqual(httpApiEvent.http.routeKey, expected)
        assert.strictEqual(httpApiEvent.http.isHttpApi, true)
      })
    })
    ;[
      { description: "a missing method", httpApi: { path: "/users" } },
      { description: "a missing path", httpApi: { method: "GET" } },
      {
        description: "a method for the catch-all path",
        httpApi: { method: "GET", path: "*" },
      },
      { description: "a string without a path", httpApi: "GET" },
      { description: "a definition of an invalid type", httpApi: true },
    ].forEach(({ description, httpApi }) => {
      it(`should skip an event with ${description}`, () => {
        assert.deepStrictEqual(
          getHttpApiEvents({
            foo: { events: [{ httpApi }], handler: "handler.foo" },
          }),
          [],
        )
      })
    })

    it("should not change the event definitions of the service", () => {
      const functions = {
        foo: {
          events: [
            {
              httpApi: {
                authorizer: { name: "auth" },
                method: "get",
                path: "/users",
              },
            },
          ],
          handler: "handler.foo",
        },
      }
      const original = parse(stringify(functions))

      const [first] = getHttpApiEvents(functions)
      const [second] = getHttpApiEvents(functions)

      assert.deepStrictEqual(functions, original)
      assert.deepStrictEqual(first, second)
      assert.deepStrictEqual(first.http.authorizer, { name: "auth" })
    })

    describe("payload version", () => {
      it("should default to 2.0", () => {
        const [httpApiEvent] = getHttpApiEvents({
          foo: { events: [{ httpApi: "GET /users" }], handler: "handler.foo" },
        })

        assert.strictEqual(httpApiEvent.http.payload, "2.0")
      })

      it("should use the payload version of the provider", () => {
        const [httpApiEvent] = getHttpApiEvents(
          {
            foo: {
              events: [{ httpApi: "GET /users" }],
              handler: "handler.foo",
            },
          },
          { httpApi: { payload: "1.0" } },
        )

        assert.strictEqual(httpApiEvent.http.payload, "1.0")
      })

      it("should let the payload version of the function win", () => {
        const [httpApiEvent] = getHttpApiEvents(
          {
            foo: {
              events: [{ httpApi: "GET /users" }],
              handler: "handler.foo",
              httpApi: { payload: "2.0" },
            },
          },
          { httpApi: { payload: "1.0" } },
        )

        assert.strictEqual(httpApiEvent.http.payload, "2.0")
      })

      // an unquoted 1.0 in serverless.yml is parsed as the number 1
      it("should accept a numeric payload version", () => {
        const [httpApiEvent] = getHttpApiEvents(
          {
            foo: {
              events: [{ httpApi: "GET /users" }],
              handler: "handler.foo",
            },
          },
          { httpApi: { payload: 1 } },
        )

        assert.strictEqual(httpApiEvent.http.payload, "1.0")
      })
    })
  })

  describe("#preLoadModules", () => {
    ;[
      {
        description: "a comma separated string",
        preLoadModules: "node:fs, does-not-exist",
      },
      { description: "a list", preLoadModules: ["node:fs", "does-not-exist"] },
    ].forEach(({ description, preLoadModules }) => {
      it(`should log a module which can't be imported from ${description}, not reject`, async () => {
        const unhandledRejections = []
        const onUnhandledRejection = (reason) => {
          unhandledRejections.push(reason)
        }

        process.on("unhandledRejection", onUnhandledRejection)

        try {
          const serverlessOffline = new ServerlessOffline(
            createServerless({}),
            { preLoadModules },
            {},
          )

          serverlessOffline.internals().mergeOptions()

          await serverlessOffline.internals().preLoadModules()

          // unhandled rejections are reported after the microtask queue drained
          await setImmediate()

          assert.deepStrictEqual(unhandledRejections, [])
        } finally {
          process.off("unhandledRejection", onUnhandledRejection)
        }
      })
    })
  })
})
