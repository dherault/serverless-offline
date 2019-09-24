/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-expressions */
import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

const aws4 = require('aws4')
const awscred = require('awscred')
const moment = require('moment')

const endpoint = process.env.npm_config_endpoint || 'ws://localhost:3005'
const loadOfflineServer = !process.env.npm_config_endpoint
const timeout = 30000 // process.env.npm_config_timeout ? parseInt(process.env.npm_config_timeout) : 1000
const WebSocketTester = require('../../_testHelpers/WebSocketTester')

jest.setTimeout(30000)

describe('handler payload tests', () => {

  let clients = []; let req = null; let cred = null;
  const createWebSocket = async options => {
    const ws = new WebSocketTester();
    let url = endpoint; let wsOptions = null;
    if (options && options.url) url = options.url; // eslint-disable-line prefer-destructuring
    if (options && options.qs) url = `${url}?${options.qs}`;
    if (options && options.headers) wsOptions = { headers:options.headers };
    const hasOpened = await ws.open(url, wsOptions);
    if (!hasOpened) {
      try { ws.close(); } catch (err) {} // eslint-disable-line brace-style, no-empty
      
      return;
    }
    clients.push(ws);

    return ws;
  };
  const createClient = async options => {
    const ws = await createWebSocket(options);

    ws.send(JSON.stringify({ action:'getClientInfo' }));

    const json = await ws.receive1();
    const {id} = JSON.parse(json).info;

    return { ws, id };
  };
  // init
  beforeAll(async () => {
    if (!loadOfflineServer) return
    return setup({
      servicePath: resolve(__dirname),
    })
  })

  // cleanup
  afterAll(() => {
    if (!loadOfflineServer) return
    return teardown()
  })

  beforeEach(() => {
    clients = []
  });
  afterEach(async () => {
    const unreceived0 = clients.map(c=>0)
    const unreceived = clients.map(c=>0)
    await Promise.all(clients.map(async (ws, i) => {
      const n = ws.countUnrecived()
      unreceived[i] = n

      if (n > 0) {
        console.log(`unreceived:[i=${i}]`);
        (await ws.receive(n)).forEach(m => console.log(m))
      }

      ws.close()
    }));
    // expect(unreceived).to.be.deep.equal(unreceived0)
    clients = []
  });

  const httpUrl = `${endpoint.replace('ws://', 'http://').replace('wss://', 'https://')}`

  test('should call action \'echo\' handler located at service.do', async () => {
    const ws = await createWebSocket()
    const now = `${Date.now()}`
    const payload = JSON.stringify({ service:{ do:'echo' }, message:now })

    ws.send(payload)

    expect(await ws.receive1()).toEqual(`${now}`)
  })

})
