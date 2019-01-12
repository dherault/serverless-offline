module.exports = typeof process.env.SLS_DEBUG !== 'undefined' ?
  console.log.bind(null, '[offline]') :
  (() => null);
