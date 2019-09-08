import { JSONPath } from 'jsonpath-plus'
// import debugLog from '../debugLog.js'

export default function jsonPath(json, path) {
  // debugLog('Calling jsonPath:', path)

  const [result] = JSONPath({
    json,
    path,
  })

  // debugLog('jsonPath resolved:', result)

  return result
}
