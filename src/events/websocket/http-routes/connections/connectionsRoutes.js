import ConnectionsController from './ConnectionsController.js'

export default function connectionsRoutes(webSocketClients, v3Utils) {
  const connectionsController = new ConnectionsController(webSocketClients)

  return [
    {
      async handler(request, h) {
        const {
          params: { connectionId },
          payload,
          url,
        } = request

        v3Utils.log.debug(`got POST to ${url}`)

        const clientExisted = await connectionsController.send(
          connectionId,
          payload,
        )

        if (!clientExisted) {
          return h.response(null).code(410)
        }

        v3Utils.log.debug(`sent data to connection:${connectionId}`)

        return null
      },

      method: 'POST',
      options: {
        payload: {
          parse: false,
        },
      },
      path: '/@connections/{connectionId}',
    },

    {
      handler(request, h) {
        const {
          params: { connectionId },
          url,
        } = request

        v3Utils.log.debug(`got DELETE to ${url}`)

        const clientExisted = connectionsController.remove(connectionId)

        if (!clientExisted) {
          return h.response(null).code(410)
        }

        v3Utils.log.debug(`closed connection:${connectionId}`)

        return h.response(null).code(204)
      },

      method: 'DELETE',
      options: {
        payload: {
          parse: false,
        },
      },
      path: '/@connections/{connectionId}',
    },
  ]
}
