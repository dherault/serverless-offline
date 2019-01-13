module.exports = class RequestBuilder {
  constructor(method, path) {
    this.request = {
      method: method.toUpperCase(),
      headers: {},
      multiValueHeaders: {},
      unprocessedHeaders: {},
      params: {},
      route: {
        path,
      },
      query: {},
      payload: null,
      rawPayload: null,
      info: {
        remoteAddress: '127.0.0.1',
      },
    };
  }

  addHeader(key, value) {
    this.request.headers[key] = value;
    this.request.unprocessedHeaders[key] = value;
    this.request.multiValueHeaders[key] =
        (this.request.multiValueHeaders[key] || []).concat(value);
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
