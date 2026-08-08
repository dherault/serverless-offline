import assert from "node:assert"
import authJWTSettingsExtractor from "../authJWTSettingsExtractor.js"

const validAuthorizer = {
  audience: ["audience1"],
  identitySource: "$request.header.Authorization",
  issuerUrl: "https://example.com",
}

function providerWith(authorizers) {
  return {
    httpApi: {
      authorizers,
    },
  }
}

describe("authJWTSettingsExtractor", () => {
  describe("when the endpoint has no authorizer", () => {
    it("should return a null authorizer name", () => {
      assert.deepStrictEqual(
        authJWTSettingsExtractor(
          {},
          providerWith({ auth: validAuthorizer }),
          true,
        ),
        { authorizerName: null },
      )
    })
  })

  describe("when the provider declares no httpApi authorizers", () => {
    it("should return a null authorizer name when httpApi is missing", () => {
      assert.deepStrictEqual(
        authJWTSettingsExtractor({ authorizer: { name: "auth" } }, {}, true),
        { authorizerName: null },
      )
    })

    it("should return a null authorizer name when authorizers is missing", () => {
      assert.deepStrictEqual(
        authJWTSettingsExtractor(
          { authorizer: { name: "auth" } },
          { httpApi: {} },
          true,
        ),
        { authorizerName: null },
      )
    })
  })

  describe("when ignoreJWTSignature is not set", () => {
    // NOTE: JWT signatures are not verified yet, so without --ignoreJWTSignature
    // the authorizer is skipped altogether
    it("should return a null authorizer name", () => {
      assert.deepStrictEqual(
        authJWTSettingsExtractor(
          { authorizer: { name: "auth" } },
          providerWith({ auth: validAuthorizer }),
          false,
        ),
        { authorizerName: null },
      )
    })
  })

  describe("with an incomplete authorizer", () => {
    ;[
      {
        authorizers: { auth: validAuthorizer },
        description: "the authorizer is not referenced by name",
        endpointAuthorizer: { type: "jwt" },
      },
      {
        authorizers: { other: validAuthorizer },
        description: "the referenced authorizer does not exist",
        endpointAuthorizer: { name: "auth" },
      },
      {
        authorizers: {
          auth: { ...validAuthorizer, identitySource: undefined },
        },
        description: "the identity source is missing",
        endpointAuthorizer: { name: "auth" },
      },
      {
        authorizers: { auth: { ...validAuthorizer, issuerUrl: undefined } },
        description: "the issuer url is missing",
        endpointAuthorizer: { name: "auth" },
      },
      {
        authorizers: { auth: { ...validAuthorizer, audience: undefined } },
        description: "the audience is missing",
        endpointAuthorizer: { name: "auth" },
      },
      {
        authorizers: { auth: { ...validAuthorizer, audience: [] } },
        description: "the audience is empty",
        endpointAuthorizer: { name: "auth" },
      },
    ].forEach(({ authorizers, description, endpointAuthorizer }) => {
      it(`should flag the auth as unsupported when ${description}`, () => {
        assert.deepStrictEqual(
          authJWTSettingsExtractor(
            { authorizer: endpointAuthorizer },
            providerWith(authorizers),
            true,
          ),
          { unsupportedAuth: true },
        )
      })
    })
  })

  describe("with a complete authorizer", () => {
    it("should merge the endpoint and provider authorizer settings", () => {
      const result = authJWTSettingsExtractor(
        {
          authorizer: {
            name: "auth",
            scopes: ["scope1"],
          },
        },
        providerWith({ auth: validAuthorizer }),
        true,
      )

      assert.deepStrictEqual(result, {
        audience: ["audience1"],
        authorizerName: "auth",
        identitySource: "$request.header.Authorization",
        issuerUrl: "https://example.com",
        name: "auth",
        scopes: ["scope1"],
      })
    })

    it("should let the provider authorizer win over the endpoint authorizer", () => {
      const result = authJWTSettingsExtractor(
        {
          authorizer: {
            audience: ["endpoint-audience"],
            name: "auth",
          },
        },
        providerWith({ auth: validAuthorizer }),
        true,
      )

      assert.deepStrictEqual(result.audience, ["audience1"])
    })
  })
})
