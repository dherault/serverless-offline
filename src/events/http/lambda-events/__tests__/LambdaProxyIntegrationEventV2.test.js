import assert from "node:assert"
import { Buffer } from "node:buffer"
import { env } from "node:process"
import RequestBuilderV2 from "./support/RequestBuilderV2.js"
import LambdaProxyIntegrationEventV2 from "../LambdaProxyIntegrationEventV2.js"

const { stringify } = JSON

const stage = "dev"

function encodeJwt(payload) {
  const encode = (obj) => Buffer.from(stringify(obj)).toString("base64url")

  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.signature`
}

function create(
  request,
  routeKey = "GET /fn1",
  additionalRequestContext = undefined,
) {
  return new LambdaProxyIntegrationEventV2(
    request,
    stage,
    routeKey,
    additionalRequestContext,
  ).create()
}

describe("LambdaProxyIntegrationEventV2", () => {
  describe("with a GET /fn1 request", () => {
    let event

    beforeEach(() => {
      event = create(new RequestBuilderV2("GET", "/fn1").toObject())
    })

    it("should have the 2.0 payload version", () => {
      assert.strictEqual(event.version, "2.0")
    })

    it("should have the route key", () => {
      assert.strictEqual(event.routeKey, "GET /fn1")
      assert.strictEqual(event.requestContext.routeKey, "GET /fn1")
    })

    it("should have the raw path", () => {
      assert.strictEqual(event.rawPath, "/fn1")
      assert.strictEqual(event.requestContext.http.path, "/fn1")
    })

    it("should have an empty raw query string", () => {
      assert.strictEqual(event.rawQueryString, "")
    })

    it("queryStringParameters should be null", () => {
      assert.strictEqual(event.queryStringParameters, null)
    })

    it("pathParameters should be null", () => {
      assert.strictEqual(event.pathParameters, null)
    })

    it("body should be null", () => {
      assert.strictEqual(event.body, null)
      assert.strictEqual(event.isBase64Encoded, false)
    })

    it("cookies should be undefined", () => {
      assert.strictEqual(event.cookies, undefined)
    })

    it("stageVariables should be null", () => {
      assert.strictEqual(event.stageVariables, null)
    })

    it("should have the fixed offline request context", () => {
      const { requestContext } = event

      assert.strictEqual(requestContext.accountId, "offlineContext_accountId")
      assert.strictEqual(requestContext.apiId, "offlineContext_apiId")
      assert.strictEqual(requestContext.domainName, "offlineContext_domainName")
      assert.strictEqual(
        requestContext.domainPrefix,
        "offlineContext_domainPrefix",
      )
      assert.strictEqual(requestContext.requestId, "offlineContext_resourceId")
      assert.strictEqual(requestContext.stage, stage)
    })

    it("should have the http request context", () => {
      assert.deepStrictEqual(event.requestContext.http, {
        method: "GET",
        path: "/fn1",
        protocol: "HTTP/1.1",
        sourceIp: "127.0.0.1",
        userAgent: "",
      })
    })

    it("should have the request time", () => {
      assert.strictEqual(event.requestContext.timeEpoch, 1)
      assert.strictEqual(typeof event.requestContext.time, "string")
    })

    it("operationName should be undefined", () => {
      assert.strictEqual(event.requestContext.operationName, undefined)
    })
  })

  describe("with an operation name", () => {
    it("should pass it through to the request context", () => {
      const event = create(
        new RequestBuilderV2("GET", "/fn1").toObject(),
        "GET /fn1",
        { operationName: "getFn1" },
      )

      assert.strictEqual(event.requestContext.operationName, "getFn1")
    })
  })

  describe("with a lowercase method", () => {
    it("should upper case the http method", () => {
      const event = create(new RequestBuilderV2("get", "/fn1").toObject())

      assert.strictEqual(event.requestContext.http.method, "GET")
    })
  })

  describe("with query string parameters", () => {
    it("should return them and the raw query string", () => {
      const request = new RequestBuilderV2("GET", "/fn1")
        .addQuery("?param=1")
        .toObject()

      const event = create(request)

      assert.deepStrictEqual(event.queryStringParameters, { param: "1" })
      assert.strictEqual(event.rawQueryString, "param=1")
    })

    // NOTE: payload format 2.0 has no multiValueQueryStringParameters, repeated
    // keys are joined with a comma instead
    it("should join repeated keys with a comma", () => {
      const request = new RequestBuilderV2("GET", "/fn1")
        .addQuery("?param=1&param=2&other=3")
        .toObject()

      const event = create(request)

      assert.deepStrictEqual(event.queryStringParameters, {
        other: "3",
        param: "1,2",
      })
      assert.strictEqual(event.multiValueQueryStringParameters, undefined)
    })
  })

  describe("with path parameters", () => {
    it("should return them", () => {
      const request = new RequestBuilderV2("GET", "/fn1/1")
        .addParam("id", "1")
        .toObject()

      const event = create(request, "GET /fn1/{id}")

      assert.deepStrictEqual(event.pathParameters, { id: "1" })
    })
  })

  describe("with headers", () => {
    it("should lower case the header names", () => {
      const request = new RequestBuilderV2("GET", "/fn1")
        .addHeader("X-Custom-Header", "value")
        .toObject()

      const event = create(request)

      assert.strictEqual(event.headers["x-custom-header"], "value")
    })

    it("should return an empty object when there are no raw headers", () => {
      const event = create(new RequestBuilderV2("GET", "/fn1").toObject())

      assert.deepStrictEqual(event.headers, {})
    })
  })

  describe("with cookies", () => {
    it("should return them as an array of name=value pairs", () => {
      const request = new RequestBuilderV2("GET", "/fn1")
        .addCookies({ bar: "2", foo: "1" })
        .toObject()

      const event = create(request)

      assert.deepStrictEqual(event.cookies, ["bar=2", "foo=1"])
    })

    it("should flatten a repeated cookie", () => {
      const request = new RequestBuilderV2("GET", "/fn1")
        .addCookies({ foo: ["1", "2"] })
        .toObject()

      const event = create(request)

      assert.deepStrictEqual(event.cookies, ["foo=1", "foo=2"])
    })
  })

  describe("with a body", () => {
    it("should stringify a json body and default the headers", () => {
      const request = new RequestBuilderV2("POST", "/fn1")
        .addBody({ key: "value" })
        .toObject()

      const event = create(request, "POST /fn1")

      assert.strictEqual(event.body, '{"key":"value"}')
      assert.strictEqual(event.isBase64Encoded, false)
      assert.strictEqual(event.headers["content-type"], "application/json")
      assert.strictEqual(event.headers["content-length"], "15")
    })

    it("should not override a given content-type", () => {
      const request = new RequestBuilderV2("POST", "/fn1")
        .addHeader("Content-Type", "text/plain")
        .addRawBody("some text")
        .toObject()

      const event = create(request, "POST /fn1")

      assert.strictEqual(event.body, "some text")
      assert.strictEqual(event.headers["content-type"], "text/plain")
      assert.strictEqual(event.headers["content-length"], "9")
    })

    it("should base64 encode a binary body", () => {
      const request = new RequestBuilderV2("POST", "/fn1")
        .addHeader("Content-Type", "application/octet-stream")
        .addRawBody("some binary data")
        .toObject()

      const event = create(request, "POST /fn1")

      assert.strictEqual(event.isBase64Encoded, true)
      assert.strictEqual(
        Buffer.from(event.body, "base64").toString(),
        "some binary data",
      )
    })

    it("should turn an empty body into null", () => {
      const request = new RequestBuilderV2("POST", "/fn1")
        .addRawBody("")
        .toObject()

      const event = create(request, "POST /fn1")

      assert.strictEqual(event.body, null)
    })
  })

  describe("authorizer", () => {
    it("should nest the authorizer context under the lambda key", () => {
      const request = new RequestBuilderV2("GET", "/fn1")
        .addAuthContext({ foo: "bar" })
        .toObject()

      const event = create(request)

      assert.deepStrictEqual(event.requestContext.authorizer.lambda, {
        foo: "bar",
      })
    })

    it("should default to an empty lambda context", () => {
      const event = create(new RequestBuilderV2("GET", "/fn1").toObject())

      assert.deepStrictEqual(event.requestContext.authorizer.lambda, {})
    })

    describe("with a Bearer token", () => {
      it("should decode the jwt claims", () => {
        const request = new RequestBuilderV2("GET", "/fn1")
          .addHeader(
            "Authorization",
            `Bearer ${encodeJwt({ scope: "profile email", sub: "user-1" })}`,
          )
          .toObject()

        const event = create(request)

        const { jwt } = event.requestContext.authorizer

        assert.strictEqual(jwt.claims.sub, "user-1")
        assert.deepStrictEqual(jwt.scopes, ["profile", "email"])
      })

      it("should read the scp claim as an array of scopes", () => {
        const request = new RequestBuilderV2("GET", "/fn1")
          .addHeader(
            "Authorization",
            `Bearer ${encodeJwt({ scp: ["profile"], sub: "user-1" })}`,
          )
          .toObject()

        const event = create(request)

        assert.deepStrictEqual(event.requestContext.authorizer.jwt.scopes, [
          "profile",
        ])
      })

      it("should leave the claims undefined for a token which is not a jwt", () => {
        const request = new RequestBuilderV2("GET", "/fn1")
          .addHeader("Authorization", "Bearer not-a-jwt")
          .toObject()

        const event = create(request)

        assert.strictEqual(
          event.requestContext.authorizer.jwt.claims,
          undefined,
        )
        assert.strictEqual(
          event.requestContext.authorizer.jwt.scopes,
          undefined,
        )
      })
    })

    describe("with an override", () => {
      it("should use the sls-offline-authorizer-override header", () => {
        const request = new RequestBuilderV2("GET", "/fn1")
          .addHeader(
            "sls-offline-authorizer-override",
            stringify({ principalId: "override" }),
          )
          .toObject()

        const event = create(request)

        assert.deepStrictEqual(event.requestContext.authorizer, {
          principalId: "override",
        })
      })

      it("should use the AUTHORIZER environment variable", () => {
        env.AUTHORIZER = stringify({ principalId: "from-env" })

        try {
          const event = create(new RequestBuilderV2("GET", "/fn1").toObject())

          assert.deepStrictEqual(event.requestContext.authorizer, {
            principalId: "from-env",
          })
        } finally {
          delete env.AUTHORIZER
        }
      })

      it("should ignore an unparseable AUTHORIZER environment variable", () => {
        env.AUTHORIZER = "not json"

        try {
          const event = create(new RequestBuilderV2("GET", "/fn1").toObject())

          assert.deepStrictEqual(event.requestContext.authorizer.lambda, {})
        } finally {
          delete env.AUTHORIZER
        }
      })
    })
  })
})
