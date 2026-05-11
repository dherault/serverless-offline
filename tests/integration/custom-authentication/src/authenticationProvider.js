"use strict"

module.exports = function authenticationProvider() {
  return {
    getAuthenticateFunction() {
      return {
        async authenticate(request, h) {
          const context = {
            expected: "it works",
          }

          return h.authenticated({
            credentials: {
              context,
            },
          })
        },
      }
    },

    name: "strategy-name",
    scheme: "scheme",
  }
}
