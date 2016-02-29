'use strict';

// const createVelocityContext = require('./src/createVelocityContext');
// const Hapi = require('hapi');

// var render = require('velocityjs').render

// const template1 =  {
//   "context": {
//     "apiId": "$context.apiId",
//     "authorizerPrincipalId": "$context.authorizer.principalId",
//     "httpMethod": "$context.httpMethod",
//     "identity": {
//       "accountId": "$context.identity.accountId",
//       "apiKey": "$context.identity.apiKey",
//       "caller": "$context.identity.caller",
//       "cognitoAuthenticationProvider": "$context.identity.cognitoAuthenticationProvider",
//       "cognitoAuthenticationType": "$context.identity.cognitoAuthenticationType",
//       "cognitoIdentityId": "$context.identity.cognitoIdentityId",
//       "cognitoIdentityPoolId": "$context.identity.cognitoIdentityPoolId",
//       "sourceIp": "$context.identity.sourceIp",
//       "user": "$context.identity.user",
//       "userAgent": "$context.identity.userAgent",
//       "userArn": "$context.identity.userArn"
//     },
//     "requestId": "$context.requestId",
//     "resourceId": "$context.resourceId",
//     "resourcePath": "$context.resourcePath",
//     "stage": "$context.stage"
//   },
//   "header": {
//     "accept": "$input.params().header.get('Accept')",
//     "apiKey": "$input.params().header.get('x-api-key')",
//     "authorization": "$input.params().header.get('Authorization')",
//     "port": "$input.params().header.get('X-Forwarded-Port')",
//     "protocol": "$input.params().header.get('X-Forwarded-Proto')",
//     "sourceIp": "$input.params().header.get('X-Forwarded-For')"
//   },
//   "path": {
//     "id": "$input.params().path.get('id')"
//   },
//   "querystring": {
//     "id": "$input.params().querystring.get('id')"
//   },
//   "body": "$input.json('$')"
// };

// const template2 = {
//   "resourcePath": "$context.resourcePath",
//   "queryString": "#foreach($key in $input.params().querystring.keySet())#if($foreach.index > 0)&#end$util.urlEncode($key)=$util.urlEncode($input.params().querystring.get($key))#end",
//   "pathKey1": "$util.escapeJavaScript($input.params().path.get('pathKey1'))",
//   "pathKey2": "$util.escapeJavaScript($input.params().path.get('pathKey2'))",
//   "pathKey3": "$util.escapeJavaScript($input.params().path.get('pathKey3'))",
//   "pathKey4": "$util.escapeJavaScript($input.params().path.get('pathKey4'))",
//   "pathKey5": "$util.escapeJavaScript($input.params().path.get('pathKey5'))"
// };

// const template = template2;

// Object.keys(require.cache).forEach(key => {
//                   // Require cache invalidation, slow, brutal and fragile. Might cause 'duplication' errors. Please submit issue.
//   if (!key.match('node_modules')) console.log(key)
//   // console.log(key);
// }); 
// console.log(render('#set tolo $toto'));

// const server = new Hapi.Server();

// server.connection({ 
//   port: 3000
// });

// server.route({
//   method: '*',
//   path: '/{pathKey1}',
//   handler: (request, reply) => {
    
//     const velocityContext = createVelocityContext(request, { stage: 'dev' });
    
//     // console.log(velocityContext);
//     const result = renderVelocity(template, velocityContext);
//     console.log('___FINAL RESULT___');
//     console.log(result);
    
//     reply('yolo');
//   }
// });

// server.start(() => {
//   console.log('Test server is listening.');
// });

// function renderVelocity(template, context) {
//   const result = {};
  
//   for (let key in template) {
//     const value = template[key];
//     // console.log('Processing key', key, 'value', value);
    
//     if (typeof value === 'string') {
//       const renderResult = render(value, context);
//       // console.log('___', renderResult);
      
//       // When unable to process a velocity string, render returns the string.
//       // This happens tipically when it looks for a value and finds undefined
//       result[key] = renderResult !== value ? renderResult : null;
//     } else if (typeof value === 'object') { //lodahsh.isPlainObject
//       result[key] = renderVelocity(value, context);
//     }
//   }
  
//   return result;
// }

// const c = require("./src/createLambdaContext.js");

// const t = new Date().getTime();
// c({
//   name: 'yolo',
//   memorySize: 10,
// });

// if (1+1 * 1000 / 50) console.log(new Date().getTime() - t);

const t = setTimeout(() => 'x', 1000);

console.log(t);