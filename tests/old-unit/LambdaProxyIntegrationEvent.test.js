import assert from "node:assert"
import { env } from "node:process"
import RequestBuilder from "./support/RequestBuilder.js"
import LambdaProxyIntegrationEvent from "../../src/events/http/lambda-events/LambdaProxyIntegrationEvent.js"

const { isArray } = Array
const { keys } = Object

describe("LambdaProxyIntegrationEvent", () => {
  const expectFixedAttributes = (lambdaProxyIntegrationEvent) => {
    const { requestContext } = lambdaProxyIntegrationEvent

    assert.strictEqual(requestContext.accountId, "offlineContext_accountId")
    assert.strictEqual(requestContext.resourceId, "offlineContext_resourceId")
    assert.strictEqual(
      requestContext.identity.cognitoIdentityPoolId,
      "offlineContext_cognitoIdentityPoolId",
    )
    assert.strictEqual(
      requestContext.identity.accountId,
      "offlineContext_accountId",
    )
    assert.strictEqual(
      requestContext.identity.cognitoIdentityId,
      "offlineContext_cognitoIdentityId",
    )
    assert.strictEqual(requestContext.identity.caller, "offlineContext_caller")
    assert.strictEqual(requestContext.identity.apiKey, "offlineContext_apiKey")
    assert.strictEqual(
      requestContext.identity.cognitoAuthenticationType,
      "offlineContext_cognitoAuthenticationType",
    )
    assert.strictEqual(
      requestContext.identity.cognitoAuthenticationProvider,
      "offlineContext_cognitoAuthenticationProvider",
    )
    assert.strictEqual(
      requestContext.identity.userArn,
      "offlineContext_userArn",
    )
    assert.strictEqual(requestContext.identity.user, "offlineContext_user")
    assert.strictEqual(
      requestContext.authorizer.principalId,
      "offlineContext_authorizer_principalId",
    )
    assert.strictEqual(requestContext.requestTimeEpoch, 1)
  }

  const stage = "dev"

  describe("with a GET /fn1 request", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1")
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("queryStringParameters should be null", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.queryStringParameters,
        null,
      )
    })

    it("pathParameters should be null", () => {
      assert.strictEqual(lambdaProxyIntegrationEvent.pathParameters, null)
    })

    it("httpMethod should be GET", () => {
      assert.strictEqual(lambdaProxyIntegrationEvent.httpMethod, "GET")
    })

    it("body should be null", () => {
      assert.strictEqual(lambdaProxyIntegrationEvent.body, null)
    })

    it("should have a unique requestId", () => {
      assert.ok(lambdaProxyIntegrationEvent.requestContext.requestId.length > 0)
    })

    it("should match fixed attributes", () => {
      expectFixedAttributes(lambdaProxyIntegrationEvent)
    })

    it("should not have operation name", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.operationName,
        undefined,
      )
    })
  })

  describe("with a GET /fn1 request with headers", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1")
    requestBuilder.addHeader("Content-Type", "application/json")
    requestBuilder.addHeader("Authorization", 'Token token="1234567890"')
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("should have two headers", () => {
      assert.strictEqual(keys(lambdaProxyIntegrationEvent.headers).length, 2)
      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers["Content-Type"],
        "application/json",
      )
      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers.Authorization,
        'Token token="1234567890"',
      )
    })

    it("should not have claims for authorizer if token is not JWT", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
        undefined,
      )
    })
  })

  describe("with a GET /fn1 request with Authorization header that contains JWT token", () => {
    // mock token
    // header
    // {
    //    "alg": "HS256",
    //    "typ": "JWT"
    // }
    // payload
    // {
    //   "sub": "1234567890",
    //   "name": "John Doe",
    //   "admin": true
    // }

    /* eslint-disable max-len */
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
    const bearerToken = `Bearer ${token}`

    it("should have claims for authorizer if Authorization header has valid JWT", () => {
      const requestBuilder = new RequestBuilder("GET", "/fn1")
      requestBuilder.addHeader("Authorization", token)
      const request = requestBuilder.toObject()
      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.deepStrictEqual(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
        {
          admin: true,
          name: "John Doe",
          sub: "1234567890",
        },
      )
    })

    it("should have claims for authorizer if authorization header has valid JWT", () => {
      const requestBuilder = new RequestBuilder("GET", "/fn1")
      requestBuilder.addHeader("authorization", token)
      const request = requestBuilder.toObject()
      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.deepStrictEqual(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
        {
          admin: true,
          name: "John Doe",
          sub: "1234567890",
        },
      )
    })

    it("should have claims for authorizer if Authorization header has valid Bearer JWT", () => {
      const requestBuilder = new RequestBuilder("GET", "/fn1")
      requestBuilder.addHeader("Authorization", bearerToken)
      const request = requestBuilder.toObject()
      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.deepStrictEqual(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
        {
          admin: true,
          name: "John Doe",
          sub: "1234567890",
        },
      )
    })

    it("should have claims for authorizer if authorization header has valid Bearer JWT", () => {
      const requestBuilder = new RequestBuilder("GET", "/fn1")
      requestBuilder.addHeader("authorization", bearerToken)
      const request = requestBuilder.toObject()
      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.deepStrictEqual(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
        {
          admin: true,
          name: "John Doe",
          sub: "1234567890",
        },
      )
    })
  })

  describe("with a POST /fn1 request with no headers", () => {
    const requestBuilder = new RequestBuilder("POST", "/fn1")
    requestBuilder.addBody({ key: "value" })
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("should calculate the Content-Length header", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers["Content-Length"],
        "15",
      )
    })

    it("should inject a default Content-Type header", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers["Content-Type"],
        "application/json",
      )
    })

    it("should stringify the payload for the body", () => {
      assert.strictEqual(lambdaProxyIntegrationEvent.body, '{"key":"value"}')
    })

    it("should not have claims for authorizer", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
        undefined,
      )
    })
  })

  describe("with a POST /fn1 request with a lowercase Content-Type header", () => {
    it("should assign the value to Content-Type", () => {
      const requestBuilder = new RequestBuilder("POST", "/fn1")
      requestBuilder.addBody({ key: "value" })
      requestBuilder.addHeader("content-type", "custom/test")
      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers["content-type"],
        "custom/test",
      )
    })
  })

  describe("with a POST /fn1 request with a single content-type header", () => {
    it("should not assign the value to Content-Type", () => {
      const requestBuilder = new RequestBuilder("POST", "/fn1")
      requestBuilder.addBody({ key: "value" })
      requestBuilder.addHeader("content-type", "custom/test")
      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers["Content-Type"],
        undefined,
      )
    })
  })

  describe("with a POST /fn1 request with a accept header", () => {
    it("should assign the value to accept", () => {
      const requestBuilder = new RequestBuilder("POST", "/fn1")
      requestBuilder.addBody({ key: "value" })
      requestBuilder.addHeader("accept", "custom/test")
      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers.accept,
        "custom/test",
      )
    })
  })

  describe("with a POST /fn1 request with a camelcase Content-Type header", () => {
    it("should assign the value to Content-Type", () => {
      const requestBuilder = new RequestBuilder("POST", "/fn1")
      requestBuilder.addBody({ key: "value" })
      requestBuilder.addHeader("Content-Type", "custom/test")
      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers["Content-Type"],
        "custom/test",
      )
    })
  })

  describe("with a POST /fn1 request with a set Content-length", () => {
    it("should have one content-length header only", () => {
      const requestBuilder = new RequestBuilder("POST", "/fn1")
      requestBuilder.addBody({ key: "value" })
      requestBuilder.addHeader("content-type", "custom/test")
      requestBuilder.addHeader("content-length", "2")
      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.ok(
        keys(lambdaProxyIntegrationEvent.headers).filter(
          (header) => header === "content-length",
        ).length === 1,
      )
    })
  })

  describe("with a POST /fn1 request with a set Content-length", () => {
    it("should have one content-length header only", () => {
      const requestBuilder = new RequestBuilder("POST", "/fn1")
      requestBuilder.addBody({ key: "value" })
      requestBuilder.addHeader("content-type", "custom/test")
      requestBuilder.addHeader("Content-length", "2")

      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.ok(
        keys(lambdaProxyIntegrationEvent.headers).filter(
          (header) => header.toLowerCase() === "content-length",
        ).length === 1,
      )
    })
  })

  describe("with a POST /fn1 request with a X-GitHub-Event header", () => {
    it("should assign not change the header case", () => {
      const requestBuilder = new RequestBuilder("POST", "/fn1")
      requestBuilder.addBody({ key: "value" })
      requestBuilder.addHeader("X-GitHub-Event", "test")

      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers["X-GitHub-Event"],
        "test",
      )
      assert.deepStrictEqual(
        lambdaProxyIntegrationEvent.multiValueHeaders["X-GitHub-Event"],
        ["test"],
      )
    })
  })

  describe("with a POST /fn1 request with multiValueHeaders", () => {
    it("should assign not change the header case", () => {
      const requestBuilder = new RequestBuilder("POST", "/fn1")
      requestBuilder.addBody({ key: "value" })
      requestBuilder.addHeader("Some-Header", "test1")
      requestBuilder.addHeader("Some-Header", "test2")

      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers["Some-Header"],
        "test2",
      )
      assert.deepStrictEqual(
        lambdaProxyIntegrationEvent.multiValueHeaders["Some-Header"],
        ["test1", "test2"],
      )
    })
  })

  describe("with a GET /fn1/{id} request with path parameters", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1/1234")
    requestBuilder.addParam("id", "1234")
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("should have a path parameter", () => {
      assert.strictEqual(
        keys(lambdaProxyIntegrationEvent.pathParameters).length,
        1,
      )
      assert.strictEqual(lambdaProxyIntegrationEvent.pathParameters.id, "1234")
    })
  })

  describe("with a GET /fn1/{id} request with encoded path parameters", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1/test|1234")
    requestBuilder.addParam("id", "test|1234")
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("should have a path parameter", () => {
      assert.strictEqual(
        keys(lambdaProxyIntegrationEvent.pathParameters).length,
        1,
      )
      assert.strictEqual(
        lambdaProxyIntegrationEvent.pathParameters.id,
        "test|1234",
      )
    })
  })

  describe("with a GET /fn1?param=1 request with single parameter in query string", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1?param=1")
    requestBuilder.addQuery("?param=1")
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("should have a query parameter named param", () => {
      assert.strictEqual(
        keys(lambdaProxyIntegrationEvent.queryStringParameters).length,
        1,
      )
      assert.strictEqual(
        lambdaProxyIntegrationEvent.queryStringParameters.param,
        "1",
      )
    })

    it("should have a multi value query parameter", () => {
      assert.ok(
        isArray(
          lambdaProxyIntegrationEvent.multiValueQueryStringParameters.param,
        ),
      )

      assert.strictEqual(
        lambdaProxyIntegrationEvent.multiValueQueryStringParameters.param[0],
        "1",
      )
    })
  })

  describe("with a GET /fn1?param=1&param2=1 request with double parameters in query string", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1?param=1")
    requestBuilder.addQuery("?param1=1&param2=2")
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("should have a two query parameters", () => {
      assert.strictEqual(
        keys(lambdaProxyIntegrationEvent.queryStringParameters).length,
        2,
      )
      assert.strictEqual(
        lambdaProxyIntegrationEvent.queryStringParameters.param1,
        "1",
      )
      assert.strictEqual(
        lambdaProxyIntegrationEvent.queryStringParameters.param2,
        "2",
      )
    })
  })

  describe("with a GET /fn1?param=1&param=1 request with single query string", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1?param=1")
    // emaulate HAPI `query` as described here:
    // https://futurestud.io/tutorials/hapi-how-to-use-query-parameters#multiplequeryparametersofthesamename
    requestBuilder.addQuery("?param=1&param=2")
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("should have a two query parameters", () => {
      assert.strictEqual(
        keys(lambdaProxyIntegrationEvent.queryStringParameters).length,
        1,
      )
      assert.strictEqual(
        lambdaProxyIntegrationEvent.queryStringParameters.param,
        "2",
      )
    })
  })

  describe("with a GET /fn1?param=1&param=2 request with multiValueQueryStringParameters", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1?param=1&param=2")
    // emaulate HAPI `query` as described here:
    // https://futurestud.io/tutorials/hapi-how-to-use-query-parameters#multiplequeryparametersofthesamename
    requestBuilder.addQuery("?param=1&param=2")
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("multi value param should have a two values", () => {
      assert.strictEqual(
        keys(lambdaProxyIntegrationEvent.multiValueQueryStringParameters)
          .length,
        1,
      )
      assert.strictEqual(
        lambdaProxyIntegrationEvent.multiValueQueryStringParameters.param
          .length,
        2,
      )
    })
  })

  describe("with a request that includes cognito-identity-id header", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1")
    const testId = "test-id"
    requestBuilder.addHeader("cognito-identity-id", testId)
    const request = requestBuilder.toObject()
    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("should have the expected cognitoIdentityId", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.identity.cognitoIdentityId,
        testId,
      )
    })

    it("should have the expected headers", () => {
      assert.strictEqual(keys(lambdaProxyIntegrationEvent.headers).length, 1)
      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers["cognito-identity-id"],
        testId,
      )
    })
  })

  describe("with a request that includes cognito-authentication-provider header", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1")
    const testId = "lorem:ipsum:test-id"
    requestBuilder.addHeader("cognito-authentication-provider", testId)
    const request = requestBuilder.toObject()
    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("should have the expected cognitoAuthenticationProvider", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.identity
          .cognitoAuthenticationProvider,
        testId,
      )
    })

    it("should have the expected headers", () => {
      assert.strictEqual(keys(lambdaProxyIntegrationEvent.headers).length, 1)
      assert.strictEqual(
        lambdaProxyIntegrationEvent.headers["cognito-authentication-provider"],
        testId,
      )
    })
  })

  describe("with environment variables", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1")
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      env.SLS_ACCOUNT_ID = "customAccountId"
      env.SLS_API_KEY = "customApiKey"
      env.SLS_CALLER = "customCaller"
      env.SLS_COGNITO_AUTHENTICATION_PROVIDER =
        "customCognitoAuthenticationProvider"
      env.SLS_COGNITO_AUTHENTICATION_TYPE = "customCognitoAuthenticationType"
      env.SLS_COGNITO_IDENTITY_ID = "customCognitoIdentityId"
      env.SLS_COGNITO_IDENTITY_POOL_ID = "customCognitoIdentityPoolId"

      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    it("should have the expected cognitoIdentityPoolId", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.identity
          .cognitoIdentityPoolId,
        "customCognitoIdentityPoolId",
      )
    })

    it("should have the expected accountId", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.identity.accountId,
        "customAccountId",
      )
    })

    it("should have the expected cognitoIdentityId", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.identity.cognitoIdentityId,
        "customCognitoIdentityId",
      )
    })

    it("should have the expected caller", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.identity.caller,
        "customCaller",
      )
    })

    it("should have the expected apiKey", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.identity.apiKey,
        "customApiKey",
      )
    })

    it("should have the expected cognitoAuthenticationType", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.identity
          .cognitoAuthenticationType,
        "customCognitoAuthenticationType",
      )
    })

    it("should have the expected cognitoAuthenticationProvider", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.identity
          .cognitoAuthenticationProvider,
        "customCognitoAuthenticationProvider",
      )
    })
  })

  describe("with operation name", () => {
    const requestBuilder = new RequestBuilder("GET", "/fn1")
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
        null,
        null,
        { operationName: "getFunctionOne" },
      ).create()
    })

    it("should have operation name", () => {
      assert.strictEqual(
        lambdaProxyIntegrationEvent.requestContext.operationName,
        "getFunctionOne",
      )
    })
  })
})
