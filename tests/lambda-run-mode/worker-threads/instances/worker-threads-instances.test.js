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

describe('run mode with worker threads tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  it('should create a new lambda instance', async () => {
    const url = joinUrl(env.TEST_BASE_URL, 'dev/foo')

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
    const url = joinUrl(env.TEST_BASE_URL, 'dev/foo')

    const a = []

    // eslint-disable-next-line no-unused-vars
    for (const _ of Array(5)) {
      // eslint-disable-next-line no-await-in-loop
      await setTimeoutPromise(2000)
      a.push(fetch(url))
    }

    const responses = await Promise.all(a)

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
