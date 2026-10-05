import assert from "node:assert"
import process, { env } from "node:process"
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

  describe("without localEnvironment", () => {
    const secret = "SERVERLESS_OFFLINE_TEST_SECRET"

    beforeEach(() => {
      process.env[secret] = "secret"

      rubyRunner = new RubyRunner(
        {
          handler: `${handlerPath}.env_var`,
          runtime: "ruby3.3",
          timeout: 30_000,
        },
        { FOO: "bar" },
        { localEnvironment: false },
      )
    })

    afterEach(() => {
      delete process.env[secret]
    })

    // without them, e.g. a ruby installed through rbenv, asdf or homebrew is
    // not found
    ;["HOME", "PATH"].forEach((name) => {
      it(`should pass ${name} of the host`, async () => {
        assert.deepStrictEqual(await rubyRunner.run({ name }, {}), {
          value: process.env[name],
        })
      })
    })

    it("should pass the environment of the function", async () => {
      assert.deepStrictEqual(await rubyRunner.run({ name: "FOO" }, {}), {
        value: "bar",
      })
    })

    it("should not pass other environment variables of the host", async () => {
      assert.deepStrictEqual(await rubyRunner.run({ name: secret }, {}), {
        value: null,
      })
    })
  })
})
