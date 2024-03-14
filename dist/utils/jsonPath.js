import { JSONPath } from 'jsonpath-plus'
export default function jsonPath(json, path) {
  const [result] =
    JSONPath({
      json,
      path,
    }) || []
  return result
}
