import debugLog from '../../../../debugLog.js'

export default function catchAllRoute(v3Utils) {
  const log = v3Utils && v3Utils.log
  return {
    handler(request, h) {
      const { url } = request

      if (log) {
        log.debug(`got GET to ${url}`)
      } else {
        debugLog(`got GET to ${url}`)
      }

      return h.response(null).code(426)
    },
    method: 'GET',
    path: '/{path*}',
  }
}
