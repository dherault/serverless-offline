import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../_testHelpers/index.js'
import { BASE_URL } from '../config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('handler payload tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'http code 504 after timeout',
      // expected: 'foo',
      path: '/dev/timeout-handler',
      status: 504,
    },
  ].forEach(({ description, path, status }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url)
      assert.equal(response.status, status)
    })
  })
})
