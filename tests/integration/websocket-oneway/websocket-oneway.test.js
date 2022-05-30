import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import WebSocket from 'ws'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'
import websocketSend from '../_testHelpers/websocketPromise.js'

const { parse, stringify } = JSON

const __dirname = dirname(fileURLToPath(import.meta.url))

describe.skip('one way websocket tests', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  it('websocket echos nothing', async () => {
    const url = new URL(joinUrl(env.TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'

    const payload = stringify({
      hello: 'world',
      now: new Date().toISOString(),
    })

    const ws = new WebSocket(url.toString())
    const { data, code, err } = await websocketSend(ws, payload)

    assert.equal(code, undefined)
    assert.equal(err, undefined)
    assert.equal(data, undefined)
  })

  it('execution error emits Internal Server Error', async () => {
    const url = new URL(joinUrl(env.TEST_BASE_URL, '/dev'))
    url.port = url.port ? '3001' : url.port
    url.protocol = 'ws'

    const payload = stringify({
      hello: 'world',
      now: new Date().toISOString(),
      throwError: true,
    })

    const ws = new WebSocket(url.toString())
    const { data, code, err } = await websocketSend(ws, payload)

    assert.equal(code, undefined)
    assert.equal(err, undefined)
    assert.equal(parse(data).message, 'Internal server error')
  })
})
