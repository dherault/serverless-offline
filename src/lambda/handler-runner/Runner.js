import { EOL } from 'os'

export default class Runner {
  constructor(funOptions, env, allowCache, v3Utils) {
    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }
  }

  _parsePayload(value) {
    let payload

    for (const item of value.split(EOL)) {
      let json

      // first check if it's JSON
      try {
        json = JSON.parse(item)
        // nope, it's not JSON
      } catch (err) {
        // no-op
      }

      // now let's see if we have a property __offline_payload__
      if (
        json &&
        typeof json === 'object' &&
        Reflect.has(json, '__offline_payload__')
      ) {
        payload = json.__offline_payload__
      } else if (this.log) {
        this.log.notice(item)
      } else {
        console.log(item)
      }
    }

    return payload
  }
}
