'use strict';

const createLambdaContextForNodejs = require('../nodejs4.3/createLambdaContext');

/*
  Mimicks the lambda context object
  http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
*/
module.exports = function createLambdaContext(fun, done) {
  
  return Object.assign(createLambdaContextForNodejs(fun), {
    done,
    succeed: result => done(null, result),
    fail: error => done(error, null),
  });
};
