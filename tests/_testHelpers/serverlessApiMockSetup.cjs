/* eslint-disable sort-keys */
/* eslint-disable unicorn/no-nested-ternary */
const MOCK_RESPONSE = JSON.stringify({
  data: {
    callerIdentity: {
      orgId: "mocked-org-id",
      orgName: "mocked-org-name",
      userEmail: "mocked-email@example.com",
      userId: "mocked-user-id",
      userName: "mocked-user-name",
    },
  },
})

// Intercept native fetch - nock v13 does not support native fetch
if (globalThis.fetch) {
  const origFetch = globalThis.fetch
  globalThis.fetch = async function (input, init) {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url

    if (url === "https://core.serverless.com/api/bff/") {
      return new Response(MOCK_RESPONSE, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    return origFetch.call(this, input, init)
  }
}

console.log("Serverless API mock setup loaded!")
