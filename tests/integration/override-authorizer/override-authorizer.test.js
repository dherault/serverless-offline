import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

const { stringify } = JSON

jest.setTimeout(30000)

const envAuthorizer = {
  iam: {
    cognitoUser: {
      amr: ['unauthenticated'],
      identityId: 'env_identity_id',
    },
  },
}

const headerAuthorizer = {
  iam: {
    cognitoUser: {
      amr: ['unauthenticated'],
      identityId: 'header_identity_id',
    },
  },
}

describe('override authorizer tests', () => {
  // init
  beforeAll(async () => {
    env.AUTHORIZER = stringify(envAuthorizer)
    await setup({
      servicePath: resolve(__dirname),
    })
  })

  // cleanup
  afterAll(async () => {
    env.AUTHORIZER = undefined
    await teardown()
  })

  //
  ;[
    {
      description: 'HTTP API Falls back on env variable',
      req: {
        path: '/gateway_v2_http_api',
        headers: {},
      },
      res: {
        status: 200,
        body: envAuthorizer,
      },
    },
    {
      description: 'REST API Falls back on env variable',
      req: {
        path: '/dev/gateway_v1_rest_api',
        headers: {},
      },
      res: {
        status: 200,
        body: envAuthorizer,
      },
    },
    {
      description: 'HTTP API uses override header',
      req: {
        path: '/gateway_v2_http_api',
        headers: {
          'sls-offline-authorizer-override': stringify(headerAuthorizer),
        },
      },
      res: {
        status: 200,
        body: headerAuthorizer,
      },
    },
    {
      description: 'HTTP API uses override header',
      req: {
        path: '/dev/gateway_v1_rest_api',
        headers: {
          'sls-offline-authorizer-override': stringify(headerAuthorizer),
        },
      },
      res: {
        status: 200,
        body: headerAuthorizer,
      },
    },
  ].forEach(({ description, req, res }) => {
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, req.path)
      const options = {
        headers: req.headers,
      }

      const response = await fetch(url, options)
      expect(response.status).toEqual(res.status)

      const json = await response.json()
      expect(json).toEqual(res.body)
    })
  })
})
