const { assign } = Object

export default class AlbEventDefinition {
  constructor(rawAlbEventDefinition) {
    let listenerArn
    let priority
    let conditions
    let rest

    if (typeof rawAlbEventDefinition === 'string') {
      ;[listenerArn, priority, conditions] = rawAlbEventDefinition.split(' ')
    } else {
      ;({ listenerArn, priority, conditions, ...rest } = rawAlbEventDefinition)
    }

    this.listenerArn = listenerArn
    this.priority = priority
    this.conditions = conditions

    assign(this, rest)
  }
}
