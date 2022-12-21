import Boom from '@hapi/boom'
import jwt from 'jsonwebtoken'
import serverlessLog from '../../serverlessLog.js'

const { isArray } = Array

export default function createAuthScheme(jwtOptions, { log }) {
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
      if (log) {
        log.notice()
        log.notice(
          `Running JWT Authorization function for ${request.method} ${request.path} (${authorizerName})`,
        )
      } else {
        console.log('') // Just to make things a little pretty

        // TODO: this only validates specific properties of the JWT
        // it does not verify the JWT is correctly signed. That would
        // be a great feature to add under an optional flag :)

        serverlessLog(
          `Running JWT Authorization function for ${request.method} ${request.path} (${authorizerName})`,
        )
      }

      // Get Authorization header
      const { req } = request.raw
      let jwtToken = req.headers[identityHeader]
      if (jwtToken && jwtToken.split(' ')[0] === 'Bearer') {
        ;[, jwtToken] = jwtToken.split(' ')
      }

      try {
        const decoded = jwt.decode(jwtToken, { complete: true })
        if (!decoded) {
          return Boom.unauthorized('JWT not decoded')
        }

        const expirationDate = new Date(decoded.payload.exp * 1000)
        if (expirationDate.valueOf() < Date.now()) {
          return Boom.unauthorized('JWT Token expired')
        }

        const { iss, aud, scope } = decoded.payload
        const clientId = decoded.payload.client_id
        if (iss !== jwtOptions.issuerUrl) {
          if (log) {
            log.notice(`JWT Token not from correct issuer url`)
          } else {
            serverlessLog(`JWT Token not from correct issuer url`)
          }
          return Boom.unauthorized('JWT Token not from correct issuer url')
        }

        const validAudiences = isArray(jwtOptions.audience)
          ? jwtOptions.audience
          : [jwtOptions.audience]
        const providedAudiences = isArray(aud) ? aud : [aud]
        const validAudienceProvided = providedAudiences.some((a) =>
          validAudiences.includes(a),
        )

        if (!validAudienceProvided && !validAudiences.includes(clientId)) {
          if (log) {
            log.notice(`JWT Token does not contain correct audience`)
          } else {
            serverlessLog(`JWT Token does not contain correct audience`)
          }
          return Boom.unauthorized(
            'JWT Token does not contain correct audience',
          )
        }

        let scopes = null
        if (jwtOptions.scopes && jwtOptions.scopes.length) {
          if (!scope) {
            if (log) {
              log.notice(`JWT Token missing valid scope`)
            } else {
              serverlessLog(`JWT Token missing valid scope`)
            }
            return Boom.forbidden('JWT Token missing valid scope')
          }

          scopes = scope.split(' ')
          if (
            scopes.every((s) => {
              return !jwtOptions.scopes.includes(s)
            })
          ) {
            if (log) {
              log.notice(`JWT Token missing valid scope`)
            } else {
              serverlessLog(`JWT Token missing valid scope`)
            }
            return Boom.forbidden('JWT Token missing valid scope')
          }
        }

        if (log) {
          log.notice(`JWT Token validated`)
        } else {
          serverlessLog(`JWT Token validated`)
        }

        // Set the credentials for the rest of the pipeline
        // return resolve(
        return h.authenticated({
          credentials: {
            claims: decoded.payload,
            scopes,
          },
        })
      } catch (err) {
        if (log) {
          log.notice(`JWT could not be decoded`)
          log.error(err)
        } else {
          serverlessLog(`JWT could not be decoded`)
          serverlessLog(err)
        }

        return Boom.unauthorized('Unauthorized')
      }
    },
  })
}
