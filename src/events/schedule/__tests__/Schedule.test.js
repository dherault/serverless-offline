import assert from "node:assert"
import nodeSchedule from "node-schedule"
import Schedule from "../Schedule.js"

const { keys } = Object

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
  return keys(nodeSchedule.scheduledJobs).map(
    (name) => nodeSchedule.scheduledJobs[name],
  )
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

  it("should not throw for an unsupported cron expression", () => {
    schedule = new Schedule(lambda, "us-east-1")

    schedule.create([{ functionKey: "foo", schedule: "cron(0 9 15W * ? *)" }])

    assert.strictEqual(getScheduledJobs().length, 0)
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
    const nextInvocation = job.nextInvocation()

    assert.strictEqual(nextInvocation.getUTCDay(), 1)
    assert.strictEqual(nextInvocation.getUTCHours(), 9)
    assert.strictEqual(nextInvocation.getUTCMinutes(), 0)
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
    assert.strictEqual(job.nextInvocation().getUTCHours(), 0)
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
