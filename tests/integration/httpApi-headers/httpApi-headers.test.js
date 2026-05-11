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
  ;[
    {
      desiredContentLengthHeader: "Content-Length",
      desiredOriginHeader: "Origin",
      desiredWebhookSignatureHeder: "X-Webhook-Signature",
      payloadVersion: "1.0",
    },
    {
      desiredContentLengthHeader: "content-length",
      desiredOriginHeader: "origin",
      desiredWebhookSignatureHeder: "x-webhook-signature",
      payloadVersion: "2.0",
    },
  ].forEach((t) => {
    ;["GET", "POST"].forEach((method) => {
      it(`${method} headers (payload ${t.payloadVersion})`, async () => {
        const url = new URL(`/echo-headers-${t.payloadVersion}`, BASE_URL)
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

        assert.equal(
          body.headersReceived[t.desiredOriginHeader],
          "http://www.example.com",
        )
        assert.equal(
          body.headersReceived[t.desiredWebhookSignatureHeder],
          "ABCDEF",
        )
        assert.equal(body.isBase64EncodedReceived, false)
      })
    })

    it(`multipart/form-data headers are base64 encoded (payload ${t.payloadVersion})`, async () => {
      const url = new URL(`/echo-headers-${t.payloadVersion}`, BASE_URL)
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

      assert.equal(
        body.headersReceived[t.desiredOriginHeader],
        "http://www.example.com",
      )
      assert.equal(
        body.headersReceived[t.desiredWebhookSignatureHeder],
        "ABCDEF",
      )
      assert.equal(
        Number.parseInt(body.headersReceived[t.desiredContentLengthHeader], 10),
        options.body.length,
      )
      assert.equal(body.isBase64EncodedReceived, true)
      assert.equal(
        body.bodyReceived,
        Buffer.from(options.body).toString("base64"),
      )
    })
  })
})
