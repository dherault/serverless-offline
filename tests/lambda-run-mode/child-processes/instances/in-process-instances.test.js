import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../../_testHelpers/index.js'
import { BASE_URL } from '../../../config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('run mode with child processes', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  it('should create a new lambda instance', async () => {
    const url = new URL('/dev/foo', BASE_URL)

    const responses = await Promise.all(
      Array.from(Array(10).keys()).map(() => fetch(url)),
    )

    responses.forEach((response) => {
      assert.equal(response.status, 200)
    })

    const jsons = await Promise.all(
      responses.map((response) => response.json()),
    )

    jsons.forEach((json) => {
      assert.deepEqual(json, 1)
    })
  })
})
