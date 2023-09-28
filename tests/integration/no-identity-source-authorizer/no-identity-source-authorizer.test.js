import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../../config.js'
import { setup, teardown } from '../../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('no identity source authorizer tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should respond with 200',
      expected: {
        message: 'hello',
      },
      options: {
        headers: {
          Authorization: 'Bearer 4674cc54-bd05-11e7-abc4-cec278b6b50a',
        },
      },
      path: '/dev/hello',
      status: 200,
    },

    {
      description:
        'should respond with 200 if request has no authorization header',
      expected: {
        message: 'hello',
      },
      path: '/dev/hello',
      status: 200,
    },
  ].forEach(({ description, expected, options, path, status }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url, options)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(json, expected)
    })
  })
})
