import WebSocketRequestContext from './WebSocketRequestContext.js'

export default class WebSocketEvent {
  #connectionId = null

  #payload = null

  #route = null

  constructor(connectionId, route, payload) {
    this.#connectionId = connectionId
    this.#payload = payload
    this.#route = route
  }

  create() {
    const requestContext = new WebSocketRequestContext(
      'MESSAGE',
      this.#route,
      this.#connectionId,
    ).create()

    return {
      body: this.#payload,
      isBase64Encoded: false,
      requestContext,
    }
  }
}
