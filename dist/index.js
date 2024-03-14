import 'object.hasown/auto'
if (globalThis.fetch === undefined) {
  const { default: fetch, Headers } = await import('node-fetch')
  globalThis.fetch = fetch
  globalThis.Headers = Headers
}
export { default } from './ServerlessOffline.js'
