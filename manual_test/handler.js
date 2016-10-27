'use strict';

// Your first function handler
module.exports.hello = (event, context, cb) => {
  cb(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.basicAuthentication = (event, context, cb) => {
  cb(null, { message: 'Private Function Executed Correctly' });
};
