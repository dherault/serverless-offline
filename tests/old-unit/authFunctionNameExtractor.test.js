import authFunctionNameExtractor from '../../src/events/authorizer/authFunctionNameExtractor.js'

describe('authFunctionNameExtractor', () => {
  const dummyLogging = (arrayStore) => (message) => {
    arrayStore.push(message)
  }

  describe('Unsupported auth method', () => {
    const unsupportedAuthTest = (authorizer, expectedWarningMessage) => () => {
      const endpoint = { authorizer }
      const logStorage = []
      const result = authFunctionNameExtractor(
        endpoint,
        dummyLogging(logStorage),
      )

      expect(result.unsupportedAuth).toEqual(true)
      expect(logStorage.length).toEqual(1)
      expect(logStorage[0]).toEqual(expectedWarningMessage)
    }

    describe('authorizer is a string', () => {
      test(
        'aws_iam',
        unsupportedAuthTest(
          'aws_iam',
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )

      test(
        'AWS_IAM',
        unsupportedAuthTest(
          'AWS_IAM',
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )

      test(
        'AwS_IaM',
        unsupportedAuthTest(
          'AwS_IaM',
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )
    })

    describe('authorizer is an object', () => {
      test(
        'type: aws_iam',
        unsupportedAuthTest(
          { type: 'aws_iam' },
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )

      test(
        'type: AWS_IAM',
        unsupportedAuthTest(
          { type: 'AWS_IAM' },
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )

      test(
        'type: AwS_IaM',
        unsupportedAuthTest(
          { type: 'AwS_IaM' },
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )

      test(
        'arn is specified',
        unsupportedAuthTest(
          { arn: 'anArnValue' },
          'WARNING: Serverless Offline does not support non local authorizers (arn): anArnValue',
        ),
      )

      test(
        'authorizerId is specified',
        unsupportedAuthTest(
          { authorizerId: 'anAuthorizerId' },
          'WARNING: Serverless Offline does not support non local authorizers (authorizerId): anAuthorizerId',
        ),
      )

      test('missing name attribute', () => {
        unsupportedAuthTest(
          {},
          'WARNING: Serverless Offline supports local authorizers but authorizer name is missing',
        )
      })
    })

    describe('authorizer is not a string or oject', () => {
      test(
        'a number',
        unsupportedAuthTest(
          4,
          'WARNING: Serverless Offline supports only local authorizers defined as string or object',
        ),
      )

      test(
        'a boolean',
        unsupportedAuthTest(
          true,
          'WARNING: Serverless Offline supports only local authorizers defined as string or object',
        ),
      )
    })
  })

  describe('supported auth method', () => {
    const supportedAuthTest = (authorizer, expectedAuthorizerName) => () => {
      const endpoint = { authorizer }
      const logStorage = []
      const result = authFunctionNameExtractor(
        endpoint,
        dummyLogging(logStorage),
      )

      expect(result.unsupportedAuth).toEqual(undefined)
      expect(logStorage.length).toEqual(0)
      expect(result.authorizerName).toEqual(expectedAuthorizerName)
    }

    describe('authorizer is a string', () => {
      test(
        'is a string anAuthorizerName',
        supportedAuthTest('anAuthorizerName', 'anAuthorizerName'),
      )
    })

    describe('authorizer is an object', () => {
      test(
        'named anAuthorizerName',
        supportedAuthTest({ name: 'anAuthorizerName' }, 'anAuthorizerName'),
      )
    })
  })
})
