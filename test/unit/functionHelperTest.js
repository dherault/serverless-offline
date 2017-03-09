/* global describe before context it */

'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const functionHelper = require('../../src/functionHelper');

const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

describe('functionHelper', () => {
  describe('#getFunctionOptions', () => {

    const funName = 'testFunction';
    const servicePath = 'src';

    let result;
    before(() => {
      const fun = {
        handler: 'handler.hello',
      };
      result = functionHelper.getFunctionOptions(fun, funName, servicePath);
    });

    it('should have the correct funName', () => {
      expect(result.funName).to.eq(funName);
    });

    it('should have the correct handler name', () => {
      expect(result.handlerName).to.eq('hello');
    });

    it('should have the correct handler path', () => {
      expect(result.handlerPath).to.eq('src/handler');
    });

    it('should have the default timeout', () => {
      expect(result.funTimeout).to.eql(6000);
    });

    it('should have babelOptions undefined', () => {
      expect(result.babelOptions).to.be.undefined();
    });

    context('with a timeout', () => {
      before(() => {
        const fun = {
          handler: 'handler.hello',
          timeout: 7,
        };
        result = functionHelper.getFunctionOptions(fun, funName, servicePath);
      });

      it('should have the correct timeout', () => {
        expect(result.funTimeout).to.eql(7000);
      });
    });
  });

  describe('#createHandler', () => {

    function stubHandler() { }

    const funOptions = {
      handlerName: 'hello',
      handlerPath: '/handler',
    };

    it('should load a module handler with handlerLoader', () => {
      const options = { verboseHandlerLoader: false };
      const handlerLoader = functionHelper.handlerLoader;

      // set handlerLoader to a dummy spy
      functionHelper.handlerLoader = sinon.spy(() => stubHandler);
      const handler = functionHelper.createHandler(funOptions, options);

      expect(functionHelper.handlerLoader).to.be.have.calledWith(funOptions);
      expect(handler).to.eq(stubHandler);
      functionHelper.handlerLoader = handlerLoader;
    });

    it('it should load a module handler with verboseHandlerLoader', () => {
      const options = { verboseHandlerLoader: true };
      const verboseHandlerLoader = functionHelper.verboseHandlerLoader;

      // set verboseHandlerLoader to a dummy spy
      functionHelper.verboseHandlerLoader = sinon.spy(() => stubHandler);
      const handler = functionHelper.createHandler(funOptions, options);

      expect(functionHelper.verboseHandlerLoader).to.be.have.calledWith(funOptions);
      expect(handler).to.eq(stubHandler);
      functionHelper.verboseHandlerLoader = verboseHandlerLoader;
    });

  });
});
