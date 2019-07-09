/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-expressions */
const moment = require('moment');
const chai = require('chai');

const {expect} = chai;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const endpoint = process.env.npm_config_endpoint || 'ws://localhost:3003';
const timeout = process.env.npm_config_timeout ? parseInt(process.env.npm_config_timeout) : 1000;
const WebSocketTester = require('../support/WebSocketTester');

describe('serverless', () => {
  describe('with Authorizer [WebSocket] support', () => {
    let clients = []; let req = null;
    const createWebSocket = async options => {
      const ws = new WebSocketTester();
      let url = endpoint; let wsOptions = null;
      if (options && options.qs) url = `${endpoint}?${options.qs}`;
      if (options && options.headers) wsOptions = { headers:options.headers };
      const hasOpened = await ws.open(url, wsOptions);
      if (!hasOpened) {
        try { ws.close(); } catch (err) {} // eslint-disable-line brace-style, no-empty
        
        return;
      }
      clients.push(ws);

      return ws;
    };
    // eslint-disable-next-line no-undef
    before(async () => {
      req = chai.request(`${endpoint.replace('ws://', 'http://').replace('wss://', 'https://')}`).keepOpen();
      // req=chai.request('http://localhost:3001').keepOpen();
    });

    beforeEach(() => {
      clients = [];
    });

    afterEach(async () => {
      await Promise.all(clients.map(async (ws, i) => {
        const n = ws.countUnrecived();

        if (n > 0) {
          console.log(`unreceived:[i=${i}]`);
          (await ws.receive(n)).forEach(m => console.log(m));
        }
        expect(n).to.equal(0);
        ws.close();
      }));
      clients = [];
    });
    const now = Date.now(); const notNow = now - 1000 * 60 * 10;

    it('should open a WebSocket with good auth', async () => {
      const ws = await createWebSocket({ headers:{ Auth123:`${now}` } }); // ${now}`}});
      expect(ws).not.to.be.undefined;
      ws.send(JSON.stringify({ action:'echo', message:`${now}` }));
      expect(await ws.receive1()).to.equal(`${now}`);
    }).timeout(timeout);

    it('should not open a WebSocket with no auth', async () => {
      const ws = await createWebSocket();
      expect(ws).to.be.undefined;
    }).timeout(timeout);
    
    it('should not open a WebSocket with bad auth', async () => {
      const ws = await createWebSocket({ headers:{ Auth123:`${notNow}` } });
      expect(ws).to.be.undefined;
    }).timeout(timeout);

    it('should not open a WebSocket with auth function throwing exception', async () => {
      const ws = await createWebSocket({ headers:{ Auth123:'This is not a number so auth function with throw exception on offline.' } });
      expect(ws).to.be.undefined;
    }).timeout(timeout);

    it('should get 401 when trying to open WebSocket with no auth', async () => {
      const res = await req.get('')
        .set('Sec-WebSocket-Version', '13').set('Sec-WebSocket-Key', 'tqDb9pU/uwEchHWtz91LRA==').set('Connection', 'Upgrade')
        .set('Upgrade', 'websocket')
        .set('Sec-WebSocket-Extensions', 'permessage-deflate; client_max_window_bits');// .set('Authorization', user.accessToken);
      expect(res).to.have.status(401);
    }).timeout(timeout);

    it('should get 403 when trying to open WebSocket with incorrect auth', async () => {
      const res = await req.get('')
        .set('Sec-WebSocket-Version', '13').set('Sec-WebSocket-Key', 'tqDb9pU/uwEchHWtz91LRA==').set('Connection', 'Upgrade')
        .set('Upgrade', 'websocket')
        .set('Sec-WebSocket-Extensions', 'permessage-deflate; client_max_window_bits')
        .set('Auth123', `${notNow}`);
      expect(res).to.have.status(403);
    }).timeout(timeout);
    
    const createExpectedEvent = (connectionId, action, eventType, actualEvent) => {
      const url = new URL(endpoint);
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
      };

      return expected;
    };

    const createExpectedConnectHeaders = actualHeaders => {
      const url = new URL(endpoint); 
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
        'X-Forwarded-Proto': `${url.protocol.replace('ws', 'http').replace('wss', 'https').replace(':', '')}`,
      };

      return expected;
    };

    const createExpectedConnectMultiValueHeaders = actualHeaders => {
      const expected = createExpectedConnectHeaders(actualHeaders);
      Object.keys(expected).map(key => expected[key] = [expected[key]]);

      return expected;
    };

    it('should receive correct call info', async () => {
      const ws = await createWebSocket({ headers:{ Auth123:`${now}` } });
      await ws.send(JSON.stringify({ action:'registerListener' }));
      await ws.receive1();

      // auth
      await createWebSocket({ headers:{ Auth123:`${now}` } });
      const auth = JSON.parse(await ws.receive1());
      const timeNow = Date.now();
      const expectedAuthInfo = { id:auth.info.event.requestContext.connectionId, event:{ headers:createExpectedConnectHeaders(auth.info.event.headers), multiValueHeaders:createExpectedConnectMultiValueHeaders(auth.info.event.headers), ...createExpectedEvent(auth.info.event.requestContext.connectionId, '$connect', 'CONNECT', auth.info.event) } };
      expect(auth).to.deep.equal({ action:'update', event:'auth', info:expectedAuthInfo });
      expect(auth.info.event.requestContext.requestTimeEpoch).to.be.within(auth.info.event.requestContext.connectedAt - 10, auth.info.event.requestContext.requestTimeEpoch + 10);
      expect(auth.info.event.requestContext.connectedAt).to.be.within(timeNow - timeout, timeNow);
      expect(auth.info.event.requestContext.requestTimeEpoch).to.be.within(timeNow - timeout, timeNow);
      expect(moment.utc(auth.info.event.requestContext.requestTime, 'D/MMM/YYYY:H:m:s Z').toDate().getTime()).to.be.within(timeNow - timeout, timeNow);
      if (endpoint.startsWith('ws://locahost')) {
        expect(auth.info.event.headers['X-Forwarded-For']).to.be.equal('127.0.0.1');
      }
    }).timeout(timeout);
  });
});
