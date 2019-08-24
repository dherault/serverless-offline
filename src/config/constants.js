'use strict'

// dummy placeholder url for the WHATWG URL constructor
// https://github.com/nodejs/node/issues/12682
exports.BASE_URL_PLACEHOLDER = 'http://example'

exports.CUSTOM_OPTION = 'serverless-offline'

exports.DEFAULT_LAMBDA_RUNTIME = 'nodejs10.x'

// https://docs.aws.amazon.com/lambda/latest/dg/limits.html
exports.DEFAULT_LAMBDA_MEMORY_SIZE = 1024
// default function timeout in seconds
exports.DEFAULT_LAMBDA_TIMEOUT = 900 // 15 min

// timeout for all connections to be closed
exports.SERVER_SHUTDOWN_TIMEOUT = 5000
