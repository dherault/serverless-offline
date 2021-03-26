// Used to lowercase string value e.g authorizerOptions.type
export default function toLowerCase(value) {
  if (!value || typeof value !== 'string') {
    return value
  }

  return value.toLowerCase()
}
