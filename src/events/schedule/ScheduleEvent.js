import { createUniqueId } from '../../utils/index.js'

export default class ScheduleEvent {
  account = createUniqueId()

  detail = {};

  ['detail-type'] = 'Scheduled Event'

  id = createUniqueId()

  region = null

  resources = []

  source = 'aws.events'

  // format of aws displaying the time, e.g.: 2020-02-09T14:13:57Z
  time = new Date().toISOString().replaceAll(/\.(.*)(?=Z)/g, '')

  version = '0'

  constructor(region) {
    this.region = region
  }
}
