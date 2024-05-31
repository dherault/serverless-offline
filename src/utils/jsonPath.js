import { JSONPath } from "jsonpath-plus"

export default function jsonPath(json, path) {
  // NOTE: JSONPath returns undefined if 'json' is e.g. null, undefined, string,
  // number (anything other than JSON)
  const [result] =
    JSONPath({
      json,
      path,
    }) || []

  return result
}
