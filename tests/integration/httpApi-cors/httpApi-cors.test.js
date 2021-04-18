// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(30000)

describe('HttpApi Cors Tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  test('Fetch OPTIONS with valid origin', async () => {
    const url = joinUrl(TEST_BASE_URL, '/dev/user')
    const options = {
      method: 'OPTIONS',
      headers: {
        origin: 'http://www.mytestapp.com',
        'access-control-request-headers': 'authorization,content-type',
        'access-control-request-method': 'GET',
      },
    }

    const response = await fetch(url, options)
    expect(response.status).toEqual(204)

    expect(response.headers.get('access-control-allow-origin')).toEqual(
      'http://www.mytestapp.com',
    )
    expect(response.headers.get('access-control-allow-credentials')).toEqual(
      'true',
    )
    expect(response.headers.get('access-control-max-age')).toEqual('60')
    expect(response.headers.get('access-control-expose-headers')).toEqual(
      'status,origin',
    )
    expect(response.headers.get('access-control-allow-methods')).toEqual(
      'GET,POST',
    )
    expect(response.headers.get('access-control-allow-headers')).toEqual(
      'authorization,content-type',
    )
  })

  test('Fetch OPTIONS with invalid origin', async () => {
    const url = joinUrl(TEST_BASE_URL, '/dev/user')
    const options = {
      method: 'OPTIONS',
      headers: {
        origin: 'http://www.wrongapp.com',
        'access-control-request-headers': 'authorization,content-type',
        'access-control-request-method': 'GET',
      },
    }

    const response = await fetch(url, options)
    expect(response.status).toEqual(204)
    expect(response.headers.get('access-control-allow-origin')).toEqual(null)
  })
})
