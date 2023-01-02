import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { setup, teardown } from '../../../_testHelpers/index.js'
import { BASE_URL } from '../../../config.js'

const setTimeoutPromise = promisify(setTimeout)

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('run mode with in-process', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  it('does not create a new lambda instance, instead uses same', async () => {
    const url = new URL('/dev/foo', BASE_URL)

    const responses = await Promise.all(
      Array.from(new Array(10).keys()).map(() => fetch(url)),
    )

    responses.forEach((response) => {
      assert.equal(response.status, 200)
    })

    const jsons = await Promise.all(
      responses.map((response) => response.json()),
    )

    jsons.forEach((json) => {
      assert.deepEqual(json, 10)
    })
  })

  it('re-uses existing lambda instance when idle', async () => {
    const url = new URL('/dev/foo', BASE_URL)

    const results = []

    // eslint-disable-next-line no-unused-vars
    for (const _ of new Array(5)) {
      // eslint-disable-next-line no-await-in-loop
      await setTimeoutPromise(2000)
      results.push(fetch(url))
    }

    const responses = await Promise.all(results)

    responses.forEach((response) => {
      assert.equal(response.status, 200)
    })

    const jsons = await Promise.all(
      responses.map((response) => response.json()),
    )

    let sort = 0

    jsons.sort().forEach((json) => {
      sort += 1
      assert.deepEqual(json, sort)
    })
  })
})
