// based on:
// https://github.com/ajmath/serverless-offline-scheduler
// https://github.com/Meemaw/serverless-offline-schedule

import nodeSchedule from 'node-schedule'
import { createUniqueId } from '../../utils/index.js'

const { stringify } = JSON

export default class Schedule {
  constructor(lambda) {
    this._lambda = lambda
  }

  _convertExpressionToCron(scheduleRate) {
    if (scheduleRate.startsWith('cron(')) {
      return scheduleRate.replace('cron(', '').replace(')', '')
    }

    if (scheduleRate.startsWith('rate(')) {
      const params = scheduleRate.replace('rate(', '').replace(')', '')
      return this._convertRateToCron(params)
    }

    throw new Error(`Invalid schedule rate: '${scheduleRate}'`)
  }

  _convertRateToCron(rate) {
    const [number, unit] = rate.split(' ')

    if (!unit) {
      throw new Error(`Invalid rate format: '${rate}'`)
    }

    if (unit.startsWith('minute')) {
      return `*/${number} * * * *`
    }

    if (unit.startsWith('hour')) {
      return `0 */${number} * * *`
    }

    if (unit.startsWith('day')) {
      return `0 0 */${number} * *`
    }

    throw new Error(`Invalid rate format: '${rate}'`)
  }

  _scheduleEvent(functionKey, schedule) {
    let cron
    let event

    if (typeof schedule === 'string') {
      cron = schedule
    } else {
      ;({ cron, input: event } = schedule)
    }

    const cronValue = this._convertExpressionToCron(cron)

    console.log(
      `Scheduling [${functionKey}] cron: [${cron}] input: ${stringify(event)}`,
    )

    nodeSchedule.scheduleJob(cronValue, async () => {
      try {
        const lambdaFunction = this._lambda.get(functionKey)

        lambdaFunction.setEvent(event)

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

  createEvent(functionKey, schedule) {
    this._scheduleEvent(functionKey, schedule)
  }
}
