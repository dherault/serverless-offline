import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"

describe("run mode with worker threads", function desc() {
  beforeEach(() =>
    setup({
      env: {
        SHOULD_BE_SHARED: "SHOULD_BE_SHARED",
      },
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  it("should share env", async () => {
    const url = new URL("/dev/foo", BASE_URL)

    const response = await fetch(url)
    assert.equal(response.status, 200)

    const json = await response.json()
    assert.equal(json.env.ENV_FUNCTIONS_FOO, "ENV_FUNCTIONS_BAR")
    assert.equal(json.env.ENV_PROVIDER_FOO, "ENV_PROVIDER_BAR")
    assert.equal(json.env.IS_OFFLINE, "true")
    assert.equal(json.env.SHOULD_BE_SHARED, "SHOULD_BE_SHARED")
  })
})
