'use strict'

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */

const process = require('node:process')
const chai = require('chai')
const WebSocketTester = require('../support/WebSocketTester.js')

const { expect } = chai
const endpoint = process.env.npm_config_endpoint || 'ws://localhost:3005'
const timeout = process.env.npm_config_timeout
  ? parseInt(process.env.npm_config_timeout, 10)
  : 1000

const { stringify } = JSON

describe('serverless', () => {
  describe('with WebSocket support', () => {
    let clients = []

    const createWebSocket = async (qs) => {
      const ws = new WebSocketTester()
      let url = endpoint

      if (qs) url = `${endpoint}?${qs}`

      await ws.open(url)

      clients.push(ws)

      return ws
    }

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

    it("should call action 'echo' handler located at service.do", async () => {
      const ws = await createWebSocket()
      const now = `${Date.now()}`
      const payload = stringify({ message: now, service: { do: 'echo' } })

      ws.send(payload)

      expect(await ws.receive1()).to.equal(`${now}`)
    }).timeout(timeout)
  })
})
