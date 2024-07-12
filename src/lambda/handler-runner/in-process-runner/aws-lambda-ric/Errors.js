// from the AWS Lambda Runtime Interface Client
// https://github.com/aws/aws-lambda-nodejs-runtime-interface-client/blob/9af681895d0cdd2094ef452342a604e94dc82cc3/src/Errors.js

/**
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Defines custom error types throwable by the runtime.
 */

'use strict';

const util = require('util');

function _isError(obj) {
  return (
    obj &&
    obj.name &&
    obj.message &&
    obj.stack &&
    typeof obj.name === 'string' &&
    typeof obj.message === 'string' &&
    typeof obj.stack === 'string'
  );
}

function intoError(err) {
  if (err instanceof Error) {
    return err;
  } else {
    return new Error(err);
  }
}

module.exports.intoError = intoError;

/**
 * Attempt to convert an object into a response object.
 * This method accounts for failures when serializing the error object.
 */
function toRapidResponse(error) {
  try {
    if (util.types.isNativeError(error) || _isError(error)) {
      return {
        errorType: error.name?.replace(/\x7F/g, '%7F'),
        errorMessage: error.message?.replace(/\x7F/g, '%7F'),
        trace: error.stack.replace(/\x7F/g, '%7F').split('\n'),
      };
    } else {
      return {
        errorType: typeof error,
        errorMessage: error.toString(),
        trace: [],
      };
    }
  } catch (_err) {
    return {
      errorType: 'handled',
      errorMessage:
        'callback called with Error argument, but there was a problem while retrieving one or more of its message, name, and stack',
    };
  }
}

module.exports.toRapidResponse = toRapidResponse;

/**
 * Format an error with the expected properties.
 * For compatability, the error string always starts with a tab.
 */
module.exports.toFormatted = (error) => {
  try {
    return (
      '\t' + JSON.stringify(error, (_k, v) => _withEnumerableProperties(v))
    );
  } catch (err) {
    return '\t' + JSON.stringify(toRapidResponse(error));
  }
};

/**
 * Error name, message, code, and stack are all members of the superclass, which
 * means they aren't enumerable and don't normally show up in JSON.stringify.
 * This method ensures those interesting properties are available along with any
 * user-provided enumerable properties.
 */
function _withEnumerableProperties(error) {
  if (error instanceof Error) {
    let ret = Object.assign(
      {
        errorType: error.name,
        errorMessage: error.message,
        code: error.code,
      },
      error,
    );
    if (typeof error.stack == 'string') {
      ret.stack = error.stack.split('\n');
    }
    return ret;
  } else {
    return error;
  }
}

const errorClasses = [
  class ImportModuleError extends Error {},
  class HandlerNotFound extends Error {},
  class MalformedHandlerName extends Error {},
  class UserCodeSyntaxError extends Error {},
  class MalformedStreamingHandler extends Error {},
  class InvalidStreamingOperation extends Error {},
  class UnhandledPromiseRejection extends Error {
    constructor(reason, promise) {
      super(reason);
      this.reason = reason;
      this.promise = promise;
    }
  },
];

errorClasses.forEach((e) => {
  module.exports[e.name] = e;
  e.prototype.name = `Runtime.${e.name}`;
});