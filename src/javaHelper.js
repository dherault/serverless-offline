'use strict';

/* eslint no-extend-native:0 func-names:0 */

/* ---------------------------------------------------------------
  String functions
  For velocity templates to access java functions, to mimick AWS
--------------------------------------------------------------- */

String.prototype.contains = function (value) {
  return this.indexOf(value) >= 0;
};

String.prototype.replaceAll = function (oldValue, newValue) {
  return this.replace(new RegExp(oldValue, 'gm'), newValue);
};

String.prototype.replaceFirst = function (oldValue, newValue) {
  return this.replace(new RegExp(oldValue, 'm'), newValue);
};

String.prototype.matches = function (value) {
  return this.match(new RegExp(value, 'm'));
};

String.prototype.regionMatches = function (ignoreCase, toffset, other, ooffset, len) {
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
};

String.prototype.equals = function (anObject) {
  return this.toString() === anObject.toString();
};

String.prototype.equalsIgnoreCase = function (anotherString) {
  return (anotherString === null) ? false :
    (this === anotherString || this.toLowerCase() === anotherString.toLowerCase());
};


// No particular exports
module.exports = null;
