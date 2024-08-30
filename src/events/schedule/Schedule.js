// based on:
// https://github.com/ajmath/serverless-offline-scheduler

import nodeSchedule from "node-schedule"
import { log } from "../../utils/log.js"
import ScheduleEvent from "./ScheduleEvent.js"
import ScheduleEventDefinition from "./ScheduleEventDefinition.js"

const CRON_LENGTH_WITH_YEAR = 6

const { stringify } = JSON

export default class Schedule {
  #lambda = null

  #region = null

  constructor(lambda, region) {
    this.#lambda = lambda
    this.#region = region
  }

  #scheduleEvent(functionKey, scheduleEvent) {
    const { enabled, input, rate } = scheduleEvent

    if (!enabled) {
      log.notice(`Scheduling [${functionKey}] cron: disabled`)

      return
    }

    // Convert string rate to array to support Serverless v2.57.0 and lower.
    let rates = rate
    if (typeof rate === "string") {
      rates = [rate]
    }

    rates.forEach((entry) => {
      const cron = this.#convertExpressionToCron(entry)

      log.notice(
        `Scheduling [${functionKey}] cron: [${cron}]${
          input ? ` input: ${stringify(input)}` : ""
        }`,
      )

      nodeSchedule.scheduleJob(cron, async () => {
        try {
          const lambdaFunction = this.#lambda.get(functionKey)

          const event = input ?? new ScheduleEvent(this.#region)
          lambdaFunction.setEvent(event)

          /* const result = */ await lambdaFunction.runHandler()

          log.notice(
            `Successfully invoked scheduled function: [${functionKey}]`,
          )
        } catch (err) {
          log.error(
            `Failed to execute scheduled function: [${functionKey}] Error: ${err}`,
          )
        }
      })
    })
  }

  #convertCronSyntax(cronString) {
    if (cronString.split(" ").length < CRON_LENGTH_WITH_YEAR) {
      return cronString
    }

    return cronString.replace(/\s\S+$/, "")
  }

  #convertRateToCron(rate) {
    const [number, unit] = rate.split(" ")

    switch (unit) {
      case "minute":
      case "minutes": {
        return `*/${number} * * * *`
      }

      case "hour":
      case "hours": {
        return `0 */${number} * * *`
      }

      case "day":
      case "days": {
        return `0 0 */${number} * *`
      }

      default: {
        log.error(`scheduler: Invalid rate syntax '${rate}', will not schedule`)

        return null
      }
    }
  }

  #convertExpressionToCron(scheduleEvent) {
    const params = scheduleEvent
      .replace("rate(", "")
      .replace("cron(", "")
      .replace(")", "")

    if (scheduleEvent.startsWith("cron(")) {
      return this.#convertCronSyntax(params)
    }

    if (scheduleEvent.startsWith("rate(")) {
      return this.#convertRateToCron(params)
    }

    log.error("scheduler: invalid, schedule syntax")

    return undefined
  }

  #create(functionKey, rawScheduleEventDefinition) {
    const scheduleEvent = new ScheduleEventDefinition(
      rawScheduleEventDefinition,
    )

    this.#scheduleEvent(functionKey, scheduleEvent)
  }

  create(events) {
    events.forEach(({ functionKey, schedule }) => {
      this.#create(functionKey, schedule)
    })
  }
}
