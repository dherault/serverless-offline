'use strict';

module.exports = class RequestBuilder {
  constructor(method, path) {
    this.request = {
      method: method.toUpperCase(),
      headers: {},
      params: {},
      route: {
        path,
      },
      query: {},
      payload: null,
      info: {
        remoteAddress: '127.0.0.1',
      },
    };
  }

  addHeader(key, value) {
    this.request.headers[key] = value;
  }

  addBody(body) {
    this.request.payload = body;
  }

  toObject() {
    return this.request;
  }
};
