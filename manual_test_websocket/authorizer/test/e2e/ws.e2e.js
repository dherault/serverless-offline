/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-expressions */
const chai = require('chai');

const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const endpoint = process.env.npm_config_endpoint || 'ws://localhost:3003';
const timeout = process.env.npm_config_timeout ? parseInt(process.env.npm_config_timeout) : 1000;
const WebSocketTester = require('../../../test/support/WebSocketTester');

describe('serverless', () => {
  describe('with WebSocket support', () => {
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
      const ws = await createWebSocket({ headers:{ Auth:`${now}` } }); // ${now}`}});
      expect(ws).not.to.be.undefined;
      ws.send(JSON.stringify({ action:'echo', message:`${now}` }));
      expect(await ws.receive1()).to.equal(`${now}`);
    }).timeout(timeout);

    it('should not open a WebSocket with no auth', async () => {
      const ws = await createWebSocket();
      expect(ws).to.be.undefined;
    }).timeout(timeout);
    
    it('should not open a WebSocket with bad auth', async () => {
      const ws = await createWebSocket({ headers:{ Auth:`${notNow}` } });
      expect(ws).to.be.undefined;
    }).timeout(timeout);

    it('should not open a WebSocket with auth function throwing exception', async () => {
      const ws = await createWebSocket({ headers:{ Auth:'This is not a number so auth function with throw exception on offline.' } });
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
        .set('Auth', `${notNow}`);
      expect(res).to.have.status(403);
    }).timeout(timeout);
    
//     const createExpectedEvent = (connectionId, action, eventType, actualEvent) => {
//       const url = new URL(endpoint);
//       const expected = {
//         apiGatewayUrl: `${actualEvent.apiGatewayUrl}`,
//         isBase64Encoded: false,
//         requestContext: {
//           apiId: actualEvent.requestContext.apiId,
//           connectedAt: actualEvent.requestContext.connectedAt,
//           connectionId: `${connectionId}`,
//           domainName: url.hostname,
//           eventType,
//           extendedRequestId: actualEvent.requestContext.extendedRequestId,
//           identity: {
//             accessKey: null,
//             accountId: null,
//             caller: null,
//             cognitoAuthenticationProvider: null,
//             cognitoAuthenticationType: null,
//             cognitoIdentityId: null,
//             cognitoIdentityPoolId: null,
//             principalOrgId: null,
//             sourceIp: actualEvent.requestContext.identity.sourceIp,
//             user: null,
//             userAgent: null,
//             userArn: null,
//           },
//           messageDirection: 'IN',
//           messageId: actualEvent.requestContext.messageId,
//           requestId: actualEvent.requestContext.requestId,
//           requestTime: actualEvent.requestContext.requestTime,
//           requestTimeEpoch: actualEvent.requestContext.requestTimeEpoch,
//           routeKey: action,
//           stage: actualEvent.requestContext.stage,
//         },
//       };

//       return expected;
//     };

//     const createExpectedContext = actualContext => {
//       const expected = {
//         awsRequestId: actualContext.awsRequestId,
//         callbackWaitsForEmptyEventLoop: true,
//         functionName: actualContext.functionName,
//         functionVersion: '$LATEST',
//         invokedFunctionArn: actualContext.invokedFunctionArn,
//         invokeid: actualContext.invokeid,
//         logGroupName: actualContext.logGroupName,
//         logStreamName: actualContext.logStreamName,
//         memoryLimitInMB: actualContext.memoryLimitInMB,
//       };

//       return expected;
//     };

//     const createExpectedConnectHeaders = actualHeaders => {
//       const url = new URL(endpoint); 
//       const expected = {
//         Host: url.hostname,
//         'Sec-WebSocket-Extensions': actualHeaders['Sec-WebSocket-Extensions'],
//         'Sec-WebSocket-Key': actualHeaders['Sec-WebSocket-Key'],
//         'Sec-WebSocket-Version': actualHeaders['Sec-WebSocket-Version'],
//         'X-Amzn-Trace-Id': actualHeaders['X-Amzn-Trace-Id'],
//         'X-Forwarded-For': actualHeaders['X-Forwarded-For'],
//         'X-Forwarded-Port': `${url.port || 443}`,
//         'X-Forwarded-Proto': `${url.protocol.replace('ws', 'http').replace('wss', 'https').replace(':', '')}`,
//       };

//       return expected;
//     };

//     const createExpectedDisconnectHeaders = (/* actualHeaders */) => {
//       const url = new URL(endpoint); 
//       const expected = {
//         Host: url.hostname,
//         'x-api-key': '',
//         'x-restapi': '',
//       };

//       return expected;
//     };

//     const createExpectedConnectMultiValueHeaders = actualHeaders => {
//       const expected = createExpectedConnectHeaders(actualHeaders);
//       Object.keys(expected).map(key => expected[key] = [expected[key]]);

//       return expected;
//     };

//     const createExpectedDisconnectMultiValueHeaders = actualHeaders => {
//       const expected = createExpectedDisconnectHeaders(actualHeaders);
//       Object.keys(expected).map(key => expected[key] = [expected[key]]);

//       return expected;
//     };

//     it('should receive correct call info', async () => {
//       return;
//       const ws = await createWebSocket();
//       await ws.send(JSON.stringify({ action:'registerListener' }));
//       await ws.receive1();

//       // connect
//       const c = await createClient();
//       const connect = JSON.parse(await ws.receive1());
//       let now = Date.now(); 
//       let expectedCallInfo = { id:c.id, event:{ headers:createExpectedConnectHeaders(connect.info.event.headers), multiValueHeaders:createExpectedConnectMultiValueHeaders(connect.info.event.headers), ...createExpectedEvent(c.id, '$connect', 'CONNECT', connect.info.event) }, context:createExpectedContext(connect.info.context) };
//       expect(connect).to.deep.equal({ action:'update', event:'connect', info:expectedCallInfo });
//       expect(connect.info.event.requestContext.requestTimeEpoch).to.be.within(connect.info.event.requestContext.connectedAt - 10, connect.info.event.requestContext.requestTimeEpoch + 10);
//       expect(connect.info.event.requestContext.connectedAt).to.be.within(now - timeout, now);
//       expect(connect.info.event.requestContext.requestTimeEpoch).to.be.within(now - timeout, now);
//       expect(moment.utc(connect.info.event.requestContext.requestTime, 'D/MMM/YYYY:H:m:s Z').toDate().getTime()).to.be.within(now - timeout, now);
//       if (endpoint.startsWith('ws://locahost')) {
//         expect(connect.info.event.apiGatewayUrl).to.equal(endpoint.replace('ws://', 'http://').replace('wss://', 'https://'));
//         expect(connect.info.event.headers['X-Forwarded-For']).to.be.equal('127.0.0.1');
//       }

//       // getCallInfo
//       c.ws.send(JSON.stringify({ action:'getCallInfo' }));
//       const callInfo = JSON.parse(await c.ws.receive1());
//       now = Date.now(); 
//       expectedCallInfo = { event:{ body: '{\"action\":\"getCallInfo\"}', ...createExpectedEvent(c.id, 'getCallInfo', 'MESSAGE', callInfo.info.event) }, context:createExpectedContext(callInfo.info.context) };
//       expect(callInfo).to.deep.equal({ action:'update', event:'call-info', info:expectedCallInfo });
//       expect(callInfo.info.event.requestContext.connectedAt).to.be.lt(callInfo.info.event.requestContext.requestTimeEpoch);
//       expect(callInfo.info.event.requestContext.connectedAt).to.be.within(now - timeout, now);
//       expect(callInfo.info.event.requestContext.requestTimeEpoch).to.be.within(now - timeout, now);
//       expect(moment.utc(callInfo.info.event.requestContext.requestTime, 'D/MMM/YYYY:H:m:s Z').toDate().getTime()).to.be.within(now - timeout, now);
//       if (endpoint.startsWith('ws://locahost')) expect(callInfo.info.event.apiGatewayUrl).to.equal(endpoint.replace('ws://', 'http://').replace('wss://', 'https://'));

//       // disconnect
//       c.ws.close();
//       const disconnect = JSON.parse(await ws.receive1());
//       now = Date.now(); 
//       expectedCallInfo = { id:c.id, event:{ headers:createExpectedDisconnectHeaders(disconnect.info.event.headers), multiValueHeaders:createExpectedDisconnectMultiValueHeaders(disconnect.info.event.headers), ...createExpectedEvent(c.id, '$disconnect', 'DISCONNECT', disconnect.info.event) }, context:createExpectedContext(disconnect.info.context) };
//       expect(disconnect).to.deep.equal({ action:'update', event:'disconnect', info:expectedCallInfo });
//     }).timeout(timeout);
  });
});
