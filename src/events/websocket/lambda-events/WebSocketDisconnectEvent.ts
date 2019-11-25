import WebSocketRequestContext from './WebSocketRequestContext'
import { parseHeaders, parseMultiValueHeaders } from '../../../utils/index'

export default class WebSocketDisconnectEvent {
  private readonly _connectionId: string

  constructor(connectionId: string) {
    this._connectionId = connectionId
  }

  create() {
    // TODO FIXME not sure where the headers come from
    const rawHeaders = ['Host', 'localhost', 'x-api-key', '', 'x-restapi', '']

    const headers = parseHeaders(rawHeaders)
    const multiValueHeaders = parseMultiValueHeaders(rawHeaders)

    const requestContext = new WebSocketRequestContext(
      'DISCONNECT',
      '$disconnect',
      this._connectionId,
    ).create()

    return {
      headers,
      isBase64Encoded: false,
      multiValueHeaders,
      requestContext,
    }
  }
}
