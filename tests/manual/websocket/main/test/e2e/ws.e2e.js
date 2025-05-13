"use strict"

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

const { env } = require("node:process")
const aws4 = require("aws4")
const awscred = require("awscred")
const chai = require("chai")
const chaiHttp = require("chai-http")
const moment = require("moment")

const { expect } = chai
const { now } = Date
const { parse, stringify } = JSON
const { keys } = Object

chai.use(chaiHttp)

const endpoint = env.npm_config_endpoint ?? "ws://localhost:3001"
const timeout = env.npm_config_timeout ? +env.npm_config_timeout : 1000
const WebSocketTester = require("../support/WebSocketTester.js")

describe("serverless", () => {
  describe("with WebSocket support", () => {
    let clients = []
    let req = null
    let cred = null
    const createWebSocket = async (qs) => {
      const ws = new WebSocketTester()
      let url = endpoint

      if (qs) url = `${endpoint}?${qs}`

      await ws.open(url)

      clients.push(ws)

      return ws
    }
    const createClient = async (qs) => {
      const ws = await createWebSocket(qs)

      ws.send(stringify({ action: "getClientInfo" }))

      const json = await ws.receive1()
      const { id } = parse(json).info

      return {
        id,
        ws,
      }
    }
    before(async () => {
      req = chai
        .request(
          `${endpoint
            .replace("ws://", "http://")
            .replace("wss://", "https://")}`,
        )
        .keepOpen()

      cred = await new Promise((resolve, reject) => {
        awscred.loadCredentials((err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      })
    })

    beforeEach(() => {
      clients = []
    })
    afterEach(async () => {
      await Promise.all(
        clients.map(async (ws, i) => {
          const n = ws.countUnrecived()

          if (n > 0) {
            console.log(`unreceived:[i=${i}]`)
            ;(await ws.receive(n)).forEach((m) => console.log(m))
          }

          expect(n).to.equal(0)
          ws.close()
        }),
      )
      clients = []
    })

    it("should request to upgade to WebSocket when receving an HTTP request", async () => {
      const request = chai
        .request(
          `${endpoint
            .replace("ws://", "http://")
            .replace("wss://", "https://")}`,
        )
        .keepOpen()
      let res = await request.get(`/${now()}`) // .set('Authorization', user.accessToken);

      expect(res).to.have.status(426)

      res = await request.get(`/${now()}/${now()}`) // .set('Authorization', user.accessToken);

      expect(res).to.have.status(426)
    }).timeout(timeout)

    it("should open a WebSocket", async () => {
      const ws = await createWebSocket()
      expect(ws).not.to.be.undefined
    }).timeout(timeout)

    it("should receive client connection info", async () => {
      const ws = await createWebSocket()
      ws.send(stringify({ action: "getClientInfo" }))
      const clientInfo = parse(await ws.receive1())

      expect(clientInfo).to.deep.equal({
        action: "update",
        event: "client-info",
        info: { id: clientInfo.info.id },
      })
    }).timeout(timeout)

    it("should call default handler when no such action exists", async () => {
      const ws = await createWebSocket()
      const payload = stringify({ action: `action${now()}` })
      ws.send(payload)

      expect(await ws.receive1()).to.equal(
        `Error: No Supported Action in Payload '${payload}'`,
      )
    }).timeout(timeout)

    it("should call default handler when no action provided", async () => {
      const ws = await createWebSocket()
      ws.send(stringify({ hello: "world" }))

      expect(await ws.receive1()).to.equal(
        'Error: No Supported Action in Payload \'{"hello":"world"}\'',
      )
    }).timeout(timeout)

    it("should send & receive data", async () => {
      const c1 = await createClient()
      const c2 = await createClient()
      c1.ws.send(
        stringify({
          action: "send",
          clients: [c1.id, c2.id],
          data: "Hello World!",
        }),
      )

      expect(await c1.ws.receive1()).to.equal("Hello World!")
      expect(await c2.ws.receive1()).to.equal("Hello World!")
    }).timeout(timeout)

    it("should respond when having an internal server error", async () => {
      const conn = await createClient()
      conn.ws.send(stringify({ action: "makeError" }))
      const res = parse(await conn.ws.receive1())

      expect(res).to.deep.equal({
        connectionId: conn.id,
        message: "Internal server error",
        requestId: res.requestId,
      })
    }).timeout(timeout)

    it("should respond via callback", async () => {
      const ws = await createWebSocket()
      ws.send(stringify({ action: "replyViaCallback" }))
      const res = parse(await ws.receive1())
      expect(res).to.deep.equal({
        action: "update",
        event: "reply-via-callback",
      })
    }).timeout(timeout)

    it("should respond with error when calling callback(error)", async () => {
      const conn = await createClient()
      conn.ws.send(stringify({ action: "replyErrorViaCallback" }))
      const res = parse(await conn.ws.receive1())
      expect(res).to.deep.equal({
        connectionId: conn.id,
        message: "Internal server error",
        requestId: res.requestId,
      })
    }).timeout(timeout)

    it("should respond with only the last action when there are more than one in the serverless.yml file", async () => {
      const ws = await createWebSocket()
      ws.send(stringify({ action: "makeMultiCalls" }))
      const res = parse(await ws.receive1())

      expect(res).to.deep.equal({ action: "update", event: "made-call-2" })
    }).timeout(timeout)

    it("should not send to non existing client", async () => {
      const c1 = await createClient()
      c1.ws.send(
        stringify({
          action: "send",
          clients: ["non-existing-id"],
          data: "Hello World!",
        }),
      )

      expect(await c1.ws.receive1()).to.equal(
        "Error: Could not Send all Messages",
      )
    }).timeout(timeout)

    it("should connect & disconnect", async () => {
      const ws = await createWebSocket()
      ws.send(stringify({ action: "registerListener" }))
      await ws.receive1()

      const c1 = await createClient()
      const connect1 = parse(await ws.receive1())
      delete connect1.info.event
      delete delete connect1.info.context
      expect(connect1).to.deep.equal({
        action: "update",
        event: "connect",
        info: {
          id: c1.id,
        },
      })

      const c2 = await createClient()
      const connect2 = parse(await ws.receive1())
      delete connect2.info.event
      delete delete connect2.info.context
      expect(connect2).to.deep.equal({
        action: "update",
        event: "connect",
        info: {
          id: c2.id,
        },
      })

      c2.ws.close()
      const disconnect2 = parse(await ws.receive1())
      delete disconnect2.info.event
      delete delete disconnect2.info.context
      expect(disconnect2).to.deep.equal({
        action: "update",
        event: "disconnect",
        info: {
          id: c2.id,
        },
      })

      const c3 = await createClient()
      const connect3 = parse(await ws.receive1())
      delete connect3.info.event
      delete delete connect3.info.context
      expect(connect3).to.deep.equal({
        action: "update",
        event: "connect",
        info: {
          id: c3.id,
        },
      })

      c1.ws.close()
      const disconnect1 = parse(await ws.receive1())
      delete disconnect1.info.event
      delete delete disconnect1.info.context
      expect(disconnect1).to.deep.equal({
        action: "update",
        event: "disconnect",
        info: {
          id: c1.id,
        },
      })

      c3.ws.close()
      const disconnect3 = parse(await ws.receive1())
      delete disconnect3.info.event
      delete delete disconnect3.info.context
      expect(disconnect3).to.deep.equal({
        action: "update",
        event: "disconnect",
        info: {
          id: c3.id,
        },
      })
    }).timeout(timeout)

    const createExpectedEvent = (
      connectionId,
      action,
      eventType,
      actualEvent,
    ) => {
      const url = new URL(endpoint)
      const expected = {
        isBase64Encoded: false,
        requestContext: {
          apiId: actualEvent.requestContext.apiId,
          connectedAt: actualEvent.requestContext.connectedAt,
          connectionId: `${connectionId}`,
          domainName: url.hostname,
          eventType,
          extendedRequestId: actualEvent.requestContext.extendedRequestId,
          identity: {
            accessKey: null,
            accountId: null,
            caller: null,
            cognitoAuthenticationProvider: null,
            cognitoAuthenticationType: null,
            cognitoIdentityId: null,
            cognitoIdentityPoolId: null,
            principalOrgId: null,
            sourceIp: actualEvent.requestContext.identity.sourceIp,
            user: null,
            userAgent: null,
            userArn: null,
          },
          messageDirection: "IN",
          messageId: actualEvent.requestContext.messageId,
          requestId: actualEvent.requestContext.requestId,
          requestTime: actualEvent.requestContext.requestTime,
          requestTimeEpoch: actualEvent.requestContext.requestTimeEpoch,
          routeKey: action,
          stage: actualEvent.requestContext.stage,
        },
      }

      return expected
    }

    const createExpectedContext = (actualContext) => {
      const expected = {
        awsRequestId: actualContext.awsRequestId,
        callbackWaitsForEmptyEventLoop: true,
        functionName: actualContext.functionName,
        functionVersion: "$LATEST",
        invokedFunctionArn: actualContext.invokedFunctionArn,
        invokeid: actualContext.invokeid,
        logGroupName: actualContext.logGroupName,
        logStreamName: actualContext.logStreamName,
        memoryLimitInMB: actualContext.memoryLimitInMB,
      }

      return expected
    }

    const createExpectedConnectHeaders = (actualHeaders) => {
      const url = new URL(endpoint)
      const expected = {
        Host: url.hostname,
        "Sec-WebSocket-Extensions": actualHeaders["Sec-WebSocket-Extensions"],
        "Sec-WebSocket-Key": actualHeaders["Sec-WebSocket-Key"],
        "Sec-WebSocket-Version": actualHeaders["Sec-WebSocket-Version"],
        "X-Amzn-Trace-Id": actualHeaders["X-Amzn-Trace-Id"],
        "X-Forwarded-For": actualHeaders["X-Forwarded-For"],
        "X-Forwarded-Port": `${url.port || 443}`,
        "X-Forwarded-Proto": `${url.protocol
          .replace("ws", "http")
          .replace("wss", "https")
          .replace(":", "")}`,
      }

      return expected
    }

    const createExpectedDisconnectHeaders = () => {
      const url = new URL(endpoint)
      const expected = {
        Host: url.hostname,
        "x-api-key": "",
        "x-restapi": "",
      }

      return expected
    }

    const createExpectedConnectMultiValueHeaders = (actualHeaders) => {
      const expected = createExpectedConnectHeaders(actualHeaders)
      keys(expected).forEach((key) => {
        expected[key] = [expected[key]]
      })

      return expected
    }

    const createExpectedDisconnectMultiValueHeaders = (actualHeaders) => {
      const expected = createExpectedDisconnectHeaders(actualHeaders)
      keys(expected).forEach((key) => {
        expected[key] = [expected[key]]
      })

      return expected
    }

    it("should receive correct call info (event only)", async () => {
      const ws = await createWebSocket()
      ws.send(stringify({ action: "registerListener" }))
      await ws.receive1()

      // connect
      const c = await createClient()
      const connect = parse(await ws.receive1())
      let timestamp = now()
      let expectedCallInfo = {
        context: createExpectedContext(connect.info.context),
        event: {
          headers: createExpectedConnectHeaders(connect.info.event.headers),
          multiValueHeaders: createExpectedConnectMultiValueHeaders(
            connect.info.event.headers,
          ),
          ...createExpectedEvent(
            c.id,
            "$connect",
            "CONNECT",
            connect.info.event,
          ),
        },
        id: c.id,
      }
      delete connect.info.context
      delete expectedCallInfo.context // Not checking context. Relying on it to be correct because serverless-offline uses general lambda context method

      expect(connect).to.deep.equal({
        action: "update",
        event: "connect",
        info: expectedCallInfo,
      })
      expect(connect.info.event.requestContext.requestTimeEpoch).to.be.within(
        connect.info.event.requestContext.connectedAt - 10,
        connect.info.event.requestContext.requestTimeEpoch + 10,
      )
      expect(connect.info.event.requestContext.connectedAt).to.be.within(
        timestamp - timeout,
        timestamp,
      )
      expect(connect.info.event.requestContext.requestTimeEpoch).to.be.within(
        timestamp - timeout,
        timestamp,
      )
      expect(
        moment
          .utc(
            connect.info.event.requestContext.requestTime,
            "D/MMM/YYYY:H:m:s Z",
          )
          .toDate()
          .getTime(),
      ).to.be.within(timestamp - timeout, timestamp)

      if (endpoint.startsWith("ws://locahost")) {
        expect(connect.info.event.headers["X-Forwarded-For"]).to.be.equal(
          "127.0.0.1",
        )
      }

      // getCallInfo
      c.ws.send(stringify({ action: "getCallInfo" }))
      const callInfo = parse(await c.ws.receive1())
      timestamp = now()
      expectedCallInfo = {
        context: createExpectedContext(callInfo.info.context),
        event: {
          body: '{"action":"getCallInfo"}',
          ...createExpectedEvent(
            c.id,
            "getCallInfo",
            "MESSAGE",
            callInfo.info.event,
          ),
        },
      }
      delete callInfo.info.context
      delete expectedCallInfo.context // Not checking context. Relying on it to be correct because serverless-offline uses general lambda context method

      expect(callInfo).to.deep.equal({
        action: "update",
        event: "call-info",
        info: expectedCallInfo,
      })
      expect(callInfo.info.event.requestContext.connectedAt).to.be.lt(
        callInfo.info.event.requestContext.requestTimeEpoch,
      )
      expect(callInfo.info.event.requestContext.connectedAt).to.be.within(
        timestamp - timeout,
        timestamp,
      )
      expect(callInfo.info.event.requestContext.requestTimeEpoch).to.be.within(
        timestamp - timeout,
        timestamp,
      )
      expect(
        moment
          .utc(
            callInfo.info.event.requestContext.requestTime,
            "D/MMM/YYYY:H:m:s Z",
          )
          .toDate()
          .getTime(),
      ).to.be.within(timestamp - timeout, timestamp)

      // disconnect
      c.ws.close()
      const disconnect = parse(await ws.receive1())
      timestamp = now()
      expectedCallInfo = {
        context: createExpectedContext(disconnect.info.context),
        event: {
          headers: createExpectedDisconnectHeaders(
            disconnect.info.event.headers,
          ),
          multiValueHeaders: createExpectedDisconnectMultiValueHeaders(
            disconnect.info.event.headers,
          ),
          ...createExpectedEvent(
            c.id,
            "$disconnect",
            "DISCONNECT",
            disconnect.info.event,
          ),
        },
        id: c.id,
      }
      delete disconnect.info.context
      delete expectedCallInfo.context // Not checking context. Relying on it to be correct because serverless-offline uses general lambda context method
      expect(disconnect).to.deep.equal({
        action: "update",
        event: "disconnect",
        info: expectedCallInfo,
      })
    }).timeout(timeout)

    it("should be able to parse query string", async () => {
      const timestamp = `${now()}`
      const ws = await createWebSocket()
      ws.send(stringify({ action: "registerListener" }))
      await ws.receive1()

      await createClient()
      await createClient(`now=${timestamp}&before=123456789`)

      expect(parse(await ws.receive1()).info.event.queryStringParameters).to.be
        .undefined
      expect(
        parse(await ws.receive1()).info.event.queryStringParameters,
      ).to.deep.equal({
        before: "123456789",
        timestamp,
      })
    }).timeout(timeout)

    it("should be able to receive messages via REST API", async () => {
      await createClient()
      const c2 = await createClient()
      const url = new URL(endpoint)
      const signature = {
        body: "Hello World!",
        headers: { "Content-Type": "text/plain" /* 'application/text' */ },
        host: url.host,
        method: "POST",
        path: `${url.pathname}/@connections/${c2.id}`,
        service: "execute-api",
      }
      aws4.sign(signature, {
        accessKeyId: cred.accessKeyId,
        secretAccessKey: cred.secretAccessKey,
      })
      const res = await req
        .post(signature.path.replace(url.pathname, ""))
        .set("X-Amz-Date", signature.headers["X-Amz-Date"])
        .set("Authorization", signature.headers.Authorization)
        .set("Content-Type", signature.headers["Content-Type"])
        .send("Hello World!")

      expect(res).to.have.status(200)
      expect(await c2.ws.receive1()).to.equal("Hello World!")
    }).timeout(timeout)

    it("should receive error code when sending to a recently closed client via REST API", async () => {
      const c = await createClient()
      const cId = c.id
      c.ws.close()
      const url = new URL(endpoint)
      const signature = {
        body: "Hello World!",
        headers: {
          "Content-Type": "text/plain" /* 'application/text' */,
        },
        host: url.host,
        method: "POST",
        path: `${url.pathname}/@connections/${cId}`,
        service: "execute-api",
      }
      aws4.sign(signature, {
        accessKeyId: cred.accessKeyId,
        secretAccessKey: cred.secretAccessKey,
      })
      const res = await req
        .post(signature.path.replace(url.pathname, ""))
        .set("X-Amz-Date", signature.headers["X-Amz-Date"])
        .set("Authorization", signature.headers.Authorization)
        .set("Content-Type", signature.headers["Content-Type"])
        .send("Hello World!")

      expect(res).to.have.status(410)
    }).timeout(timeout)

    it("should be able to close connections via REST API", async () => {
      await createClient()
      const c2 = await createClient()
      const url = new URL(endpoint)
      const signature = {
        host: url.host,
        method: "DELETE",
        path: `${url.pathname}/@connections/${c2.id}`,
        service: "execute-api",
      }
      aws4.sign(signature, {
        accessKeyId: cred.accessKeyId,
        secretAccessKey: cred.secretAccessKey,
      })
      const res = await req
        .del(signature.path.replace(url.pathname, ""))
        .set("X-Amz-Date", signature.headers["X-Amz-Date"])
        .set("Authorization", signature.headers.Authorization)

      expect(res).to.have.status(200)
    }).timeout(timeout)

    it("should receive error code when deleting a previously closed client via REST API", async () => {
      const c = await createClient()
      const cId = c.id
      c.ws.close()
      const url = new URL(endpoint)
      const signature = {
        host: url.host,
        method: "DELETE",
        path: `${url.pathname}/@connections/${cId}`,
        service: "execute-api",
      }
      aws4.sign(signature, {
        accessKeyId: cred.accessKeyId,
        secretAccessKey: cred.secretAccessKey,
      })
      const res = await req
        .del(signature.path.replace(url.pathname, ""))
        .set("X-Amz-Date", signature.headers["X-Amz-Date"])
        .set("Authorization", signature.headers.Authorization)

      expect(res).to.have.status(410)
    }).timeout(timeout)
  })
})
