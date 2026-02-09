import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"

describe("Streaming Response Tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  it("should handle streaming text response", async () => {
    const url = new URL("/dev/stream-text", BASE_URL)
    const response = await fetch(url)
    const text = await response.text()

    assert.equal(response.status, 200)
    assert.ok(response.headers.get("content-type").includes("text/plain"))
    assert.equal(text, "Hello streaming world!")
  })

  it("should handle streaming JSON response", async () => {
    const url = new URL("/dev/stream-json", BASE_URL)
    const response = await fetch(url)
    const text = await response.text()

    assert.equal(response.status, 200)
    assert.ok(response.headers.get("content-type").includes("application/json"))
    assert.equal(text, '{"message":"Streaming JSON"}')
  })

  it("should handle regular non-streaming response", async () => {
    const url = new URL("/dev/regular", BASE_URL)
    const response = await fetch(url)
    const text = await response.text()

    assert.equal(response.status, 200)
    assert.equal(text, "Regular response")
  })

  it("should handle buffered response (transferMode: BUFFERED)", async () => {
    const url = new URL("/dev/stream-buffered", BASE_URL)
    const response = await fetch(url)
    const text = await response.text()

    assert.equal(response.status, 200)
    assert.equal(text, "Buffered response")
  })
})
