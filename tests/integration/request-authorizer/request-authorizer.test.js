// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../../config.js'
import { setup, teardown } from '../../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('request authorizer tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: '...',
      expected: {
        status: 'authorized',
      },
      options: {
        headers: {
          Authorization: 'Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a',
        },
      },
      path: '/user',
      status: 200,
    },

    {
      description: '...',
      expected: {
        error: 'Forbidden',
        message: 'User is not authorized to access this resource',
        statusCode: 403,
      },
      options: {
        headers: {
          Authorization: 'Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b',
        },
      },
      path: '/user',
      status: 403,
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
