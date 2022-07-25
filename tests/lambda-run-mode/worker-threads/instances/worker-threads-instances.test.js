import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../../../config.js'
import { setup, teardown } from '../../../integration/_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('run mode with worker threads', function desc() {
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

  it('should re-use existing lambda instance when idle', async () => {
    const url = new URL('/dev/foo', BASE_URL)

    // eslint-disable-next-line no-unused-vars
    for (const i of Array(10).keys()) {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(url)
      // eslint-disable-next-line no-await-in-loop
      const json = await response.json()

      assert.equal(response.status, 200)
      assert.deepEqual(json, i + 1)
    }
  })
})
