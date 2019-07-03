/* eslint-disable import/no-extraneous-dependencies */
const WebSocket = require('ws');

class WebSocketTester {
  constructor() {
    this.messages = []; this.receivers = []; this.waitingForClose = []; this.hasClosed = false;
  }

  notifyWaitingForClose() {
    this.waitingForClose.forEach(resolve => resolve());
    this.waitingForClose = []; 
  }

  open(url, options) {
    if (this.ws != null) return;
    const ws = this.ws = new WebSocket(url, options);
    ws.on('message', message => {
      // console.log('Received: '+message);
      if (this.receivers.length > 0) this.receivers.shift()(message);
      else this.messages.push(message);
    });

    return new Promise(resolve => {
      ws.on('open', () => {
        resolve(true);
      });
      ws.on('unexpected-response', () => {
        this.hasClosed = true;
        this.notifyWaitingForClose();
        resolve(false);
      });
      ws.on('close', () => {
        this.notifyWaitingForClose();
        this.hasClosed = true;
      });
    });
  }

  send(data) {
    this.ws.send(data);
  }

  receive1() {
    return new Promise(resolve => {
      if (this.messages.length > 0) resolve(this.messages.shift());
      else this.receivers.push(resolve);
    });
  }

  receive(n) {
    return new Promise(resolve => {
      const messages = [];
      for (let i = 0; i < n; i += 1) {
        this.receive1().then(message => {
          messages[i] = message;
          if (i === n - 1) resolve(messages);
        });
      }
    });
  }

  skip() {
    if (this.messages.length > 0) this.messages.shift();
    else this.receivers.push(() => {});
  }

  countUnrecived() {
    return this.messages.length;
  }

  close() {
    this.hasClosed = true;
    if (this.ws != null) this.ws.close();
  }

  waitForClose() {
    return new Promise(resolve => {
      if (this.hasClosed) resolve();
      else this.waitingForClose.push(resolve);
    });
  }
}

module.exports = WebSocketTester;
