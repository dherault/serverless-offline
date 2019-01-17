/* eslint-disable no-extend-native */

/* ---------------------------------------------------------------
  String functions
  For velocity templates to access java functions, to mimick AWS
--------------------------------------------------------------- */

function contains(value) {
  return this.indexOf(value) >= 0;
}

function replaceAll(oldValue, newValue) {
  return this.replace(new RegExp(oldValue, 'gm'), newValue);
}

function replaceFirst(oldValue, newValue) {
  return this.replace(new RegExp(oldValue, 'm'), newValue);
}

function matches(value) {
  return this.match(new RegExp(value, 'm'));
}

function regionMatches(ignoreCase, toffset, other, ooffset, len) {
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

function equals(anObject) {
  return this.toString() === anObject.toString();
}

function equalsIgnoreCase(anotherString) {
  return (anotherString === null) ? false :
  (this === anotherString || this.toLowerCase() === anotherString.toLowerCase());
}

const originalValues = {};

function polluteStringPrototype() {
  originalValues.contains = String.prototype.contains;
  originalValues.replaceAll = String.prototype.replaceAll;
  originalValues.replaceFirst = String.prototype.replaceFirst;
  originalValues.matches = String.prototype.matches;
  originalValues.regionMatches = String.prototype.regionMatches;
  originalValues.equals = String.prototype.equals;
  originalValues.equalsIgnoreCase = String.prototype.equalsIgnoreCase;

  String.prototype.contains = contains;
  String.prototype.replaceAll = replaceAll;
  String.prototype.replaceFirst = replaceFirst;
  String.prototype.matches = matches;
  String.prototype.regionMatches = regionMatches;
  String.prototype.equals = equals;
  String.prototype.equalsIgnoreCase = equalsIgnoreCase;
}

function depolluteStringPrototype() {
  delete String.prototype.contains;
  delete String.prototype.replaceAll;
  delete String.prototype.replaceFirst;
  delete String.prototype.matches;
  delete String.prototype.regionMatches;
  delete String.prototype.equals;
  delete String.prototype.equalsIgnoreCase;

  Object.keys(originalValues).forEach(key => {
    if (originalValues[key]) {
      String.prototype[key] = originalValues[key];
    }
  });
}

// No particular exports
module.exports = { polluteStringPrototype, depolluteStringPrototype };
