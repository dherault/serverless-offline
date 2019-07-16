'use strict';

const objectFromEntries = require('object.fromentries');

objectFromEntries.shim();

const { fromEntries } = Object;

// https://aws.amazon.com/blogs/compute/support-for-multi-value-parameters-in-amazon-api-gateway/
// [ [ 'petType', 'dog' ], [ 'petType', 'fish' ] ]
// => { petType: [ 'dog', 'fish' ] },
module.exports = function parseMultiValueQueryStringParameters(searchParams) {
  if (Array.from(searchParams).length === 0) {
    return null;
  }

  const map = new Map();

  for (const [key, value] of searchParams) {
    const item = map.get(key);

    if (item) {
      item.push(value);
    } else {
      map.set(key, [value]);
    }
  }

  return fromEntries(map);
};
