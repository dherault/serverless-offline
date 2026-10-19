import assert from "node:assert"
import defaultOptions from "../../config/defaultOptions.js"
import HttpServer from "../HttpServer.js"

const functionName = "foo"

// the cors options built by ServerlessOffline from the default CLI options
const defaultCorsConfig = {
  credentials: !defaultOptions.corsDisallowCredentials,
  exposedHeaders: defaultOptions.corsExposedHeaders.split(","),
  headers: defaultOptions.corsAllowHeaders.split(","),
  origin: defaultOptions.corsAllowOrigin.split(","),
}

function createLambda(runHandler) {
  return {
    getByFunctionName() {
      return {
        runHandler,
        setClientContext() {},
        setEvent() {},
      }
    },
    listFunctionNamePairs() {
      return {
        [functionName]: functionName,
      }
    },
    listFunctionNames() {
      return [functionName]
    },
  }
}

function getExposedHeaders(response) {
  return response.headers
    .get("access-control-expose-headers")
    .toLowerCase()
    .split(/\s*,\s*/)
}

describe("Lambda HttpServer", () => {
  let httpServer

  afterEach(async () => {
    await httpServer.stop(0)
  })

  async function startServer(
    provider,
    runHandler,
    corsConfig = defaultCorsConfig,
  ) {
    httpServer = new HttpServer(
      {
        service: {
          provider,
        },
      },
      {
        corsConfig,
        host: "localhost",
        // any free port
        lambdaPort: 0,
      },
      createLambda(runHandler),
    )

    await httpServer.start()

    return `http://localhost:${httpServer.server.address().port}`
  }

  function invoke(url, origin, name = functionName) {
    return fetch(`${url}/2015-03-31/functions/${name}/invocations`, {
      body: "{}",
      headers: {
        origin,
      },
      method: "POST",
    })
  }

  const sdkRequestHeaders =
    "amz-sdk-invocation-id,amz-sdk-request,content-type,x-amz-user-agent"

  function preflight(url, origin) {
    return fetch(`${url}/2015-03-31/functions/${functionName}/invocations`, {
      headers: {
        "access-control-request-headers": sdkRequestHeaders,
        "access-control-request-method": "POST",
        origin,
      },
      method: "OPTIONS",
    })
  }

  describe("when provider.httpApi.cors is not set", () => {
    it("should answer a CORS preflight request from the aws-sdk", async () => {
      const url = await startServer({}, async () => ({}))

      const response = await preflight(url, "https://example.com")

      assert.strictEqual(response.status, 200)
      assert.strictEqual(
        response.headers.get("access-control-allow-origin"),
        "https://example.com",
      )
      assert.strictEqual(
        response.headers.get("access-control-allow-headers"),
        sdkRequestHeaders,
      )
    })

    it("should allow credentials with the default CLI options", async () => {
      const url = await startServer({}, async () => ({}))

      const response = await invoke(url, "https://example.com")

      assert.strictEqual(
        response.headers.get("access-control-allow-origin"),
        "https://example.com",
      )
      assert.strictEqual(
        response.headers.get("access-control-allow-credentials"),
        "true",
      )
    })

    it("should not allow credentials with corsDisallowCredentials", async () => {
      const url = await startServer({}, async () => ({}), {
        ...defaultCorsConfig,
        credentials: false,
      })

      const response = await invoke(url, "https://example.com")

      assert.strictEqual(
        response.headers.get("access-control-allow-origin"),
        "https://example.com",
      )
      assert.strictEqual(
        response.headers.get("access-control-allow-credentials"),
        null,
      )
    })

    describe("with origins restricted by the CLI options", () => {
      const corsConfig = {
        ...defaultCorsConfig,
        origin: ["https://trusted.example"],
      }

      it("should answer a CORS preflight request from the aws-sdk from an allowed origin", async () => {
        const url = await startServer({}, async () => ({}), corsConfig)

        const response = await preflight(url, "https://trusted.example")

        assert.strictEqual(response.status, 200)
        assert.strictEqual(
          response.headers.get("access-control-allow-origin"),
          "https://trusted.example",
        )
        assert.strictEqual(
          response.headers.get("access-control-allow-headers"),
          sdkRequestHeaders,
        )
      })

      it("should let the aws-sdk invoke a function from an origin matching a wildcard", async () => {
        const url = await startServer({}, async () => ({}), {
          ...defaultCorsConfig,
          origin: ["https://*.trusted.example"],
        })

        const preflightResponse = await preflight(
          url,
          "https://app.trusted.example",
        )

        assert.strictEqual(preflightResponse.status, 200)
        assert.strictEqual(
          preflightResponse.headers.get("access-control-allow-origin"),
          "https://app.trusted.example",
        )
        assert.strictEqual(
          preflightResponse.headers.get("access-control-allow-headers"),
          sdkRequestHeaders,
        )

        const response = await invoke(url, "https://app.trusted.example")

        assert.strictEqual(response.status, 200)
        assert.strictEqual(
          response.headers.get("access-control-allow-origin"),
          "https://app.trusted.example",
        )
      })

      it("should not allow a CORS preflight request from another origin", async () => {
        const url = await startServer({}, async () => ({}), corsConfig)

        const response = await preflight(url, "https://untrusted.example")

        assert.strictEqual(
          response.headers.get("access-control-allow-origin"),
          null,
        )
        assert.strictEqual(
          response.headers.get("access-control-allow-headers"),
          null,
        )
      })

      it("should not add CORS headers to an invocation from another origin", async () => {
        const url = await startServer(
          {},
          async () => ({
            foo: "bar",
          }),
          corsConfig,
        )

        const response = await invoke(url, "https://untrusted.example")

        assert.strictEqual(response.status, 200)
        assert.strictEqual(
          response.headers.get("access-control-allow-origin"),
          null,
        )
        assert.strictEqual(
          response.headers.get("access-control-allow-credentials"),
          null,
        )
        assert.strictEqual(
          response.headers.get("access-control-expose-headers"),
          null,
        )
      })
    })

    it("should expose the error header of a failed invocation", async () => {
      const url = await startServer({}, async () => {
        throw new Error("foo")
      })

      const response = await invoke(url, "https://example.com")

      assert.strictEqual(response.status, 200)
      assert.strictEqual(
        response.headers.get("access-control-allow-origin"),
        "https://example.com",
      )
      assert.strictEqual(
        response.headers.get("x-amz-function-error"),
        "Unhandled",
      )

      const exposedHeaders = getExposedHeaders(response)

      assert.ok(exposedHeaders.includes("x-amz-function-error"))
      assert.ok(exposedHeaders.includes("x-amzn-errortype"))
      // the exposed headers of the CLI options are kept
      assert.ok(exposedHeaders.includes("www-authenticate"))
    })

    it("should expose the error type header of an invocation of a missing function", async () => {
      const url = await startServer({}, async () => ({}))

      const response = await invoke(url, "https://example.com", "bar")

      assert.strictEqual(response.status, 404)
      assert.strictEqual(
        response.headers.get("x-amzn-errortype"),
        "ResourceNotFoundException",
      )
      assert.ok(getExposedHeaders(response).includes("x-amzn-errortype"))
    })
  })

  describe("when provider.httpApi.cors is set", () => {
    const provider = {
      httpApi: {
        cors: {
          allowedOrigins: ["https://example.com"],
          exposedResponseHeaders: ["status"],
        },
      },
    }

    it("should expose the error header of a failed invocation from an allowed origin", async () => {
      const url = await startServer(provider, async () => {
        throw new Error("foo")
      })

      const response = await invoke(url, "https://example.com")

      assert.strictEqual(response.status, 200)
      assert.strictEqual(
        response.headers.get("access-control-allow-origin"),
        "https://example.com",
      )
      assert.strictEqual(
        response.headers.get("x-amz-function-error"),
        "Unhandled",
      )

      const exposedHeaders = getExposedHeaders(response)

      assert.ok(exposedHeaders.includes("x-amz-function-error"))
      assert.ok(exposedHeaders.includes("x-amzn-errortype"))
      // the configured exposed headers are kept
      assert.ok(exposedHeaders.includes("status"))
    })

    it("should not add CORS headers to an invocation from another origin", async () => {
      const url = await startServer(provider, async () => ({
        foo: "bar",
      }))

      const response = await invoke(url, "https://other.com")

      assert.strictEqual(response.status, 200)
      assert.deepStrictEqual(await response.json(), {
        foo: "bar",
      })
      assert.strictEqual(
        response.headers.get("access-control-allow-origin"),
        null,
      )
      assert.strictEqual(
        response.headers.get("access-control-allow-credentials"),
        null,
      )
      assert.strictEqual(
        response.headers.get("access-control-expose-headers"),
        null,
      )
    })
  })
})
