import assert from "node:assert"
import AlbEventDefinition from "../AlbEventDefinition.js"
import HttpServer from "../HttpServer.js"

function createLambda(runHandler) {
  return {
    get() {
      return {
        runHandler,
        setEvent() {},
      }
    },
  }
}

describe("ALB HttpServer", () => {
  let httpServer

  afterEach(async () => {
    await httpServer.stop(0)
  })

  async function startServer(runHandler) {
    httpServer = new HttpServer(
      {
        service: {
          provider: {
            stage: "dev",
          },
        },
      },
      {
        // any free port
        albPort: 0,
        host: "localhost",
        noPrependStageInUrl: true,
      },
      createLambda(runHandler),
    )

    await httpServer.createServer()

    httpServer.createRoutes(
      "foo",
      new AlbEventDefinition({
        conditions: {
          path: "/foo",
        },
        listenerArn: "arn:aws:elasticloadbalancing:us-east-1:12345:listener",
        priority: 1,
      }),
    )

    await httpServer.start()

    return `http://localhost:${httpServer.server.address().port}`
  }

  it("should return the response of the handler", async () => {
    const url = await startServer(async () => ({
      body: "foo",
      statusCode: 201,
    }))

    const response = await fetch(`${url}/foo`)

    assert.strictEqual(response.status, 201)
    assert.strictEqual(await response.text(), "foo")
  })

  it("should return 502 when the handler rejects with a falsy value", async () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    const url = await startServer(() => Promise.reject(null))

    const response = await fetch(`${url}/foo`)

    assert.strictEqual(response.status, 502)
  })
})
