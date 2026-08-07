import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"

function albUrl(path) {
  const url = new URL(path, BASE_URL)
  url.port = url.port ? "3003" : url.port

  return url
}

describe("ALB Conditions Tests", function desc() {
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
        "should route to the function whose header condition matches",
      expected: { functionKey: "createOrder" },
      headers: { "x-function": "CREATE" },
      path: "/dev/order",
      status: 200,
    },
    {
      description:
        "should route to the other function sharing the path and the method",
      expected: { functionKey: "cancelOrder" },
      headers: { "x-function": "CANCEL" },
      path: "/dev/order",
      status: 200,
    },
    {
      description: "should match header values case insensitively",
      expected: { functionKey: "cancelOrder" },
      headers: { "X-Function": "cancel" },
      path: "/dev/order",
      status: 200,
    },
    {
      description: "should return 404 when no rule matches the conditions",
      expected: { message: "Not Found" },
      headers: { "x-function": "DELETE" },
      path: "/dev/order",
      status: 404,
    },
    {
      description: "should return 404 when the header is missing",
      expected: { message: "Not Found" },
      headers: {},
      path: "/dev/order",
      status: 404,
    },
  ].forEach(({ description, expected, headers, path, status }) => {
    it(description, async () => {
      const response = await fetch(albUrl(path), {
        headers,
        method: "POST",
      })

      assert.equal(response.status, status)
      assert.deepEqual(await response.json(), expected)
    })
  })

  //
  ;[
    {
      description: "should route on a query string condition",
      expected: { functionKey: "archivedBasket" },
      path: "/dev/basket?archived=true",
    },
    {
      description:
        "should fall through to the next rule when the query string does not match",
      expected: { functionKey: "basket" },
      path: "/dev/basket?archived=false",
    },
    {
      description:
        "should fall through to the rule without conditions when there is no query string",
      expected: { functionKey: "basket" },
      path: "/dev/basket",
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async () => {
      const response = await fetch(albUrl(path))

      assert.equal(response.status, 200)
      assert.deepEqual(await response.json(), expected)
    })
  })
})
