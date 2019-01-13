const sinon = require('sinon');

module.exports = class ServerlessBuilder {
  constructor(serverless) {
    const serverlessDefaults = {
      service: {
        provider: {
          name: 'aws',
          stage: 'dev',
          region: 'us-east-1',
          runtime: 'nodejs4.3',
        },
        functions: {},
        getFunction(functionName) {
          return this.functions[functionName];
        },
      },
      cli: {
        log: sinon.stub(),
      },
      version: '1.0.2',
      config: {
        servicePath: '',
      },
    };
    this.serverless = Object.assign({}, serverless, serverlessDefaults);
    this.serverless.service.getFunction = this.serverless.service.getFunction.bind(this.serverless.service);
  }

  addApiKeys(keys) {
    this.serverless.service.provider = Object.assign(this.serverless.service.provider, { apiKeys: keys });
  }

  addFunction(functionName, functionConfig) {
    this.serverless.service.functions[functionName] = functionConfig;
  }

  addCustom(prop, value) {
    const newCustomProp = {};
    newCustomProp[prop] = value;
    this.serverless.service.custom = Object.assign(this.serverless.service.custom || {}, newCustomProp);
  }

  toObject() {
    return this.serverless;
  }
};
