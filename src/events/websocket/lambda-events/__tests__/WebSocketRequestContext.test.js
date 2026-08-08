import assert from "node:assert"
import WebSocketRequestContext from "../WebSocketRequestContext.js"

const uuid = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/

let nextConnectionId = 0

// NOTE: the connectedAt registry is module level state shared by every
// instance, so every test needs its own connection id
function connectionId() {
  nextConnectionId += 1

  return `requestContext-connection-${nextConnectionId}`
}

describe("WebSocketRequestContext", () => {
  it("should have the offline websocket defaults", () => {
    const requestContext = new WebSocketRequestContext(
      "CONNECT",
      "$connect",
      connectionId(),
    ).create()

    assert.strictEqual(requestContext.apiId, "private")
    assert.strictEqual(requestContext.domainName, "localhost")
    assert.strictEqual(requestContext.messageDirection, "IN")
    assert.strictEqual(requestContext.stage, "local")
    assert.strictEqual(requestContext.identity.sourceIp, "127.0.0.1")
  })

  it("should carry the event type, route and connection id", () => {
    const id = connectionId()
    const requestContext = new WebSocketRequestContext(
      "MESSAGE",
      "$default",
      id,
    ).create()

    assert.strictEqual(requestContext.connectionId, id)
    assert.strictEqual(requestContext.eventType, "MESSAGE")
    assert.strictEqual(requestContext.routeKey, "$default")
  })

  it("should generate uuids for the request, message and extended request ids", () => {
    const requestContext = new WebSocketRequestContext(
      "MESSAGE",
      "$default",
      connectionId(),
    ).create()

    assert.match(requestContext.extendedRequestId, uuid)
    assert.match(requestContext.messageId, uuid)
    assert.match(requestContext.requestId, uuid)
  })

  it("should generate a new request id per invocation", () => {
    const id = connectionId()
    const first = new WebSocketRequestContext(
      "MESSAGE",
      "$default",
      id,
    ).create()
    const second = new WebSocketRequestContext(
      "MESSAGE",
      "$default",
      id,
    ).create()

    assert.notStrictEqual(first.requestId, second.requestId)
  })

  it("should format the request time as CLF", () => {
    const requestContext = new WebSocketRequestContext(
      "MESSAGE",
      "$default",
      connectionId(),
    ).create()

    assert.match(
      requestContext.requestTime,
      /^\d{2}\/\w{3}\/\d{4}(?::\d{2}){3} [+-]\d{4}$/,
    )
    assert.strictEqual(typeof requestContext.requestTimeEpoch, "number")
  })

  describe("connectedAt", () => {
    it("should be set on CONNECT", () => {
      const requestContext = new WebSocketRequestContext(
        "CONNECT",
        "$connect",
        connectionId(),
      ).create()

      assert.strictEqual(typeof requestContext.connectedAt, "number")
    })

    it("should be remembered for subsequent messages of the same connection", () => {
      const id = connectionId()

      const connect = new WebSocketRequestContext(
        "CONNECT",
        "$connect",
        id,
      ).create()
      const message = new WebSocketRequestContext(
        "MESSAGE",
        "$default",
        id,
      ).create()

      assert.strictEqual(message.connectedAt, connect.connectedAt)
    })

    it("should not leak across connections", () => {
      const id = connectionId()

      new WebSocketRequestContext("CONNECT", "$connect", id).create()

      const other = new WebSocketRequestContext(
        "MESSAGE",
        "$default",
        connectionId(),
      ).create()

      assert.strictEqual(other.connectedAt, undefined)
    })

    it("should be forgotten after DISCONNECT", () => {
      const id = connectionId()

      new WebSocketRequestContext("CONNECT", "$connect", id).create()

      const disconnect = new WebSocketRequestContext(
        "DISCONNECT",
        "$disconnect",
        id,
      ).create()

      assert.strictEqual(typeof disconnect.connectedAt, "number")

      const afterDisconnect = new WebSocketRequestContext(
        "MESSAGE",
        "$default",
        id,
      ).create()

      assert.strictEqual(afterDisconnect.connectedAt, undefined)
    })
  })
})
