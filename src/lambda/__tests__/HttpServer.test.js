import assert from "node:assert"
import HttpServer from "../HttpServer.js"

const functionName = "foo"

// the cors options built by ServerlessOffline from the default CLI options
const defaultCorsConfig = {
  credentials: false,
  exposedHeaders: ["WWW-Authenticate", "Server-Authorization"],
  headers: ["accept", "content-type", "x-api-key", "authorization"],
  origin: ["*"],
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

  async function startServer(provider, runHandler) {
    httpServer = new HttpServer(
      {
        service: {
          provider,
        },
      },
      {
        corsConfig: defaultCorsConfig,
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

  describe("when provider.httpApi.cors is not set", () => {
    it("should answer a CORS preflight request from the aws-sdk", async () => {
      const url = await startServer({}, async () => ({}))
      const requestHeaders =
        "amz-sdk-invocation-id,amz-sdk-request,content-type,x-amz-user-agent"

      const response = await fetch(
        `${url}/2015-03-31/functions/${functionName}/invocations`,
        {
          headers: {
            "access-control-request-headers": requestHeaders,
            "access-control-request-method": "POST",
            origin: "https://example.com",
          },
          method: "OPTIONS",
        },
      )

      assert.strictEqual(response.status, 200)
      assert.strictEqual(
        response.headers.get("access-control-allow-origin"),
        "https://example.com",
      )
      assert.strictEqual(
        response.headers.get("access-control-allow-headers"),
        requestHeaders,
      )
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
