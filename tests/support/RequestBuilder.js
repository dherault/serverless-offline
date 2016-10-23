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

  toObject() {
    return this.request;
  }
};
