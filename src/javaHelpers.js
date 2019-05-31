/* eslint-disable no-extend-native */

/* ---------------------------------------------------------------
  String functions
  For velocity templates to access java functions, to mimick AWS
--------------------------------------------------------------- */

function javaContains(value) {
  return this.includes(value);
}

function javaEquals(anObject) {
  return this.toString() === anObject.toString();
}

function javaEqualsIgnoreCase(anotherString) {
  return (anotherString === null) ? false :
    (this === anotherString || this.toLowerCase() === anotherString.toLowerCase());
}

function javaMatches(value) {
  return this.match(new RegExp(value, 'm'));
}

function javaReplaceAll(oldValue, newValue) {
  return this.replace(new RegExp(oldValue, 'gm'), newValue);
}

function javaReplaceFirst(oldValue, newValue) {
  return this.replace(new RegExp(oldValue, 'm'), newValue);
}

function javaRegionMatches(ignoreCase, toffset, other, ooffset, len) {
  /*
  * Support different method signatures
  */
  if (typeof ignoreCase === 'number'
  || (ignoreCase !== true && ignoreCase !== false)) {
    len = ooffset;
    ooffset = other;
    other = toffset;
    toffset = ignoreCase;
    ignoreCase = false;
  }

  // Note: toffset, ooffset, or len might be near -1>>>1.
  if ((ooffset < 0) || (toffset < 0) || (toffset > this.length - len) ||
  (ooffset > other.length - len)) {
    return false;
  }

  let s1 = this.substring(toffset, toffset + len);
  let s2 = other.substring(ooffset, ooffset + len);

  if (ignoreCase) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  }

  return s1 == s2; // eslint-disable-line eqeqeq
}

const {
  contains,
  equals,
  equalsIgnoreCase,
  matches,
  regionMatches,
  replaceAll,
  replaceFirst,
} = String.prototype;

function polluteStringPrototype() {
  String.prototype.contains = javaContains;
  String.prototype.equals = javaEquals;
  String.prototype.equalsIgnoreCase = javaEqualsIgnoreCase;
  String.prototype.matches = javaMatches;
  String.prototype.regionMatches = javaRegionMatches;
  String.prototype.replaceAll = javaReplaceAll;
  String.prototype.replaceFirst = javaReplaceFirst;
}

function depolluteStringPrototype() {
  String.prototype.contains = contains;
  String.prototype.equals = equals;
  String.prototype.equalsIgnoreCase = equalsIgnoreCase;
  String.prototype.matches = matches;
  String.prototype.regionMatches = regionMatches;
  String.prototype.replaceAll = replaceAll;
  String.prototype.replaceFirst = replaceFirst;
}

// No particular exports
module.exports = { polluteStringPrototype, depolluteStringPrototype };
