// based on:
// https://github.com/ajmath/serverless-offline-scheduler

import nodeSchedule from 'node-schedule'
import ScheduleEventDefinition from './ScheduleEventDefinition.js'
import { createUniqueId } from '../../utils/index.js'

// const CRON_LENGTH_WITH_YEAR = 6

const { stringify } = JSON

export default class Schedule {
  constructor(lambda) {
    this._lambda = lambda
  }

  _scheduleEvent(functionKey, rawScheduleEventDefinition) {
    const scheduleEvent = new ScheduleEventDefinition(
      rawScheduleEventDefinition,
    )

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

        const requestId = createUniqueId()
        lambdaFunction.setRequestId(requestId)

        /* const result = */ await lambdaFunction.runHandler()

        const {
          billedExecutionTimeInMillis,
          executionTimeInMillis,
        } = lambdaFunction

        console.log(
          `(λ: ${functionKey}) RequestId: ${requestId}  Duration: ${executionTimeInMillis.toFixed(
            2,
          )} ms  Billed Duration: ${billedExecutionTimeInMillis} ms`,
        )

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

  createEvent(functionKey, schedule) {
    this._scheduleEvent(functionKey, schedule)
  }
}
