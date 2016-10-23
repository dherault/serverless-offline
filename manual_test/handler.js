'use strict';

// Your first function handler
module.exports.hello = (event, context, cb) => {
  const response = {
    body: JSON.stringify({ message: 'Go Serverless v1.0! Your function executed successfully!', event }),
  };
  cb(null, response);
};

// You can add more handlers here, and reference them in serverless.yml
