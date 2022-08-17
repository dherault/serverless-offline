import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../_testHelpers/index.js'
import { BASE_URL } from '../../config.js'

const { stringify } = JSON

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('lambda integration tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should return JSON',
      expected: {
        foo: 'bar',
      },
      path: '/dev/lambda-integration-json',
      status: 200,
    },

    {
      description: 'should return stringified JSON',
      expected: stringify({
        foo: 'bar',
      }),
      path: '/dev/lambda-integration-stringified',
      status: 200,
    },
    {
      description: 'should return operation name from request context',
      expected: {
        operationName: 'getIntegrationWithOperationName',
      },
      path: '/dev/lambda-integration-with-operation-name',
      status: 200,
    },
  ].forEach(({ description, expected, path, status }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(json, expected)
    })
  })
})
