import { createUniqueId } from '../../utils/index.js'

export default class ScheduleEvent {
  constructor(region) {
    this.account = createUniqueId()()
    this.detail = {}
    this['detail-type'] = 'Scheduled Event'
    this.id = createUniqueId()
    this.region = region
    this.resources = []
    this.source = 'aws.events'
    this.time = new Date().toISOString()
    this.version = '0'
  }
}
