import assert from "node:assert"

import { scheduledJobs } from "croner"

import Schedule from "../Schedule.js"

const lambda = {
  get() {
    return {
      async runHandler() {
        return null
      },
      setEvent() {},
    }
  },
}

function getScheduledJobs() {
  return [...scheduledJobs]
}

describe("Schedule", () => {
  let schedule

  afterEach(() => {
    schedule.stop()
  })

  it("should not throw for an invalid rate", () => {
    schedule = new Schedule(lambda, "us-east-1")

    schedule.create([{ functionKey: "foo", schedule: "rate(5 seconds)" }])

    assert.strictEqual(getScheduledJobs().length, 0)
  })

  it("should not throw for an invalid cron expression", () => {
    schedule = new Schedule(lambda, "us-east-1")

    schedule.create([{ functionKey: "foo", schedule: "cron(0 9 32 * ? *)" }])

    assert.strictEqual(getScheduledJobs().length, 0)
  })

  // AWS: every 15 minutes, starting at minute 5
  it("should schedule a step with a start value", () => {
    schedule = new Schedule(lambda, "us-east-1")

    schedule.create([{ functionKey: "foo", schedule: "cron(5/15 * * * ? *)" }])

    const [job] = getScheduledJobs()
    const minutes = job.nextRuns(4).map((date) => date.getUTCMinutes())

    assert.deepStrictEqual(
      minutes.toSorted((a, b) => a - b),
      [5, 20, 35, 50],
    )
  })

  // AWS: the weekday nearest to the 15th of the month
  it("should schedule the nearest weekday of a day of the month", () => {
    schedule = new Schedule(lambda, "us-east-1")

    schedule.create([{ functionKey: "foo", schedule: "cron(0 9 15W * ? *)" }])

    const [job] = getScheduledJobs()
    const nextRun = job.nextRun()

    assert.ok(nextRun.getUTCDay() >= 1 && nextRun.getUTCDay() <= 5)
    assert.ok(nextRun.getUTCDate() >= 14 && nextRun.getUTCDate() <= 16)
  })

  // AWS: the last Friday of the month
  it("should schedule the last day of the week of the month", () => {
    schedule = new Schedule(lambda, "us-east-1")

    schedule.create([{ functionKey: "foo", schedule: "cron(0 9 ? * 6L *)" }])

    const [job] = getScheduledJobs()
    const nextRun = job.nextRun()
    const daysInMonth = new Date(
      Date.UTC(nextRun.getUTCFullYear(), nextRun.getUTCMonth() + 1, 0),
    ).getUTCDate()

    assert.strictEqual(nextRun.getUTCDay(), 5)
    assert.ok(nextRun.getUTCDate() > daysInMonth - 7)
  })

  it("should not schedule a disabled event", () => {
    schedule = new Schedule(lambda, "us-east-1")

    schedule.create([
      {
        functionKey: "foo",
        schedule: { enabled: false, rate: "rate(1 minute)" },
      },
    ])

    assert.strictEqual(getScheduledJobs().length, 0)
  })

  it("should schedule every rate of an event", () => {
    schedule = new Schedule(lambda, "us-east-1")

    schedule.create([
      {
        functionKey: "foo",
        schedule: { rate: ["rate(1 minute)", "cron(0 9 ? * 2 *)"] },
      },
    ])

    assert.strictEqual(getScheduledJobs().length, 2)
  })

  // AWS evaluates cron expressions in UTC
  it("should evaluate cron expressions in UTC by default", () => {
    schedule = new Schedule(lambda, "us-east-1")

    // AWS: every Monday at 09:00
    schedule.create([{ functionKey: "foo", schedule: "cron(0 9 ? * 2 *)" }])

    const [job] = getScheduledJobs()
    const nextRun = job.nextRun()

    assert.strictEqual(nextRun.getUTCDay(), 1)
    assert.strictEqual(nextRun.getUTCHours(), 9)
    assert.strictEqual(nextRun.getUTCMinutes(), 0)
  })

  it("should evaluate cron expressions in the configured timezone", () => {
    schedule = new Schedule(lambda, "us-east-1")

    schedule.create([
      {
        functionKey: "foo",
        schedule: { rate: "cron(0 9 ? * 2 *)", timezone: "Asia/Tokyo" },
      },
    ])

    const [job] = getScheduledJobs()

    // 09:00 in Tokyo (UTC+9, no DST) is 00:00 UTC
    assert.strictEqual(job.nextRun().getUTCHours(), 0)
  })

  it("should cancel all jobs when stopped", () => {
    schedule = new Schedule(lambda, "us-east-1")

    schedule.create([
      { functionKey: "foo", schedule: "rate(1 minute)" },
      { functionKey: "bar", schedule: "rate(5 minutes)" },
    ])

    assert.strictEqual(getScheduledJobs().length, 2)

    schedule.stop()

    assert.strictEqual(getScheduledJobs().length, 0)
  })
})
