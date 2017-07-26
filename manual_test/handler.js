'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports.rejectedPromise = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  console.log('About to reject promise');
  
  Promise.reject(new Error('This is the rejected error'));

  callback(null, response);
};

module.exports.authFunction = (event, context, callback) => {
  context.succeed({
    principalId: 'xxxxxxx', // the principal user identification associated with the token send by the client
    policyDocument: {
      // example policy shown below, but this value is any valid policy
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['execute-api:Invoke'],
          Resource: [event.methodArn],
        },
      ],
    },
  });
};

module.exports.hello500 = (event, context, callback) => {
  const response = {
    statusCode: 500,
    body: JSON.stringify({
      message: 'Fake internal server error.',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports.helloLambdaIntegration = (event, context, cb) => {
  cb(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.helloLambdaIntegration500 = (event, context, cb) => {
  cb(new Error('[500] Fake internal server error.'));
};

module.exports.basicAuthentication = (event, context, cb) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Private Function Executed Correctly',
    }),
  };

  cb(null, response);
};

module.exports.catchAll = (event, context, cb) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Catch all route',
    }),
  };

  cb(null, response);
};

module.exports.pathParams = (event, context, cb) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `id is ${event.pathParameters.id}`,
    }),
  };

  cb(null, response);
};
