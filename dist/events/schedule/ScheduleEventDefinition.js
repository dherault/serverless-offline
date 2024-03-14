const { assign } = Object
export default class ScheduleEventDefinition {
  constructor(rawHttpEventDefinition) {
    let enabled
    let rate
    let rest
    if (typeof rawHttpEventDefinition === 'string') {
      rate = rawHttpEventDefinition
    } else {
      ;({ rate, enabled, ...rest } = rawHttpEventDefinition)
    }
    this.enabled = enabled == null ? true : enabled
    this.rate = rate
    assign(this, rest)
  }
}
