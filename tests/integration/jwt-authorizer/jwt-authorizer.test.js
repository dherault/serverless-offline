// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import crypto from 'crypto'
import { resolve } from 'path'
import fetch from 'node-fetch'
import jsonwebtoken from 'jsonwebtoken'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(30000)

const secret = crypto.randomBytes(256)

const jwtSignOptions = {
  algorithm: 'HS256',
}

const baseJWT = {
  sub: '584a5479-8943-45cd-8505-14cf3ccd92fa',
  'cognito:groups': ['testGroup1'],
  iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_notreal',
  version: 2,
  client_id: 'ZjE4ZGVlYzUtMDU1Ni00ZWM4LThkMDAtYTlkMmIzNWE4NTNj',
  event_id: '5d6f052a-0341-4da6-9c50-26426265c459',
  token_use: 'access',
  scope: 'profile email',
  auth_time: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 5000,
  iat: Math.floor(Date.now() / 1000),
  jti: '9a2f8ae5-9a8d-4d88-be36-bc0a1e042718',
  username: '805ac36b-cf7a-42e0-a9c3-029e12d724b2',
}

const expiredJWT = {
  ...baseJWT,
  exp: Math.floor(Date.now() / 1000) - 2000,
}

const wrongIssuerUrl = {
  ...baseJWT,
  iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-2_reallynotreal',
}

const wrongClientId = {
  ...baseJWT,
  client_id: 'wrong client',
}

const wrongAudience = {
  ...baseJWT,
  aud: 'wrong aud',
}
delete wrongAudience.client_id

const correctAudience = {
  ...baseJWT,
  aud: baseJWT.client_id,
}
delete correctAudience.client_id

const multipleCorrectAudience = {
  ...correctAudience,
  aud: [baseJWT.client_id, 'https://api.example.com/'],
}

const noScopes = {
  ...baseJWT,
}
delete noScopes.scope

describe('jwt authorizer tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
      args: ['--ignoreJWTSignature'],
    }),
  )

  // cleanup
  afterAll(() => teardown())

  //
  ;[
    {
      description: 'Valid JWT',
      expected: {
        status: 'authorized',
        requestContext: {
          claims: baseJWT,
          scopes: ['profile', 'email'],
        },
      },
      jwt: baseJWT,
      path: '/dev/user1',
      status: 200,
    },
    {
      description: 'Valid JWT with audience',
      expected: {
        status: 'authorized',
        requestContext: {
          claims: correctAudience,
          scopes: ['profile', 'email'],
        },
      },
      jwt: correctAudience,
      path: '/dev/user1',
      status: 200,
    },

    {
      description:
        'Valid JWT with multiple audience values (one matching single configured audience)',
      expected: {
        status: 'authorized',
        requestContext: {
          claims: multipleCorrectAudience,
          scopes: ['profile', 'email'],
        },
      },
      jwt: multipleCorrectAudience,
      path: '/dev/user1',
      status: 200,
    },

    {
      description: 'Valid JWT with scopes',
      expected: {
        status: 'authorized',
        requestContext: {
          claims: baseJWT,
          scopes: ['profile', 'email'],
        },
      },
      jwt: baseJWT,
      path: '/dev/user2',
      status: 200,
    },
    {
      description: 'Expired JWT',
      expected: {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'JWT Token expired',
      },
      jwt: expiredJWT,
      path: '/dev/user1',
      status: 401,
    },
    {
      description: 'Wrong Issuer Url',
      expected: {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'JWT Token not from correct issuer url',
      },
      jwt: wrongIssuerUrl,
      path: '/dev/user1',
      status: 401,
    },
    {
      description: 'Wrong Client Id',
      expected: {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'JWT Token does not contain correct audience',
      },
      jwt: wrongClientId,
      path: '/dev/user1',
      status: 401,
    },
    {
      description: 'Wrong Audience',
      expected: {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'JWT Token does not contain correct audience',
      },
      jwt: wrongAudience,
      path: '/dev/user1',
      status: 401,
    },
    {
      description: 'Missing Scopes',
      expected: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'JWT Token missing valid scope',
      },
      jwt: noScopes,
      path: '/dev/user2',
      status: 403,
    },
  ].forEach(({ description, expected, jwt, path, status }) => {
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)
      const signedJwt = jsonwebtoken.sign(jwt, secret, jwtSignOptions)
      const options = {
        headers: {
          Authorization: `Bearer ${signedJwt}`,
        },
      }

      const response = await fetch(url, options)
      expect(response.status).toEqual(status)

      const json = await response.json()
      expect(json).toEqual(expected)
    })
  })
})
