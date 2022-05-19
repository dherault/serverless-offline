import { resolve } from 'node:path'
import WebSocket from 'ws'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'
import websocketSend from '../_testHelpers/websocketPromise.js'

const { parse, stringify } = JSON

jest.setTimeout(30000)

describe('two way websocket tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  test('websocket echos sent message', async () => {
    const url = new URL(joinUrl(TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'

    const payload = stringify({
      hello: 'world',
      now: new Date().toISOString(),
    })

    const ws = new WebSocket(String(url))
    const { code, data, err } = await websocketSend(ws, payload)

    expect(code).toBeUndefined()
    expect(err).toBeUndefined()
    expect(data).toEqual(payload)
  })

  test.each([401, 500, 501, 502])(
    'websocket connection emits status code %s',
    async (statusCode) => {
      const url = new URL(joinUrl(TEST_BASE_URL, '/dev'))
      url.port = url.port ? '3001' : url.port
      url.searchParams.set('statusCode', statusCode)
      url.protocol = 'ws'

      const payload = stringify({
        hello: 'world',
        now: new Date().toISOString(),
      })

      const ws = new WebSocket(String(url))
      const { code, data, err } = await websocketSend(ws, payload)

      expect(code).toBeUndefined()

      if (statusCode >= 200 && statusCode < 300) {
        expect(err).toBeUndefined()
        expect(data).toEqual(payload)
      } else {
        expect(err.message).toEqual(`Unexpected server response: ${statusCode}`)
        expect(data).toBeUndefined()
      }
    },
  )

  test('websocket emits 502 on connection error', async () => {
    const url = new URL(joinUrl(TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.searchParams.set('throwError', 'true')
    url.protocol = 'ws'

    const payload = stringify({
      hello: 'world',
      now: new Date().toISOString(),
    })

    const ws = new WebSocket(String(url))
    const { code, data, err } = await websocketSend(ws, payload)

    expect(code).toBeUndefined()
    expect(err.message).toEqual('Unexpected server response: 502')
    expect(data).toBeUndefined()
  })

  test('execution error emits Internal Server Error', async () => {
    const url = new URL(joinUrl(TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'

    const payload = stringify({
      hello: 'world',
      now: new Date().toISOString(),
      throwError: true,
    })

    const ws = new WebSocket(String(url))
    const { code, data, err } = await websocketSend(ws, payload)

    expect(code).toBeUndefined()
    expect(err).toBeUndefined()
    expect(parse(data).message).toEqual('Internal server error')
  })
})
