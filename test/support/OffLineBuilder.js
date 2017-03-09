'use strict';

const sinon = require('sinon');
const functionHelper = require('../../src/functionHelper');
const Offline = require('../../src/index');
const ServiceBuilder = require('./ServerlessBuilder');

function createHandler(handlers) {
  return funOptions => handlers[funOptions.handlerPath.split('/')[1]][funOptions.handlerName];
}

module.exports = class OffLineBuilder {
  constructor(serviceBuilder, options) {
    this.serviceBuilder = serviceBuilder || new ServiceBuilder();
    this.handlers = {};
    this.options = options || {};
  }

  addFunctionConfig(functionName, functionConfig, handler) {
    this.serviceBuilder.addFunction(functionName, functionConfig);
    const funOptions = functionHelper.getFunctionOptions(functionConfig, functionName, '.');
    const handlerPath = funOptions.handlerPath.split('/')[1];
    this.handlers[handlerPath] = this.constructor.getFunctionIndex(funOptions.handlerName, handler);

    return this;
  }

  addFunctionHTTP(functionName, http, handler) {
    return this.addFunctionConfig(functionName, {
      handler: `handler.${functionName}`,
      events: [{
        http,
      }],
    }, handler);
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
    sinon.stub(functionHelper, 'createHandler', createHandler(this.handlers));
    sinon.stub(offline, 'printBlankLine');
    this.server = offline._buildServer();

    Object.assign(this.server, {
      restore: this.restore,
    });

    return this.server;
  }

  restore() {
    functionHelper.createHandler.restore();
  }
};
