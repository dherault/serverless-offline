import { JSONPath } from 'jsonpath-plus'
// import debugLog from '../debugLog.js'

export default function jsonPath(json, path) {
  // debugLog('Calling jsonPath:', path)

  // NOTE: JSONPath returns undefined if 'json' is e.g. null, undefined, string,
  // number (anything other than JSON)
  const [result] =
    JSONPath({
      json,
      path,
    }) || []

  // debugLog('jsonPath resolved:', result)

  return result
}
