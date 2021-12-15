class CustomPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options

    this.hooks = {
      initialize: () => {
        this.loadPlugin()
      },
    }
  }

  loadPlugin() {
    const authProvider = {
      // eslint-disable-next-line no-unused-vars
      getAuthorizationStrategy: (endpoint, functionKey, method, path) => {
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
      },
    }

    this.options.plugins = {
      offline: {
        authentication: authProvider,
      },
    }
  }
}

module.exports = CustomPlugin
