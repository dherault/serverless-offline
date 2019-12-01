import WebSocketClients from '../../WebSocketClients'

export default class ConnectionsController {
  private readonly _webSocketClients: WebSocketClients

  constructor(webSocketClients: WebSocketClients) {
    this._webSocketClients = webSocketClients
  }

  send(connectionId: string, payload) {
    // TODO, is this correct?
    if (!payload) {
      return null
    }

    const clientExisted = this._webSocketClients.send(
      connectionId,
      // payload is a Buffer
      payload.toString('utf-8'),
    )

    return clientExisted
  }

  remove(connectionId: string) {
    const clientExisted = this._webSocketClients.close(connectionId)

    return clientExisted
  }
}
