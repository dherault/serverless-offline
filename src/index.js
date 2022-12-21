// TODO remove with node.js v16.9+ support
import 'object.hasown/auto'

// install global fetch
// TODO remove `node-fetch` module and use global built-in with node.js v18+ support
if (globalThis.fetch === undefined) {
  const { default: fetch, Headers } = await import('node-fetch')
  globalThis.fetch = fetch
  globalThis.Headers = Headers
}

export { default } from './ServerlessOffline.js'
