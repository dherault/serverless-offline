'use strict'

const { existsSync, readFileSync } = require('fs')
const { resolve } = require('path')
const debugLog = require('./debugLog.js')
const OfflineEndpoint = require('./OfflineEndpoint.js')

function readFile(filename) {
  return readFileSync(resolve(__dirname, filename), 'utf8')
}

// velocity template defaults
const defaultRequestTemplate = readFile('./templates/offline-default.req.vm')
const defaultResponseTemplate = readFile('./templates/offline-default.res.vm')

function getResponseContentType(fep) {
  if (fep.response && fep.response.headers['Content-Type']) {
    return fep.response.headers['Content-Type'].replace(/'/gm, '')
  }

  return 'application/json'
}

module.exports = class Endpoint {
  constructor(httpData, handlerPath) {
    this._handlerPath = handlerPath
    this._httpData = httpData

    return this._generate()
  }

  // determine whether we have function level overrides for velocity templates
  // if not we will use defaults
  _setVmTemplates(fullEndpoint) {
    // determine requestTemplate
    // first check if requestTemplate is set through serverless
    const fep = fullEndpoint

    try {
      // determine request template override
      const reqFilename = `${this._handlerPath}.req.vm`

      // check if serverless framework populates the object itself
      if (
        typeof this._httpData.request === 'object' &&
        typeof this._httpData.request.template === 'object'
      ) {
        const templatesConfig = this._httpData.request.template

        Object.keys(templatesConfig).forEach((key) => {
          fep.requestTemplates[key] = templatesConfig[key]
        })
      }
      // load request template if exists if not use default from serverless offline
      else if (existsSync(reqFilename)) {
        fep.requestTemplates['application/json'] = readFileSync(
          reqFilename,
          'utf8',
        )
      } else {
        fep.requestTemplates['application/json'] = defaultRequestTemplate
      }

      // determine response template
      const resFilename = `${this._handlerPath}.res.vm`

      fep.responseContentType = getResponseContentType(fep)
      debugLog('Response Content-Type ', fep.responseContentType)

      // load response template from http response template, or load file if exists other use default
      if (fep.response && fep.response.template) {
        fep.responses.default.responseTemplates[fep.responseContentType] =
          fep.response.template
      } else if (existsSync(resFilename)) {
        fep.responses.default.responseTemplates[
          fep.responseContentType
        ] = readFileSync(resFilename, 'utf8')
      } else {
        fep.responses.default.responseTemplates[
          fep.responseContentType
        ] = defaultResponseTemplate
      }
    } catch (err) {
      debugLog(`Error: ${err}`)
    }

    return fep
  }

  // return fully generated Endpoint
  _generate() {
    const offlineEndpoint = new OfflineEndpoint()

    const fullEndpoint = {
      ...offlineEndpoint,
      ...this._httpData,
    }

    if (this._httpData.integration === 'lambda') {
      // determine request and response templates or use defaults
      return this._setVmTemplates(fullEndpoint)
    }

    return fullEndpoint
  }
}
