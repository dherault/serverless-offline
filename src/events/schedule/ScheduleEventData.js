export default class ScheduleEventData {
  constructor(rawEvent) {
    const { description, enabled, input, name, rate } =
      typeof rawEvent === 'string' ? {} : rawEvent

    this.description = description
    // default if not specified: enabled
    this.enabled = enabled == null ? true : enabled
    this.input = input
    this.name = name
    this.rate = rate
  }
}
