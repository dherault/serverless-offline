import assert from "node:assert"
import { env } from "node:process"
import { join } from "desm"
import { setup, teardown } from "../../_testHelpers/index.js"
import { BASE_URL } from "../../config.js"

const { stringify } = JSON

const envAuthorizer = {
  iam: {
    cognitoUser: {
      amr: ["unauthenticated"],
      identityId: "env_identity_id",
    },
  },
}

const headerAuthorizer = {
  iam: {
    cognitoUser: {
      amr: ["unauthenticated"],
      identityId: "header_identity_id",
    },
  },
}

describe("override authorizer tests", function desc() {
  beforeEach(async () => {
    env.AUTHORIZER = stringify(envAuthorizer)

    await setup({
      servicePath: join(import.meta.url),
    })
  })

  afterEach(async () => {
    env.AUTHORIZER = undefined
    await teardown()
  })

  //
  ;[
    {
      description: "HTTP API Falls back on env variable",
      req: {
        headers: {},
        path: "/gateway_v2_http_api",
      },
      res: {
        body: envAuthorizer,
        status: 200,
      },
    },
    {
      description: "REST API Falls back on env variable",
      req: {
        headers: {},
        path: "/dev/gateway_v1_rest_api",
      },
      res: {
        body: envAuthorizer,
        status: 200,
      },
    },
    {
      description: "HTTP API uses override header",
      req: {
        headers: {
          "sls-offline-authorizer-override": stringify(headerAuthorizer),
        },
        path: "/gateway_v2_http_api",
      },
      res: {
        body: headerAuthorizer,
        status: 200,
      },
    },
    {
      description: "HTTP API uses override header",
      req: {
        headers: {
          "sls-offline-authorizer-override": stringify(headerAuthorizer),
        },
        path: "/dev/gateway_v1_rest_api",
      },
      res: {
        body: headerAuthorizer,
        status: 200,
      },
    },
  ].forEach(({ description, req, res }) => {
    it(description, async () => {
      const url = new URL(req.path, BASE_URL)
      const options = {
        headers: req.headers,
      }

      const response = await fetch(url, options)
      assert.equal(response.status, res.status)

      const json = await response.json()
      assert.deepEqual(json, res.body)
    })
  })
})
