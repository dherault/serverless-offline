import assert from "node:assert"
import { env } from "node:process"
import RubyRunner from "../RubyRunner.js"

const handlerPath =
  "src/lambda/handler-runner/ruby-runner/__tests__/fixtures/handler"

describe("RubyRunner", function desc() {
  let rubyRunner

  before(function before() {
    if (!env.RUBY_DETECTED) {
      this.skip()
    }
  })

  afterEach(async () => {
    await rubyRunner?.cleanup()
    rubyRunner = undefined
  })

  it("should pass the timeout to context.get_remaining_time_in_millis", async () => {
    rubyRunner = new RubyRunner(
      {
        handler: `${handlerPath}.remaining_time`,
        runtime: "ruby3.3",
        timeout: 30_000,
      },
      {},
    )

    const { remainingTime } = await rubyRunner.run({}, {})

    assert.ok(
      remainingTime > 25_000 && remainingTime <= 30_000,
      `unexpected remaining time ${remainingTime}`,
    )
  })
})
