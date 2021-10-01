import parseContentLength from './parseContentLength.js'
import parseContentType from './parseContentType.js'

export default function parseBody(request, headers) {
  let body = request.payload

  if (body) {
    if (typeof body !== 'string') {
      // this.#request.payload is NOT the same as the rawPayload
      body = request.rawPayload
    }

    parseContentLength(headers, body)

    // Set a default Content-Type if not provided.
    parseContentType(headers)
  } else if (typeof body === 'undefined' || body === '') {
    body = null
  }

  return body
}
