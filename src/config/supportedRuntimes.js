'use strict';

// native runtime support for AWS
// https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html

module.exports = new Set([
  // .net
  // dotnetcore2.1
  // dotnetcore1.0

  // go
  'go1.x',

  // java
  // java8

  // node.js
  'nodejs10.x',
  'nodejs8.10',

  // provided
  'provided',

  // python
  'python2.7',
  'python3.6',
  'python3.7',

  // ruby
  'ruby2.5',
]);
