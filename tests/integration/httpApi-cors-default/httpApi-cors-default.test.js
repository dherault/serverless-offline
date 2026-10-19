// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"

describe("HttpApi Cors Default Tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  it("Fetch OPTIONS with any origin", async () => {
    const url = new URL("/dev/user", BASE_URL)
    const options = {
      headers: {
        "access-control-request-headers": "authorization,content-type",
        "access-control-request-method": "GET",
        origin: "http://www.mytestapp.com",
      },
      method: "OPTIONS",
    }

    const response = await fetch(url, options)
    assert.equal(response.status, 204)

    assert.equal(
      response.headers.get("access-control-allow-origin"),
      "http://www.mytestapp.com",
    )
    assert.equal(
      response.headers.get("access-control-allow-methods"),
      "DELETE,GET,OPTIONS,PATCH,POST,PUT",
    )
    assert.equal(
      response.headers.get("access-control-allow-headers"),
      "Authorization,Content-Type,X-Amz-Date,X-Amz-Security-Token,X-Amz-User-Agent,X-Api-Key",
    )
  })

  describe("REST API endpoint with CORS", () => {
    it("should allow credentials by default", async () => {
      const url = new URL("/dev/rest/user", BASE_URL)

      const response = await fetch(url, {
        headers: {
          origin: "http://www.mytestapp.com",
        },
      })

      assert.equal(response.status, 200)
      assert.equal(
        response.headers.get("access-control-allow-origin"),
        "http://www.mytestapp.com",
      )
      assert.equal(
        response.headers.get("access-control-allow-credentials"),
        "true",
      )
    })

    it("should not allow credentials when allowCredentials is false", async () => {
      const url = new URL("/dev/rest/user-without-credentials", BASE_URL)

      const response = await fetch(url, {
        headers: {
          origin: "http://www.mytestapp.com",
        },
      })

      assert.equal(response.status, 200)
      assert.equal(
        response.headers.get("access-control-allow-origin"),
        "http://www.mytestapp.com",
      )
      assert.equal(
        response.headers.get("access-control-allow-credentials"),
        null,
      )
    })
  })
})
