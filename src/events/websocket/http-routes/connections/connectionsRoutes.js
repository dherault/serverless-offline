import { log } from '@serverless/utils/log.js'
import ConnectionsController from './ConnectionsController.js'

export default function connectionsRoutes(webSocketClients) {
  const connectionsController = new ConnectionsController(webSocketClients)

  return [
    {
      async handler(request, h) {
        const {
          params: { connectionId },
          payload,
          url,
        } = request

        log.debug(`got POST to ${url}`)

        const clientExisted = await connectionsController.send(
          connectionId,
          payload,
        )

        if (!clientExisted) {
          return h.response(null).code(410)
        }

        log.debug(`sent data to connection:${connectionId}`)

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

        log.debug(`got DELETE to ${url}`)

        const clientExisted = connectionsController.remove(connectionId)

        if (!clientExisted) {
          return h.response(null).code(410)
        }

        log.debug(`closed connection:${connectionId}`)

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
