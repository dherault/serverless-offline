import { createUniqueId, formatToClfTime } from '../../../utils/index.js'

const { now } = Date

export default class WebSocketRequestContext {
  #connectionId = null
  #eventType = null
  #route = null

  constructor(eventType, route, connectionId) {
    this.#connectionId = connectionId
    this.#eventType = eventType
    this.#route = route
  }

  create() {
    const timeEpoch = now()

    const requestContext = {
      apiId: 'private',
      connectedAt: now(), // TODO this is probably not correct, and should be the initial connection time?
      connectionId: this.#connectionId,
      domainName: 'localhost',
      eventType: this.#eventType,
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
      routeKey: this.#route,
      stage: 'local',
    }

    return requestContext
  }
}
