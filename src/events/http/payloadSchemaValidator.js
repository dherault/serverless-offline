import { validate } from 'jsonschema'

export default function payloadSchemaValidator(model, body) {
  const result = validate(body, model)

  if (result.errors.length > 0) {
    throw new Error(
      `Request body validation failed: ${result.errors
        .map((e) => e.message)
        .join(', ')}`,
    )
  }
}
