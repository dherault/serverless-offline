import { config, Lambda } from 'aws-sdk'
import { platform } from 'os'
import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

jest.setTimeout(60000)

const { stringify } = JSON

// skipping 'Python 3' tests on Windows for now.
// Could not find 'Python 3' executable, skipping 'Python' tests.
const _describe =
  process.env.PYTHON3_DETECTED && platform() !== 'win32'
    ? describe
    : describe.skip

_describe('Python 3 tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  //
  ;[
    {
      description: 'should work with python 3',
      expected: {
        message: 'Hello Python 3!',
      },
      path: '/dev/hello',
    },
  ].forEach(({ description, expected, path }) => {
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      expect(json).toEqual(expected)
    })
  })

  config.update({
    accessKeyId: 'ABC',
    secretAccessKey: 'SECRET',
    region: 'us-east-1',
  })

  const lambda = new Lambda({
    apiVersion: '2015-03-31',
    endpoint: 'http://localhost:3002',
  })

  // lambda invocation with some cases.
  ;[
    {
      description: 'should work with python 3 with empty string',
      expected: { Payload: stringify(''), StatusCode: 200 },
      functionName: 'helloReturnEmptyString',
    },
    {
      description: 'should work with python 3 without return value',
      expected: { Payload: '', StatusCode: 200 },
      functionName: 'helloReturnNothing',
    },
    {
      description: 'should work with python 3 raising exception',
      expected: { Payload: stringify('hello-error'), StatusCode: 200 },
      functionName: 'helloException',
    },
  ].forEach(({ description, expected, functionName }) => {
    test(description, async () => {
      const params = {
        // ClientContext: undefined,
        FunctionName: `python-3-tests-dev-${functionName}`,
        InvocationType: 'RequestResponse',
        // Payload: undefined,
      }

      const response = await lambda.invoke(params).promise()

      expect(response).toEqual(expected)
    })
  })
})
