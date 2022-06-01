export default function catchAllRoute(v3Utils) {
  return {
    handler(request, h) {
      const { url } = request

      v3Utils.log.debug(`got GET to ${url}`)

      return h.response(null).code(426)
    },
    method: 'GET',
    path: '/{path*}',
  }
}
