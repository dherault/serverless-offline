// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('authorizer tests', function desc() {
  this.timeout(30000)

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
          Authorization: 'Bearer 4674cc54-bd05-11e7-abc4-cec278b6b50a',
        },
      },
      path: '/dev/user1',
      status: 200,
    },

    {
      description: '...',
      expected: {
        status: 'authorized',
      },
      options: {
        headers: {
          Authorization: 'Bearer 4674cc54-bd05-11e7-abc4-cec278b6b50a',
        },
      },
      path: '/dev/user2',
      status: 200,
    },

    {
      description: 'should return acceptable context object',
      expected: {
        authorizer: {
          booleanKey: 'true',
          numberKey: '1',
          principalId: 'user123',
          stringKey: 'value',
        },
      },
      options: {
        headers: {
          Authorization: 'Bearer recommendedContext',
        },
      },
      path: '/dev/context',
      status: 200,
    },

    {
      description: 'should return stringified context objects',
      expected: {
        authorizer: {
          booleanKey: 'true',
          numberKey: '1',
          principalId: 'user123',
          stringKey: 'value',
        },
      },
      options: {
        headers: {
          Authorization: 'Bearer stringifiedContext',
        },
      },
      path: '/dev/context',
      status: 200,
    },

    {
      description:
        'should return 500 error if context contains forbidden types (array, object)',
      expected: {
        error: 'AuthorizerConfigurationException',
        message:
          'Authorizer response context values must be of type string, number, or boolean',
        statusCode: 500,
      },
      options: {
        headers: {
          Authorization: 'Bearer contextWithObjectKeys',
        },
      },
      path: '/dev/context',
      status: 500,
    },

    {
      description: 'should return 500 error if context is not an object',
      expected: {
        error: 'AuthorizerConfigurationException',
        message: 'Authorizer response context must be an object',
        statusCode: 500,
      },
      options: {
        headers: {
          Authorization: 'Bearer contextNotAnObject',
        },
      },
      path: '/dev/context',
      status: 500,
    },
  ].forEach(({ description, expected, options, path, status }) => {
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)

      const response = await fetch(url, options)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(json, expected)
    })
  })
})
