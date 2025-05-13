import assert from "node:assert"
import { platform } from "node:os"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"
import installNpmModules from "../../../installNpmModules.js"

describe("@sparticuz/chrome-aws-lambda http", function desc() {
  before(async () => {
    await installNpmModules(join(import.meta.url, "app-http"))
  })

  beforeEach(async () => {
    await setup({
      servicePath: join(import.meta.url, "app-http"),
    })
  })

  afterEach(() => teardown())
  // Not working on macos-latest
  it.skip("@sparticuz/chrome-aws-lambda http tests", async function it() {
    if (platform() !== "darwin") {
      this.skip()
    }

    const url = new URL("/dev/pdf", BASE_URL)

    const response = await fetch(url, {
      headers: new Headers({
        accept: "application/pdf",
      }),
    })

    assert.deepEqual(response.status, 200)

    const blob = await response.blob()

    assert.deepEqual(blob.type, "application/pdf")
  })
})
