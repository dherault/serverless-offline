// based on:
// https://github.com/ajmath/serverless-offline-scheduler

import nodeSchedule from 'node-schedule'
import ScheduleEventDefinition from './ScheduleEventDefinition.js'

// const CRON_LENGTH_WITH_YEAR = 6

const { stringify } = JSON

export default class Schedule {
  #lambda = null
  #region = null

  constructor(lambda, region) {
    this.#lambda = lambda
    this.#region = region
  }

  _scheduleEvent(functionKey, scheduleEvent) {
    const { enabled, input, rate } = scheduleEvent

    if (!enabled) {
      console.log(`Scheduling [${functionKey}] cron: disabled`)

      return
    }

    const cron = this._convertExpressionToCron(rate)
    console.log(
      `Scheduling [${functionKey}] cron: [${cron}] input: ${stringify(input)}`,
    )

    nodeSchedule.scheduleJob(cron, async () => {
      try {
        const lambdaFunction = this.#lambda.get(functionKey)

        const event = input ?? this.getDefaultLambdaScheduleEvent()
        lambdaFunction.setEvent(event)

        /* const result = */ await lambdaFunction.runHandler()

        console.log(`Succesfully invoked scheduled function: [${functionKey}]`)
      } catch (err) {
        console.log(
          `Failed to execute scheduled function: [${functionKey}] Error: ${err}`,
        )
      }
    })
  }

  getDefaultLambdaScheduleEvent() {
    return {
      version: '0',
      id: 'random-event-id',
      account: 'random-account-id',
      region: this.#region,
      time: new Date().toISOString(),
      'detail-type': 'Scheduled Event',
      detail: {},
      source: 'aws.events',
    }
  }

  // _convertCronSyntax(cronString) {
  //   if (cronString.split(' ').length < CRON_LENGTH_WITH_YEAR) {
  //     return cronString
  //   }
  //
  //   return cronString.replace(/\s\S+$/, '')
  // }

  _convertRateToCron(rate) {
    const [number, unit] = rate.split(' ')

    switch (unit) {
      case 'minute':
      case 'minutes':
        return `*/${number} * * * *`

      case 'hour':
      case 'hours':
        return `0 */${number} * * *`

      case 'day':
      case 'days':
        return `0 0 */${number} * *`

      default:
        console.log(
          `scheduler: Invalid rate syntax '${rate}', will not schedule`,
        )
        return null
    }
  }

  _convertExpressionToCron(scheduleEvent) {
    const params = scheduleEvent
      .replace('rate(', '')
      .replace('cron(', '')
      .replace(')', '')

    if (scheduleEvent.startsWith('cron(')) {
      console.log('schedule rate "cron" not yet supported!')
      // return this._convertCronSyntax(params)
    }

    if (scheduleEvent.startsWith('rate(')) {
      return this._convertRateToCron(params)
    }

    console.log('scheduler: invalid, schedule syntax')

    return undefined
  }

  _create(functionKey, rawScheduleEventDefinition) {
    const scheduleEvent = new ScheduleEventDefinition(
      rawScheduleEventDefinition,
    )

    this._scheduleEvent(functionKey, scheduleEvent)
  }

  create(events) {
    events.forEach(({ functionKey, schedule }) => {
      this._create(functionKey, schedule)
    })
  }
}
