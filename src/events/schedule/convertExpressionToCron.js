import { log } from "../../utils/log.js"

const CRON_LENGTH_WITH_YEAR = 6

const DAY_OF_WEEK_INDEX = 4

// AWS numbers the days of the week 1-7 (SUN-SAT), cron 0-6 (SUN-SAT), e.g.
// 2-6 (MON-FRI) => 1-5, 6#3 (third FRI) => 5#3, 7L (last SAT) => 6L
// https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html#eb-cron-expressions
function convertDayOfWeek(dayOfWeek) {
  return dayOfWeek.replaceAll(
    /(^|[,-])([1-7])/g,
    (match, separator, day) => `${separator}${Number(day) - 1}`,
  )
}

function convertCronSyntax(cronString) {
  const fields = cronString.trim().split(/\s+/)

  if (fields.length < CRON_LENGTH_WITH_YEAR) {
    return cronString
  }

  // remove the year, which is not supported by cron
  fields.pop()

  fields[DAY_OF_WEEK_INDEX] = convertDayOfWeek(fields[DAY_OF_WEEK_INDEX])

  return fields.join(" ")
}

function convertRateToCron(rate) {
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

// (string) => string | null
export default function convertExpressionToCron(scheduleEvent) {
  const params = scheduleEvent
    .replace("rate(", "")
    .replace("cron(", "")
    .replace(")", "")

  if (scheduleEvent.startsWith("cron(")) {
    return convertCronSyntax(params)
  }

  if (scheduleEvent.startsWith("rate(")) {
    return convertRateToCron(params)
  }

  log.error("scheduler: invalid, schedule syntax")

  return null
}
