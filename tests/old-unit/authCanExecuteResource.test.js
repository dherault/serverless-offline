import assert from "node:assert"
import authCanExecuteResource from "../../src/events/authCanExecuteResource.js"

describe("authCanExecuteResource", () => {
  describe("when the policy has one Statement in an array", () => {
    const setup = (Effect, Resource) => ({
      Statement: [
        {
          Effect,
          Resource,
        },
      ],
    })
    const resource =
      "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs"

    describe("when the Resource is in an Allow statement", () => {
      describe("and the Resource is an array", () => {
        it("returns true", () => {
          const policy = setup("Allow", [resource])

          const canExecute = authCanExecuteResource(policy, resource)
          assert.strictEqual(canExecute, true)
        })
      })

      describe("and Allow is lowercase", () => {
        it("returns true", () => {
          const policy = setup("allow", resource)

          const canExecute = authCanExecuteResource(policy, resource)
          assert.strictEqual(canExecute, true)
        })
      })

      it("returns true", () => {
        const policy = setup("Allow", resource)

        const canExecute = authCanExecuteResource(policy, resource)
        assert.strictEqual(canExecute, true)
      })
    })

    describe("when the Resource is in a Deny statement", () => {
      it("returns false", () => {
        const policy = setup("Deny", resource)

        const canExecute = authCanExecuteResource(policy, resource)
        assert.strictEqual(canExecute, false)
      })
      describe("and Resource is an array", () => {
        it("returns true", () => {
          const policy = setup("Deny", [resource])

          const canExecute = authCanExecuteResource(policy, resource)
          assert.strictEqual(canExecute, false)
        })
      })
    })
  })

  describe("when the policy has multiple Statements", () => {
    const setup = (statements) => ({
      Statement: statements.map((statement) => ({
        Effect: statement.Effect,
        Resource: statement.Resource,
      })),
    })
    const resourceOne =
      "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs"
    const resourceTwo =
      "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dogs"

    describe("when the Resource is in an Allow statement", () => {
      it("returns true", () => {
        const policy = setup([
          {
            Effect: "Allow",
            Resource: resourceOne,
          },
          {
            Effect: "Deny",
            Resource: resourceTwo,
          },
        ])
        const canExecute = authCanExecuteResource(policy, resourceOne)
        assert.strictEqual(canExecute, true)
      })

      describe("and the Resource is an array", () => {
        it("returns true", () => {
          const policy = setup([
            {
              Effect: "Allow",
              Resource: [resourceOne],
            },
            {
              Effect: "Deny",
              Resource: [resourceTwo],
            },
          ])

          const canExecute = authCanExecuteResource(policy, resourceOne)
          assert.strictEqual(canExecute, true)
        })
      })
    })

    describe("when the resource is in a Deny statement", () => {
      it("returns false", () => {
        const policy = setup([
          {
            Effect: "Allow",
            Resource: resourceOne,
          },
          {
            Effect: "Deny",
            Resource: resourceTwo,
          },
        ])

        const canExecute = authCanExecuteResource(policy, resourceTwo)
        assert.strictEqual(canExecute, false)
      })

      describe("and the Resource is an array", () => {
        it("returns false", () => {
          const policy = setup([
            {
              Effect: "Allow",
              Resource: [resourceOne],
            },
            {
              Effect: "Deny",
              Resource: [resourceTwo],
            },
          ])

          const canExecute = authCanExecuteResource(policy, resourceTwo)
          assert.strictEqual(canExecute, false)
        })
      })

      describe("and there is also an Allow statement", () => {
        it("returns false", () => {
          const policy = setup([
            {
              Effect: "Allow",
              Resource: [resourceTwo],
            },
            {
              Effect: "Deny",
              Resource: [resourceTwo],
            },
          ])

          const canExecute = authCanExecuteResource(policy, resourceTwo)
          assert.strictEqual(canExecute, false)
        })
      })
    })
  })
})
