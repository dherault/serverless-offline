// based on:
// https://github.com/ajmath/serverless-offline-scheduler

import nodeSchedule from 'node-schedule'
import ScheduleEventDefinition from './ScheduleEventDefinition'

// const CRON_LENGTH_WITH_YEAR = 6

const { stringify } = JSON

export default class Schedule {
  private readonly _lambda: any

  constructor(lambda) {
    this._lambda = lambda
  }

  private _scheduleEvent(functionKey: string, scheduleEvent) {
    const { enabled, input, rate } = scheduleEvent

    if (!enabled) {
      console.log(`Scheduling [${functionKey}] cron: disabled`)

      return
    }

    const cron = this._convertExpressionToCron(rate)

    console.log(
      `Scheduling [${functionKey}] cron: [${cron}] input: ${stringify(
        scheduleEvent.input,
      )}`,
    )

    nodeSchedule.scheduleJob(cron, async () => {
      try {
        const lambdaFunction = this._lambda.get(functionKey)

        lambdaFunction.setEvent(input)

        /* const result = */ await lambdaFunction.runHandler()

        console.log(`Succesfully invoked scheduled function: [${functionKey}]`)
      } catch (err) {
        console.log(
          `Failed to execute scheduled function: [${functionKey}] Error: ${err}`,
        )
      }
    })
  }

  // _convertCronSyntax(cronString) {
  //   if (cronString.split(' ').length < CRON_LENGTH_WITH_YEAR) {
  //     return cronString
  //   }
  //
  //   return cronString.replace(/\s\S+$/, '')
  // }

  private _convertRateToCron(rate: string) {
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

  private _convertExpressionToCron(scheduleEvent: string) {
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

  createEvent(functionKey: string, rawScheduleEventDefinition) {
    const scheduleEvent = new ScheduleEventDefinition(
      rawScheduleEventDefinition,
    )

    this._scheduleEvent(functionKey, scheduleEvent)
  }
}
