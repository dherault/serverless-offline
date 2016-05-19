'use strict';

const Boom = require('boom');

const createLambdaContext = require('./createLambdaContext');
const functionHelper = require('./functionHelper');
const debugLog = require('./debugLog');

module.exports = function createAuthScheme(authFun, funName, endpointPath, options, serverlessLog) {
  const authFunName = authFun.name;

  let populatedAuthFun;
  try {
    populatedAuthFun = authFun.toObjectPopulated({
      stage:  options.stage,
      region: options.region,
    });
  } catch (err) {
    debugLog(`Error while populating function '${authFun.name}' with stage '${options.stage}' and region '${options.region}':`);
    throw err;
  }
  const funOptions = functionHelper.getFunctionOptions(authFun, populatedAuthFun);

  const scheme = function (server, schemeOptions) {

      return {
          authenticate: function (request, reply) {
            console.log('');
            serverlessLog(`Running Authorization function for ${request.method} ${request.path} (λ: ${authFunName})`);

            const req = request.raw.req;
            const authorization = req.headers.authorization;

            debugLog(`Recieved auth header: `, authorization);
            let authToken = null;

            if (authorization) {
              const authParts = authorization.split(' ');
              authToken = authParts[1];
            }

            const event = {
              "type": "TOKEN",
              "authorizationToken": authToken,
              "methodArn": `arn:aws:execute-api:${options.region}:<Account id>:<API id>/${options.stage}/${funName}/${endpointPath}`
            };

            let handler;

            try {
              handler = functionHelper.createHandler(funOptions, options);
            } catch (err) {
              return reply(Boom.badImplementation(null, `Error while loading ${authFunName}`));
            }

            const lambdaContext = createLambdaContext(authFun, (err, data) => {
              if(err) {
                serverlessLog(`Authorization function returned an error response: (λ: ${authFunName})`, err);
                return reply(Boom.unauthorized(null, 'Custom'));
              }

              serverlessLog(`Authorization function returned a successful response: (λ: ${authFunName})`, data);

              return reply.continue({ credentials: { user: data.principalId } });
            });

            handler(event, lambdaContext, lambdaContext.done);
          }
      };
  };

  return scheme;
}
