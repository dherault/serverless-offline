export default class ScheduleEventDefinition {
  constructor(rawScheduleEventDefinition) {
    const { description, enabled, input, name, rate } =
      typeof rawScheduleEventDefinition === 'string'
        ? {}
        : rawScheduleEventDefinition

    this.description = description
    // default if not specified: enabled
    this.enabled = enabled == null ? true : enabled
    this.input = input
    this.name = name
    this.rate = rate
  }
}
