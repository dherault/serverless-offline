'use strict';

const path = require('path');
const functionHelper = require('../../functionHelper');

describe('functionHelper', () => {
  describe('#getFunctionOptions', () => {
    const funName = 'testFunction';
    const servicePath = 'src';

    let result;
    beforeEach(() => {
      const fun = {
        handler: 'handler.hello',
      };
      result = functionHelper.getFunctionOptions(fun, funName, servicePath);
    });

    test('should have the correct funName', () => {
      expect(result.funName).toEqual(funName);
    });

    test('should have the correct handler name', () => {
      expect(result.handlerName).toEqual('hello');
    });

    test('should have the correct handler path', () => {
      expect(result.handlerPath).toEqual(path.join('src', 'handler'));
    });

    test('should have the default timeout', () => {
      expect(result.funTimeout).toEqual(30000);
    });

    test('should have babelOptions undefined', () => {
      expect(result.babelOptions).toEqual(undefined);
    });

    test('nested folders for handlers', () => {
      const fun = {
        handler: './somefolder/.handlers/handler.run',
      };
      const result = functionHelper.getFunctionOptions(
        fun,
        funName,
        servicePath,
      );
      expect(result.handlerName).toEqual('run');
      expect(result.handlerPath).toEqual(
        path.join('src', 'somefolder', '.handlers', 'handler'),
      );
    });

    describe('with a timeout', () => {
      beforeEach(() => {
        const fun = {
          handler: 'handler.hello',
          timeout: 7,
        };
        result = functionHelper.getFunctionOptions(fun, funName, servicePath);
      });

      test('should have the correct timeout', () => {
        expect(result.funTimeout).toEqual(7000);
      });
    });
  });
});
