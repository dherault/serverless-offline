'use strict';

/**
 * Endpoint class to return a valid handpoint for offline to handle
 * requires serverless service and http Event data to be merged in
 * Works with Serverless version 1.0
 *
 * bsoylu 8/16/2016
 */

// Node dependencies
const fs = require('fs');
const path = require('path');

// project dependencies
const debugLog = require('./debugLog');

function readFile(filename) {
  return fs.readFileSync(path.resolve(__dirname, filename), 'utf8');
}

// we'll read the json as string, so we are able to clone it
const endpointStruct = readFile('./offline-endpoint.json');
// velocity template defaults
const defaultRequestTemplate = readFile('./offline-default.req.vm');
const defaultResponseTemplate = readFile('./offline-default.res.vm');

class Endpoint {
  constructor(httpData, options) {
    this.httpData = httpData;
    this.options = options;
  }

  /*
  * determine whether we have function level overrides for velocity templates
  * if not we will use defaults
  */
  setVmTemplates(fullEndpoint) {
    // determine requestTemplate
    // first check if requestTemplate is set through serverless
    const fep = fullEndpoint;

    try {
      // determine request template override
      const reqFilename = `${this.options.handlerPath}.req.vm`;
      // check if serverless framework populates the object itself
      if (typeof this.httpData.request === 'object' && typeof this.httpData.request.template === 'object') {
        const templatesConfig = this.httpData.request.template;
        Object.keys(templatesConfig).forEach(key => {
          fep.requestTemplates[key] = templatesConfig[key];
        });
      }
      // load request template if exists if not use default from serverless offline
      else if (fs.existsSync(reqFilename)) {
        fep.requestTemplates['application/json'] = fs.readFileSync(reqFilename, 'utf8');
      }
      else {
        fep.requestTemplates['application/json'] = defaultRequestTemplate;
      }

      // determine response template
      const resFilename = `${this.options.handlerPath}.res.vm`;
      fep.responseContentType = this.getResponseContentType(fep);
      debugLog('Response Content-Type ', fep.responseContentType);
      // load response template from http response template, or load file if exists other use default
      if (fep.response && fep.response.template) {
        fep.responses.default.responseTemplates[fep.responseContentType] = fep.response.template;
      }
      else if (fs.existsSync(resFilename)) {
        fep.responses.default.responseTemplates[fep.responseContentType] = fs.readFileSync(resFilename, 'utf8');
      }
      else {
        fep.responses.default.responseTemplates[fep.responseContentType] = defaultResponseTemplate;
      }
    }
    catch (err) {
      this.errorHandler(err);
    }

    return fep;
  }

  getResponseContentType(fep) {
    let responseContentType = 'application/json';

    if (fep.response && fep.response.headers['Content-Type']) {
      responseContentType = fep.response.headers['Content-Type'].replace(/'/gm, '');
    }

    return responseContentType;
  }

  /*
   * Generic error handler
   */
  errorHandler(err) {
    debugLog(`Error: ${err}`);
  }

  /*
   * return the fully generated Endpoint
   */
  generate() {
    // JSON.parse(endpointStruct) -> new instance, deep clone
    let fullEndpoint = Object.assign({}, JSON.parse(endpointStruct), this.httpData);

    if (this.httpData.integration && this.httpData.integration === 'lambda') {
      // determine request and response templates or use defaults
      fullEndpoint = this.setVmTemplates(fullEndpoint);
    }

    return fullEndpoint;
  }

}

module.exports = Endpoint;
