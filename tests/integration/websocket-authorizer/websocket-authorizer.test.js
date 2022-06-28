import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { WebSocket } from 'ws'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'
import websocketSend from '../_testHelpers/websocketPromise.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe.skip('websocket authorizer tests', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  it('websocket authorization with valid request', async () => {
    const url = new URL(joinUrl(env.TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'
    url.searchParams.append('credential', 'isValid')

    const ws = new WebSocket(url)
    const { code, data, err } = await websocketSend(ws, '{}')

    assert.equal(code, undefined)
    assert.equal(err, undefined)
    assert.equal(data, '{}')
  })

  it('websocket authorization without valid request', async () => {
    const url = new URL(joinUrl(env.TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'
    url.searchParams.append('credential', 'isNotValid')

    const ws = new WebSocket(url)
    const { code, data, err } = await websocketSend(ws, '{}')

    assert.equal(code, undefined)
    assert.equal(err.message, 'Unexpected server response: 403')
    assert.equal(data, undefined)
  })

  it('websocket authorization without context', async () => {
    const url = new URL(joinUrl(env.TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'
    url.searchParams.append('credential', 'noContext')

    const ws = new WebSocket(url)
    const { code, data, err } = await websocketSend(ws, '{}')

    assert.equal(code, undefined)
    assert.equal(err, undefined)
    assert.equal(data, '{}')
  })

  it('websocket authorization with authorizer crash', async () => {
    const url = new URL(joinUrl(env.TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'
    url.searchParams.append('credential', 'exception')

    const ws = new WebSocket(url)
    const { code, data, err } = await websocketSend(ws, '{}')

    assert.equal(code, undefined)
    assert.equal(err.message, 'Unexpected server response: 500')
    assert.equal(data, undefined)
  })

  it('websocket authorization without credentials', async () => {
    const url = new URL(joinUrl(env.TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'

    const ws = new WebSocket(url)
    const { code, data, err } = await websocketSend(ws, '{}')

    assert.equal(code, undefined)
    assert.equal(err.message, 'Unexpected server response: 401')
    assert.equal(data, undefined)
  })
})
