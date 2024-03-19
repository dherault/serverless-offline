"use strict"

const { stringify } = JSON

exports.echo = async function echo(event, context) {
  const data = {
    context,
    event,
  }

  return stringify(data)
}
