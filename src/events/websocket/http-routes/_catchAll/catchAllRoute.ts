import debugLog from '../../../../debugLog'

export default function catchAllRoute() {
  return {
    method: 'GET',
    path: '/{path*}',
    handler(request, h) {
      const { url } = request

      debugLog(`got GET to ${url}`)

      return h.response(null).code(426)
    },
  }
}
