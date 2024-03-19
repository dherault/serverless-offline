import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"

describe("uncategorized tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  // issue: https://github.com/dherault/serverless-offline/issues/756
  // PR: https://github.com/dherault/serverless-offline/pull/757
  it("Uncategorized 1", async () => {
    const url = new URL("/dev/uncategorized-1", BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    assert.deepEqual(json, { foo: "bar" })
  })

  // issue: https://github.com/dherault/serverless-offline/issues/758
  // PR: https://github.com/dherault/serverless-offline/pull/759
  it("Uncategorized 2", async () => {
    const url = new URL("/dev/uncategorized-2", BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    assert.deepEqual(json, { foo: "bar" })
  })
})
