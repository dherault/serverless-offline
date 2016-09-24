'use strict';
/**
 * Endpoint class to return a valid handpoint for offline to handle
 * requires serverless service and http Event data to be merged in
 * Works with Serverless version 1.0
 *
 * bsoylu 8/16/2016
 */

// External depedencies
const _ = require('lodash');

// Node dependencies
const fs = require('fs');

// require extension to load velocity templates
require.extensions['.vm'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

// project dependencies
const debugLog = require('./debugLog');
const endpointStruct = require('./offline-endpoint.json');
// velocity template defaults
const defRequestTemplate = require('./offline-default.req.vm');
const defResponseTemplate = require('./offline-default.res.vm');

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
    let fep = fullEndpoint;
    try {
      // determine request template override
      const reqFilename = `${this.options.handlerPath}.req.vm`;
      // check if serverless framework populates the object itself
      if (typeof this.httpData.request === 'object' && typeof this.httpData.request.template === 'object') {
        const templatesConfig = this.httpData.request.template;
        Object.keys(templatesConfig).forEach(function(key,index) {
          fep.requestTemplates[key] = templatesConfig[key];
        });
      } else {
        // load request template if exists if not use default from serverless offline
        if (fs.existsSync(reqFilename)) {
          fep.requestTemplates['application/json'] = fs.readFileSync(reqFilename, 'utf8');
        } else {
          fep.requestTemplates['application/json'] = defRequestTemplate;
        }
      }

      // determine response template
      const resFilename = `${this.options.handlerPath}.res.vm`;
      // load response template if exists other use default
      if (fs.existsSync(resFilename)) {
        fep.responses.default.responseTemplates['application/json'] = fs.readFileSync(resFilename, 'utf8');
      } else {
        fep.responses.default.responseTemplates['application/json'] = defResponseTemplate;
      }
    } catch (err) {
      this.errorHandler(err);
    }

    return fep;
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

    let fullEndpoint = {};
    _.merge(fullEndpoint, endpointStruct, this.httpData);
    // determine request and response templates or use defaults
    fullEndpoint = this.setVmTemplates(fullEndpoint);

    return fullEndpoint;
  }

}

module.exports = Endpoint;
