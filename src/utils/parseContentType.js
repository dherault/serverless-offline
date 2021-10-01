export default function parseContentType(headers) {
  if (
    !headers['Content-Type'] &&
    !headers['content-type'] &&
    !headers['Content-type']
  ) {
    Object.assign(headers, { 'Content-Type': 'application/json' })
  }
}
