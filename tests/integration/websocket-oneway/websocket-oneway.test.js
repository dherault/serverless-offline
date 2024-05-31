import assert from "node:assert"
import { join } from "desm"
import { WebSocket } from "ws"
import { setup, teardown } from "../../_testHelpers/index.js"
import websocketSend from "../../_testHelpers/websocketPromise.js"
import { BASE_URL } from "../../config.js"

const { parse, stringify } = JSON

describe("one way websocket tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  it("websocket echos nothing", async () => {
    const url = new URL("/dev", BASE_URL)
    url.port = url.port ? "3001" : url.port
    url.protocol = "ws"

    const payload = stringify({
      hello: "world",
      now: new Date().toISOString(),
    })

    const ws = new WebSocket(url)
    const { data, code, err } = await websocketSend(ws, payload)

    assert.equal(code, undefined)
    assert.equal(err, undefined)
    assert.equal(data, undefined)
  })

  it("execution error emits Internal Server Error", async () => {
    const url = new URL("/dev", BASE_URL)
    url.port = url.port ? "3001" : url.port
    url.protocol = "ws"

    const payload = stringify({
      hello: "world",
      now: new Date().toISOString(),
      throwError: true,
    })

    const ws = new WebSocket(url)
    const { data, code, err } = await websocketSend(ws, payload)

    assert.equal(code, undefined)
    assert.equal(err, undefined)
    assert.equal(parse(data).message, "Internal server error")
  })
})
