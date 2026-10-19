import assert from "node:assert"
import { createRequire } from "node:module"
import ServerlessOffline from "../index.js"

const customRequire = createRequire(import.meta.url)

describe("commonjs entry point", () => {
  it("should resolve to the plugin class when required", async () => {
    // node.js versions without require(esm) support receive a promise
    const result = await customRequire("serverless-offline")

    assert.equal(result, ServerlessOffline)
  })
})
