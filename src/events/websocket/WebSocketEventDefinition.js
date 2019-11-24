const { assign } = Object

export default class WebSocketEventDefinition {
  constructor(rawWebSocketEventDefinition) {
    let rest
    let route

    if (typeof rawWebSocketEventDefinition === 'string') {
      route = rawWebSocketEventDefinition
    } else {
      ;({ route, ...rest } = rawWebSocketEventDefinition)
    }

    this.route = route

    assign(this, rest)
  }
}
