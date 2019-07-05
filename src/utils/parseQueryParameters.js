const { URL } = require('url');
const objectFromEntries = require('object.fromentries');

objectFromEntries.shim();

const { fromEntries } = Object;

module.exports = function parseQueryParameters(url) {
  return fromEntries(new URL(url).searchParams.entries());
};
