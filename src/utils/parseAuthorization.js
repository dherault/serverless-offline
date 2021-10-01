import { decode } from 'jsonwebtoken'

export default function parseAuthorization(headers) {
  let token = headers.Authorization || headers.authorization

  if (token && token.split(' ')[0] === 'Bearer') {
    ;[, token] = token.split(' ')
  }

  let claims
  let scopes

  if (token) {
    try {
      claims = decode(token) || undefined
      if (claims && claims.scope) {
        scopes = claims.scope.split(' ')
        // In AWS HTTP Api the scope property is removed from the decoded JWT
        // I'm leaving this property because I'm not sure how all of the authorizers
        // for AWS REST Api handle JWT.
        // claims = { ...claims }
        // delete claims.scope
      }
    } catch (err) {
      // Do nothing
    }
  }

  return { token, scopes, claims }
}
