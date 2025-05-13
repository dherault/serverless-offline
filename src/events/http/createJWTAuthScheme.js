import Boom from "@hapi/boom"
import { decodeJwt } from "jose"
import { log } from "../../utils/log.js"

const { isArray } = Array
const { now } = Date

export default function createJWTAuthScheme(jwtOptions) {
  const authorizerName = jwtOptions.name

  const identitySourceMatch = /^\$request.header.((?:\w+-?)+\w+)$/.exec(
    jwtOptions.identitySource,
  )

  if (!identitySourceMatch || identitySourceMatch.length !== 2) {
    throw new Error(
      `Serverless Offline only supports retrieving JWT from the headers (${authorizerName})`,
    )
  }

  const identityHeader = identitySourceMatch[1].toLowerCase()

  // Create Auth Scheme
  return () => ({
    async authenticate(request, h) {
      log.notice()
      log.notice(
        `Running JWT Authorization function for ${request.method} ${request.path} (${authorizerName})`,
      )

      // Get Authorization header
      const { req } = request.raw
      let jwtToken = req.headers[identityHeader]
      if (jwtToken && jwtToken.split(" ")[0] === "Bearer") {
        ;[, jwtToken] = jwtToken.split(" ")
      }

      try {
        const claims = decodeJwt(jwtToken)

        const expirationDate = new Date(claims.exp * 1000)
        if (expirationDate.getTime() < now()) {
          return Boom.unauthorized("JWT Token expired")
        }

        const { aud, iss, scope, scp, client_id: clientId } = claims
        if (iss !== jwtOptions.issuerUrl) {
          log.notice(`JWT Token not from correct issuer url`)

          return Boom.unauthorized("JWT Token not from correct issuer url")
        }

        const validAudiences = isArray(jwtOptions.audience)
          ? jwtOptions.audience
          : [jwtOptions.audience]
        const providedAudiences = isArray(aud) ? aud : [aud]
        const validAudienceProvided = providedAudiences.some((a) =>
          validAudiences.includes(a),
        )

        if (!validAudienceProvided && !validAudiences.includes(clientId)) {
          log.notice(`JWT Token does not contain correct audience`)

          return Boom.unauthorized(
            "JWT Token does not contain correct audience",
          )
        }

        let scopes = null
        if (jwtOptions.scopes && jwtOptions.scopes.length > 0) {
          if (!scope && !scp) {
            log.notice(`JWT Token missing valid scope`)

            return Boom.forbidden("JWT Token missing valid scope")
          }

          scopes = scp || scope.split(" ")
          if (scopes.every((s) => !jwtOptions.scopes.includes(s))) {
            log.notice(`JWT Token missing valid scope`)

            return Boom.forbidden("JWT Token missing valid scope")
          }
        }

        log.notice(`JWT Token validated`)

        // Set the credentials for the rest of the pipeline
        return h.authenticated({
          credentials: {
            claims,
            scopes,
          },
        })
      } catch (err) {
        log.notice(`JWT could not be decoded`)
        log.error(err)

        return Boom.unauthorized("Unauthorized")
      }
    },
  })
}
