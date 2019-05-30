const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const aws4  = require('aws4');
const awscred = require('awscred');
const endpoint = process.env.npm_config_endpoint||'ws://localhost:3001';
const timeout = process.env.npm_config_timeout||1000;

const WebSocketTester=require('../support/WebSocketTester');

describe('serverless', ()=>{
  describe('with WebSocket support', ()=>{
    let clients=[]; let req=null; let cred=null;
    const createWebSocket=async (qs)=>{
      const ws=new WebSocketTester();
      let url=endpoint;
      if (qs) url=`${endpoint}?${qs}`;
      await ws.open(url);
      clients.push(ws);
      return ws;
    };
    const createClient=async (qs)=>{
      const ws=await createWebSocket(qs);
      ws.send(JSON.stringify({action:'getClientInfo'}));
      const json=await ws.receive1();
      const id=JSON.parse(json).info.id;
      return {ws, id};
    };
    before(async ()=>{
      req=chai.request(`${endpoint.replace('ws://', 'http://').replace('wss://', 'https://')}`).keepOpen();
      // req=chai.request('http://localhost:3001/dev').keepOpen();
      cred=await new Promise((resolve, reject)=>{
        awscred.loadCredentials(function(err, data) { if (err) reject(err); else resolve(data); });
       });
    });
    
    beforeEach(()=>{
      clients=[];
    });
    afterEach(async ()=>{
      await Promise.all(clients.map(async (ws, i)=>{
        const n=ws.countUnrecived();

        if (n>0) {
          console.log(`unreceived:[i=${i}]`);
          (await ws.receive(n)).forEach(m=>console.log(m));
        }
        expect(n).to.equal(0);
        ws.close();
      }));
      clients=[];
    });

    it('should request to upgade to WebSocket when receving an HTTP request',  async ()=>{
      const req=chai.request(`${endpoint.replace('ws://', 'http://').replace('wss://', 'https://')}`).keepOpen();
      let res=await req.get(`/${Date.now()}`);//.set('Authorization', user.accessToken);
      expect(res).to.have.status(426);
      res=await req.get(`/${Date.now()}/${Date.now()}`);//.set('Authorization', user.accessToken);
      expect(res).to.have.status(426);
    }).timeout(timeout);

    it('should open a WebSocket', async ()=>{
      const ws=await createWebSocket();
      expect(ws).not.to.be.undefined;
    }).timeout(timeout);

    it('should receive client connection info', async ()=>{
      const ws=await createWebSocket();
      ws.send(JSON.stringify({action:'getClientInfo'}));
      const clientInfo=JSON.parse(await ws.receive1());
      expect(clientInfo).to.deep.equal({action:'update', event:'client-info', info:{id:clientInfo.info.id}});
    }).timeout(timeout);

    it('should call default handler when no such action exists', async ()=>{
      const ws=await createWebSocket();
      const payload=JSON.stringify({action:'action'+Date.now()});
      ws.send(payload);
      expect(await ws.receive1()).to.equal(`Error: No Supported Action in Payload '${payload}'`);
    }).timeout(timeout);

    it('should call default handler when no action provided', async ()=>{
      const ws=await createWebSocket();
      ws.send(JSON.stringify({hello:'world'}));
      expect(await ws.receive1()).to.equal(`Error: No Supported Action in Payload '{"hello":"world"}'`);
    }).timeout(timeout);

    it('should send & receive data', async ()=>{
      const c1=await createClient();
      const c2=await createClient();
      const c3=await createClient();
      c1.ws.send(JSON.stringify({action:'send', data:'Hello World!', clients:[c1.id, c3.id]}));
      expect(await c1.ws.receive1()).to.equal('Hello World!');
      expect(await c3.ws.receive1()).to.equal('Hello World!');
    }).timeout(timeout);

    it('should response when having an internal server error', async ()=>{
      const conn=await createClient();
      conn.ws.send(JSON.stringify({action:'makeError'}));
      const res=JSON.parse(await conn.ws.receive1());
      expect(res).to.deep.equal({message:'Internal server error', connectionId:conn.id, requestId:res.requestId});
    }).timeout(timeout);

    it('should response with only the last action when there are more than one in the serverless.yml file', async ()=>{
      const ws=await createWebSocket();
      ws.send(JSON.stringify({action:'makeMultiCalls'}));
      const res=JSON.parse(await ws.receive1());
      expect(res).to.deep.equal({action:'update', event:'made-call-2'});
    }).timeout(timeout);

    it('should not send to non existing client', async ()=>{
      const c1=await createClient();
      c1.ws.send(JSON.stringify({action:'send', data:'Hello World!', clients:["non-existing-id"]}));
      expect(await c1.ws.receive1()).to.equal('Error: Could not Send all Messages');
    }).timeout(timeout);

    it('should connect & disconnect', async ()=>{
      const ws=await createWebSocket();
      await ws.send(JSON.stringify({action:'registerListener'}));
      await ws.receive1();

      const c1=await createClient();
      expect(JSON.parse(await ws.receive1())).to.deep.equal({action:'update', event:'connect', info:{id:c1.id}});

      const c2=await createClient();
      expect(JSON.parse(await ws.receive1())).to.deep.equal({action:'update', event:'connect', info:{id:c2.id}});

      c2.ws.close();
      expect(JSON.parse(await ws.receive1())).to.deep.equal({action:'update', event:'disconnect', info:{id:c2.id}});

      const c3=await createClient();
      expect(JSON.parse(await ws.receive1())).to.deep.equal({action:'update', event:'connect', info:{id:c3.id}});

      c1.ws.close();
      expect(JSON.parse(await ws.receive1())).to.deep.equal({action:'update', event:'disconnect', info:{id:c1.id}});

      c3.ws.close();
      expect(JSON.parse(await ws.receive1())).to.deep.equal({action:'update', event:'disconnect', info:{id:c3.id}});
    }).timeout(timeout);

    it('should be able to parse query string', async ()=>{
      const now=''+Date.now();
      const ws=await createWebSocket();
      await ws.send(JSON.stringify({action:'registerListener'}));
      await ws.receive1();

      const c1=await createClient();
      const c2=await createClient(`now=${now}&before=123456789`);
      expect(JSON.parse(await ws.receive1())).to.deep.equal({action:'update', event:'connect', info:{id:c1.id}});
      expect(JSON.parse(await ws.receive1())).to.deep.equal({action:'update', event:'connect', info:{id:c2.id, queryStringParameters:{now, before:'123456789'}}});
    }).timeout(timeout);

    it('should be able to receive messages via REST API', async ()=>{
      const c1=await createClient();
      const c2=await createClient();
      const url=new URL(endpoint);
      const signature = {service: 'execute-api', host:url.host, path:`${url.pathname}/@connections/${c2.id}`, method: 'POST', body:'Hello World!', headers:{'Content-Type':'text/plain'/*'application/text'*/}};
      aws4.sign(signature, {accessKeyId: cred.accessKeyId, secretAccessKey: cred.secretAccessKey});
      const res=await req.post(signature.path.replace(url.pathname, '')).set('X-Amz-Date', signature.headers['X-Amz-Date']).set('Authorization', signature.headers['Authorization']).set('Content-Type', signature.headers['Content-Type']).send('Hello World!');
      expect(res).to.have.status(200);
      expect(await c2.ws.receive1()).to.equal('Hello World!');
    }).timeout(timeout);

    it('should receive error code when sending to non existing client via REST API', async ()=>{
      const c='aJz0Md6VoAMCIbQ=';
      const url=new URL(endpoint);
      const signature = {service: 'execute-api', host:url.host, path:`${url.pathname}/@connections/${c}`, method: 'POST', body:'Hello World!', headers:{'Content-Type':'text/plain'/*'application/text'*/}};
      aws4.sign(signature, {accessKeyId: cred.accessKeyId, secretAccessKey: cred.secretAccessKey});
      const res=await req.post(signature.path.replace(url.pathname, '')).set('X-Amz-Date', signature.headers['X-Amz-Date']).set('Authorization', signature.headers['Authorization']).set('Content-Type', signature.headers['Content-Type']).send('Hello World!');
      expect(res).to.have.status(410);
    }).timeout(timeout);

    // UNABLE TO TEST HIS SCENARIO BECAUSE AWS DOESN'T RETURN ANYTHING
    // it('should not receive anything when POSTing nothing', async ()=>{
    //   const c1=await createClient();
    //   const url=new URL(endpoint);
    //   const signature = {service: 'execute-api', host:url.host, path:`${url.pathname}/@connections/${c1.id}`, method: 'POST'/*, body:'Hello World!'*/, headers:{'Content-Type':'text/plain'/*'application/text'*/}};
    //   aws4.sign(signature, {accessKeyId: cred.accessKeyId, secretAccessKey: cred.secretAccessKey});
    //   const res=await req.post(signature.path.replace(url.pathname, '')).set('X-Amz-Date', signature.headers['X-Amz-Date']).set('Authorization', signature.headers['Authorization']).set('Content-Type', signature.headers['Content-Type']).send(/*'Hello World!'*/);
    //   expect(res).to.have.status(200);
    // }).timeout(timeout);
    
  });
});