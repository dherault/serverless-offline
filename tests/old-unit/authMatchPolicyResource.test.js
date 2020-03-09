import authMatchPolicyResource from '../../src/events/authorizer/authMatchPolicyResource.js'

describe('authMatchPolicyResource', () => {
  describe('when resource has no wildcards', () => {
    const resource =
      'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs'

    describe('and the resource matches', () => {
      test('returns true', () => {
        expect(authMatchPolicyResource(resource, resource)).toEqual(true)
      })
    })

    describe('when the resource has one wildcard to match everything', () => {
      const wildcardResource =
        'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/*'

      test('returns true', () => {
        expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
          true,
        )
      })
    })
  })

  describe('when the resource has wildcards', () => {
    describe('and it matches', () => {
      const wildcardResource =
        'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/*'
      const resource =
        'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs'

      test('returns true', () => {
        expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
          true,
        )
      })
    })

    describe('and it does not match', () => {
      test('returns false', () => {
        const wildcardResource =
          'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/*'
        const resource =
          'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/PUT/dinosaurs'

        expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
          false,
        )
      })
    })

    describe('and the resource contains colons', () => {
      test('returns true', () => {
        const wildcardResource =
          'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/*'
        const resource =
          'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs:extinct'
        expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
          true,
        )
      })
    })

    // test for #560
    describe('when the resource has wildcards and colons', () => {
      const wildcardResource =
        'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/*/stats'

      describe('and it matches', () => {
        test('returns true', () => {
          const resource =
            'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs:extinct/stats'

          expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
            true,
          )
        })
      })

      describe('and it does not match', () => {
        test('returns false', () => {
          const resource =
            'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs/all-stats'

          expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
            false,
          )
        })
      })
    })

    describe('when the resource has multiple wildcards', () => {
      describe('and it matches', () => {
        test('returns true', () => {
          const wildcardResource =
            'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/*/*/stats'
          const resource =
            'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs/stats'

          expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
            true,
          )
        })
      })

      describe('and it does not match', () => {
        test('returns false', () => {
          const wildcardResource =
            'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/*'
          const resource =
            'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/PUT/dinosaurs/xx'

          expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
            false,
          )
        })
      })

      describe('and the wildcard is between two fragments', () => {
        const wildcardResource =
          'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/*/dinosaurs/*'

        describe('and it matches', () => {
          test('returns true', () => {
            const resource =
              'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs/stats'

            expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
              true,
            )
          })
        })

        describe('and it does not match', () => {
          test('returns false', () => {
            const resource =
              'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/cats/stats'

            expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
              false,
            )
          })
        })
      })
    })
  })

  describe('when the resource has single character wildcards', () => {
    const wildcardResource =
      'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/d?nosaurs'

    describe('and it matches', () => {
      const resource =
        'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs'
      test('returns true', () => {
        expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
          true,
        )
      })
    })

    describe('and it does not match', () => {
      test('returns false', () => {
        const resource =
          'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/diinosaurs'
        expect(authMatchPolicyResource(wildcardResource, resource)).toEqual(
          false,
        )
      })
    })
  })
})
