import { BASE_URL_PLACEHOLDER } from "../../../../../config/index.js"

const { stringify } = JSON

// builds the subset of a hapi request object which
// LambdaProxyIntegrationEventV2 reads from
export default class RequestBuilderV2 {
  #request = null

  constructor(method, path) {
    this.#request = {
      headers: {},
      info: {
        received: 1,
        remoteAddress: "127.0.0.1",
      },
      method: method.toUpperCase(),
      params: {},
      payload: null,
      raw: {
        req: {
          rawHeaders: [],
        },
      },
      rawPayload: null,
      route: {
        path,
      },
      url: new URL(path, BASE_URL_PLACEHOLDER),
    }
  }

  addBody(body) {
    this.#request.payload = body
    // the rawPayload would normally be the string version of the given body
    this.#request.rawPayload = stringify(body)

    return this
  }

  addRawBody(rawPayload) {
    this.#request.payload = rawPayload
    this.#request.rawPayload = rawPayload
    this.#request.raw.req.payload = rawPayload

    return this
  }

  addHeader(key, value) {
    this.#request.headers[key.toLowerCase()] = value
    this.#request.raw.req.rawHeaders.push(key, value)

    return this
  }

  addAuthContext(context) {
    this.#request.auth = {
      credentials: {
        context,
      },
    }

    return this
  }

  addCookies(state) {
    this.#request.state = state

    return this
  }

  addParam(key, value) {
    this.#request.params[key] = value

    return this
  }

  addQuery(query) {
    this.#request.url = new URL(
      `${this.#request.route.path}${query}`,
      BASE_URL_PLACEHOLDER,
    )

    return this
  }

  toObject() {
    return this.#request
  }
}
