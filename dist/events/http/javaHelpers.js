function javaContains(value) {
  return this.includes(value)
}
function javaEquals(anObject) {
  return this.toString() === anObject.toString()
}
function javaEqualsIgnoreCase(anotherString) {
  return anotherString === null
    ? false
    : this === anotherString ||
        this.toLowerCase() === anotherString.toLowerCase()
}
function javaMatches(value) {
  return this.match(new RegExp(value, 'm'))
}
function javaReplaceAll(oldValue, newValue) {
  return this.replace(new RegExp(oldValue, 'gm'), newValue)
}
function javaReplaceFirst(oldValue, newValue) {
  return this.replace(new RegExp(oldValue, 'm'), newValue)
}
function javaRegionMatches(...args) {
  let ignoreCase
  let toffset
  let other
  let ooffset
  let len
  if (args.length === 4) {
    ;[toffset, other, ooffset, len] = args
    ignoreCase = false
  } else {
    ;[ignoreCase, toffset, other, ooffset, len] = args
  }
  if (
    ooffset < 0 ||
    toffset < 0 ||
    toffset > this.length - len ||
    ooffset > other.length - len
  ) {
    return false
  }
  let s1 = this.substring(toffset, toffset + len)
  let s2 = other.substring(ooffset, ooffset + len)
  if (ignoreCase) {
    s1 = s1.toLowerCase()
    s2 = s2.toLowerCase()
  }
  return s1 === s2
}
const {
  prototype,
  prototype: {
    contains,
    equals,
    equalsIgnoreCase,
    matches,
    regionMatches,
    replaceAll,
    replaceFirst,
  },
} = String
export default function runInPollutedScope(runScope) {
  prototype.contains = javaContains
  prototype.equals = javaEquals
  prototype.equalsIgnoreCase = javaEqualsIgnoreCase
  prototype.matches = javaMatches
  prototype.regionMatches = javaRegionMatches
  prototype.replaceAll = javaReplaceAll
  prototype.replaceFirst = javaReplaceFirst
  const result = runScope()
  prototype.contains = contains
  prototype.equals = equals
  prototype.equalsIgnoreCase = equalsIgnoreCase
  prototype.matches = matches
  prototype.regionMatches = regionMatches
  prototype.replaceAll = replaceAll
  prototype.replaceFirst = replaceFirst
  return result
}
