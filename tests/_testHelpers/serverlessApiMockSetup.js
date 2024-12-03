import nock from "nock"

nock("https://core.serverless.com/api")
  .post("/bff/")
  .reply(200, {
    data: {
      callerIdentity: {
        orgId: "your-mocked-org-id",
        orgName: "your-mocked-org-name",
        userEmail: "your-mocked-email@example.com",
        userId: "your-mocked-user-id",
        userName: "your-mocked-user-name",
      },
    },
  })
console.log("Serverless API mock setup loaded!")
