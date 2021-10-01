import { EOL } from 'os'

export default class Runner {
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
      } else {
        console.log(item)
      }
    }

    return payload
  }
}
