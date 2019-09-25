/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-expressions */
import { resolve } from 'path'
import fetch from 'node-fetch'
import { setup, teardown } from '../../_testHelpers/index.js'

const moment = require('moment')

const endpoint = process.env.npm_config_endpoint || 'ws://localhost:3003'
const loadOfflineServer = !process.env.npm_config_endpoint
const timeout = 30000 // process.env.npm_config_timeout ? parseInt(process.env.npm_config_timeout) : 1000
const WebSocketTester = require('../../_testHelpers/WebSocketTester')

jest.setTimeout(30000)

describe('WebSocket authorizer tests', () => {
  let clients = []

  const createWebSocket = async (options) => {
    const ws = new WebSocketTester()
    let url = endpoint
    let wsOptions = null
    if (options && options.url) url = options.url // eslint-disable-line prefer-destructuring
    if (options && options.qs) url = `${url}?${options.qs}`
    if (options && options.headers) wsOptions = { headers: options.headers }
    console.log('wsOptions:')
    console.log(wsOptions)
    const hasOpened = await ws.open(url, wsOptions)
    if (!hasOpened) {
      try {
        ws.close()
      } catch (err) {} // eslint-disable-line brace-style, no-empty

      return undefined
    }
    clients.push(ws)

    return ws
  }

  // init
  beforeAll(async () => {
    if (!loadOfflineServer) return null
    return setup({
      servicePath: resolve(__dirname),
    })
  })

  // cleanup
  afterAll(async () => {
    if (!loadOfflineServer) return null
    return teardown()
  })

  beforeEach(() => {
    clients = []
  })

  afterEach(async () => {
    // const unreceived0 = clients.map(c=>0)
    const unreceived = clients.map(() => 0)
    await Promise.all(
      clients.map(async (ws, i) => {
        const n = ws.countUnrecived()
        unreceived[i] = n

        if (n > 0) {
          console.log(`unreceived:[i=${i}]`)
          ;(await ws.receive(n)).forEach((m) => console.log(m))
        }

        ws.close()
      }),
    )
    // expect(unreceived).to.be.deep.equal(unreceived0)
    clients = []
  })

  const now = Date.now()
  const notNow = now - 1000 * 60 * 10

  test.skip('should not open a WebSocket with no auth', async () => {
    const ws = await createWebSocket()
    expect(ws).toBeUndefined()
  })

  test.skip('should not open a WebSocket with bad auth', async () => {
    const ws = await createWebSocket({ headers: { Auth123: `${notNow}` } })
    expect(ws).toBeUndefined()
  })

  test('should open a WebSocket with good auth', async () => {
    const ws = await createWebSocket({ headers: { Auth123: `${now}` } })
    expect(ws).toBeDefined()
    ws.send(JSON.stringify({ action: 'echo', message: `${now}` }))
    expect(await ws.receive1()).toEqual(`${now}`)
  })

  test.skip('should not open a WebSocket with auth function throwing exception', async () => {
    const ws = await createWebSocket({ headers: { Auth123: 'This is not a number so auth function with throw exception on offline.' } }) // eslint-disable-line
    expect(ws).toBeUndefined()
  })

  const httpUrl = `${endpoint.replace('ws://', 'http://').replace('wss://', 'https://')}` // eslint-disable-line

  test.skip('should get 401 when trying to open WebSocket with no auth', async () => {
    const response = await fetch(httpUrl, {
      headers: {
        'Sec-WebSocket-Version': '13',
        'Sec-WebSocket-Key': 'tqDb9pU/uwEchHWtz91LRA==',
        Connection: 'Upgrade',
        Upgrade: 'websocket',
        'Sec-WebSocket-Extensions':
          'permessage-deflate; client_max_window_bits',
      },
    })
    expect(response.status).toEqual(401)
  })

  test.skip('should get 403 when trying to open WebSocket with incorrect auth', async () => {
    const response = await fetch(httpUrl, {
      headers: {
        'Sec-WebSocket-Version': '13',
        'Sec-WebSocket-Key': 'tqDb9pU/uwEchHWtz91LRA==',
        Connection: 'Upgrade',
        Upgrade: 'websocket',
        'Sec-WebSocket-Extensions':
          'permessage-deflate; client_max_window_bits',
        Auth123: `${notNow}`,
      },
    })
    expect(response.status).toEqual(403)
  })

  const createExpectedEvent = (connectionId, action, eventType, actualEvent) => { // eslint-disable-line
    const url = new URL(endpoint)
    const expected = {
      type: 'REQUEST',
      methodArn: actualEvent.methodArn,
      stageVariables: {},
      queryStringParameters: {},
      multiValueQueryStringParameters: {},
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
        messageDirection: 'IN',
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

  const createExpectedConnectHeaders = (actualHeaders) => {
    const url = new URL(endpoint)
    const expected = {
      Host: url.port ? `${url.hostname}:${url.port}` : url.hostname,
      Auth123: `${now}`,
      Connection: 'upgrade',
      Upgrade: 'websocket',
      'content-length': '0',
      'Sec-WebSocket-Extensions': actualHeaders['Sec-WebSocket-Extensions'],
      'Sec-WebSocket-Key': actualHeaders['Sec-WebSocket-Key'],
      'Sec-WebSocket-Version': actualHeaders['Sec-WebSocket-Version'],
      'X-Amzn-Trace-Id': actualHeaders['X-Amzn-Trace-Id'],
      'X-Forwarded-For': actualHeaders['X-Forwarded-For'],
      'X-Forwarded-Port': `${url.port || 443}`,
      'X-Forwarded-Proto': `${url.protocol.replace('ws', 'http').replace('wss', 'https').replace(':', '')}`, // eslint-disable-line
    }

    return expected
  }

  const createExpectedConnectMultiValueHeaders = (actualHeaders) => {
    const expected = createExpectedConnectHeaders(actualHeaders)
    Object.keys(expected).map(key => { expected[key] = [expected[key]] }) // eslint-disable-line

    return expected
  }

  expect.extend({
    toBeWithinRange(received, floor, ceiling) {
      const pass = received >= floor && received <= ceiling
      if (pass) {
        return {
          message: () =>
            `expected ${received} not to be within range ${floor} - ${ceiling}`,
          pass: true,
        }
      }
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    },
  })

  test.skip('should receive correct call info', async () => {
    const ws = await createWebSocket({ headers: { Auth123: `${now}` } })
    await ws.send(JSON.stringify({ action: 'registerListener' }))
    await ws.receive1()

    // auth
    await createWebSocket({ headers: { Auth123: `${now}` } })
    const auth = JSON.parse(await ws.receive1())
    const timeNow = Date.now()
    const expectedAuthInfo = { id:auth.info.event.requestContext.connectionId, event:{ headers:createExpectedConnectHeaders(auth.info.event.headers), multiValueHeaders:createExpectedConnectMultiValueHeaders(auth.info.event.headers), ...createExpectedEvent(auth.info.event.requestContext.connectionId, '$connect', 'CONNECT', auth.info.event) } } // eslint-disable-line
    expect(auth).toEqual({ action: 'update', event: 'auth', info: expectedAuthInfo }) // eslint-disable-line
    expect(auth.info.event.requestContext.requestTimeEpoch).toBeWithinRange(auth.info.event.requestContext.connectedAt - 10, auth.info.event.requestContext.requestTimeEpoch + 10) // eslint-disable-line
    expect(auth.info.event.requestContext.connectedAt).toBeWithinRange(timeNow - timeout, timeNow) // eslint-disable-line
    expect(auth.info.event.requestContext.requestTimeEpoch).toBeWithinRange(timeNow - timeout, timeNow) // eslint-disable-line
    expect(moment.utc(auth.info.event.requestContext.requestTime, 'D/MMM/YYYY:H:m:s Z').toDate().getTime()).toBeWithinRange(timeNow - timeout, timeNow) // eslint-disable-line
    if (endpoint.startsWith('ws://locahost')) {
      expect(auth.info.event.headers['X-Forwarded-For']).toEqual('127.0.0.1')
    }
  })
})
