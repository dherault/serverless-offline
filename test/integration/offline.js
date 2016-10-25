'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const functionHelper = require('../../src/functionHelper');
const Offline = require('../../src/index');
const ServerlessBuilder = require('../support/ServerlessBuilder');

const expect = chai.expect;
chai.use(dirtyChai);

describe('Offline', () => {
  const serverlessBuilder = new ServerlessBuilder();
  serverlessBuilder.addFunction('fn1', {
    handler: 'handler.hello',
    events: [{
      http: {
        path: 'fn1',
        method: 'GET',
      },
    }],
  });
  const serverless = serverlessBuilder.toObject();

  const options = {};

  let offline;
  let server;

  before(() => {
    offline = new Offline(serverless, options);
    sinon.stub(offline, 'printBlankLine');
    server = offline._buildServer();
  });

  context('with a non existing route', () => {
    it('should return 404', () => {
      const reqOpts = {
        method: 'GET',
        url: '/magic',
      };

      server.inject(reqOpts, (res) => {
        expect(res.statusCode).to.eq(404);
      });
    });
  });

  context('with an exiting lambda-proxy integration type route', () => {
    it('should return the expected status code', () => {
      const reqOpts = {
        method: 'GET',
        url: '/fn1',
      };

      sinon.stub(functionHelper, 'createHandler', () => () => ({
        statusCode: 201,
        body: null,
      }));

      server.inject(reqOpts, (res) => {
        expect(res.statusCode).to.eq(201);
      });

      functionHelper.createHandler.restore();
    });
  });
});
