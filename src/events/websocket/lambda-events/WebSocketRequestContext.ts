import { createUniqueId, formatToClfTime } from '../../../utils/index'

const { now } = Date

export default class WebSocketRequestContext {
  private readonly _connectionId: string
  private readonly _eventType: any
  private readonly _route: string

  constructor(eventType, route: string, connectionId: string) {
    this._connectionId = connectionId
    this._eventType = eventType
    this._route = route
  }

  create() {
    const timeEpoch = now()

    const requestContext = {
      apiId: 'private',
      connectedAt: now(), // TODO this is probably not correct, and should be the initial connection time?
      connectionId: this._connectionId,
      domainName: 'localhost',
      eventType: this._eventType,
      extendedRequestId: createUniqueId(),
      identity: {
        accessKey: null,
        accountId: null,
        caller: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: '127.0.0.1',
        user: null,
        userAgent: null,
        userArn: null,
      },
      messageDirection: 'IN',
      messageId: createUniqueId(),
      requestId: createUniqueId(),
      requestTime: formatToClfTime(timeEpoch),
      requestTimeEpoch: timeEpoch,
      routeKey: this._route,
      stage: 'local',
    }

    return requestContext
  }
}
