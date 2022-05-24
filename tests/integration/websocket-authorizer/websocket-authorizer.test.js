import { resolve } from 'node:path'
import WebSocket from 'ws'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'
import websocketSend from '../_testHelpers/websocketPromise.js'

jest.setTimeout(30000)

describe('websocket authorizer tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  test('websocket authorization with valid request', async () => {
    const url = new URL(joinUrl(TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'
    url.searchParams.append('credential', 'isValid')

    const ws = new WebSocket(url.toString())
    const { data, code, err } = await websocketSend(ws, '{}')

    expect(code).toBeUndefined()
    expect(err).toBeUndefined()
    expect(data).toEqual('{}')
  })

  test('websocket authorization without valid request', async () => {
    const url = new URL(joinUrl(TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'
    url.searchParams.append('credential', 'isNotValid')

    const ws = new WebSocket(url.toString())
    const { data, code, err } = await websocketSend(ws, '{}')

    expect(code).toBeUndefined()
    expect(err.message).toEqual('Unexpected server response: 403')
    expect(data).toBeUndefined()
  })

  test('websocket authorization with authorizer crash', async () => {
    const url = new URL(joinUrl(TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'
    url.searchParams.append('credential', 'exception')

    const ws = new WebSocket(url.toString())
    const { data, code, err } = await websocketSend(ws, '{}')

    expect(code).toBeUndefined()
    expect(err.message).toEqual('Unexpected server response: 500')
    expect(data).toBeUndefined()
  })

  test('websocket authorization without credentials', async () => {
    const url = new URL(joinUrl(TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'

    const ws = new WebSocket(url.toString())
    const { data, code, err } = await websocketSend(ws, '{}')

    expect(code).toBeUndefined()
    expect(err.message).toEqual('Unexpected server response: 401')
    expect(data).toBeUndefined()
  })
})
