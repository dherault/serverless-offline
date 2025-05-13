import assert from "node:assert"
import OfflineBuilder from "./support/OfflineBuilder.js"
import ServerlessBuilder from "./support/ServerlessBuilder.js"

const { parse, stringify } = JSON

describe("Offline", () => {
  describe("with a non existing route", () => {
    let offline
    let server

    beforeEach(async () => {
      // Creates offline test server with no function
      offline = new OfflineBuilder(new ServerlessBuilder())

      server = await offline.toObject()
    })

    afterEach(async () => {
      await offline.end(true)
    })

    it("should return 404 status code", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/dev/magic",
      })

      assert.strictEqual(res.statusCode, 404)
    })
  })

  describe("with private function and noAuth option set", () => {
    let offline
    let server
    const validToken = "valid-token"

    beforeEach(async () => {
      offline = new OfflineBuilder(new ServerlessBuilder(), {
        apiKey: validToken,
        noAuth: true,
      }).addFunctionConfig("fn2", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn3",
              private: true,
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.basicAuthentication2",
      })

      server = await offline.toObject()
    })

    afterEach(async () => {
      await offline.end(true)
    })

    it("should execute the function correctly if no API key is provided", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/dev/fn3",
      })

      assert.strictEqual(res.statusCode, 200)
    })

    it("should execute the function correctly if API key is provided", async () => {
      const res = await server.inject({
        headers: {
          "x-api-key": validToken,
        },
        method: "GET",
        url: "/dev/fn3",
      })

      assert.strictEqual(res.statusCode, 200)
    })
  })

  describe("lambda integration", () => {
    it("should use event defined response template and headers", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("index", {
        events: [
          {
            http: {
              integration: "lambda",
              method: "GET",
              path: "index",
              response: {
                headers: {
                  "Content-Type": "'text/html'",
                },
                template: "$input.path('$')",
              },
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.usersIndex1",
      })

      const server = await offline.toObject()

      const res = await server.inject("/dev/index")

      assert.strictEqual(
        res.headers["content-type"],
        "text/html; charset=utf-8",
      )
      assert.strictEqual(res.statusCode, 200)

      await offline.end(true)
    })

    describe("error handling", () => {
      it("should set the status code to 502 when no [xxx] is present", async () => {
        const offline = new OfflineBuilder().addFunctionConfig("index", {
          events: [
            {
              http: {
                integration: "lambda",
                method: "GET",
                path: "index",
                response: {
                  headers: {
                    "Content-Type": "'text/html'",
                  },
                  template: "$input.path('$')",
                },
              },
            },
          ],
          handler: "tests/old-unit/fixtures/handler.usersIndex2",
        })

        const server = await offline.toObject()

        const res = await server.inject("/dev/index")

        assert.strictEqual(
          res.headers["content-type"],
          "text/html; charset=utf-8",
        )
        assert.strictEqual(res.statusCode, 502)

        await offline.end(true)
      })

      it("should set the status code to 401 when [401] is the prefix of the error message", async () => {
        const offline = new OfflineBuilder().addFunctionConfig("index", {
          events: [
            {
              http: {
                integration: "lambda",
                method: "GET",
                path: "index",
                response: {
                  headers: {
                    "Content-Type": "'text/html'",
                  },
                  template: "$input.path('$')",
                },
              },
            },
          ],
          handler: "tests/old-unit/fixtures/handler.usersIndex3",
        })

        const server = await offline.toObject()

        const res = await server.inject("/dev/index")

        assert.strictEqual(
          res.headers["content-type"],
          "text/html; charset=utf-8",
        )
        assert.strictEqual(res.statusCode, 401)

        await offline.end(true)
      })
    })
  })

  describe("lambda-proxy integration", () => {
    it("should accept and return application/json content type by default", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("fn1", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn1",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.fn1",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        method: "GET",
        payload: {
          data: "data",
        },
        url: "/dev/fn1",
      })

      assert.strictEqual(
        res.headers["content-type"],
        "application/json; charset=utf-8",
      )

      await offline.end(true)
    })

    it("should accept and return application/json content type", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("fn2", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn2",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.fn2",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        headers: {
          "content-type": "application/json",
        },
        method: "GET",
        payload: {
          data: "data",
        },
        url: "/dev/fn1",
      })

      assert.strictEqual(
        res.headers["content-type"],
        "application/json; charset=utf-8",
      )

      await offline.end(true)
    })

    it("should accept and return custom content type", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("fn3", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn3",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.fn3",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        headers: {
          "content-type": "application/vnd.api+json",
        },
        method: "GET",
        payload: {
          data: "data",
        },
        url: "/dev/fn3",
      })

      assert.strictEqual(
        res.headers["content-type"],
        "application/vnd.api+json",
      )

      await offline.end(true)
    })

    it("should return application/json content type by default", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("fn4", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn4",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.fn4",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        method: "GET",
        url: "/dev/fn4",
      })

      assert.strictEqual(
        res.headers["content-type"],
        "application/json; charset=utf-8",
      )

      await offline.end(true)
    })

    it("should work with trailing slashes path", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("fn5", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn5",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.fn5",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        method: "GET",
        url: "/dev/fn5",
      })

      assert.strictEqual(res.statusCode, 201)

      await offline.end(true)
    })

    it("should return the expected status code", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("fn6", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn6",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.fn6",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        method: "GET",
        url: "/dev/fn6",
      })

      assert.strictEqual(res.statusCode, 201)

      await offline.end(true)
    })

    it("should return correctly set multiple set-cookie headers", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("fn7", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn7",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.fn7",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        method: "GET",
        url: "/dev/fn7",
      })

      assert.deepStrictEqual(res.headers["set-cookie"], ["foo=bar", "floo=baz"])

      await offline.end(true)
    })
  })

  describe("with catch-all route", () => {
    it("should match arbitary route", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("test", {
        events: [
          {
            http: {
              method: "GET",
              path: "test/{stuff+}",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.test",
      })

      const server = await offline.toObject()

      const res = await server.inject("/dev/test/some/matching/route")

      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.payload, "Hello")

      await offline.end(true)
    })
  })

  describe("does not mangle payload", () => {
    let offline
    let server

    const rawBody = `{
  \t"type": "notification_event",
  \t"app_id": "q8sn4hth",
  \t"data": {
  \t\t"type": "notification_event_data",
  \t\t\t"item": {
  \t\t\t\t"type": "ping",
  \t\t\t\t"message": "something something interzen"
  \t\t\t}
  \t\t},
  \t"links": {},
  \t"id": null,
  \t"topic": "ping",
  \t"delivery_status": null,
  \t"delivery_attempts": 1,
  \t"delivered_at": 0,
  \t"first_sent_at": 1513466985,
  \t"created_at": 1513466985,
  \t"self": null
  }`

    beforeEach(async () => {
      offline = new OfflineBuilder(new ServerlessBuilder()).addFunctionConfig(
        "rawJsonBody",
        {
          events: [
            {
              http: {
                method: "POST",
                path: "raw-json-body",
              },
            },
          ],
          handler: "tests/old-unit/fixtures/handler.rawJsonBody",
        },
      )
      server = await offline.toObject()
    })

    afterEach(async () => {
      await offline.end(true)
    })

    it.skip("should return that the JSON was not mangled", async () => {
      const res = await server.inject({
        method: "POST",
        payload: rawBody,
        url: "/dev/raw-json-body",
      })

      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(
        res.payload,
        stringify({
          message: "JSON body was not stripped of newlines or tabs",
        }),
      )
    })

    it.skip("should return that the JSON was not mangled with an application/json type", async () => {
      const res = await server.inject({
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        payload: rawBody,
        url: "/dev/raw-json-body",
      })

      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(
        res.payload,
        stringify({
          message: "JSON body was not stripped of newlines or tabs",
        }),
      )
    })
  })

  describe("aws runtime nodejs8.10", () => {
    const serverless = {
      service: {
        provider: {
          name: "aws",
          region: "us-east-1",
          runtime: "nodejs8.10",
          stage: "dev",
        },
      },
    }

    it("should support handler returning Promise", async () => {
      const offline = new OfflineBuilder(
        new ServerlessBuilder(serverless),
      ).addFunctionConfig("promise", {
        events: [
          {
            http: {
              method: "GET",
              path: "promise",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.promise",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        method: "GET",
        payload: {
          data: "input",
        },
        url: "/dev/promise",
      })

      assert.strictEqual(
        res.headers["content-type"],
        "application/json; charset=utf-8",
      )
      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.payload, '{"message":"Hello World"}')

      await offline.end(true)
    })

    it("should support handler returning Promise that defers", async () => {
      const offline = new OfflineBuilder(
        new ServerlessBuilder(serverless),
      ).addFunctionConfig("promiseDeferred", {
        events: [
          {
            http: {
              method: "GET",
              path: "promise-deferred",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.promiseDeferred",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        method: "GET",
        payload: {
          data: "input",
        },
        url: "/dev/promise-deferred",
      })

      assert.strictEqual(
        res.headers["content-type"],
        "application/json; charset=utf-8",
      )
      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.payload, '{"message":"Hello World"}')

      await offline.end(true)
    })

    it("should support handler that defers and uses done()", async () => {
      const offline = new OfflineBuilder(
        new ServerlessBuilder(serverless),
      ).addFunctionConfig("doneDeferred", {
        events: [
          {
            http: {
              method: "GET",
              path: "done-deferred",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.doneDeferred",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        method: "GET",
        payload: {
          data: "input",
        },
        url: "/dev/done-deferred",
      })

      assert.strictEqual(
        res.headers["content-type"],
        "application/json; charset=utf-8",
      )
      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.payload, '{"message":"Hello World"}')

      await offline.end(true)
    })

    it("should support handler that throws and uses done()", async () => {
      const offline = new OfflineBuilder(
        new ServerlessBuilder(serverless),
      ).addFunctionConfig("throwDone", {
        events: [
          {
            http: {
              method: "GET",
              path: "throw-done",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.throwDone",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        method: "GET",
        payload: {
          data: "input",
        },
        url: "/dev/throw-done",
      })

      assert.strictEqual(
        res.headers["content-type"],
        "application/json; charset=utf-8",
      )
      assert.strictEqual(res.statusCode, 502)

      await offline.end(true)
    })

    it("should support handler using async function", async () => {
      const offline = new OfflineBuilder(
        new ServerlessBuilder(serverless),
      ).addFunctionConfig("asyncFunction", {
        events: [
          {
            http: {
              method: "GET",
              path: "async-function",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.asyncFunction",
      })
      const server = await offline.toObject()

      const res = await server.inject({
        method: "GET",
        payload: {
          data: "input",
        },
        url: "/dev/async-function",
      })

      assert.strictEqual(
        res.headers["content-type"],
        "application/json; charset=utf-8",
      )
      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.payload, '{"message":"Hello World"}')

      await offline.end(true)
    })

    it("should support handler that uses async function that throws", async () => {
      const offline = new OfflineBuilder(
        new ServerlessBuilder(serverless),
      ).addFunctionConfig("asyncFunctionThrows", {
        events: [
          {
            http: {
              method: "GET",
              path: "async-function-throws",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.asyncFunctionThrows",
      })

      const server = await offline.toObject()

      const res = await server.inject({
        method: "GET",
        payload: {
          data: "input",
        },
        url: "/dev/async-function-throws",
      })

      assert.strictEqual(
        res.headers["content-type"],
        "application/json; charset=utf-8",
      )
      assert.strictEqual(res.statusCode, 502)

      await offline.end(true)
    })
  })

  describe("with HEAD support", () => {
    it("should skip HEAD route mapping and return 404 when requested", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("foo", {
        events: [
          {
            http: {
              method: "HEAD",
              path: "fn8",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.foo",
      })
      const server = await offline.toObject()

      const res = await server.inject({
        method: "HEAD",
        url: "/dev/foo",
      })

      assert.strictEqual(res.statusCode, 404)

      await offline.end(true)
    })

    it("should use GET route for HEAD requests, if exists", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("fn8", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn8",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.fn8",
      })
      const server = await offline.toObject()

      const res = await server.inject({
        method: "HEAD",
        url: "/dev/fn8",
      })

      assert.strictEqual(res.statusCode, 204)

      await offline.end(true)
    })
  })

  describe("static headers", () => {
    it("are returned if defined in lambda integration", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("headers", {
        events: [
          {
            http: {
              integration: "lambda",
              method: "GET",
              path: "headers",
              response: {
                headers: {
                  "custom-header-1": "'first value'",
                  "Custom-Header-2": "'Second Value'",
                  "custom-header-3": "'third's value'",
                },
              },
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.headers",
      })
      const server = await offline.toObject()

      const res = await server.inject("/dev/headers")

      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.headers["custom-header-1"], "first value")
      assert.strictEqual(res.headers["custom-header-2"], "Second Value")
      assert.strictEqual(res.headers["custom-header-3"], "third's value")

      await offline.end(true)
    })

    it("are not returned if not double-quoted strings in lambda integration", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("headers", {
        events: [
          {
            http: {
              integration: "lambda",
              method: "GET",
              path: "headers",
              response: {
                headers: {
                  "custom-header-1": "first value",
                  "Custom-Header-2": true,
                },
              },
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.headers",
      })
      const server = await offline.toObject()

      const res = await server.inject("/dev/headers")

      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.headers["custom-header-1"], undefined)
      assert.strictEqual(res.headers["custom-header-2"], undefined)

      await offline.end(true)
    })

    it("are not returned if defined in non-lambda integration", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("headers", {
        events: [
          {
            http: {
              integration: "other",
              method: "GET",
              path: "headers",
              response: {
                headers: {
                  "custom-header-1": "'first value'",
                  "Custom-Header-2": "'Second Value'",
                },
              },
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.headers",
      })
      const server = await offline.toObject()

      const res = await server.inject("/dev/headers")

      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.headers["custom-header-1"], undefined)
      assert.strictEqual(res.headers["custom-header-2"], undefined)

      await offline.end(true)
    })
  })

  describe("disable cookie validation", () => {
    it.skip("should return bad request by default if invalid cookies are passed by the request", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("cookie", {
        events: [
          {
            http: {
              method: "GET",
              path: "cookie",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.cookie",
      })
      const server = await offline.toObject()

      const res = await server.inject({
        headers: {
          Cookie:
            "a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n",
        },
        method: "GET",
        url: "/dev/cookie",
      })

      assert.strictEqual(res.statusCode, 400)

      await offline.end(true)
    })

    it('should return 200 if the "disableCookieValidation"-flag is set', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(), {
        disableCookieValidation: true,
      }).addFunctionConfig("cookie", {
        events: [
          {
            http: {
              method: "GET",
              path: "cookie",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.cookie",
      })
      const server = await offline.toObject()

      const res = await server.inject({
        headers: {
          Cookie:
            "a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n",
        },
        method: "GET",
        url: "/dev/cookie",
      })

      assert.strictEqual(res.statusCode, 200)

      await offline.end(true)
    })
  })

  describe("check cookie status", () => {
    it("check for isHttpOnly off", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("fn9", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn9",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.fn9",
      })
      const server = await offline.toObject()

      const res = await server.inject({
        headers: {},
        method: "GET",
        url: "/dev/fn9",
      })

      res.headers["set-cookie"].forEach((v) =>
        assert.strictEqual(v.match(/httponly/i), null),
      )

      await offline.end(true)
    })

    it("check for isSecure off", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("fn10", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn10",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.fn10",
      })
      const server = await offline.toObject()

      const res = await server.inject({
        headers: {},
        method: "GET",
        url: "/dev/fn10",
      })

      res.headers["set-cookie"].forEach((v) =>
        assert.strictEqual(v.match(/secure/i), null),
      )

      await offline.end(true)
    })

    it("check for isSameSite off", async () => {
      const offline = new OfflineBuilder().addFunctionConfig("fn11", {
        events: [
          {
            http: {
              method: "GET",
              path: "fn11",
            },
          },
        ],
        handler: "tests/old-unit/fixtures/handler.fn11",
      })
      const server = await offline.toObject()

      const res = await server.inject({
        headers: {},
        method: "GET",
        url: "/dev/fn11",
      })

      res.headers["set-cookie"].forEach((v) =>
        assert.strictEqual(v.match(/samesite/i), null),
      )

      await offline.end(true)
    })
  })

  describe("with resource routes", () => {
    let serverlessBuilder

    beforeEach(() => {
      serverlessBuilder = new ServerlessBuilder()
      serverlessBuilder.serverless.service.resources = {
        Resources: {
          EchoProxyMethod: {
            Properties: {
              HttpMethod: "ANY",
              Integration: {
                IntegrationHttpMethod: "ANY",
                Type: "HTTP_PROXY",
                Uri: "http://mockbin.org/request/{proxy}",
              },
              ResourceId: {
                Ref: "EchoProxyResource",
              },
            },
            Type: "AWS::ApiGateway::Method",
          },
          EchoProxyResource: {
            Properties: {
              PathPart: "echo/{proxy+}",
            },
            Type: "AWS::ApiGateway::Resource",
          },
        },
      }
    })

    it.skip("proxies query strings", async () => {
      const offline = new OfflineBuilder(serverlessBuilder, {
        resourceRoutes: true,
      })

      const server = await offline.toObject()

      const res = await server.inject("/dev/echo/foo?bar=baz")
      const result = parse(res.result)

      assert.strictEqual(result.queryString.bar, "baz")

      await offline.end(true)
    })

    describe("disable cookie validation", () => {
      it.skip("should return bad request by default if invalid cookies are passed by the request", async () => {
        const offline = new OfflineBuilder(serverlessBuilder, {
          resourceRoutes: true,
        }).addFunctionConfig("cookie", {
          events: [
            {
              http: {
                method: "GET",
                path: "cookie",
              },
            },
          ],
          handler: "tests/old-unit/fixtures/handler.cookie",
        })

        const server = await offline.toObject()

        const res = await server.inject({
          headers: {
            Cookie:
              "a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n",
          },
          method: "GET",
          url: "/dev/cookie",
        })

        assert.strictEqual(res.statusCode, 400)

        await offline.end(true)
      })

      it('should return 200 if the "disableCookieValidation"-flag is set', async () => {
        const offline = new OfflineBuilder(serverlessBuilder, {
          disableCookieValidation: true,
          resourceRoutes: true,
        }).addFunctionConfig("cookie", {
          events: [
            {
              http: {
                method: "GET",
                path: "cookie",
              },
            },
          ],
          handler: "tests/old-unit/fixtures/handler.cookie",
        })

        const server = await offline.toObject()

        const res = await server.inject({
          headers: {
            Cookie:
              "a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n",
          },
          method: "GET",
          url: "/dev/cookie",
        })

        assert.strictEqual(res.statusCode, 200)

        await offline.end(true)
      })
    })
  })
})
