import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import {
  joinUrl,
  setup,
  teardown,
} from '../../../integration/_testHelpers/index.js'

const setTimeoutPromise = promisify(setTimeout)

const __dirname = dirname(fileURLToPath(import.meta.url))

describe.only('run mode with worker threads', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  it('should always create a new lambda instance', async () => {
    const url = joinUrl(env.TEST_BASE_URL, 'dev/foo')

    const results = []

    // eslint-disable-next-line no-unused-vars
    for (const _ of Array(100)) {
      // eslint-disable-next-line no-await-in-loop
      await setTimeoutPromise(10)
      results.push(fetch(url))
    }

    const responses = await Promise.all(results)

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
