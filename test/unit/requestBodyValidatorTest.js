/* global describe before context it */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const requestBodyValidator = require('../../src/requestBodyValidator');

const expect = chai.expect;
chai.use(dirtyChai);

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
    before(() => {
      const eventHttp = {
        documentation: {
          requestModels: {
            'application/json': modelName,
          },
        },
      };
      result = requestBodyValidator.getModel(custom, eventHttp);
    });

    it('should have the correct model name', () => {
      expect(result.name).to.eq(modelName);
    });

    context('without documentation', () => {
      before(() => {
        result = requestBodyValidator.getModel({}, {});
      });

      it('should return null', () => {
        expect(result).to.eq(null);
      });
    });

    context('without requestModels', () => {
      before(() => {
        const eventHttp = {
          documentation: {},
        };
        result = requestBodyValidator.getModel({}, eventHttp);
      });

      it('should return null', () => {
        expect(result).to.eq(null);
      });
    });

    context('without required request model', () => {
      const logStorage = [];
      const anotherModel = 'anotherModel';
      const eventHttp = {
        documentation: {
          requestModels: {
            'application/json': anotherModel,
          },
        },
      };
      before(() => {
        result = requestBodyValidator.getModel(custom, eventHttp, log => logStorage.push(log));
      });

      it('should return null', () => {
        expect(result).to.eq(null);
      });
      it('should add a warning log', () => {
        expect(logStorage.length).to.eq(1);
        expect(logStorage[0]).to.eq(`Warning: can't find '${anotherModel}' within ${JSON.stringify(eventHttp.documentation.requestModels)}`);
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

    before(() => {
      const body = JSON.stringify({
        message: 12,
      });
      requestBodyValidator.validate(model, body);
    });

    context('json not conforming to the schema', () => {
      const body = JSON.stringify({
        message: 'foo',
      });
      it('should throw error', () => {
        expect(() => requestBodyValidator.validate(model, body)).to.throw(/Request body validation failed.*/);
      });
    });
  });
});
