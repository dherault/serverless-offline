const { assign } = Object

export default class WebSocketEventDefinition {
  constructor(rawWebSocketEventDefinition) {
    let rest
    let route
    let authorizer

    if (typeof rawWebSocketEventDefinition === 'string') {
      route = rawWebSocketEventDefinition
    } else {
      ;({ route, authorizer, ...rest } = rawWebSocketEventDefinition)
    }

    this.route = route
    this.authorizer = authorizer

    assign(this, rest)
  }
}
