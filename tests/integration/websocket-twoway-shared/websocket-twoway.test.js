import assert from "node:assert"
import { join } from "desm"
import { WebSocket } from "ws"
import { setup, teardown } from "../../_testHelpers/index.js"
import websocketSend from "../../_testHelpers/websocketPromise.js"
import { BASE_URL } from "../../config.js"

const { parse, stringify } = JSON

describe("two way websocket tests on shared port", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  it("websocket echos sent message", async () => {
    const url = new URL("/dev", BASE_URL)
    url.port = url.port ? "3000" : url.port
    url.protocol = "ws"

    const payload = stringify({
      hello: "world",
      now: new Date().toISOString(),
    })

    const ws = new WebSocket(url)
    const { code, data, err } = await websocketSend(ws, payload)

    assert.equal(code, undefined)
    assert.equal(err, undefined)
    assert.deepEqual(data, payload)
  })

  //
  ;[401, 500, 501, 502].forEach((statusCode) => {
    it(`websocket connection emits status code ${statusCode}`, async () => {
      const url = new URL("/dev", BASE_URL)
      url.port = url.port ? "3000" : url.port
      url.searchParams.set("statusCode", statusCode)
      url.protocol = "ws"

      const payload = stringify({
        hello: "world",
        now: new Date().toISOString(),
      })

      const ws = new WebSocket(url)
      const { code, data, err } = await websocketSend(ws, payload)

      assert.equal(code, undefined)

      if (statusCode >= 200 && statusCode < 300) {
        assert.equal(err, undefined)
        assert.deepEqual(data, payload)
      } else {
        assert.equal(err.message, `Unexpected server response: ${statusCode}`)
        assert.equal(data, undefined)
      }
    })
  })

  it("websocket emits 502 on connection error", async () => {
    const url = new URL("/dev", BASE_URL)
    url.port = url.port ? "3000" : url.port
    url.searchParams.set("throwError", "true")
    url.protocol = "ws"

    const payload = stringify({
      hello: "world",
      now: new Date().toISOString(),
    })

    const ws = new WebSocket(url)
    const { code, data, err } = await websocketSend(ws, payload)

    assert.equal(code, undefined)
    assert.equal(err.message, "Unexpected server response: 502")
    assert.equal(data, undefined)
  })

  it("execution error emits Internal Server Error", async () => {
    const url = new URL("/dev", BASE_URL)
    url.port = url.port ? "3000" : url.port
    url.protocol = "ws"

    const payload = stringify({
      hello: "world",
      now: new Date().toISOString(),
      throwError: true,
    })

    const ws = new WebSocket(url)
    const { code, data, err } = await websocketSend(ws, payload)

    assert.equal(code, undefined)
    assert.equal(err, undefined)
    assert.equal(parse(data).message, "Internal server error")
  })
})
