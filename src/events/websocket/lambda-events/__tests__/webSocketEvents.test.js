import assert from "node:assert"
import WebSocketAuthorizerEvent from "../WebSocketAuthorizerEvent.js"
import WebSocketConnectEvent from "../WebSocketConnectEvent.js"
import WebSocketDisconnectEvent from "../WebSocketDisconnectEvent.js"
import WebSocketEvent from "../WebSocketEvent.js"

const options = {
  httpsProtocol: false,
  websocketPort: 3001,
}

const provider = {
  region: "us-east-1",
}

function request(url = "/", rawHeaders = ["Host", "localhost"]) {
  return { rawHeaders, url }
}

describe("WebSocketEvent", () => {
  it("should carry the payload as the body", () => {
    const event = new WebSocketEvent(
      "connection-1",
      "$default",
      '{"action":"echo"}',
    ).create()

    assert.strictEqual(event.body, '{"action":"echo"}')
    assert.strictEqual(event.isBase64Encoded, false)
  })

  it("should have a MESSAGE request context", () => {
    const event = new WebSocketEvent("connection-1", "someRoute", "").create()

    assert.strictEqual(event.requestContext.eventType, "MESSAGE")
    assert.strictEqual(event.requestContext.routeKey, "someRoute")
    assert.strictEqual(event.requestContext.connectionId, "connection-1")
  })
})

describe("WebSocketConnectEvent", () => {
  it("should have a CONNECT request context", () => {
    const event = new WebSocketConnectEvent(
      "connection-2",
      request(),
      options,
    ).create()

    assert.strictEqual(event.requestContext.eventType, "CONNECT")
    assert.strictEqual(event.requestContext.routeKey, "$connect")
    assert.strictEqual(event.isBase64Encoded, false)
  })

  it("should parse the headers", () => {
    const event = new WebSocketConnectEvent(
      "connection-3",
      request("/", ["Host", "localhost", "X-Custom", "value"]),
      options,
    ).create()

    assert.deepStrictEqual(event.headers, {
      Host: "localhost",
      "X-Custom": "value",
    })
    assert.deepStrictEqual(event.multiValueHeaders, {
      Host: ["localhost"],
      "X-Custom": ["value"],
    })
  })

  it("should omit the query string properties when there is no query string", () => {
    const event = new WebSocketConnectEvent(
      "connection-4",
      request(),
      options,
    ).create()

    assert.ok(!("queryStringParameters" in event))
    assert.ok(!("multiValueQueryStringParameters" in event))
  })

  it("should include the query string properties when there is a query string", () => {
    const event = new WebSocketConnectEvent(
      "connection-5",
      request("/?foo=bar&foo=baz"),
      options,
    ).create()

    assert.deepStrictEqual(event.queryStringParameters, { foo: "baz" })
    assert.deepStrictEqual(event.multiValueQueryStringParameters, {
      foo: ["bar", "baz"],
    })
  })
})

describe("WebSocketDisconnectEvent", () => {
  it("should have a DISCONNECT request context", () => {
    const event = new WebSocketDisconnectEvent("connection-6").create()

    assert.strictEqual(event.requestContext.eventType, "DISCONNECT")
    assert.strictEqual(event.requestContext.routeKey, "$disconnect")
    assert.strictEqual(event.requestContext.connectionId, "connection-6")
    assert.strictEqual(event.isBase64Encoded, false)
  })
})

describe("WebSocketAuthorizerEvent", () => {
  it("should be a REQUEST type authorizer event", () => {
    const event = new WebSocketAuthorizerEvent(
      "connection-7",
      request(),
      provider,
      options,
    ).create()

    assert.strictEqual(event.type, "REQUEST")
    assert.strictEqual(event.requestContext.eventType, "CONNECT")
  })

  it("should build the method arn from the provider region and the request context", () => {
    const event = new WebSocketAuthorizerEvent(
      "connection-8",
      request(),
      provider,
      options,
    ).create()

    // NOTE: the websocket request context has no top level accountId (only
    // identity.accountId, which is null), so the account segment of the arn is
    // the literal "undefined"
    assert.strictEqual(event.requestContext.accountId, undefined)
    assert.strictEqual(
      event.methodArn,
      "arn:aws:execute-api:us-east-1:undefined:private/local/$connect",
    )
  })

  it("should pass the query string through", () => {
    const event = new WebSocketAuthorizerEvent(
      "connection-9",
      request("/?token=abc"),
      provider,
      options,
    ).create()

    assert.deepStrictEqual(event.queryStringParameters, { token: "abc" })
  })
})
