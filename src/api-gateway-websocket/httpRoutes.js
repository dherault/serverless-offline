import debugLog from '../debugLog.js'

export default function httpRoutes(webSocketClients) {
  return [
    {
      method: 'GET',
      path: '/{path*}',
      handler(request, h) {
        h.response().code(426)
      },
    },

    {
      method: 'POST',
      options: {
        payload: {
          parse: false,
        },
      },
      path: '/@connections/{connectionId}',
      handler(request, h) {
        debugLog(`got POST to ${request.url}`)

        const { connectionId } = request.params

        const clientExisted = webSocketClients.send(
          connectionId,
          request.payload,
        )

        if (!clientExisted) {
          return h.response().code(410)
        }

        if (!request.payload) {
          return ''
        }

        debugLog(`sent data to connection:${connectionId}`)

        return ''
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
        const { connectionId } = request.params

        debugLog(`got DELETE to ${request.url}`)

        const clientExisted = webSocketClients.close(connectionId)

        if (!clientExisted) {
          return h.response().code(410)
        }

        debugLog(`closed connection:${connectionId}`)

        return ''
      },
    },
  ]
}
