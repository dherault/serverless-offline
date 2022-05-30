// eslint-disable-next-line no-unused-vars
module.exports = (endpoint, functionKey, method, path) => {
  return {
    name: 'strategy-name',
    scheme: 'scheme',

    getAuthenticateFunction: () => ({
      async authenticate(request, h) {
        const context = { expected: 'it works' }
        return h.authenticated({
          credentials: {
            context,
          },
        })
      },
    }),
  }
}
