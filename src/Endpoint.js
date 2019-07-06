'use strict';

const { existsSync, readFileSync } = require('fs');
const path = require('path');
const debugLog = require('./debugLog');
const endpointStruct = require('./config/offline-endpoint.json');

function readFile(filename) {
  return readFileSync(path.resolve(__dirname, filename), 'utf8');
}

// velocity template defaults
const defaultRequestTemplate = readFile('./config/offline-default.req.vm');
const defaultResponseTemplate = readFile('./config/offline-default.res.vm');

module.exports = class Endpoint {
  constructor(httpData, options) {
    this.httpData = httpData;
    this.options = options;
  }

  // determine whether we have function level overrides for velocity templates
  // if not we will use defaults
  setVmTemplates(fullEndpoint) {
    // determine requestTemplate
    // first check if requestTemplate is set through serverless
    const fep = fullEndpoint;

    try {
      // determine request template override
      const reqFilename = `${this.options.handlerPath}.req.vm`;
      // check if serverless framework populates the object itself
      if (
        typeof this.httpData.request === 'object' &&
        typeof this.httpData.request.template === 'object'
      ) {
        const templatesConfig = this.httpData.request.template;
        Object.keys(templatesConfig).forEach((key) => {
          fep.requestTemplates[key] = templatesConfig[key];
        });
      }
      // load request template if exists if not use default from serverless offline
      else if (existsSync(reqFilename)) {
        fep.requestTemplates['application/json'] = readFileSync(
          reqFilename,
          'utf8',
        );
      } else {
        fep.requestTemplates['application/json'] = defaultRequestTemplate;
      }

      // determine response template
      const resFilename = `${this.options.handlerPath}.res.vm`;
      fep.responseContentType = this.getResponseContentType(fep);
      debugLog('Response Content-Type ', fep.responseContentType);
      // load response template from http response template, or load file if exists other use default
      if (fep.response && fep.response.template) {
        fep.responses.default.responseTemplates[fep.responseContentType] =
          fep.response.template;
      } else if (existsSync(resFilename)) {
        fep.responses.default.responseTemplates[
          fep.responseContentType
        ] = readFileSync(resFilename, 'utf8');
      } else {
        fep.responses.default.responseTemplates[
          fep.responseContentType
        ] = defaultResponseTemplate;
      }
    } catch (err) {
      this.errorHandler(err);
    }

    return fep;
  }

  getResponseContentType(fep) {
    let responseContentType = 'application/json';

    if (fep.response && fep.response.headers['Content-Type']) {
      responseContentType = fep.response.headers['Content-Type'].replace(
        /'/gm,
        '',
      );
    }

    return responseContentType;
  }

  // Generic error handler
  errorHandler(err) {
    debugLog(`Error: ${err}`);
  }

  // return the fully generated Endpoint
  generate() {
    // cheap and dirty deep clone
    const endpointClone = JSON.parse(JSON.stringify(endpointStruct));

    const fullEndpoint = { ...endpointClone, ...this.httpData };

    if (this.httpData.integration === 'lambda') {
      // determine request and response templates or use defaults
      return this.setVmTemplates(fullEndpoint);
    }

    return fullEndpoint;
  }
};
