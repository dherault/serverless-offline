// based on:
// https://github.com/ajmath/serverless-offline-scheduler

import { randomUUID } from "node:crypto"
import nodeSchedule from "node-schedule"
import { log } from "../../utils/log.js"
import convertExpressionToCron from "./convertExpressionToCron.js"
import ScheduleEvent from "./ScheduleEvent.js"
import ScheduleEventDefinition from "./ScheduleEventDefinition.js"

const { stringify } = JSON

// AWS evaluates schedule expressions in UTC, unless a timezone is configured
const DEFAULT_TIMEZONE = "Etc/UTC"

export default class Schedule {
  #jobs = []

  #lambda = null

  #region = null

  constructor(lambda, region) {
    this.#lambda = lambda
    this.#region = region
  }

  #scheduleEvent(functionKey, scheduleEvent) {
    const { enabled, input, rate, timezone = DEFAULT_TIMEZONE } = scheduleEvent

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
      const cron = convertExpressionToCron(entry)

      // the expression is invalid, the error has been logged already
      if (cron == null) {
        return
      }

      const jobName = `${functionKey} ${randomUUID()}`

      const job = nodeSchedule.scheduleJob(
        jobName,
        {
          rule: cron,
          tz: timezone,
        },
        async () => {
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
        },
      )

      // e.g. unsupported cron syntax
      if (job == null) {
        // node-schedule registers the job nonetheless
        nodeSchedule.cancelJob(jobName)

        log.error(
          `scheduler: Invalid schedule expression '${entry}', will not schedule`,
        )

        return
      }

      this.#jobs.push(job)

      log.notice(
        `Scheduling [${functionKey}] cron: [${cron}] (${timezone})${
          input ? ` input: ${stringify(input)}` : ""
        }`,
      )
    })
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

  stop() {
    this.#jobs.forEach((job) => {
      job.cancel()
    })

    this.#jobs = []
  }
}
