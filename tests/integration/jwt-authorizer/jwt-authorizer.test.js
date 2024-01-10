// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import assert from "node:assert"
import crypto from "node:crypto"
import { join } from "desm"
import { SignJWT } from "jose"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"

const { now } = Date
const { floor } = Math

const secret = crypto.randomBytes(256)

const baseJWT = {
  auth_time: floor(now() / 1000),
  client_id: "ZjE4ZGVlYzUtMDU1Ni00ZWM4LThkMDAtYTlkMmIzNWE4NTNj",
  "cognito:groups": ["testGroup1"],
  event_id: "5d6f052a-0341-4da6-9c50-26426265c459",
  exp: floor(now() / 1000) + 5000,
  iat: floor(now() / 1000),
  iss: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_notreal",
  jti: "9a2f8ae5-9a8d-4d88-be36-bc0a1e042718",
  scope: "profile email",
  sub: "584a5479-8943-45cd-8505-14cf3ccd92fa",
  token_use: "access",
  username: "805ac36b-cf7a-42e0-a9c3-029e12d724b2",
  version: 2,
}

const expiredJWT = {
  ...baseJWT,
  exp: floor(now() / 1000) - 2000,
}

const wrongIssuerUrl = {
  ...baseJWT,
  iss: "https://cognito-idp.us-east-1.amazonaws.com/us-east-2_reallynotreal",
}

const wrongClientId = {
  ...baseJWT,
  client_id: "wrong client",
}

const wrongAudience = {
  ...baseJWT,
  aud: "wrong aud",
}
delete wrongAudience.client_id

const correctAudience = {
  ...baseJWT,
  aud: baseJWT.client_id,
}
delete correctAudience.client_id

const correctAudienceInArray = {
  ...correctAudience,
  aud: [baseJWT.client_id],
}

const multipleCorrectAudience = {
  ...correctAudience,
  aud: [baseJWT.client_id, "https://api.example.com/"],
}

const noScopes = {
  ...baseJWT,
}
delete noScopes.scope

describe("jwt authorizer tests", function desc() {
  beforeEach(() =>
    setup({
      args: ["--ignoreJWTSignature"],
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: "Valid JWT",
      expected: {
        requestContext: {
          claims: baseJWT,
          scopes: ["profile", "email"],
        },
        status: "authorized",
      },
      jwt: baseJWT,
      path: "/user1",
      status: 200,
    },
    {
      description: "Valid JWT with audience",
      expected: {
        requestContext: {
          claims: correctAudience,
          scopes: ["profile", "email"],
        },
        status: "authorized",
      },
      jwt: correctAudience,
      path: "/user1",
      status: 200,
    },
    {
      description: "Valid JWT with audience in array",
      expected: {
        requestContext: {
          claims: correctAudienceInArray,
          scopes: ["profile", "email"],
        },
        status: "authorized",
      },
      jwt: correctAudienceInArray,
      path: "/user1",
      status: 200,
    },
    {
      description:
        "Valid JWT with multiple audience values (one matching single configured audience)",
      expected: {
        requestContext: {
          claims: multipleCorrectAudience,
          scopes: ["profile", "email"],
        },
        status: "authorized",
      },
      jwt: multipleCorrectAudience,
      path: "/user1",
      status: 200,
    },
    {
      description: "Valid JWT with scopes",
      expected: {
        requestContext: {
          claims: baseJWT,
          scopes: ["profile", "email"],
        },
        status: "authorized",
      },
      jwt: baseJWT,
      path: "/user2",
      status: 200,
    },
    {
      description: "Expired JWT",
      expected: {
        error: "Unauthorized",
        message: "JWT Token expired",
        statusCode: 401,
      },
      jwt: expiredJWT,
      path: "/user1",
      status: 401,
    },
    {
      description: "Wrong Issuer Url",
      expected: {
        error: "Unauthorized",
        message: "JWT Token not from correct issuer url",
        statusCode: 401,
      },
      jwt: wrongIssuerUrl,
      path: "/user1",
      status: 401,
    },
    {
      description: "Wrong Client Id",
      expected: {
        error: "Unauthorized",
        message: "JWT Token does not contain correct audience",
        statusCode: 401,
      },
      jwt: wrongClientId,
      path: "/user1",
      status: 401,
    },
    {
      description: "Wrong Audience",
      expected: {
        error: "Unauthorized",
        message: "JWT Token does not contain correct audience",
        statusCode: 401,
      },
      jwt: wrongAudience,
      path: "/user1",
      status: 401,
    },
    {
      description: "Missing Scopes",
      expected: {
        error: "Forbidden",
        message: "JWT Token missing valid scope",
        statusCode: 403,
      },
      jwt: noScopes,
      path: "/user2",
      status: 403,
    },
  ].forEach(({ description, expected, jwt, path, status }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)
      const signedJwt = await new SignJWT(jwt)
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret)
      const options = {
        headers: {
          Authorization: `Bearer ${signedJwt}`,
        },
      }

      const response = await fetch(url, options)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(json, expected)
    })
  })
})
