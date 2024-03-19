import assert from "node:assert"
import { Buffer } from "node:buffer"
import { readFile } from "node:fs/promises"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"
import installNpmModules from "../../../installNpmModules.js"

const { stringify } = JSON

describe("@vendia/serverless-express", function desc() {
  before(async () => {
    await installNpmModules(join(import.meta.url, "app"))
  })

  beforeEach(async () => {
    await setup({
      servicePath: join(import.meta.url, "app"),
    })
  })

  afterEach(() => teardown())

  it("get", async () => {
    const url = new URL("/dev/foo", BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {
      foo: "bar",
    }

    assert.equal(response.status, 200)
    assert.deepEqual(json, expected)
  })

  it("get with param, 404", async () => {
    const url = new URL("/dev/users/1", BASE_URL)
    const response = await fetch(url)
    const json = await response.json()

    const expected = {}

    assert.equal(response.status, 404)
    assert.deepEqual(json, expected)
  })

  it("post", async () => {
    const url = new URL("/dev/users", BASE_URL)
    const response = await fetch(url, {
      body: stringify({
        foo: "bar",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })

    const json = await response.json()

    const expected = {
      foo: "bar",
    }

    assert.equal(response.status, 201)
    assert.deepEqual(json, expected)
  })

  // TODO FIXME
  // does not run in AWS
  it.skip("get, image", async () => {
    const url = new URL("/dev/image", BASE_URL)
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const image = await readFile(join(import.meta.url, "app/src/sam-logo.png"))

    assert.equal(response.status, 200)
    assert.deepEqual(buffer, image)
  })
})
