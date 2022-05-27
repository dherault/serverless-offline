'use strict'

const { env } = require('node:process')

const { stringify } = JSON

exports.hello = async () => {
  const { ENV_VAR_MAPPED, ENV_VAR_QUOTED, ENV_VAR_UNQUOTED } = env

  const body = stringify({
    ENV_VAR_MAPPED,
    ENV_VAR_QUOTED,
    ENV_VAR_UNQUOTED,
  })

  return {
    body,
    statusCode: 200,
  }
}
