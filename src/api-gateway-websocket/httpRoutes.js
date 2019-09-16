import debugLog from '../debugLog.js'

export default function httpRoutes(webSocketClients) {
  return [
    {
      method: 'POST',
      options: {
        payload: {
          parse: false,
        },
      },
      path: '/@connections/{connectionId}',
      handler(request, h) {
        const {
          params: { connectionId },
          payload,
          url,
        } = request

        debugLog(`got POST to ${url}`)

        // TODO, is this correct?
        if (!payload) {
          return null
        }

        const clientExisted = webSocketClients.send(
          connectionId,
          // payload is a Buffer
          payload.toString('utf-8'),
        )

        if (!clientExisted) {
          return h.response(null).code(410)
        }

        debugLog(`sent data to connection:${connectionId}`)

        return null
      },
    },

    {
      method: 'DELETE',
      options: {
        payload: {
          parse: false,
        },
      },
      path: '/@connections/{connectionId}',
      handler(request, h) {
        const {
          params: { connectionId },
          url,
        } = request

        debugLog(`got DELETE to ${url}`)

        const clientExisted = webSocketClients.close(connectionId)

        if (!clientExisted) {
          return h.response(null).code(410)
        }

        debugLog(`closed connection:${connectionId}`)

        return h.response(null).code(204)
      },
    },

    {
      method: 'GET',
      path: '/{path*}',
      handler(request, h) {
        return h.response(null).code(426)
      },
    },
  ]
}
