import assert from "node:assert"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"
import installYarnModules from "../../installYarnModules.js"

describe("serverless-esbuild", function desc() {
  before(async () => {
    await installYarnModules(join(import.meta.url, "app"))
  })

  beforeEach(async () => {
    await setup({
      servicePath: join(import.meta.url, "app"),
    })
  })

  afterEach(() => teardown())

  it("should work with serverless-yarn-pnp", async () => {
    const url = new URL("/dev/yarn-pnp", BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      hello: "serverless-yarn-pnp!",
    }

    assert.deepEqual(json, expected)
  })
})
