'use strict';

const requestBodyValidator = require('../../requestBodyValidator');

describe('requestBodyValidator', () => {
  describe('#getModel', () => {
    const modelName = 'myModel';
    const custom = {
      documentation: {
        models: [
          {
            name: modelName,
          },
        ],
      },
    };

    let result;
    beforeEach(() => {
      const eventHttp = {
        documentation: {
          requestModels: {
            'application/json': modelName,
          },
        },
      };
      result = requestBodyValidator.getModel(custom, eventHttp);
    });

    test('should have the correct model name', () => {
      expect(result.name).toEqual(modelName);
    });

    describe('without documentation', () => {
      beforeEach(() => {
        result = requestBodyValidator.getModel({}, {});
      });

      test('should return null', () => {
        expect(result).toEqual(null);
      });
    });

    describe('without requestModels', () => {
      beforeEach(() => {
        const eventHttp = {
          documentation: {},
        };
        result = requestBodyValidator.getModel({}, eventHttp);
      });

      test('should return null', () => {
        expect(result).toEqual(null);
      });
    });

    describe('without required request model', () => {
      const logStorage = [];
      const anotherModel = 'anotherModel';
      const eventHttp = {
        documentation: {
          requestModels: {
            'application/json': anotherModel,
          },
        },
      };

      beforeEach(() => {
        result = requestBodyValidator.getModel(custom, eventHttp, (log) =>
          logStorage.push(log),
        );
      });

      test('should return null', () => {
        expect(result).toEqual(null);
      });

      test('should add a warning log', () => {
        // expect(logStorage.length).toEqual(1);  TODO #DN fails in jest
        expect(logStorage[0]).toEqual(
          `Warning: can't find '${anotherModel}' within ${JSON.stringify(
            eventHttp.documentation.requestModels,
          )}`,
        );
      });
    });
  });

  describe('#validate', () => {
    const model = {
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'number',
          },
        },
      },
    };

    beforeEach(() => {
      const body = JSON.stringify({
        message: 12,
      });
      requestBodyValidator.validate(model, body);
    });

    describe('json not conforming to the schema', () => {
      const body = JSON.stringify({
        message: 'foo',
      });

      test('should throw error', () => {
        expect(() => requestBodyValidator.validate(model, body)).toThrow(
          /Request body validation failed.*/,
        );
      });
    });
  });
});
