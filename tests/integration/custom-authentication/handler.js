'use strict'

const { stringify } = JSON

exports.echo = async function echo(event, context) {
  const data = { event, context }
  return stringify(data)
}
