'use strict';

const Boom = require('boom');

const createLambdaContext = require('./createLambdaContext');
const functionHelper = require('./functionHelper');
const debugLog = require('./debugLog');
const utils = require('./utils');
const _ = require('lodash');
const authCanExecuteResource = require('./authCanExecuteResource');

module.exports = function createAuthScheme(authFun, authorizerOptions, funName, endpointPath, options, serverlessLog, servicePath, serverless) {
  const authFunName = authorizerOptions.name;

  let identityHeader = 'authorization';

  if (authorizerOptions.type !== 'request') {
    const identitySourceMatch = /^method.request.header.((?:\w+-?)+\w+)$/.exec(authorizerOptions.identitySource);
    if (!identitySourceMatch || identitySourceMatch.length !== 2) {
      throw new Error(`Serverless Offline only supports retrieving tokens from the headers (λ: ${authFunName})`);
    }
    identityHeader = identitySourceMatch[1].toLowerCase();
  }
  
  const funOptions = functionHelper.getFunctionOptions(authFun, funName, servicePath);

  // Create Auth Scheme
  return () => ({
    authenticate(request, reply) {
      process.env = _.extend({}, serverless.service.provider.environment, authFun.environment, process.env);
      console.log(''); // Just to make things a little pretty
      serverlessLog(`Running Authorization function for ${request.method} ${request.path} (λ: ${authFunName})`);

      // Get Authorization header
      const req = request.raw.req;

      // Get path params
      const pathParams = {};
      Object.keys(request.params).forEach(key => {
        // aws doesn't auto decode path params - hapi does
        pathParams[key] = encodeURIComponent(request.params[key]);
      });

      let event, handler;

      // Create event Object for authFunction
      //   methodArn is the ARN of the function we are running we are authorizing access to (or not)
      //   Account ID and API ID are not simulated
      if (authorizerOptions.type === 'request') {
        event = {
          type: 'REQUEST',
          path: request.path,
          httpMethod: request.method.toUpperCase(),
          headers: Object.assign(request.headers, utils.capitalizeKeys(request.headers)),
          pathParameters: utils.nullIfEmpty(pathParams),
          queryStringParameters: utils.nullIfEmpty(request.query),
        };
      }
      else {
        const authorization = req.headers[identityHeader];
        debugLog(`Retrieved ${identityHeader} header ${authorization}`);
        event = {
          type: 'TOKEN',
          authorizationToken: authorization,
        };
      }
      event.methodArn = `arn:aws:execute-api:${options.region}:random-account-id:random-api-id/${options.stage}/${request.method.toUpperCase()}${request.path.replace(new RegExp(`^/${options.stage}`), '')}`;

      // Create the Authorization function handler
      try {
        handler = functionHelper.createHandler(funOptions, options);
      }
      catch (err) {
        debugLog(`create authorization function handler error: ${err}`);

        return reply(Boom.badImplementation(null, `Error while loading ${authFunName}: ${err.message}`));
      }

      // Creat the Lambda Context for the Auth function
      const lambdaContext = createLambdaContext(authFun, (err, result) => {
        // Return an unauthorized response
        const onError = error => {
          serverlessLog(`Authorization function returned an error response: (λ: ${authFunName})`, error);

          return reply(Boom.unauthorized('Unauthorized'));
        };

        if (err) {
          return onError(err);
        }

        const onSuccess = policy => {
        // Validate that the policy document has the principalId set
          if (!policy.principalId) {
            serverlessLog(`Authorization response did not include a principalId: (λ: ${authFunName})`, err);

            return reply(Boom.forbidden('No principalId set on the Response'));
          }

          if (!authCanExecuteResource(policy.policyDocument, event.methodArn)) {
            serverlessLog(`Authorization response didn't authorize user to access resource: (λ: ${authFunName})`, err);

            return reply(Boom.forbidden('User is not authorized to access this resource'));
          }

          serverlessLog(`Authorization function returned a successful response: (λ: ${authFunName})`, policy);

          // Set the credentials for the rest of the pipeline
          return reply.continue({ credentials: { user: policy.principalId, context: policy.context } });
        };

        if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
          debugLog('Auth function returned a promise');
          result.then(onSuccess).catch(onError);
        }
        else if (result instanceof Error) {
          onError(result);
        }
        else {
          onSuccess(result);
        }
      });

      // Execute the Authorization Function
      handler(event, lambdaContext, lambdaContext.done);
    },
  });
};
