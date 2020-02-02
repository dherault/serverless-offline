export default class ScheduleEvent {
  constructor(region) {
    this.account = 'random-account-id'
    this.detail = {}
    this['detail-type'] = 'Scheduled Event'
    this.id = 'random-event-id'
    this.region = region
    this.resources = []
    this.source = 'aws.events'
    this.time = new Date().toISOString()
    this.version = '0'
  }
}
