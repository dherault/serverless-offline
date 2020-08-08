'use strict'

exports.hello = async () => {
  const {
    ENV_VAR_QUOTED,
    ENV_VAR_UNQUOTED,
    ENV_VAR_MAPPED,
    ENV_VAR_EMPTY_STRING,
    ENV_VAR_UNDEFINED,
  } = process.env

  const body = JSON.stringify({
    ENV_VAR_QUOTED,
    ENV_VAR_UNQUOTED,
    ENV_VAR_MAPPED,
    ENV_VAR_EMPTY_STRING,
    ENV_VAR_UNDEFINED,
  })

  return {
    statusCode: 200,
    body,
  }
}
