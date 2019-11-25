import WebSocketRequestContext from './WebSocketRequestContext'

export default class WebSocketEvent {
  private readonly _connectionId: string
  private readonly _payload: any
  private readonly _route: string

  constructor(connectionId: string, route: string, payload) {
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
