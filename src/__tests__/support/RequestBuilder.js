'use strict';

module.exports = class RequestBuilder {
  constructor(method, path) {
    this.request = {
      headers: {},
      info: {
        received: 1,
        remoteAddress: '127.0.0.1',
      },
      method: method.toUpperCase(),
      multiValueHeaders: {},
      params: {},
      payload: null,
      query: {},
      rawPayload: null,
      route: {
        path,
      },
      unprocessedHeaders: {},
    };
  }

  addHeader(key, value) {
    this.request.headers[key] = value;
    this.request.unprocessedHeaders[key] = value;
    this.request.multiValueHeaders[key] = (
      this.request.multiValueHeaders[key] || []
    ).concat(value);
  }

  addBody(body) {
    this.request.payload = body;

    // The rawPayload would normally be the string version of the given body
    this.request.rawPayload = JSON.stringify(body);
  }

  addParam(key, value) {
    this.request.params[key] = value;
  }

  addQuery(key, value) {
    this.request.query[key] = value;
  }

  toObject() {
    return this.request;
  }
};
