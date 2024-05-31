import assert from "node:assert"
import { join } from "desm"
import { BASE_URL } from "../../config.js"
import { setup, teardown } from "../../_testHelpers/index.js"

describe("noPrependStageInUrl option", function desc() {
  beforeEach(() =>
    setup({
      args: ["--noPrependStageInUrl"],
      servicePath: join(import.meta.url, "src"),
    }),
  )

  afterEach(() => teardown())

  describe("when --noPrependStageInUrl is used", () => {
    it("it should return a payload", async () => {
      const url = new URL("/hello", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: "bar",
      })
    })

    it("it should return a payload with no path", async () => {
      const url = new URL("/", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: "bar",
      })
    })

    it("it should return a payload when accessed with trailing slash", async () => {
      const url = new URL("/hello/", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: "bar",
      })
    })

    it("when --noPrependStageInUrl is used it should return a 404", async () => {
      const url = new URL("/dev/hello", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.equal(json.statusCode, 404)
    })
  })
})

describe("prefix option", function desc() {
  beforeEach(() =>
    setup({
      args: ["--prefix", "someprefix"],
      servicePath: join(import.meta.url, "src"),
    }),
  )

  afterEach(() => teardown())

  describe("when the --prefix option is used", () => {
    it("the prefixed path should return a payload", async () => {
      const url = new URL("/someprefix/dev/hello", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: "bar",
      })
    })

    it("the prefixed path should return a payload when accessed with trailing slash", async () => {
      const url = new URL("/someprefix/dev/hello/", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: "bar",
      })
    })

    it("the prefixed path should return a payload with no path", async () => {
      const url = new URL("/someprefix/dev", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: "bar",
      })
    })

    it("the prefixed path should return a payload with no path and trailing slash", async () => {
      const url = new URL("/someprefix/dev/", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: "bar",
      })
    })
  })
})

describe("noPrependStageInUrl option with prefix option", function desc() {
  beforeEach(() =>
    setup({
      args: ["--noPrependStageInUrl", "--prefix", "someprefix"],
      servicePath: join(import.meta.url, "src"),
    }),
  )

  afterEach(() => teardown())

  describe("when --noPrependStageInUrl and --prefix is used", () => {
    it("it should return a payload", async () => {
      const url = new URL("/someprefix/hello", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: "bar",
      })
    })

    it("it should return a payload with no path", async () => {
      const url = new URL("/someprefix", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: "bar",
      })
    })

    it("it should return a payload with no path and trailing slash", async () => {
      const url = new URL("/someprefix/", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: "bar",
      })
    })

    it("it should return a payload when accessed with trailing slash", async () => {
      const url = new URL("/someprefix/hello/", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: "bar",
      })
    })

    it("when --noPrependStageInUrl is used it should return a 404", async () => {
      const url = new URL("/someprefix/dev/hello", BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.equal(json.statusCode, 404)
    })
  })
})
