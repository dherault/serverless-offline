/* eslint-disable max-classes-per-file */
/**
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This code was copied from:
 * https://github.com/aws/aws-lambda-nodejs-runtime-interface-client/blob/main/src/Errors.js
 *
 * Defines custom error types throwable by the runtime.
 */

"use strict"

const errorClasses = [
  class ImportModuleError extends Error {},
  class HandlerNotFound extends Error {},
  class MalformedHandlerName extends Error {},
  class UserCodeSyntaxError extends Error {},
  class MalformedStreamingHandler extends Error {},
  class InvalidStreamingOperation extends Error {},
  class UnhandledPromiseRejection extends Error {
    constructor(reason, promise) {
      super(reason)
      this.reason = reason
      this.promise = promise
    }
  },
]

errorClasses.forEach((e) => {
  module.exports[e.name] = e
  e.prototype.name = `Runtime.${e.name}`
})
