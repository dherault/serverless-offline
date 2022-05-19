import { resolve } from 'node:path'
import WebSocket from 'ws'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'
import websocketSend from '../_testHelpers/websocketPromise.js'

const { parse, stringify } = JSON

jest.setTimeout(30000)

describe('one way websocket tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  test('websocket echos nothing', async () => {
    const url = new URL(joinUrl(TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'

    const payload = stringify({
      hello: 'world',
      now: new Date().toISOString(),
    })

    const ws = new WebSocket(url.toString())
    const { data, code, err } = await websocketSend(ws, payload)

    expect(code).toBeUndefined()
    expect(err).toBeUndefined()
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

    const ws = new WebSocket(url.toString())
    const { data, code, err } = await websocketSend(ws, payload)

    expect(code).toBeUndefined()
    expect(err).toBeUndefined()
    expect(parse(data).message).toEqual('Internal server error')
  })
})
