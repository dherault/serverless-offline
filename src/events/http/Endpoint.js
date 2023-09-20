import { existsSync, readFileSync } from 'node:fs'
import { log } from '@serverless/utils/log.js'
import { join } from 'desm'
import OfflineEndpoint from './OfflineEndpoint.js'

const { entries } = Object

// velocity template defaults
const defaultRequestTemplate = readFileSync(
  join(import.meta.url, 'templates/offline-default.req.vm'),
  'utf8',
)
const defaultResponseTemplate = readFileSync(
  join(import.meta.url, 'templates/offline-default.res.vm'),
  'utf8',
)

function getResponseContentType(fep) {
  if (fep.response && fep.response.headers['Content-Type']) {
    return fep.response.headers['Content-Type'].replaceAll(/'/gm, '')
  }

  return 'application/json'
}

export default class Endpoint {
  #handlerPath = null

  #http = null

  constructor(handlerPath, http) {
    this.#handlerPath = handlerPath
    this.#http = http
  }

  // determine whether we have function level overrides for velocity templates
  // if not we will use defaults
  #setVmTemplates(fullEndpoint) {
    // determine requestTemplate
    // first check if requestTemplate is set through serverless
    const fep = fullEndpoint

    try {
      // determine request template override
      const reqFilename = `${this.#handlerPath}.req.vm`

      // check if serverless framework populates the object itself
      if (
        typeof this.#http.request === 'object' &&
        typeof this.#http.request.template === 'object'
      ) {
        const templatesConfig = this.#http.request.template

        entries(templatesConfig).forEach(([key, value]) => {
          fep.requestTemplates[key] = value
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
      const resFilename = `${this.#handlerPath}.res.vm`

      fep.responseContentType = getResponseContentType(fep)
      log.debug('Response Content-Type ', fep.responseContentType)

      // load response template from http response template, or load file if exists other use default
      if (fep.response && fep.response.template) {
        fep.responses.default.responseTemplates[fep.responseContentType] =
          fep.response.template
      } else if (existsSync(resFilename)) {
        fep.responses.default.responseTemplates[fep.responseContentType] =
          readFileSync(resFilename, 'utf8')
      } else {
        fep.responses.default.responseTemplates[fep.responseContentType] =
          defaultResponseTemplate
      }
    } catch (err) {
      log.debug(`Error: ${err}`)
    }

    return fep
  }

  // loosely based on:
  // https://github.com/serverless/serverless/blob/v1.59.2/lib/plugins/aws/package/compile/events/apiGateway/lib/validate.js#L380
  #getIntegration(http) {
    const { integration, async: isAsync } = http
    if (integration) {
      const normalizedIntegration = integration.toUpperCase().replace('-', '_')
      if (normalizedIntegration === 'LAMBDA') {
        return 'AWS'
      }
      if (normalizedIntegration === 'LAMBDA_PROXY') {
        return 'AWS_PROXY'
      }
      return normalizedIntegration
    }

    if (isAsync) {
      return 'AWS'
    }

    return 'AWS_PROXY'
  }

  // return fully generated Endpoint
  generate() {
    const offlineEndpoint = new OfflineEndpoint()

    const fullEndpoint = {
      ...offlineEndpoint,
      ...this.#http,
    }

    fullEndpoint.integration = this.#getIntegration(this.#http)

    if (fullEndpoint.integration === 'AWS') {
      // determine request and response templates or use defaults
      return this.#setVmTemplates(fullEndpoint)
    }

    return fullEndpoint
  }
}
