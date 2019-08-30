const { stringify } = JSON

export default class RequestBuilder {
  constructor(method, path) {
    this.request = {
      headers: {},
      info: {
        received: 1,
        remoteAddress: '127.0.0.1',
      },
      method: method.toUpperCase(),
      params: {},
      payload: null,
      query: {},
      raw: {
        req: {
          rawHeaders: [],
          url: '',
        },
      },
      rawPayload: null,
      route: {
        path,
      },
    }
  }

  addHeader(key, value) {
    this.request.headers[key] = value
    this.request.raw.req.rawHeaders.push(key, value)
  }

  addBody(body) {
    this.request.payload = body
    // The rawPayload would normally be the string version of the given body
    this.request.rawPayload = stringify(body)
  }

  addParam(key, value) {
    this.request.params[key] = value
  }

  addQuery(query) {
    if (this.request.raw.req.url) {
      this.request.raw.req.url = this.request.route.path
    }

    this.request.raw.req.url += query
  }

  toObject() {
    return this.request
  }
}
