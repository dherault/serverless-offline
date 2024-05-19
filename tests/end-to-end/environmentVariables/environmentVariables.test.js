import assert from "node:assert"
import { env } from "node:process"
import { join } from "desm"
import { BASE_URL } from "../../config.js"
import { setup, teardown } from "../../_testHelpers/index.js"

describe("environment variables", function desc() {
  const ENV_VAR_QUOTED = "I am ENV_VAR_1"
  const ENV_VAR_UNQUOTED = "I am ENV_VAR_2"
  const ENV_VAR_MAPPED = "I am ENV_VAR_3"

  let json

  beforeEach(async () => {
    env.ENV_VAR_QUOTED = ENV_VAR_QUOTED
    env.ENV_VAR_UNQUOTED = ENV_VAR_UNQUOTED
    env.ENV_VAR_MAPPED_FROM_ANOTHER = ENV_VAR_MAPPED

    await setup({
      servicePath: join(import.meta.url, "src"),
    })

    const url = new URL("/dev/hello", BASE_URL)
    const response = await fetch(url)
    json = await response.json()
  })

  afterEach(async () => {
    env.ENV_VAR_QUOTED = undefined
    env.ENV_VAR_UNQUOTED = undefined
    env.ENV_VAR_MAPPED_FROM_ANOTHER = undefined

    await teardown()
  })

  it("it should handle a quoted environment variable", () => {
    assert.equal(json.ENV_VAR_QUOTED, ENV_VAR_QUOTED)
  })

  it("it should handle an unquoted environment variable", () => {
    assert.equal(json.ENV_VAR_UNQUOTED, ENV_VAR_UNQUOTED)
  })

  it("it should handle a mapped environment variable", () => {
    assert.equal(json.ENV_VAR_MAPPED, ENV_VAR_MAPPED)
  })
})
