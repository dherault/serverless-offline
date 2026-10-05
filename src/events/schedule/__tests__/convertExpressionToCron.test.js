import assert from "node:assert"
import convertExpressionToCron from "../convertExpressionToCron.js"

describe("convertExpressionToCron", () => {
  describe("with a rate expression", () => {
    ;[
      { expected: "*/1 * * * *", expression: "rate(1 minute)" },
      { expected: "*/5 * * * *", expression: "rate(5 minutes)" },
      { expected: "0 */1 * * *", expression: "rate(1 hour)" },
      { expected: "0 */2 * * *", expression: "rate(2 hours)" },
      { expected: "0 0 */1 * *", expression: "rate(1 day)" },
      { expected: "0 0 */3 * *", expression: "rate(3 days)" },
    ].forEach(({ expected, expression }) => {
      it(`should convert ${expression}`, () => {
        assert.strictEqual(convertExpressionToCron(expression), expected)
      })
    })

    it("should return null for an invalid unit", () => {
      assert.strictEqual(convertExpressionToCron("rate(5 seconds)"), null)
    })
  })

  describe("with a cron expression", () => {
    ;[
      {
        description: "should remove the year",
        expected: "0 12 * * ?",
        expression: "cron(0 12 * * ? *)",
      },
      {
        description: "should keep named days of the week",
        expected: "0 18 ? * MON-FRI",
        expression: "cron(0 18 ? * MON-FRI *)",
      },
      // AWS: 1-7 (SUN-SAT), cron: 0-6 (SUN-SAT)
      {
        description: "should convert a numeric day of the week",
        expected: "0 9 ? * 1",
        expression: "cron(0 9 ? * 2 *)",
      },
      {
        description: "should convert a range of days of the week",
        expected: "0 9 ? * 1-5",
        expression: "cron(0 9 ? * 2-6 *)",
      },
      {
        description: "should convert a list of days of the week",
        expected: "0 9 ? * 0,6",
        expression: "cron(0 9 ? * 1,7 *)",
      },
      {
        description: "should convert the nth day of the week of the month",
        expected: "0 9 ? * 5#3",
        expression: "cron(0 9 ? * 6#3 *)",
      },
      {
        description: "should convert the last day of the week of the month",
        expected: "0 9 ? * 4L",
        expression: "cron(0 9 ? * 5L *)",
      },
      {
        description: "should not touch the day of the month",
        expected: "15 10 2 * ?",
        expression: "cron(15 10 2 * ? *)",
      },
      {
        description: "should pass through an expression without a year",
        expected: "0 9 * * 2",
        expression: "cron(0 9 * * 2)",
      },
    ].forEach(({ description, expected, expression }) => {
      it(description, () => {
        assert.strictEqual(convertExpressionToCron(expression), expected)
      })
    })
  })

  it("should return null for an unknown expression", () => {
    assert.strictEqual(convertExpressionToCron("at(2026-01-01T00:00:00)"), null)
  })
})
