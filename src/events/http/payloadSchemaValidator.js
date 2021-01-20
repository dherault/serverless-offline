'use strict'

const { validate: validateJsonSchema } = require('jsonschema')

exports.validate = function validate(model, body) {
  const result = validateJsonSchema(body, model)

  if (result.errors.length > 0) {
    throw new Error(
      `Request body validation failed: ${result.errors
        .map((e) => e.message)
        .join(', ')}`,
    )
  }
}
