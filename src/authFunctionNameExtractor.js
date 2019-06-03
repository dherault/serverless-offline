const extract = (endpoint, logFunction) => {
  const buildFailureResult = warningMessage => {
    logFunction(warningMessage);

    return { unsupportedAuth: true };
  };

  const buildSuccessResult = authorizerName => ({ authorizerName });

  const handleStringAuthorizer = authorizerString => {
    if (authorizerString.toUpperCase() === 'AWS_IAM') {
      return buildFailureResult('WARNING: Serverless Offline does not support the AWS_IAM authorization type');
    }

    return buildSuccessResult(authorizerString);
  };

  const handleObjectAuthorizer = authorizerObject => {
    if (authorizerObject.type && authorizerObject.type.toUpperCase() === 'AWS_IAM') {
      return buildFailureResult('WARNING: Serverless Offline does not support the AWS_IAM authorization type');
    }
    if (authorizerObject.arn) {
      return buildFailureResult(`WARNING: Serverless Offline does not support non local authorizers (arn): ${authorizerObject.arn}`);
    }
    if (authorizerObject.authorizerId) {
      return buildFailureResult(`WARNING: Serverless Offline does not support non local authorizers (authorizerId): ${authorizerObject.authorizerId}`);
    }

    const name = authorizerObject.name;

    if (!name) {
      return buildFailureResult('WARNING: Serverless Offline supports local authorizers but authorizer name is missing');
    }

    return buildSuccessResult(name);
  };

  if (!endpoint.authorizer) {
    return buildSuccessResult(null);
  }

  const authorizer = endpoint.authorizer;

  if (typeof authorizer === 'string') {
    return handleStringAuthorizer(authorizer);
  }

  if (typeof authorizer === 'object') {
    return handleObjectAuthorizer(authorizer);
  }

  return buildFailureResult('WARNING: Serverless Offline supports only local authorizers defined as string or object');
};

module.exports = extract;
