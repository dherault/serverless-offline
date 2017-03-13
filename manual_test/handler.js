'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: process.env.HELLO + 'Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports.hello500 = (event, context, callback) => {
  const response = {
    statusCode: 500,
    body: JSON.stringify({
      message: process.env.HELLO500 + 'Fake internal server error.',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports.helloLambdaIntegration = (event, context, cb) => {
  cb(null, { message: process.env.HELLO_LAMBDA + 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.helloLambdaIntegration500 = (event, context, cb) => {
  cb(new Error('[500] ' + process.env.HELLO_LAMBDA_500 + 'Fake internal server error.'));
};

module.exports.basicAuthentication = (event, context, cb) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: process.env.BASIC_AUTH + 'Private Function Executed Correctly',
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
