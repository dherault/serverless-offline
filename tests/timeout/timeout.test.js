import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../_testHelpers/index.js"
import { BASE_URL } from "../config.js"

describe("handler payload tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: "http code 504 after timeout",
      // expected: 'foo',
      path: "/dev/timeout-handler",
      status: 504,
    },
  ].forEach(({ description, path, status }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url)
      assert.equal(response.status, status)
    })
  })

  // regression test for https://github.com/dherault/serverless-offline/issues/1896
  it("recovers after a timeout: a later invocation succeeds", async () => {
    const slowUrl = new URL(
      "/dev/conditional-timeout-handler?slow=true",
      BASE_URL,
    )
    const fastUrl = new URL(
      "/dev/conditional-timeout-handler?slow=false",
      BASE_URL,
    )

    // first invocation exceeds the timeout (the worker thread is terminated)
    const slowResponse = await fetch(slowUrl)
    assert.equal(slowResponse.status, 504)

    // the next invocation must get a fresh worker and return immediately,
    // instead of reusing the terminated one and hanging until it 504s too
    const fastResponse = await fetch(fastUrl)
    assert.equal(fastResponse.status, 200)
  })
})
