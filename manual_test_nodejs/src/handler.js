'use strict';

const { stringify } = JSON;

exports.hello = function hello(event, context, callback) {
  const response = {
    statusCode: 200,
    body: stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};

exports.rejectedPromise = function rejectedPromise(event, context, callback) {
  const response = {
    statusCode: 200,
    body: stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  console.log('About to reject promise');

  Promise.reject(new Error('This is the rejected error'));

  callback(null, response);
};

exports.authFunction = function authFunction(event, context) {
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

exports.hello500 = function hello500(event, context, callback) {
  const response = {
    statusCode: 500,
    body: stringify({
      message: 'Fake internal server error.',
      input: event,
    }),
  };

  callback(null, response);
};

exports.helloLambdaIntegration = function helloLambdaIntegration(
  event,
  context,
  cb,
) {
  cb(null, {
    message: 'Go Serverless v1.0! Your function executed successfully!',
    event,
  });
};

exports.helloLambdaIntegration500 = function helloLambdaIntegration500(
  event,
  context,
  cb,
) {
  cb(new Error('[500] Fake internal server error.'));
};

exports.basicAuthentication = function basicAuthentication(event, context, cb) {
  const response = {
    statusCode: 200,
    body: stringify({
      message: 'Private Function Executed Correctly',
    }),
  };

  cb(null, response);
};

exports.catchAll = function catchAll(event, context, cb) {
  const response = {
    statusCode: 200,
    body: stringify({
      message: 'Catch all route',
    }),
  };

  cb(null, response);
};

exports.pathParams = function pathParams(event, context, cb) {
  const response = {
    statusCode: 200,
    body: stringify({
      message: `id is ${event.pathParameters.id}`,
    }),
  };

  cb(null, response);
};

exports.failure = function failure() {
  throw new Error('Unexpected error!');
};
