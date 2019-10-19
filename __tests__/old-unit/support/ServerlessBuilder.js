export default class ServerlessBuilder {
  constructor(serverless) {
    const serverlessDefaults = {
      cli: {
        // log: stub(), // TODO FIXME
        log: () => {},
      },
      config: {
        servicePath: '',
      },
      service: {
        functions: {},
        // https://github.com/serverless/serverless/blob/v1.54.0/lib/classes/Service.js#L250
        getAllEventsInFunction(functionName) {
          return this.getFunction(functionName).events
        },
        // https://github.com/serverless/serverless/blob/v1.54.0/lib/classes/Service.js#L216
        getAllFunctions() {
          return Object.keys(this.functions)
        },
        // https://github.com/serverless/serverless/blob/v1.54.0/lib/classes/Service.js#L228
        getFunction(functionName) {
          if (functionName in this.functions) {
            return this.functions[functionName]
          }
          throw new Error(
            `Function "${functionName}" doesn't exist in this Service`,
          )
        },
        provider: {
          name: 'aws',
          region: 'us-east-1',
          runtime: 'nodejs4.3',
          stage: 'dev',
        },
      },
      version: '1.0.2',
    }

    this.serverless = { ...serverless, ...serverlessDefaults }
    this.serverless.service.getFunction = this.serverless.service.getFunction.bind(
      this.serverless.service,
    )
  }

  addApiKeys(keys) {
    this.serverless.service.provider.apiKeys = keys
  }

  addFunction(functionKey, functionConfig) {
    this.serverless.service.functions[functionKey] = functionConfig
  }

  addCustom(prop, value) {
    this.serverless.service.custom = {
      ...this.serverless.service.custom,
      [prop]: value,
    }
  }

  toObject() {
    return this.serverless
  }
}
