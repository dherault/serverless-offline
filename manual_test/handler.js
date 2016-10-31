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

module.exports.basicAuthentication = (event, context, cb) => {
  cb(null, { message: 'Private Function Executed Correctly' });
};

module.exports.helloLambdaIntegration500 = (event, context, cb) => {
  cb(new Error('[500] Fake internal server error.'));
};

// You can add more handlers here, and reference them in serverless.yml
