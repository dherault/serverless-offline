'use strict';

const objectFromEntries = require('object.fromentries');

objectFromEntries.shim();

const { fromEntries } = Object;

module.exports = function parseQueryStringParameters(searchParams) {
  if (Array.from(searchParams).length === 0) {
    return null;
  }

  return fromEntries(searchParams);
};
