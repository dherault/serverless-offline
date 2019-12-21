'use strict'

const fetch = require('node-fetch')

const { stringify } = JSON

module.exports.hello = async () => {
  const host = 'host.docker.internal'

  const response = await fetch(`http://${host}:8080/hello`)
  const text = await response.text()

  return {
    body: stringify({ message: text }),
    statusCode: 200,
  }
}
