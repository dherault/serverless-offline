'use strict'

exports.CUSTOM_OPTION = 'serverless-offline'

// https://docs.aws.amazon.com/lambda/latest/dg/limits.html
exports.DEFAULT_LAMBDA_MEMORY_SIZE = 1024
// default function timeout in seconds
exports.DEFAULT_LAMBDA_TIMEOUT = 900 // 15 min

// timeout for all connections to be closed
exports.SERVER_SHUTDOWN_TIMEOUT = 5000
