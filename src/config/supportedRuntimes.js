'use strict'

// native runtime support for AWS
// https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html

// deprecated runtimes
// https://docs.aws.amazon.com/lambda/latest/dg/runtime-support-policy.html
module.exports = new Set([
  // ==========
  // .NET CORE
  // ==========

  // deprecated
  // 'dotnetcore1.0',
  // 'dotnetcore2.0',

  // supported
  // 'dotnetcore2.1'

  // ==========
  // GO
  // ==========

  'go1.x',

  // ==========
  // JAVA
  // ==========

  // 'java8'

  // ==========
  // NODE.JS
  // ==========

  // deprecated, but still working
  'nodejs4.3',
  'nodejs6.10',

  // supported
  'nodejs8.10',
  'nodejs10.x',

  // ==========
  // PROVIDED
  // ==========

  'provided',

  // ==========
  // PYTHON
  // ==========

  'python2.7',
  'python3.6',
  'python3.7',

  // ==========
  // RUBY
  // ==========

  'ruby2.5',
])
