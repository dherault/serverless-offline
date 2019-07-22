'use strict';

const functionHelper = require('../../functionHelper');
const Offline = require('../../index');
const ServiceBuilder = require('./ServerlessBuilder');

function createHandler(handlers) {
  return (funOptions) =>
    handlers[funOptions.handlerPath.split('/')[1]][funOptions.handlerName];
}

module.exports = class OfflineBuilder {
  constructor(serviceBuilder, options) {
    this.serviceBuilder = serviceBuilder || new ServiceBuilder();
    this.handlers = {};

    // Avoid already wrapped exception when offline is instanciated many times
    // Problem if test are instanciated serveral times
    // FIXME, we could refactor index to have an handlerFactory and just instanciate offline with a factory test stub
    if (functionHelper.createHandler.restore) {
      functionHelper.createHandler.restore();
    }
    this.options = options || {};
  }

  addFunctionConfig(functionName, functionConfig, handler) {
    this.serviceBuilder.addFunction(functionName, functionConfig);
    const funOptions = functionHelper.getFunctionOptions(
      functionConfig,
      functionName,
      '.',
    );
    const handlerPath = funOptions.handlerPath.split('/')[1];
    this.handlers[handlerPath] = this.constructor.getFunctionIndex(
      funOptions.handlerName,
      handler,
    );

    return this;
  }

  addFunctionHTTP(functionName, http, handler) {
    return this.addFunctionConfig(
      functionName,
      {
        events: [
          {
            http,
          },
        ],
        handler: `handler.${functionName}`,
      },
      handler,
    );
  }

  addCustom(prop, value) {
    this.serviceBuilder.addCustom(prop, value);

    return this;
  }

  addApiKeys(keys) {
    this.serviceBuilder.addApiKeys(keys);

    return this;
  }

  static getFunctionIndex(handlerName, handler) {
    const functionIndex = {};
    functionIndex[handlerName] = handler;

    return functionIndex;
  }

  toObject() {
    const offline = new Offline(this.serviceBuilder.toObject(), this.options);

    functionHelper.createHandler = jest.fn(createHandler(this.handlers));

    // offline.printBlankLine = jest.fn();

    this.server = offline._buildServer();

    // offline.apiGateway.printBlankLine = jest.fn();

    this.server.restore = this.restore;

    return this.server;
  }

  static restore() {
    functionHelper.createHandler.restore();
  }
};
