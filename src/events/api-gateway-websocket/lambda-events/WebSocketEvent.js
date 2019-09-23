import WebSocketRequestContext from './WebSocketRequestContext.js'

export default class WebSocketEvent {
  constructor(connectionId, route, payload) {
    this._connectionId = connectionId
    this._payload = payload
    this._route = route
  }

  create() {
    const requestContext = new WebSocketRequestContext(
      'MESSAGE',
      this._route,
      this._connectionId,
    ).create()

    return {
      body: this._payload,
      isBase64Encoded: false,
      requestContext,
    }
  }
}
