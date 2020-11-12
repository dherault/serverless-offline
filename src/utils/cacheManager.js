import { ok } from 'assert'
import EventEmitter from 'events'
import { which, test, exec } from 'shelljs'
import Path from 'path'
import debugLog from '../debugLog.js'
import { logWarning } from '../serverlessLog.js'

/**
 * @typedef {("error" | "changed")} CacheEventType
 * @typedef {([Error] | string[])} CacheEventArgs
 * @typedef {function(...CacheEventArgs): any} CacheEventHandler
 */

class CacheManager extends EventEmitter {
  /**
   * Map of current resource hashes
   *
   * @type {Map<string, string>}
   */
  #resourceHashes = new Map()

  #tools = {
    md5deep: which('md5deep'),
    shasum: which('shasum'),
  }

  #onError = (err) => {
    logWarning(`Error occurred in Cache Manager`, err)
  }

  constructor() {
    super()

    Object.entries(this.#tools).forEach(([name, path]) =>
      ok(
        !!path && test('-e', path),
        `"${name}" missing @ "${path}" is not installed and/or accessible from your PATH`,
      ),
    )

    this.setMaxListeners(Number.MAX_SAFE_INTEGER)

    this.on('error', this.#onError)
  }

  /**
   * Add an event listener of type @see CacheEventType
   *
   * @param {CacheEventType} event
   * @param {CacheEventHandler} handler
   */
  on(event, handler) {
    super.on(event, handler)
  }

  /**
   * Emit event
   *
   * @param {CacheEventType} event
   * @param {...CacheEventArgs} args
   */
  emit(event, ...args) {
    super.emit(event, ...args)
  }

  /**
   * get the current hash for a resource
   *
   * @param {string} resource
   * @returns {string}
   */
  getCurrentHash(resource) {
    return this.#resourceHashes.get(this.findResource(resource))
  }

  /**
   * Mark a resource hash
   *
   * @param {string} resource
   */
  mark(resource) {
    this.didChange(resource)
  }

  findResource(requestedResource) {
    ok(
      test('-e', requestedResource),
      `resource does not exist, can not hash ${requestedResource}`,
    )

    return !test('-d', requestedResource)
      ? Path.resolve(requestedResource, '..')
      : requestedResource
  }

  /**
   * check resource hash for changes
   * @param requestedResource
   */
  didChange(requestedResource) {
    const resource = this.findResource(requestedResource)

    const { md5deep, shasum } = this.#tools

    const result = exec(`${md5deep} -r -l "${resource}" | sort | ${shasum}`)
    ok(result.code === 0, `Failed to hash`)

    const newHash = result.stdout.trim()
    const previousHash = this.#resourceHashes.get(resource)
    debugLog(`${resource} (newHash=${newHash},previousHash=${previousHash}))`)

    if (previousHash !== newHash) {
      this.#resourceHashes.set(resource, newHash)
      // noinspection JSCheckFunctionSignatures
      this.emit('changed', resource)
      return true
    }

    return false
  }
}

const cacheManager = new CacheManager()

export default cacheManager
