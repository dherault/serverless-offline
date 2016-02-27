const btoa = require('btoa');
const atob = require('atob');
const escapeJavaScript = require('js-string-escape');

module.exports = function createVelocityContext(request, options) {
  
  options.identity = options.identity || {};
  options.stageVariables = options.stageVariables || {};
  
  return {
    context: {
      apiId: options.apiId || 'offline_apiId',
      princialId: options.princialId || 'offline_princialId',
      httpMethod: request.method,
      identity: {
        accountId: options.identity.accountId || 'offline_accountId',
        apiKey: options.identity.apiKey || 'offline_apiKey',
        caller: options.identity.caller || 'offline_caller',
        cognitoAuthenticationProvider: options.identity.cognitoAuthenticationProvider || 'offline_cognitoAuthenticationProvider',
        cognitoAuthenticationType: options.identity.cognitoAuthenticationType || 'offline_cognitoAuthenticationType',
        sourceIp: options.identity.sourceIp || request.info.remoteAddress,
        user: options.identity.user || 'offline_user',
        userAgent: request.headers['user-agent'],
        userArn: options.identity.userArn || 'offline_userArn',
        requestId: 'offline_' + Math.random(),
        resourceId: options.identity.resourceId || 'offline_resourceId',
        resourcePath: options.identity.resourcePath || 'offline_resourcePath',
        stage: options.stage
      }
    },
    input: {
      json: x => 'need to implement',
      params: x => {
        if (typeof x === 'string') return request.params[x] || request.query[x] || request.headers[x];
        else return request.params;
      },
      path: x => 'need to implement' // https://www.npmjs.com/package/jsonpath
    },
    stageVariables: options.stageVariables,
    util: {
      escapeJavaScript,
      urlEncode: encodeURI,
      urlDecode: decodeURI,
      base64Encode: btoa,
      base64Decode: atob,
    }
  };
} 