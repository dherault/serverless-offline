import assert from "node:assert"
import getHttpApiHapiCorsConfig from "../getHttpApiHapiCorsConfig.js"

describe("getHttpApiHapiCorsConfig", () => {
  it("should convert a custom policy into hapi cors options", () => {
    assert.deepStrictEqual(
      getHttpApiHapiCorsConfig({
        allowCredentials: true,
        allowedHeaders: ["X-Custom"],
        allowedMethods: ["GET"],
        allowedOrigins: "https://example.com",
        exposedResponseHeaders: ["X-Exposed"],
        maxAge: 60,
      }),
      {
        credentials: true,
        exposedHeaders: ["X-Exposed"],
        headers: ["X-Custom"],
        maxAge: 60,
        origin: ["https://example.com"],
      },
    )
  })

  it("should convert the AWS default policy into hapi cors options", () => {
    assert.deepStrictEqual(getHttpApiHapiCorsConfig(true), {
      credentials: undefined,
      exposedHeaders: [],
      headers: [
        "Authorization",
        "Content-Type",
        "X-Amz-Date",
        "X-Amz-Security-Token",
        "X-Amz-User-Agent",
        "X-Api-Key",
      ],
      maxAge: undefined,
      origin: ["*"],
    })
  })
})
