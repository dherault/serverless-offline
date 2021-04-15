// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import { resolve } from 'path'
import fetch from 'node-fetch'
import keys from 'ramda/src/keys'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(30000)

const corsHeadersNotSetByDefault = [
  'access-control-allow-origin',
  'access-control-allow-credentials',
  'access-control-expose-headers',
  'access-control-allow-headers',
  'access-control-allow-methods',
  'access-control-max-age',
]

describe('httpApi manual CORS routes', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
      args: [],
    }),
  )

  // cleanup
  afterAll(() => teardown())

  //
  ;[
    {
      description: 'Simple GET should not add cors headers',
      expected: {
        status: 'authorized',
      },
      requestHeaders: {
        Origin: 'http://localhost',
      },
      path: '/dev/get',
      method: 'GET',
      status: 200,
      resHeaderNot: corsHeadersNotSetByDefault,
    },
    {
      description: 'Simple OPTIONS should not add cors headers',
      expected: {
        status: 'authorized',
      },
      requestHeaders: {
        Origin: 'http://localhost',
      },
      path: '/dev/get',
      method: 'OPTIONS',
      status: 200,
      resHeaderNot: corsHeadersNotSetByDefault,
    },
    {
      description: 'Manual CORS preflight should return 404 with no headers',
      expected: 'Not Found',
      path: '/dev/cors404',
      method: 'OPTIONS',
      requestHeaders: {
        origin: 'http://localhost',
        'access-control-request-headers': 'GET',
        'access-control-request-method': 'authorization,content-type',
      },
      status: 404,
      resHeaderNot: corsHeadersNotSetByDefault,
    },
    {
      description: 'Manual CORS preflight should return 401 with no headers',
      expected: 'Unauthorized',
      path: '/dev/cors401',
      method: 'OPTIONS',
      requestHeaders: {
        origin: 'http://localhost',
        'access-control-request-headers': 'POST',
        'access-control-request-method': 'Authorization',
      },
      status: 401,
      resHeaderNot: corsHeadersNotSetByDefault,
      resHeaderHas: {
        'x-sls-should-return-401': '401',
      },
    },
  ].forEach(
    ({
      description,
      expected,
      path,
      method,
      requestHeaders,
      status,
      resHeaderNot,
      resHeaderHas,
    }) => {
      test(description, async () => {
        const url = joinUrl(TEST_BASE_URL, path)
        const options = {
          method,
          headers: requestHeaders,
        }

        const response = await fetch(url, options)
        const resHeaders = response.headers.raw()

        expect(response.status).toEqual(status)

        resHeaderNot.forEach((headerName) =>
          expect(keys(resHeaders)).toEqual(
            expect.not.arrayContaining([headerName]),
          ),
        )
        if (resHeaderHas && keys(resHeaderHas).length > 0) {
          keys(resHeaderHas).forEach((header) => {
            expect(keys(resHeaders)).toEqual(expect.arrayContaining([header]))
            expect([header, resHeaderHas[header]]).toEqual([
              header,
              resHeaders[header].join(', '),
            ])
          })
        }

        if (typeof expected === 'string') {
          const text = await response.text()
          expect(text).toEqual(expected)
        } else {
          const json = await response.json()
          expect(json).toEqual(expected)
        }
      })
    },
  )
})
