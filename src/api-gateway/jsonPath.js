import { JSONPath } from 'jsonpath-plus'
import debugLog from '../debugLog.js'

// wrapper around external dependency for debugging purposes
export default function jsonPath(json, path) {
  debugLog('Calling jsonPath:', path)

  const [result] = JSONPath({
    json,
    path,
    wrap: true,
  })

  debugLog('jsonPath resolved:', result)

  return result
}
