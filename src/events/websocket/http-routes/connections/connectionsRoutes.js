import ConnectionsController from './ConnectionsController.js'
import debugLog from '../../../../debugLog.js'

export default function connectionsRoutes(webSocketClients, v3Utils) {
  const log = v3Utils && v3Utils.log
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

        if (log) {
          log.debug(`got POST to ${url}`)
        } else {
          debugLog(`got POST to ${url}`)
        }

        const clientExisted = await connectionsController.send(
          connectionId,
          payload,
        )

        if (!clientExisted) {
          return h.response(null).code(410)
        }

        if (log) {
          log.debug(`sent data to connection:${connectionId}`)
        } else {
          debugLog(`sent data to connection:${connectionId}`)
        }

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

        if (log) {
          log.debug(`got DELETE to ${url}`)
        } else {
          debugLog(`got DELETE to ${url}`)
        }

        const clientExisted = connectionsController.remove(connectionId)

        if (!clientExisted) {
          return h.response(null).code(410)
        }

        if (log) {
          log.debug(`closed connection:${connectionId}`)
        } else {
          debugLog(`closed connection:${connectionId}`)
        }

        return h.response(null).code(204)
      },
    },
  ]
}
