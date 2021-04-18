// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(30000)

describe('HttpApi Cors Default Tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  test('Fetch OPTIONS with any origin', async () => {
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
    expect(response.headers.get('access-control-allow-methods')).toEqual(
      'OPTIONS,GET,POST,PUT,DELETE,PATCH',
    )
    expect(response.headers.get('access-control-allow-headers')).toEqual(
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
    )
  })
})
