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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.helloLambdaIntegration = (event, context, cb) => {
  cb(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.helloLambdaIntegration500 = (event, context, cb) => {
  cb(null, { message: '[500] Fake internal server error.', event });
};

// You can add more handlers here, and reference them in serverless.yml
