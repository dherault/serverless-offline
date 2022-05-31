import assert from 'node:assert'
import authFunctionNameExtractor from '../../src/events/authFunctionNameExtractor.js'

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

      assert.strictEqual(result.unsupportedAuth, true)
      assert.strictEqual(logStorage.length, 1)
      assert.strictEqual(logStorage[0], expectedWarningMessage)
    }

    describe('authorizer is a string', () => {
      it(
        'aws_iam',
        unsupportedAuthTest(
          'aws_iam',
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )

      it(
        'AWS_IAM',
        unsupportedAuthTest(
          'AWS_IAM',
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )

      it(
        'AwS_IaM',
        unsupportedAuthTest(
          'AwS_IaM',
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )
    })

    describe('authorizer is an object', () => {
      it(
        'type: aws_iam',
        unsupportedAuthTest(
          { type: 'aws_iam' },
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )

      it(
        'type: AWS_IAM',
        unsupportedAuthTest(
          { type: 'AWS_IAM' },
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )

      it(
        'type: AwS_IaM',
        unsupportedAuthTest(
          { type: 'AwS_IaM' },
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
        ),
      )

      it(
        'arn is specified',
        unsupportedAuthTest(
          { arn: 'anArnValue' },
          'WARNING: Serverless Offline does not support non local authorizers (arn): anArnValue',
        ),
      )

      it(
        'authorizerId is specified',
        unsupportedAuthTest(
          { authorizerId: 'anAuthorizerId' },
          'WARNING: Serverless Offline does not support non local authorizers (authorizerId): anAuthorizerId',
        ),
      )

      it('missing name attribute', () => {
        unsupportedAuthTest(
          {},
          'WARNING: Serverless Offline supports local authorizers but authorizer name is missing',
        )
      })
    })

    describe('authorizer is not a string or oject', () => {
      it(
        'a number',
        unsupportedAuthTest(
          4,
          'WARNING: Serverless Offline supports only local authorizers defined as string or object',
        ),
      )

      it(
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

      assert.strictEqual(result.unsupportedAuth, undefined)
      assert.strictEqual(logStorage.length, 0)
      assert.strictEqual(result.authorizerName, expectedAuthorizerName)
    }

    describe('authorizer is a string', () => {
      it(
        'is a string anAuthorizerName',
        supportedAuthTest('anAuthorizerName', 'anAuthorizerName'),
      )
    })

    describe('authorizer is an object', () => {
      it(
        'named anAuthorizerName',
        supportedAuthTest({ name: 'anAuthorizerName' }, 'anAuthorizerName'),
      )
    })
  })
})
