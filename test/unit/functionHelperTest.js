/* global describe before context it */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const functionHelper = require('../../src/functionHelper');

const expect = chai.expect;
chai.use(dirtyChai);

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
      expect(result.funTimeout).to.eql(30000);
    });

    it('should have babelOptions undefined', () => {
      expect(result.babelOptions).to.be.undefined();
    });

    it('nested folders for handlers', () => {
      const fun = {
        handler: './somefolder/.handlers/handler.run',
      };
      const result = functionHelper.getFunctionOptions(fun, funName, servicePath);
      expect(result.handlerName).to.eq('run');
      expect(result.handlerPath).to.eq('src/somefolder/.handlers/handler');
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
});
