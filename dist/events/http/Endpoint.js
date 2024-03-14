import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { log } from '@serverless/utils/log.js'
import OfflineEndpoint from './OfflineEndpoint.js'
const { entries } = Object
const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultRequestTemplate = readFileSync(
  resolve(__dirname, './templates/offline-default.req.vm'),
  'utf8',
)
const defaultResponseTemplate = readFileSync(
  resolve(__dirname, './templates/offline-default.res.vm'),
  'utf8',
)
function getResponseContentType(fep) {
  if (fep.response && fep.response.headers['Content-Type']) {
    return fep.response.headers['Content-Type'].replace(/'/gm, '')
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
  #setVmTemplates(fullEndpoint) {
    const fep = fullEndpoint
    try {
      const reqFilename = `${this.#handlerPath}.req.vm`
      if (
        typeof this.#http.request === 'object' &&
        typeof this.#http.request.template === 'object'
      ) {
        const templatesConfig = this.#http.request.template
        entries(templatesConfig).forEach(([key, value]) => {
          fep.requestTemplates[key] = value
        })
      } else if (existsSync(reqFilename)) {
        fep.requestTemplates['application/json'] = readFileSync(
          reqFilename,
          'utf8',
        )
      } else {
        fep.requestTemplates['application/json'] = defaultRequestTemplate
      }
      const resFilename = `${this.#handlerPath}.res.vm`
      fep.responseContentType = getResponseContentType(fep)
      log.debug('Response Content-Type ', fep.responseContentType)
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
  generate() {
    const offlineEndpoint = new OfflineEndpoint()
    const fullEndpoint = {
      ...offlineEndpoint,
      ...this.#http,
    }
    fullEndpoint.integration = this.#getIntegration(this.#http)
    if (fullEndpoint.integration === 'AWS') {
      return this.#setVmTemplates(fullEndpoint)
    }
    return fullEndpoint
  }
}
