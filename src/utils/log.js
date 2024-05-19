let utils

export function setLogUtils({ log, progress }) {
  utils = { log, progress }
}

export const log = {
  debug: (...args) => utils?.log?.debug(...args),
  error: (...args) => utils?.log?.error(...args),
  info: (...args) => utils?.log?.info(...args),
  notice: (...args) => utils?.log?.notice(...args),
  verbose: (...args) => utils?.log?.verbose(...args),
  warning: (...args) => utils?.log?.warning(...args),
}

export const progress = {
  get: (namespace) => utils?.progress?.get(namespace),
  notice: (message) => utils?.progress?.notice(message),
  remove: () => utils?.progress?.remove(),
}
