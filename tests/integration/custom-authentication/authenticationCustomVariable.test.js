import assert from "node:assert"
import { join } from "desm"
import { BASE_URL } from "../../config.js"
import { setup, teardown } from "../../_testHelpers/index.js"

describe("custom authentication serverless-offline variable tests", function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description:
        "should return custom payload from injected authentication provider",
      path: "/echo",
      status: 200,
    },
  ].forEach(({ description, path, status }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(
        json.event.requestContext.authorizer.lambda.expected,
        "it works",
      )
    })
  })
})
