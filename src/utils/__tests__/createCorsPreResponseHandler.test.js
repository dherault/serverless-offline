import assert from "node:assert"
import { Server } from "@hapi/hapi"
import createCorsPreResponseHandler from "../createCorsPreResponseHandler.js"

function createServer(provider, corsConfig) {
  const server = new Server()

  server.ext(
    "onPreResponse",
    createCorsPreResponseHandler(
      {
        service: {
          provider,
        },
      },
      corsConfig,
    ),
  )

  server.route([
    {
      handler() {
        return "ok"
      },
      method: "POST",
      path: "/",
    },
    {
      handler(request, h) {
        return h
          .response("ok")
          .header("access-control-allow-origin", "https://explicit.com")
      },
      method: "POST",
      path: "/explicit",
    },
  ])

  return server
}

function preflight(server, origin) {
  return server.inject({
    headers: {
      "access-control-request-headers": "amz-sdk-invocation-id,content-type",
      "access-control-request-method": "POST",
      origin,
    },
    method: "OPTIONS",
    url: "/",
  })
}

describe("createCorsPreResponseHandler", () => {
  describe("when provider.httpApi.cors is not set", () => {
    it("should not add CORS headers when the request has no origin", async () => {
      const server = createServer({})

      const { headers, statusCode } = await server.inject({
        method: "POST",
        url: "/",
      })

      assert.equal(statusCode, 200)
      assert.equal(headers["access-control-allow-origin"], undefined)
      assert.equal(headers["access-control-allow-credentials"], undefined)
    })

    it("should answer a preflight request with the requested headers and method", async () => {
      const server = createServer({})

      const { headers, statusCode } = await preflight(
        server,
        "https://example.com",
      )

      assert.equal(statusCode, 200)
      assert.equal(
        headers["access-control-allow-origin"],
        "https://example.com",
      )
      assert.equal(headers["access-control-allow-credentials"], "true")
      assert.equal(
        headers["access-control-allow-headers"],
        "amz-sdk-invocation-id,content-type",
      )
      assert.equal(headers["access-control-allow-methods"], "POST")
      assert.equal(
        headers["access-control-expose-headers"],
        "content-type, content-length, etag",
      )
      assert.equal(headers["access-control-max-age"], 600)
    })

    it("should add CORS headers to a response", async () => {
      const server = createServer({})

      const { headers, statusCode } = await server.inject({
        headers: {
          origin: "https://example.com",
        },
        method: "POST",
        url: "/",
      })

      assert.equal(statusCode, 200)
      assert.equal(
        headers["access-control-allow-origin"],
        "https://example.com",
      )
      assert.equal(headers["access-control-allow-credentials"], "true")
    })

    it("should add CORS headers to an error response", async () => {
      const server = createServer({})

      const { headers, statusCode } = await server.inject({
        headers: {
          origin: "https://example.com",
        },
        method: "POST",
        url: "/not-found",
      })

      assert.equal(statusCode, 404)
      assert.equal(
        headers["access-control-allow-origin"],
        "https://example.com",
      )
      assert.equal(headers["access-control-allow-credentials"], "true")
    })

    it("should keep the CORS headers explicitly set on a response", async () => {
      const server = createServer({})

      const { headers } = await server.inject({
        headers: {
          origin: "https://example.com",
        },
        method: "POST",
        url: "/explicit",
      })

      assert.equal(
        headers["access-control-allow-origin"],
        "https://explicit.com",
      )
    })
  })

  describe("when provider.httpApi.cors is not set and cors options are given", () => {
    const corsConfig = {
      credentials: false,
      origin: ["https://example.com"],
    }

    it("should answer a preflight request from an allowed origin with the requested headers, without credentials", async () => {
      const server = createServer({}, corsConfig)

      const { headers, statusCode } = await preflight(
        server,
        "https://example.com",
      )

      assert.equal(statusCode, 200)
      assert.equal(
        headers["access-control-allow-origin"],
        "https://example.com",
      )
      assert.equal(headers["access-control-allow-credentials"], undefined)
      assert.equal(
        headers["access-control-allow-headers"],
        "amz-sdk-invocation-id,content-type",
      )
      assert.equal(headers["access-control-allow-methods"], "POST")
    })

    it("should not allow a preflight request from another origin", async () => {
      const server = createServer({}, corsConfig)

      const { headers } = await preflight(server, "https://other.com")

      assert.equal(headers["access-control-allow-origin"], undefined)
      assert.equal(headers["access-control-allow-headers"], undefined)
    })

    it("should not add CORS headers to a response to another origin", async () => {
      const server = createServer({}, corsConfig)

      const { headers, statusCode } = await server.inject({
        headers: {
          origin: "https://other.com",
        },
        method: "POST",
        url: "/",
      })

      assert.equal(statusCode, 200)
      assert.equal(headers["access-control-allow-origin"], undefined)
      assert.equal(headers["access-control-allow-credentials"], undefined)
    })

    it("should allow any origin, with credentials, when the cors options do", async () => {
      const server = createServer(
        {},
        {
          credentials: true,
          origin: ["*"],
        },
      )

      const { headers } = await server.inject({
        headers: {
          origin: "https://other.com",
        },
        method: "POST",
        url: "/",
      })

      assert.equal(headers["access-control-allow-origin"], "https://other.com")
      assert.equal(headers["access-control-allow-credentials"], "true")
    })

    describe("with a wildcard origin", () => {
      const wildcardCorsConfig = {
        credentials: false,
        origin: ["https://*.example.com"],
      }

      it("should answer a preflight request from a matching origin", async () => {
        const server = createServer({}, wildcardCorsConfig)

        const { headers, statusCode } = await preflight(
          server,
          "https://app.example.com",
        )

        assert.equal(statusCode, 200)
        assert.equal(
          headers["access-control-allow-origin"],
          "https://app.example.com",
        )
        assert.equal(
          headers["access-control-allow-headers"],
          "amz-sdk-invocation-id,content-type",
        )
      })
      ;[
        "https://example.com",
        // the dots of the allowed origin aren't wildcards
        "https://appxexample.com",
        "https://app.example.com.other.com",
      ].forEach((origin) => {
        it(`should not allow a preflight request from ${origin}`, async () => {
          const server = createServer({}, wildcardCorsConfig)

          const { headers } = await preflight(server, origin)

          assert.equal(headers["access-control-allow-origin"], undefined)
          assert.equal(headers["access-control-allow-headers"], undefined)
        })
      })
    })
  })

  describe("when provider.httpApi.cors is set", () => {
    const provider = {
      httpApi: {
        cors: {
          allowCredentials: true,
          allowedHeaders: ["authorization", "content-type"],
          allowedMethods: ["GET", "POST"],
          allowedOrigins: ["https://example.com"],
          exposedResponseHeaders: ["status"],
          maxAge: 60,
        },
      },
    }

    it("should answer a preflight request from an allowed origin with the configured policy", async () => {
      const server = createServer(provider)

      const { headers, statusCode } = await preflight(
        server,
        "https://example.com",
      )

      assert.equal(statusCode, 204)
      assert.equal(
        headers["access-control-allow-origin"],
        "https://example.com",
      )
      assert.equal(headers["access-control-allow-credentials"], "true")
      assert.equal(
        headers["access-control-allow-headers"],
        "authorization,content-type",
      )
      assert.equal(headers["access-control-allow-methods"], "GET,POST")
      assert.equal(headers["access-control-expose-headers"], "status")
      assert.equal(headers["access-control-max-age"], 60)
    })

    it("should not allow a preflight request from another origin", async () => {
      const server = createServer(provider)

      const { headers, statusCode } = await preflight(
        server,
        "https://other.com",
      )

      assert.equal(statusCode, 204)
      assert.equal(headers["access-control-allow-origin"], undefined)
      assert.equal(headers["access-control-allow-headers"], undefined)
    })

    it("should allow a preflight request from any origin with the default policy", async () => {
      const server = createServer({
        httpApi: {
          cors: true,
        },
      })

      const { headers, statusCode } = await preflight(
        server,
        "https://other.com",
      )

      assert.equal(statusCode, 204)
      assert.equal(headers["access-control-allow-origin"], "https://other.com")
      assert.equal(headers["access-control-allow-credentials"], undefined)
      assert.equal(
        headers["access-control-allow-methods"],
        "DELETE,GET,OPTIONS,PATCH,POST,PUT",
      )
    })

    it("should add CORS headers to a response", async () => {
      const server = createServer(provider)

      const { headers, statusCode } = await server.inject({
        headers: {
          origin: "https://example.com",
        },
        method: "POST",
        url: "/",
      })

      assert.equal(statusCode, 200)
      assert.equal(
        headers["access-control-allow-origin"],
        "https://example.com",
      )
      assert.equal(headers["access-control-allow-credentials"], "true")
      assert.equal(headers["access-control-expose-headers"], "status")
    })

    it("should not add CORS headers to a response to another origin", async () => {
      const server = createServer(provider)

      const { headers, statusCode } = await server.inject({
        headers: {
          origin: "https://other.com",
        },
        method: "POST",
        url: "/",
      })

      assert.equal(statusCode, 200)
      assert.equal(headers["access-control-allow-origin"], undefined)
      assert.equal(headers["access-control-allow-credentials"], undefined)
      assert.equal(headers["access-control-expose-headers"], undefined)
    })
  })
})
