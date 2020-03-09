import authCanExecuteResource from '../../src/events/authorizer/authCanExecuteResource.js'

describe('authCanExecuteResource', () => {
  describe('when the policy has one Statement in an array', () => {
    const setup = (Effect, Resource) => ({
      Statement: [
        {
          Effect,
          Resource,
        },
      ],
    })
    const resource =
      'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs'

    describe('when the Resource is in an Allow statement', () => {
      describe('and the Resource is an array', () => {
        test('returns true', () => {
          const policy = setup('Allow', [resource])

          const canExecute = authCanExecuteResource(policy, resource)
          expect(canExecute).toEqual(true)
        })
      })

      describe('and Allow is lowercase', () => {
        test('returns true', () => {
          const policy = setup('allow', resource)

          const canExecute = authCanExecuteResource(policy, resource)
          expect(canExecute).toEqual(true)
        })
      })

      test('returns true', () => {
        const policy = setup('Allow', resource)

        const canExecute = authCanExecuteResource(policy, resource)
        expect(canExecute).toEqual(true)
      })
    })

    describe('when the Resource is in a Deny statement', () => {
      test('returns false', () => {
        const policy = setup('Deny', resource)

        const canExecute = authCanExecuteResource(policy, resource)
        expect(canExecute).toEqual(false)
      })
      describe('and Resource is an array', () => {
        test('returns true', () => {
          const policy = setup('Deny', [resource])

          const canExecute = authCanExecuteResource(policy, resource)
          expect(canExecute).toEqual(false)
        })
      })
    })
  })

  describe('when the policy has multiple Statements', () => {
    const setup = (statements) => ({
      Statement: statements.map((statement) => ({
        Effect: statement.Effect,
        Resource: statement.Resource,
      })),
    })
    const resourceOne =
      'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dinosaurs'
    const resourceTwo =
      'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/dogs'

    describe('when the Resource is in an Allow statement', () => {
      test('returns true', () => {
        const policy = setup([
          {
            Effect: 'Allow',
            Resource: resourceOne,
          },
          {
            Effect: 'Deny',
            Resource: resourceTwo,
          },
        ])
        const canExecute = authCanExecuteResource(policy, resourceOne)
        expect(canExecute).toEqual(true)
      })

      describe('and the Resource is an array', () => {
        test('returns true', () => {
          const policy = setup([
            {
              Effect: 'Allow',
              Resource: [resourceOne],
            },
            {
              Effect: 'Deny',
              Resource: [resourceTwo],
            },
          ])

          const canExecute = authCanExecuteResource(policy, resourceOne)
          expect(canExecute).toEqual(true)
        })
      })
    })

    describe('when the resource is in a Deny statement', () => {
      test('returns false', () => {
        const policy = setup([
          {
            Effect: 'Allow',
            Resource: resourceOne,
          },
          {
            Effect: 'Deny',
            Resource: resourceTwo,
          },
        ])

        const canExecute = authCanExecuteResource(policy, resourceTwo)
        expect(canExecute).toEqual(false)
      })

      describe('and the Resource is an array', () => {
        test('returns false', () => {
          const policy = setup([
            {
              Effect: 'Allow',
              Resource: [resourceOne],
            },
            {
              Effect: 'Deny',
              Resource: [resourceTwo],
            },
          ])

          const canExecute = authCanExecuteResource(policy, resourceTwo)
          expect(canExecute).toEqual(false)
        })
      })

      describe('and there is also an Allow statement', () => {
        test('returns false', () => {
          const policy = setup([
            {
              Effect: 'Allow',
              Resource: [resourceTwo],
            },
            {
              Effect: 'Deny',
              Resource: [resourceTwo],
            },
          ])

          const canExecute = authCanExecuteResource(policy, resourceTwo)
          expect(canExecute).toEqual(false)
        })
      })
    })
  })
})
