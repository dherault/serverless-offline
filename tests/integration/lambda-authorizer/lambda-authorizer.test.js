import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const validToken = 'validToken'
const invalidToken = 'invalidToken'

describe('Lambda authorizer simple response', function desc() {
  beforeEach(() =>
    setup({
      args: ['--ignoreJWTSignature'],
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'Authorizer using simple response for authorized request',
      expected: {
        status: 'authorized',
      },
      path: '/user',
      status: 200,
      token: validToken,
    },
    {
      description: 'Authorizer using simple response for unauthorized request',
      expected: {
        error: 'Unauthorized',
        message: 'Unauthorized',
        statusCode: 401,
      },
      path: '/user',
      status: 401,
      token: invalidToken,
    },
  ].forEach(({ description, expected, token, path, status }) => {
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)
      const options = {
        headers: {
          Authorization: token,
        },
      }

      const response = await fetch(url, options)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(json, expected)
    })
  })
})
