export default class ConnectionsController {
  constructor(webSocketClients) {
    this._webSocketClients = webSocketClients
  }

  send(connectionId, payload) {
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

  remove(connectionId) {
    const clientExisted = this._webSocketClients.close(connectionId)

    return clientExisted
  }
}
