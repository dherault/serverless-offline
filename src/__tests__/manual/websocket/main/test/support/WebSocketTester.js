'use strict';

/* eslint-disable import/no-extraneous-dependencies */

const WebSocket = require('ws');

module.exports = class WebSocketTester {
  constructor() {
    this.messages = [];
    this.receivers = [];
  }

  open(url) {
    if (this.ws != null) return;
    const ws = (this.ws = new WebSocket(url));
    ws.on('message', (message) => {
      // console.log('Received: '+message);
      if (this.receivers.length > 0) this.receivers.shift()(message);
      else this.messages.push(message);
    });

    return new Promise((resolve) => {
      ws.on('open', () => {
        resolve(true);
      });
    });
  }

  send(data) {
    this.ws.send(data);
  }

  receive1() {
    return new Promise((resolve) => {
      if (this.messages.length > 0) resolve(this.messages.shift());
      else this.receivers.push(resolve);
    });
  }

  receive(n) {
    return new Promise((resolve) => {
      const messages = [];
      for (let i = 0; i < n; i += 1) {
        this.receive1().then((message) => {
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
    if (this.ws != null) this.ws.close();
  }
};
