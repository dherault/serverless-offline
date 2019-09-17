import ConnectionsController from './ConnectionsController.js'
import debugLog from '../../../debugLog.js'

export default function connectionsRoutes(webSocketClients) {
  const connectionsController = new ConnectionsController(webSocketClients)

  return [
    {
      method: 'POST',
      options: {
        payload: {
          parse: false,
        },
      },
      path: '/@connections/{connectionId}',
      async handler(request, h) {
        const {
          params: { connectionId },
          payload,
          url,
        } = request

        debugLog(`got POST to ${url}`)

        const clientExisted = await connectionsController.send(
          connectionId,
          payload,
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

        const clientExisted = connectionsController.remove(connectionId)

        if (!clientExisted) {
          return h.response(null).code(410)
        }

        debugLog(`closed connection:${connectionId}`)

        return h.response(null).code(204)
      },
    },
  ]
}
