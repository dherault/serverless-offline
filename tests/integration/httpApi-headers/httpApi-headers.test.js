import assert from "node:assert"
import { Buffer } from "node:buffer"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"

describe("HttpApi Headers Tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;["GET", "POST"].forEach((method) => {
    it(`${method} headers`, async () => {
      const url = new URL("/echo-headers", BASE_URL)
      const options = {
        headers: {
          Origin: "http://www.example.com",
          "X-Webhook-Signature": "ABCDEF",
        },
        method,
      }

      const response = await fetch(url, options)

      assert.equal(response.status, 200)

      const body = await response.json()

      assert.equal(body.headersReceived.origin, "http://www.example.com")
      assert.equal(body.headersReceived["x-webhook-signature"], "ABCDEF")
      assert.equal(body.isBase64Encoded, false)
    })
  })

  it(`multipart/form-data headers are base64 encoded`, async () => {
    const url = new URL("/echo-headers", BASE_URL)
    const options = {
      body: `------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="file"; filename="file.txt"\r\nContent-Type: text/plain\r\n\r\n\u0001content\u0003\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--\r\n`,
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        Origin: "http://www.example.com",
        "X-Webhook-Signature": "ABCDEF",
      },
      method: "POST",
    }

    const response = await fetch(url, options)

    assert.equal(response.status, 200)

    const body = await response.json()

    assert.equal(body.headersReceived.origin, "http://www.example.com")
    assert.equal(body.headersReceived["x-webhook-signature"], "ABCDEF")
    assert.equal(body.isBase64Encoded, true)
    assert.equal(body.body, Buffer.from(options.body).toString("base64"))
    assert.equal(
      Number.parseInt(body.headersReceived["content-length"], 10),
      options.body.length,
    )
  })
})
