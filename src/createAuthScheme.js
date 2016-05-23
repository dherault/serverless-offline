'use strict';

const Boom = require('boom');

const createLambdaContext = require('./createLambdaContext');
const functionHelper = require('./functionHelper');
const debugLog = require('./debugLog');

module.exports = function createAuthScheme(authFun, funName, endpointPath, options, serverlessLog) {
  const authFunName = authFun.name;

  // Get Auth Function object with variables
  let populatedAuthFun;
  try {
    populatedAuthFun = authFun.toObjectPopulated({
      stage:  options.stage,
      region: options.region,
    });
  } catch (err) {
    debugLog(`Error while populating function '${authFunName}' with stage '${options.stage}' and region '${options.region}':`);
    throw err;
  }

  const authorizerOptions = populatedAuthFun.authorizer;
  if(authorizerOptions.type !== 'TOKEN') {
    throw new Error(`Authorizer Type must be TOKEN (λ: ${authFunName})`);
  }

  if(authorizerOptions.identitySource !== 'method.request.header.Authorization') {
    throw new Error(`Serverless Offline only supports retrieving tokens from the Authorization header (λ: ${authFunName})`);
  }

  const funOptions = functionHelper.getFunctionOptions(authFun, populatedAuthFun);

  // Create Auth Scheme
  const scheme = function (server, schemeOptions) {
      return {
          authenticate: function (request, reply) {
            console.log(''); // Just to make things a little pretty
            serverlessLog(`Running Authorization function for ${request.method} ${request.path} (λ: ${authFunName})`);

            // Get Authorization header
            const req = request.raw.req;
            const authorization = req.headers.authorization;

            debugLog(`Recieved auth header: `, authorization);
            let authToken = null;

            // Split auth header i.e 'Bearer xyzAbc...'
            if (authorization) {
              const authParts = authorization.split(' ');
              authToken = authParts[1]; // take the token part of the header
            }

            // Create event Object for authFunction
            //   methodArn is the ARN of the function we are running we are authorizing access to (or not)
            //   Account ID and API ID are not simulated
            const event = {
              "type": "TOKEN",
              "authorizationToken": authToken,
              "methodArn": `arn:aws:execute-api:${options.region}:<Account id>:<API id>/${options.stage}/${funName}/${endpointPath}`
            };

            // Create the Authorization function handler
            let handler;

            try {
              handler = functionHelper.createHandler(funOptions, options);
            } catch (err) {
              return reply(Boom.badImplementation(null, `Error while loading ${authFunName}`));
            }

            // Creat the Lambda Context for the Auth function
            const lambdaContext = createLambdaContext(authFun, (err, policy) => {
              // Return an unauthorized response
              if(err) {
                serverlessLog(`Authorization function returned an error response: (λ: ${authFunName})`, err);
                return reply(Boom.forbidden('Forbidden'));
              }

              // Validate that the policy document has the principalId set
              if(!policy.principalId) {
                serverlessLog(`Authorization response did not include a principalId: (λ: ${authFunName})`, err);
                return reply(Boom.forbidden('No principalId set on the Response'));
              }

              serverlessLog(`Authorization function returned a successful response: (λ: ${authFunName})`, policy);

              // Set the credentials for the rest of the pipeline
              return reply.continue({ credentials: { user: policy.principalId } });
            });

            // Execute the Authorization Function
            handler(event, lambdaContext, lambdaContext.done);
          }
      };
  };

  return scheme;
}
