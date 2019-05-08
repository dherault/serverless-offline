const chai = require('chai');
const expect = chai.expect;
const endpoint=process.env.npm_config_endpoint||'ws://localhost:3000/dev';
const timeout=6000;

const WebSocketTester=require('../support/WebSocketTester');

describe('serverless', ()=>{
  describe('with WebSocket support', ()=>{
    let clients=[];
    const createWebSocket=async ()=>{
      const ws=new WebSocketTester();
      await ws.open(endpoint);
      clients.push(ws);
      return ws;
    };
    const createClient=async ()=>{
      const ws=await createWebSocket();
      ws.send(JSON.stringify({action:'getClientInfo'}));
      const json=await ws.receive1();
      const id=JSON.parse(json).info.id;
      return {ws, id};
    };
    
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

    it('should open a WebSocket', async ()=>{
      const ws=await createWebSocket();
      expect(ws).not.to.be.undefined;
    });

    it('should receive client connection info', async ()=>{
      const ws=await createWebSocket();
      ws.send(JSON.stringify({action:'getClientInfo'}));
      const clientInfo=JSON.parse(await ws.receive1());
      expect(clientInfo).to.deep.equal({action:'update', event:'client-info', info:{id:clientInfo.info.id}});
    });

    it('should call default handler when no such action exists', async ()=>{
      const ws=await createWebSocket();
      const payload=JSON.stringify({action:'action'+Date.now()});
      ws.send(payload);
      expect(await ws.receive1()).to.equal(`Error: No Supported Action in Payload '${payload}'`);
    });

    it('should call default handler when no action provided', async ()=>{
      const ws=await createWebSocket();
      ws.send(JSON.stringify({hello:'world'}));
      expect(await ws.receive1()).to.equal(`Error: No Supported Action in Payload '{"hello":"world"}'`);
    });

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
    });

    it('should response with only the last action when there are more than one in the serverless.yml file', async ()=>{
      const ws=await createWebSocket();
      ws.send(JSON.stringify({action:'makeMultiCalls'}));
      const res=JSON.parse(await ws.receive1());
      expect(res).to.deep.equal({action:'update', event:'made-call-2'});
    });

    it('should not send to non existing client', async ()=>{
      const c1=await createClient();
      c1.ws.send(JSON.stringify({action:'send', data:'Hello World!', clients:["non-existing-id"]}));
      expect(await c1.ws.receive1()).to.equal('Error: Could not Send all Messages');
    });

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
    }).timeout(6000);
  });
});