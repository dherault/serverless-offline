'use strict';

const { satisfies, valid, validRange } = require('semver');

module.exports = function satisfiesVersionRange(range, version) {
  if (valid(version) == null) {
    throw new Error('Not a valid semver version.');
  }

  if (validRange(range) == null) {
    throw new Error('Not a valid semver range.');
  }

  return satisfies(version, range);
};
