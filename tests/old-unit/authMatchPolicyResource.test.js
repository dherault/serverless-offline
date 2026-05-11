import assert from "node:assert"
import authMatchPolicyResource from "../../src/events/authMatchPolicyResource.js"

describe("authMatchPolicyResource", () => {
  describe("when resource has no wildcards", () => {
    const resource =
      "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs"

    describe("and the resource matches", () => {
      it("returns true", () => {
        assert.strictEqual(authMatchPolicyResource(resource, resource), true)
      })
    })

    describe("when the resource has one wildcard to match everything", () => {
      const wildcardResource =
        "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/*"

      it("returns true", () => {
        assert.strictEqual(
          authMatchPolicyResource(wildcardResource, resource),
          true,
        )
      })
    })
  })

  describe("when the resource defines all segments with a wildcard", () => {
    const wildcardResource = "arn:aws:execute-api:*:*:*"

    it("matches anything", () => {
      for (const resource of [
        "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs",
        "arn:aws:execute-api:us-west-1:123456:random-api-id/development/GET/diinosaurs",
        "arn:aws:execute-api:eu-west-2:123abc:random-api-id/development/PUT/dinosaurs",
        "arn:aws:execute-api:eu-west-1:random-account-id:123abc/development/GET/dinosaurs:extinct",
        "arn:aws:execute-api:ap-southeast-1:random-account-id:random-api-id/development/GET/diinosaurs",
      ]) {
        assert.strictEqual(
          authMatchPolicyResource(wildcardResource, resource),
          true,
        )
      }
    })
  })

  describe("when the resource ends with a wildcarded region segment", () => {
    const wildcardResource = "arn:aws:execute-api:*"

    it("matches anything", () => {
      for (const resource of [
        "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs",
        "arn:aws:execute-api:us-west-1:123456:random-api-id/development/GET/diinosaurs",
        "arn:aws:execute-api:eu-west-2:123abc:random-api-id/development/PUT/dinosaurs",
        "arn:aws:execute-api:eu-west-1:random-account-id:123abc/development/GET/dinosaurs:extinct",
        "arn:aws:execute-api:ap-southeast-1:random-account-id:random-api-id/development/GET/diinosaurs",
      ]) {
        assert.strictEqual(
          authMatchPolicyResource(wildcardResource, resource),
          true,
        )
      }
    })
  })

  describe("when the resource ends with a wildcarded account-id segment", () => {
    const wildcardResource = "arn:aws:execute-api:eu-west-1:*"

    describe("and the resource is in the same region", () => {
      it("matches regardless of what comes afterwards", () => {
        for (const resource of [
          "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs",
          "arn:aws:execute-api:eu-west-1:123456:random-api-id/development/GET/diinosaurs",
          "arn:aws:execute-api:eu-west-1:123abc:random-api-id/development/PUT/dinosaurs",
          "arn:aws:execute-api:eu-west-1:random-account-id:123abc/development/GET/dinosaurs:extinct",
        ]) {
          assert.strictEqual(
            authMatchPolicyResource(wildcardResource, resource),
            true,
          )
        }
      })
    })

    describe("and the resource is in a different region", () => {
      it("does not match regardless of what comes afterwards", () => {
        for (const resource of [
          "arn:aws:execute-api:eu-west-2:random-account-id:random-api-id/development/GET/dinosaurs",
          "arn:aws:execute-api:us-west-1:123456:random-api-id/development/GET/diinosaurs",
          "arn:aws:execute-api:eu-west-2:123abc:random-api-id/development/PUT/dinosaurs",
          "arn:aws:execute-api:eu-west-2:random-account-id:123abc/development/GET/dinosaurs:extinct",
          "arn:aws:execute-api:ap-southeast-1:random-account-id:random-api-id/development/GET/diinosaurs",
        ]) {
          assert.strictEqual(
            authMatchPolicyResource(wildcardResource, resource),
            false,
          )
        }
      })
    })
  })

  describe("when the resource has wildcards", () => {
    describe("and it matches", () => {
      const wildcardResource =
        "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/*"
      const resource =
        "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs"

      it("returns true", () => {
        assert.strictEqual(
          authMatchPolicyResource(wildcardResource, resource),
          true,
        )
      })
    })

    describe("and it does not match", () => {
      it("returns false", () => {
        const wildcardResource =
          "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/*"
        const resource =
          "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/PUT/dinosaurs"

        assert.strictEqual(
          authMatchPolicyResource(wildcardResource, resource),
          false,
        )
      })
    })

    describe("and the resource contains colons", () => {
      it("returns true", () => {
        const wildcardResource =
          "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/*"
        const resource =
          "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs:extinct"
        assert.strictEqual(
          authMatchPolicyResource(wildcardResource, resource),
          true,
        )
      })
    })

    // test for #560
    describe("when the resource has wildcards and colons", () => {
      const wildcardResource =
        "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/*/stats"

      describe("and it matches", () => {
        it("returns true", () => {
          const resource =
            "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs:extinct/stats"

          assert.strictEqual(
            authMatchPolicyResource(wildcardResource, resource),
            true,
          )
        })
      })

      describe("and it does not match", () => {
        it("returns false", () => {
          const resource =
            "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs/all-stats"

          assert.strictEqual(
            authMatchPolicyResource(wildcardResource, resource),
            false,
          )
        })
      })
    })

    describe("when the resource has multiple wildcards", () => {
      describe("and it matches", () => {
        it("returns true", () => {
          const wildcardResource =
            "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/*/*/stats"
          const resource =
            "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs/stats"

          assert.strictEqual(
            authMatchPolicyResource(wildcardResource, resource),
            true,
          )
        })
      })

      describe("and it does not match", () => {
        it("returns false", () => {
          const wildcardResource =
            "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/*"
          const resource =
            "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/PUT/dinosaurs/xx"

          assert.strictEqual(
            authMatchPolicyResource(wildcardResource, resource),
            false,
          )
        })
      })

      describe("and the wildcard is between two fragments", () => {
        const wildcardResource =
          "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/*/dinosaurs/*"

        describe("and it matches", () => {
          it("returns true", () => {
            const resource =
              "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs/stats"

            assert.strictEqual(
              authMatchPolicyResource(wildcardResource, resource),
              true,
            )
          })
        })

        describe("and it does not match", () => {
          it("returns false", () => {
            const resource =
              "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/cats/stats"

            assert.strictEqual(
              authMatchPolicyResource(wildcardResource, resource),
              false,
            )
          })
        })
      })
    })

    describe("when the resource has segment wildcards", () => {
      const wildcardResource =
        "arn:aws:execute-api:*:*:random-api-id/local/GET/organizations"

      describe("and it matches", () => {
        it("returns true", () => {
          const resource =
            "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/local/GET/organizations"

          assert.strictEqual(
            authMatchPolicyResource(wildcardResource, resource),
            true,
          )
        })
      })

      describe("and it does not match", () => {
        it("returns false", () => {
          for (const resource of [
            "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/local/GET/me",
            "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/local/GET/organisations",
            "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/local/GET/organizations/1",
          ]) {
            assert.strictEqual(
              authMatchPolicyResource(wildcardResource, resource),
              false,
            )
          }
        })
      })
    })
  })

  describe("when the resource has single character wildcards", () => {
    const wildcardResource =
      "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/d?nosaurs"

    describe("and it matches", () => {
      const resource =
        "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs"
      it("returns true", () => {
        assert.strictEqual(
          authMatchPolicyResource(wildcardResource, resource),
          true,
        )
      })
    })

    describe("and it does not match", () => {
      it("returns false", () => {
        const resource =
          "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/diinosaurs"
        assert.strictEqual(
          authMatchPolicyResource(wildcardResource, resource),
          false,
        )
      })
    })
  })
})
