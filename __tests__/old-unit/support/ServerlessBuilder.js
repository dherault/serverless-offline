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
        getFunction(functionKey) {
          return this.functions[functionKey]
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
