import assert from "node:assert"
import generateHapiPath, { generateAlbHapiPath } from "../generateHapiPath.js"

const serverless = {
  service: {
    provider: {
      stage: "dev",
    },
  },
}

describe("generateHapiPath", () => {
  it("should generate url starting with a slash", () => {
    const options = {}
    const result = generateHapiPath("users", options, serverless)

    assert.strictEqual(result[0], "/")
  })

  it("should generate url with the stage prepended", () => {
    const options = {}
    const result = generateHapiPath("users", options, serverless)

    assert.strictEqual(result, "/dev/users")
  })

  it("should not add a second slash when the path already starts with one", () => {
    const result = generateHapiPath("/users", {}, serverless)

    assert.strictEqual(result, "/dev/users")
  })

  describe("when a prefix option is set", () => {
    it("the url should add the prefix", () => {
      const options = {
        prefix: "some-prefix",
      }
      const result = generateHapiPath("users", options, serverless)

      assert.strictEqual(result, "/some-prefix/dev/users")
    })
  })

  describe("when the noPrependStageInUrl option is set", () => {
    it("the url should omit the stage", () => {
      const options = {
        noPrependStageInUrl: true,
      }
      const result = generateHapiPath("users", options, serverless)

      assert.strictEqual(result, "/users")
    })

    it("the root path should stay a single slash", () => {
      const options = {
        noPrependStageInUrl: true,
      }
      const result = generateHapiPath("/", options, serverless)

      assert.strictEqual(result, "/")
    })
  })

  it("the stage from options should override stage from serverless config", () => {
    const options = {
      stage: "prod",
    }
    const result = generateHapiPath("users", options, serverless)

    assert.strictEqual(result, "/prod/users")
  })

  it("should strip a trailing slash", () => {
    const result = generateHapiPath("users/", {}, serverless)

    assert.strictEqual(result, "/dev/users")
  })

  it("should keep path parameters untouched", () => {
    const result = generateHapiPath("users/{id}", {}, serverless)

    assert.strictEqual(result, "/dev/users/{id}")
  })

  it("should translate greedy path parameters to the hapi wildcard syntax", () => {
    const result = generateHapiPath("users/{proxy+}", {}, serverless)

    assert.strictEqual(result, "/dev/users/{proxy*}")
  })

  it("should translate every greedy path parameter", () => {
    const result = generateHapiPath("{a+}/{b+}", {}, serverless)

    assert.strictEqual(result, "/dev/{a*}/{b*}")
  })
})

describe("generateAlbHapiPath", () => {
  it("should generate url starting with a slash", () => {
    const result = generateAlbHapiPath("users", {}, serverless)

    assert.strictEqual(result, "/dev/users")
  })

  it("should add the prefix and the stage", () => {
    const result = generateAlbHapiPath(
      "users",
      { prefix: "some-prefix" },
      serverless,
    )

    assert.strictEqual(result, "/some-prefix/dev/users")
  })

  it("should omit the stage when noPrependStageInUrl is set", () => {
    const result = generateAlbHapiPath(
      "users",
      { noPrependStageInUrl: true },
      serverless,
    )

    assert.strictEqual(result, "/users")
  })

  it("should strip a trailing slash by default", () => {
    const result = generateAlbHapiPath("users/", {}, serverless)

    assert.strictEqual(result, "/dev/users")
  })

  describe("when the noStripTrailingSlashInUrl option is set", () => {
    it("should keep the trailing slash", () => {
      const result = generateAlbHapiPath(
        "users/",
        { noStripTrailingSlashInUrl: true },
        serverless,
      )

      assert.strictEqual(result, "/dev/users/")
    })
  })

  it("should convert a wildcard into a numbered path parameter", () => {
    const result = generateAlbHapiPath("users/*", {}, serverless)

    assert.strictEqual(result, "/dev/users/{0}")
  })

  it("should number multiple wildcards in order", () => {
    const result = generateAlbHapiPath("*/users/*", {}, serverless)

    assert.strictEqual(result, "/dev/{0}/users/{1}")
  })
})
