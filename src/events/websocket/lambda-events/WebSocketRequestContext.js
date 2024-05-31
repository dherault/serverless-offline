import crypto from "node:crypto"
import { formatToClfTime } from "../../../utils/index.js"

const { now } = Date

const connectedAt = new Map()

export default class WebSocketRequestContext {
  #connectedAt = null

  #connectionId = null

  #eventType = null

  #route = null

  constructor(eventType, route, connectionId) {
    this.#connectionId = connectionId
    this.#eventType = eventType
    this.#route = route

    if (eventType === "CONNECT") {
      connectedAt.set(connectionId, now())
    }

    this.#connectedAt = connectedAt.get(connectionId)

    if (eventType === "DISCONNECT") {
      connectedAt.delete(connectionId)
    }
  }

  create() {
    const timeEpoch = now()

    const requestContext = {
      apiId: "private",
      connectedAt: this.#connectedAt,
      connectionId: this.#connectionId,
      domainName: "localhost",
      eventType: this.#eventType,
      extendedRequestId: crypto.randomUUID(),
      identity: {
        accessKey: null,
        accountId: null,
        caller: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: "127.0.0.1",
        user: null,
        userAgent: null,
        userArn: null,
      },
      messageDirection: "IN",
      messageId: crypto.randomUUID(),
      requestId: crypto.randomUUID(),
      requestTime: formatToClfTime(timeEpoch),
      requestTimeEpoch: timeEpoch,
      routeKey: this.#route,
      stage: "local",
    }

    return requestContext
  }
}
