import { createUniqueId } from '../../utils/index.js'

export default class ScheduleEvent {
  constructor(region) {
    // format of aws displaying the time, e.g.: 2020-02-09T14:13:57Z
    const time = new Date().toISOString().replace(/\.(.*)(?=Z)/g, '')

    this.account = createUniqueId()
    this.detail = {}
    this['detail-type'] = 'Scheduled Event'
    this.id = createUniqueId()
    this.region = region
    this.resources = []
    this.source = 'aws.events'
    this.time = time
    this.version = '0'
  }
}
