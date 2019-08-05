'use strict';

exports.CUSTOM_OPTION = 'serverless-offline';

// timeout for all connections to be closed
exports.SERVER_SHUTDOWN_TIMEOUT = 5000;

// https://docs.aws.amazon.com/lambda/latest/dg/limits.html
// default function timeout in seconds
exports.DEFAULT_LAMBDA_TIMEOUT = 900; // 15 min
