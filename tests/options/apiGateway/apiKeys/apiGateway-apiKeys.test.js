import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../../_testHelpers/index.js'
import { BASE_URL } from '../../../config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('apiGateway apiKeys tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should ...',
      expected: {
        body: {
          message: 'Forbidden',
        },
        statusCode: 403,
      },
      path: '/dev/foo',
    },

    {
      description: 'should ...',
      expected: {
        body: {
          foo: 'bar',
        },
        statusCode: 200,
      },
      headers: {
        'x-api-key': 'fooValuefooValuefooValue',
      },
      path: '/dev/foo',
    },

    {
      description: 'should ...',
      expected: {
        body: {
          foo: 'bar',
        },
        statusCode: 200,
      },
      headers: {
        'x-api-key': 'barValuebarValuebarValue',
      },
      path: '/dev/foo',
    },
  ].forEach(({ description, expected, headers, path }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url, {
        headers,
      })
      assert.equal(response.status, expected.statusCode)

      const json = await response.json()
      assert.deepEqual(json, expected.body)
    })
  })
})
