export default class ConnectionsController {
  #webSocketClients = null

  constructor(webSocketClients) {
    this.#webSocketClients = webSocketClients
  }

  send(connectionId, payload) {
    // TODO, is this correct?
    if (!payload) {
      return null
    }

    const clientExisted = this.#webSocketClients.send(
      connectionId,
      // payload is a Buffer
      payload.toString('utf-8'),
    )

    return clientExisted
  }

  remove(connectionId) {
    const clientExisted = this.#webSocketClients.close(connectionId)

    return clientExisted
  }
}
