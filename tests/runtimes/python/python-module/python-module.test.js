import assert from 'node:assert'
import { platform } from 'node:os'
import { env } from 'node:process'
import { join } from 'desm'
import { setup, teardown } from '../../../_testHelpers/index.js'
import { BASE_URL } from '../../../config.js'

describe('Python 3 tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should work with python in a module',
      expected: {
        message: 'Hello Python Module!',
      },
      path: '/dev/hello',
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async function it() {
      // Could not find 'Python 3' executable, skipping 'Python' tests.
      if (!env.PYTHON3_DETECTED || platform() === 'darwin') {
        this.skip()
      }

      const url = new URL(path, BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
