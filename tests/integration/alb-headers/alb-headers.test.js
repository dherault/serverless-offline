import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"

describe("ALB Headers Tests", function desc() {
  beforeEach(() =>
    setup({
      noPrependStageInUrl: false,
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;["GET", "POST"].forEach((method) => {
    it(`${method} response headers`, async () => {
      const url = new URL("/dev/response-headers", BASE_URL)
      url.port = url.port ? "3003" : url.port
      const options = {
        method,
      }

      const response = await fetch(url, options)

      assert.equal(response.status, 200)

      const body = await response.text()

      assert.equal(body, "Plain text")
      assert.equal(response.headers.get("Content-Type"), "text/plain")
      assert.equal(response.headers.get("Set-Cookie"), "alb-cookie=works")
    })
  })
})
