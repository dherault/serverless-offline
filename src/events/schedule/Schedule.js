// based on:
// https://github.com/ajmath/serverless-offline-scheduler

import nodeSchedule from 'node-schedule'
import ScheduleEvent from './ScheduleEvent.js'
import ScheduleEventDefinition from './ScheduleEventDefinition.js'

// const CRON_LENGTH_WITH_YEAR = 6

const { stringify } = JSON

export default class Schedule {
  #lambda = null
  #region = null

  constructor(lambda, region, v3Utils) {
    this.#lambda = lambda
    this.#region = region

    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }
  }

  _scheduleEvent(functionKey, scheduleEvent) {
    const { enabled, input, rate } = scheduleEvent

    if (!enabled) {
      if (this.log) {
        this.log.notice(`Scheduling [${functionKey}] cron: disabled`)
      } else {
        console.log(`Scheduling [${functionKey}] cron: disabled`)
      }

      return
    }

    // Convert string rate to array to support Serverless v2.57.0 and lower.
    let rates = rate
    if (typeof rate === 'string') {
      rates = [rate]
    }

    rates.forEach((entry) => {
      const cron = this._convertExpressionToCron(entry)

      if (this.log) {
        this.log.notice(
          `Scheduling [${functionKey}] cron: [${cron}] input: ${stringify(
            input,
          )}`,
        )
      } else {
        console.log(
          `Scheduling [${functionKey}] cron: [${cron}] input: ${stringify(
            input,
          )}`,
        )
      }

      nodeSchedule.scheduleJob(cron, async () => {
        try {
          const lambdaFunction = this.#lambda.get(functionKey)

          const event = input ?? new ScheduleEvent(this.#region)
          lambdaFunction.setEvent(event)

          /* const result = */ await lambdaFunction.runHandler()

          if (this.log) {
            this.log.notice(
              `Successfully invoked scheduled function: [${functionKey}]`,
            )
          } else {
            console.log(
              `Successfully invoked scheduled function: [${functionKey}]`,
            )
          }
        } catch (err) {
          if (this.log) {
            this.log.error(
              `Failed to execute scheduled function: [${functionKey}] Error: ${err}`,
            )
          } else {
            console.log(
              `Failed to execute scheduled function: [${functionKey}] Error: ${err}`,
            )
          }
        }
      })
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
        if (this.log) {
          this.log.error(
            `scheduler: Invalid rate syntax '${rate}', will not schedule`,
          )
        } else {
          console.log(
            `scheduler: Invalid rate syntax '${rate}', will not schedule`,
          )
        }
        return null
    }
  }

  _convertExpressionToCron(scheduleEvent) {
    const params = scheduleEvent
      .replace('rate(', '')
      .replace('cron(', '')
      .replace(')', '')

    if (scheduleEvent.startsWith('cron(')) {
      if (!this.log) console.log('schedule rate "cron" not yet supported!')
      // return this._convertCronSyntax(params)
    }

    if (scheduleEvent.startsWith('rate(')) {
      return this._convertRateToCron(params)
    }

    if (this.log) {
      this.log.error('scheduler: invalid, schedule syntax')
    } else {
      console.log('scheduler: invalid, schedule syntax')
    }

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
