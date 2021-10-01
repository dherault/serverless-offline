import { Buffer } from 'buffer'

export default function parseContentLength(headers, body) {
  if (
    !headers['Content-Length'] &&
    !headers['content-length'] &&
    !headers['Content-length'] &&
    (typeof body === 'string' ||
      body instanceof Buffer ||
      body instanceof ArrayBuffer)
  ) {
    Object.assign(headers, {
      'Content-Length': String(Buffer.byteLength(body)),
    })
  }
}
