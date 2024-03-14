export default class ConnectionsController {
  #webSocketClients = null
  constructor(webSocketClients) {
    this.#webSocketClients = webSocketClients
  }
  send(connectionId, payload) {
    if (!payload) {
      return null
    }
    const clientExisted = this.#webSocketClients.send(
      connectionId,
      payload.toString('utf-8'),
    )
    return clientExisted
  }
  remove(connectionId) {
    const clientExisted = this.#webSocketClients.close(connectionId)
    return clientExisted
  }
}
