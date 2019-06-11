const chai = require('chai');
const expect = chai.expect;
const endpoint = process.env.npm_config_endpoint||'ws://localhost:3005';
const timeout = process.env.npm_config_timeout?parseInt(process.env.npm_config_timeout):1000;
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

    it(`should call action 'echo' handler located at service.do`, async ()=>{
      const ws=await createWebSocket();
      const now=""+Date.now();
      const payload=JSON.stringify({service:{do:'echo'}, message:now});
      ws.send(payload);
      expect(await ws.receive1()).to.equal(`${now}`);
    }).timeout(timeout);

    
  });
});