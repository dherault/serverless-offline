import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"

describe("run mode with worker threads and --localEnvironment flag", function desc() {
  beforeEach(() =>
    setup({
      env: {
        AWS_ACCESS_KEY_ID: "SHOULD_BE_SHARED",
        AWS_FOOBAR: "SHOULD_BE_SHARED",
        ENV_SHOULD_BE_SHARED: "ENV_SHOULD_BE_SHARED",
      },
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  it("should not share env", async () => {
    const url = new URL("/dev/foo", BASE_URL)

    const response = await fetch(url)
    assert.equal(response.status, 200)

    const { env } = await response.json()

    assert.equal(env.AWS_ACCESS_KEY_ID, "SHOULD_BE_SHARED")
    assert.equal(env.AWS_FOOBAR, "SHOULD_BE_SHARED")
    assert.equal(env.ENV_FUNCTIONS_FOO, "ENV_FUNCTIONS_BAR")
    assert.equal(env.ENV_PROVIDER_FOO, "ENV_PROVIDER_BAR")
    assert.equal(env.ENV_SHOULD_BE_SHARED, "ENV_SHOULD_BE_SHARED")
    assert.equal(env.IS_OFFLINE, "true")
  })
})
