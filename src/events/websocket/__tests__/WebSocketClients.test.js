import assert from "node:assert"
import { EventEmitter } from "node:events"
import { Buffer } from "node:buffer"
import { setImmediate } from "node:timers/promises"
import { WebSocket } from "ws"
import WebSocketClients from "../WebSocketClients.js"

const { stringify } = JSON

// a minimal stand-in for a ws client, which is an EventEmitter
// eslint-disable-next-line unicorn/prefer-event-target
class FakeWebSocketClient extends EventEmitter {
  readyState = WebSocket.OPEN

  sent = []

  close() {
    this.readyState = WebSocket.CLOSED
    this.emit("close")
  }

  send(data) {
    this.sent.push(data)
  }
}

function createWebSocketClients(runHandler) {
  const webSocketClients = new WebSocketClients(
    {
      service: {
        provider: {},
      },
    },
    {
      noAuth: true,
      webSocketHardTimeout: 7200,
      webSocketIdleTimeout: 600,
    },
    {
      get() {
        return {
          runHandler,
          setEvent() {},
        }
      },
    },
  )

  webSocketClients.addRoute("foo", {
    route: "$default",
    routeResponseSelectionExpression: "$default",
  })

  return webSocketClients
}

describe("WebSocketClients", () => {
  let webSocketClient

  beforeEach(() => {
    webSocketClient = new FakeWebSocketClient()
  })

  // also clears the idle and hard timeouts
  afterEach(() => {
    webSocketClient.close()
  })

  it("should not send an error when the handler returns nothing", async () => {
    const webSocketClients = createWebSocketClients(async () => undefined)

    webSocketClients.addClient(webSocketClient, "connection-id")
    webSocketClient.emit(
      "message",
      Buffer.from(stringify({ foo: "bar" })),
      false,
    )

    await setImmediate()

    assert.deepStrictEqual(webSocketClient.sent, [])
  })

  it("should send the body which the handler returns", async () => {
    const webSocketClients = createWebSocketClients(async () => ({
      body: "pong",
      statusCode: 200,
    }))

    webSocketClients.addClient(webSocketClient, "connection-id")
    webSocketClient.emit("message", Buffer.from("ping"), false)

    await setImmediate()

    assert.deepStrictEqual(webSocketClient.sent, ["pong"])
  })

  it("should send an error when the handler throws", async () => {
    const webSocketClients = createWebSocketClients(async () => {
      throw new Error("boom")
    })

    webSocketClients.addClient(webSocketClient, "connection-id")
    webSocketClient.emit("message", Buffer.from("ping"), false)

    await setImmediate()

    assert.strictEqual(webSocketClient.sent.length, 1)
    assert.match(webSocketClient.sent[0], /Internal server error/)
  })

  // e.g. an invalid frame. An 'error' event without a listener is thrown.
  it("should handle errors of the connection", () => {
    const webSocketClients = createWebSocketClients(async () => undefined)

    webSocketClients.addClient(webSocketClient, "connection-id")

    assert.doesNotThrow(() => {
      webSocketClient.emit("error", new Error("Invalid WebSocket frame"))
    })
  })
})
