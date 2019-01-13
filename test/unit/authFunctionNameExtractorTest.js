/* global describe context it */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const authFunctionNameExtractor = require('../../src/authFunctionNameExtractor');

const expect = chai.expect;
chai.use(dirtyChai);

describe('authFunctionNameExtractor', () => {


  const dummyLogging = arrayStore => message => {
    arrayStore.push(message);
  };

  context('Unsupported auth method', () => {
    const unsupportedAuthTest = (authorizer, expectedWarningMessage) => () => {
      const endpoint = { authorizer };
      const logStorage = [];
      const result = authFunctionNameExtractor(endpoint, dummyLogging(logStorage));

      expect(result.unsupportedAuth).to.eq(true);
      expect(logStorage.length).to.eq(1);
      expect(logStorage[0]).to.eq(expectedWarningMessage);
    };

    context('authorizer is a string', () => {
      it('aws_iam',
        unsupportedAuthTest('aws_iam',
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type'));

      it('AWS_IAM',
        unsupportedAuthTest('AWS_IAM',
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type'));

      it('AwS_IaM',
        unsupportedAuthTest('AwS_IaM',
          'WARNING: Serverless Offline does not support the AWS_IAM authorization type'));
    });

    context('authorizer is an object', () => {
      it('type: aws_iam', unsupportedAuthTest({ type: 'aws_iam' },
        'WARNING: Serverless Offline does not support the AWS_IAM authorization type'));

      it('type: AWS_IAM', unsupportedAuthTest({ type: 'AWS_IAM' },
        'WARNING: Serverless Offline does not support the AWS_IAM authorization type'));

      it('type: AwS_IaM', unsupportedAuthTest({ type: 'AwS_IaM' },
        'WARNING: Serverless Offline does not support the AWS_IAM authorization type'));

      it('arn is specified',
        unsupportedAuthTest({ arn: 'anArnValue' },
          'WARNING: Serverless Offline does not support non local authorizers (arn): anArnValue'));

      it('authorizerId is specified',
        unsupportedAuthTest({ authorizerId: 'anAuthorizerId' },
          'WARNING: Serverless Offline does not support non local authorizers (authorizerId): anAuthorizerId'));

      it('missing name attribute', () => {
        unsupportedAuthTest({}, 'WARNING: Serverless Offline supports local authorizers but authorizer name is missing');
      });
    });

    context('authorizer is not a string or oject', () => {
      it('a number', unsupportedAuthTest(4,
        'WARNING: Serverless Offline supports only local authorizers defined as string or object'));

      it('a boolean', unsupportedAuthTest(true,
        'WARNING: Serverless Offline supports only local authorizers defined as string or object'));
    });
  });

  context('supported auth method', () => {
    const supportedAuthTest = (authorizer, expectedAuthorizerName) => () => {
      const endpoint = { authorizer };
      const logStorage = [];
      const result = authFunctionNameExtractor(endpoint, dummyLogging(logStorage));

      expect(result.unsupportedAuth).to.be.undefined();
      expect(logStorage.length).to.eq(0);
      expect(result.authorizerName).to.eq(expectedAuthorizerName);
    };

    context('authorizer is a string', () => {
      it('is a string anAuthorizerName', supportedAuthTest('anAuthorizerName', 'anAuthorizerName'));
    });
    context('authorizer is an object', () => {
      it('named anAuthorizerName', supportedAuthTest({ name : 'anAuthorizerName' }, 'anAuthorizerName'));
    });

  });

});
