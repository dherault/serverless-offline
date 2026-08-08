import assert from "node:assert"
import ScheduleEventDefinition from "../ScheduleEventDefinition.js"

describe("ScheduleEventDefinition", () => {
  describe("with a shorthand string definition", () => {
    it("should use the string as the rate", () => {
      const scheduleEventDefinition = new ScheduleEventDefinition(
        "rate(1 minute)",
      )

      assert.strictEqual(scheduleEventDefinition.rate, "rate(1 minute)")
    })

    it("should be enabled by default", () => {
      const scheduleEventDefinition = new ScheduleEventDefinition(
        "cron(0 12 * * ? *)",
      )

      assert.strictEqual(scheduleEventDefinition.enabled, true)
    })
  })

  describe("with an object definition", () => {
    it("should assign the rate", () => {
      const scheduleEventDefinition = new ScheduleEventDefinition({
        rate: ["rate(2 hours)"],
      })

      assert.deepStrictEqual(scheduleEventDefinition.rate, ["rate(2 hours)"])
    })

    it("should be enabled when enabled is not set", () => {
      const scheduleEventDefinition = new ScheduleEventDefinition({
        rate: "rate(1 minute)",
      })

      assert.strictEqual(scheduleEventDefinition.enabled, true)
    })

    it("should be enabled when enabled is explicitly true", () => {
      const scheduleEventDefinition = new ScheduleEventDefinition({
        enabled: true,
        rate: "rate(1 minute)",
      })

      assert.strictEqual(scheduleEventDefinition.enabled, true)
    })

    it("should be disabled when enabled is explicitly false", () => {
      const scheduleEventDefinition = new ScheduleEventDefinition({
        enabled: false,
        rate: "rate(1 minute)",
      })

      assert.strictEqual(scheduleEventDefinition.enabled, false)
    })

    it("should copy over any additional property", () => {
      const scheduleEventDefinition = new ScheduleEventDefinition({
        description: "some description",
        input: {
          key: "value",
        },
        name: "my-schedule",
        rate: "rate(1 minute)",
      })

      assert.strictEqual(
        scheduleEventDefinition.description,
        "some description",
      )
      assert.strictEqual(scheduleEventDefinition.name, "my-schedule")
      assert.deepStrictEqual(scheduleEventDefinition.input, { key: "value" })
    })
  })
})
