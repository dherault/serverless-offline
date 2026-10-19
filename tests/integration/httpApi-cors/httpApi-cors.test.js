// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import assert from "node:assert"

import { join } from "desm"

import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL, LAMBDA_BASE_URL } from "../../config.js"

describe("HttpApi Cors Tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  it("Fetch OPTIONS with valid origin", async () => {
    const url = new URL("/user", BASE_URL)
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
    assert.equal(response.headers.get("access-control-allow-origin"), "http://www.mytestapp.com")
    assert.equal(response.headers.get("access-control-allow-credentials"), "true")
    assert.equal(response.headers.get("access-control-max-age"), "60")
    assert.equal(response.headers.get("access-control-expose-headers"), "status,origin")
    assert.equal(response.headers.get("access-control-allow-methods"), "GET,POST")
    assert.equal(response.headers.get("access-control-allow-headers"), "authorization,content-type")
  })

  it("Fetch OPTIONS with invalid origin", async () => {
    const url = new URL("/user", BASE_URL)
    const options = {
      headers: {
        "access-control-request-headers": "authorization,content-type",
        "access-control-request-method": "GET",
        origin: "http://www.wrongapp.com",
      },
      method: "OPTIONS",
    }

    const response = await fetch(url, options)

    assert.equal(response.status, 204)
    assert.equal(response.headers.get("access-control-allow-origin"), null)
  })

  it("Fetch GET with valid origin", async () => {
    const url = new URL("/user", BASE_URL)
    const options = {
      headers: {
        origin: "http://www.mytestapp.com",
      },
    }

    const response = await fetch(url, options)

    assert.equal(response.status, 200)
    assert.equal(response.headers.get("access-control-allow-origin"), "http://www.mytestapp.com")
    assert.equal(response.headers.get("access-control-allow-credentials"), "true")
  })

  it("Fetch GET with invalid origin", async () => {
    const url = new URL("/user", BASE_URL)
    const options = {
      headers: {
        origin: "http://www.wrongapp.com",
      },
    }

    const response = await fetch(url, options)

    assert.equal(response.status, 200)
    assert.equal(response.headers.get("access-control-allow-origin"), null)
    assert.equal(response.headers.get("access-control-allow-credentials"), null)
  })

  describe("lambda invoke endpoint", () => {
    const lambdaInvokeUrl = new URL(
      "/2015-03-31/functions/httpapi-cors-dev-user/invocations",
      LAMBDA_BASE_URL,
    )

    it("Fetch OPTIONS with valid origin", async () => {
      const options = {
        headers: {
          "access-control-request-headers": "amz-sdk-invocation-id,authorization,content-type",
          "access-control-request-method": "POST",
          origin: "http://www.mytestapp.com",
        },
        method: "OPTIONS",
      }

      const response = await fetch(lambdaInvokeUrl, options)

      assert.equal(response.status, 204)
      assert.equal(response.headers.get("access-control-allow-origin"), "http://www.mytestapp.com")
      assert.equal(response.headers.get("access-control-allow-credentials"), "true")
      assert.equal(response.headers.get("access-control-max-age"), "60")
      assert.equal(response.headers.get("access-control-expose-headers"), "status,origin")
      assert.equal(response.headers.get("access-control-allow-methods"), "GET,POST")
      assert.equal(
        response.headers.get("access-control-allow-headers"),
        "authorization,content-type",
      )
    })

    it("Fetch OPTIONS with invalid origin", async () => {
      const options = {
        headers: {
          "access-control-request-headers": "authorization,content-type",
          "access-control-request-method": "POST",
          origin: "http://www.wrongapp.com",
        },
        method: "OPTIONS",
      }

      const response = await fetch(lambdaInvokeUrl, options)

      assert.equal(response.status, 204)
      assert.equal(response.headers.get("access-control-allow-origin"), null)
    })

    it("Invoke with valid origin", async () => {
      const options = {
        body: "{}",
        headers: {
          origin: "http://www.mytestapp.com",
        },
        method: "POST",
      }

      const response = await fetch(lambdaInvokeUrl, options)

      assert.equal(response.status, 200)
      assert.equal(response.headers.get("access-control-allow-origin"), "http://www.mytestapp.com")
      assert.equal(response.headers.get("access-control-allow-credentials"), "true")

      const exposedHeaders = response.headers
        .get("access-control-expose-headers")
        .toLowerCase()
        .split(",")

      // the configured exposed headers, and the ones the aws-sdk reads to
      // detect a failed invocation
      assert.ok(exposedHeaders.includes("status"))
      assert.ok(exposedHeaders.includes("x-amz-function-error"))
      assert.ok(exposedHeaders.includes("x-amzn-errortype"))
    })

    it("Invoke with invalid origin", async () => {
      // a simple request, which a browser sends without a preflight request
      const options = {
        body: "{}",
        headers: {
          "content-type": "text/plain",
          origin: "http://www.wrongapp.com",
        },
        method: "POST",
      }

      const response = await fetch(lambdaInvokeUrl, options)

      assert.equal(response.status, 200)
      assert.equal(response.headers.get("access-control-allow-origin"), null)
      assert.equal(response.headers.get("access-control-allow-credentials"), null)
      assert.equal(response.headers.get("access-control-expose-headers"), null)
    })
  })
})
