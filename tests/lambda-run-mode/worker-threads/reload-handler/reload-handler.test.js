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

  it('should always create a new lambda instance', async () => {
    const url = new URL('/dev/foo', BASE_URL)

    // eslint-disable-next-line no-unused-vars
    for (const _ of Array(10)) {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(url)
      // eslint-disable-next-line no-await-in-loop
      const json = await response.json()

      assert.equal(response.status, 200)
      assert.deepEqual(json, 1)
    }
  })
})
