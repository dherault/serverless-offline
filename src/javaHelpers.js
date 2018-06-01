'use strict';

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

const prototypeFunctions = {
  contains,
  replaceAll,
  replaceFirst,
  matches,
  regionMatches,
  equals,
  equalsIgnoreCase
};

module.exports = function polluteStringPrototype() {
  // Save a copy of any potential original prototype functions
  const originalValues = Object.keys(prototypeFunctions).reduce(function(map, key) {
    map[key] = String.prototype[key];
    String.prototype[key] = prototypeFunctions[key];
    return map;
  }, {});

  // After the process is complete that needs these prototypes, restore
  // the original functions.
  return function depolluteStringPrototype() {
    Object.keys(originalValues).forEach(function(key) {
      String.prototype[key] = originalValues[key];
    })
  }
};
