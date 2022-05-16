'use strict'

const { env } = require('process')

const { stringify } = JSON

exports.hello = async () => {
  const {
    ENV_VAR_QUOTED,
    ENV_VAR_UNQUOTED,
    ENV_VAR_MAPPED,
    ENV_VAR_EMPTY_STRING,
    ENV_VAR_UNDEFINED,
  } = env

  const body = stringify({
    ENV_VAR_QUOTED,
    ENV_VAR_UNQUOTED,
    ENV_VAR_MAPPED,
    ENV_VAR_EMPTY_STRING, // This should be undefined
    ENV_VAR_UNDEFINED, // This should be undefined
  })

  return {
    statusCode: 200,
    body,
  }
}
