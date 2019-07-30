'use strict';

const Boom = require('@hapi/boom');
const authCanExecuteResource = require('./authCanExecuteResource');
const debugLog = require('./debugLog');
const { createHandler, getFunctionOptions } = require('./functionHelper');
const LambdaContext = require('./LambdaContext');
const {
  capitalizeKeys,
  normalizeMultiValueQuery,
  normalizeQuery,
  nullIfEmpty,
} = require('./utils');

module.exports = function createAuthScheme(
  authFun,
  authorizerOptions,
  funName,
  endpointPath,
  options,
  serverlessLog,
  servicePath,
  serviceRuntime,
  serverlessService,
) {
  const authFunName = authorizerOptions.name;

  let identityHeader = 'authorization';

  if (authorizerOptions.type !== 'request') {
    const identitySourceMatch = /^method.request.header.((?:\w+-?)+\w+)$/.exec(
      authorizerOptions.identitySource,
    );
    if (!identitySourceMatch || identitySourceMatch.length !== 2) {
      throw new Error(
        `Serverless Offline only supports retrieving tokens from the headers (λ: ${authFunName})`,
      );
    }
    identityHeader = identitySourceMatch[1].toLowerCase();
  }

  const funOptions = getFunctionOptions(
    authFun,
    funName,
    servicePath,
    serviceRuntime,
  );

  // Create Auth Scheme
  return () => ({
    authenticate(request, h) {
      process.env = Object.assign(
        {},
        serverlessService.provider.environment,
        authFun.environment,
        process.env,
      );
      console.log(''); // Just to make things a little pretty
      serverlessLog(
        `Running Authorization function for ${request.method} ${request.path} (λ: ${authFunName})`,
      );

      // Get Authorization header
      const { req } = request.raw;

      // Get path params
      // aws doesn't auto decode path params - hapi does
      const pathParams = { ...request.params };

      let event;
      let handler;

      // Create event Object for authFunction
      //   methodArn is the ARN of the function we are running we are authorizing access to (or not)
      //   Account ID and API ID are not simulated
      if (authorizerOptions.type === 'request') {
        event = {
          headers: {},
          httpMethod: request.method.toUpperCase(),
          multiValueHeaders: {},
          multiValueQueryStringParameters: request.query
            ? normalizeMultiValueQuery(request.query)
            : {},
          path: request.path,
          pathParameters: nullIfEmpty(pathParams),
          queryStringParameters: request.query
            ? normalizeQuery(request.query)
            : {},
          type: 'REQUEST',
        };

        if (req.rawHeaders) {
          for (let i = 0; i < req.rawHeaders.length; i += 2) {
            event.headers[req.rawHeaders[i]] = req.rawHeaders[i + 1];
            event.multiValueHeaders[req.rawHeaders[i]] = (
              event.multiValueHeaders[req.rawHeaders[i]] || []
            ).concat(req.rawHeaders[i + 1]);
          }
        } else {
          event.headers = Object.assign(
            request.headers,
            capitalizeKeys(request.headers),
          );
          event.multiValueHeaders = normalizeMultiValueQuery(event.headers);
        }
      } else {
        const authorization = req.headers[identityHeader];

        const identityValidationExpression = new RegExp(
          authorizerOptions.identityValidationExpression,
        );
        const matchedAuthorization = identityValidationExpression.test(
          authorization,
        );
        const finalAuthorization = matchedAuthorization ? authorization : '';

        debugLog(`Retrieved ${identityHeader} header "${finalAuthorization}"`);

        event = {
          authorizationToken: finalAuthorization,
          type: 'TOKEN',
        };
      }

      const httpMethod = request.method.toUpperCase();
      const apiId = 'random-api-id';
      const accountId = 'random-account-id';
      const resourcePath = request.path.replace(
        new RegExp(`^/${options.stage}`),
        '',
      );

      event.methodArn = `arn:aws:execute-api:${options.region}:${accountId}:${apiId}/${options.stage}/${httpMethod}${resourcePath}`;

      event.requestContext = {
        accountId,
        apiId,
        httpMethod,
        requestId: 'random-request-id',
        resourceId: 'random-resource-id',
        resourcePath,
        stage: options.stage,
      };

      // Create the Authorization function handler
      try {
        handler = createHandler(funOptions, options);
      } catch (err) {
        debugLog(`create authorization function handler error: ${err}`);

        throw Boom.badImplementation(
          null,
          `Error while loading ${authFunName}: ${err.message}`,
        );
      }

      return new Promise((resolve, reject) => {
        const callback = (err, data) => {
          // Return an unauthorized response
          const onError = (error) => {
            serverlessLog(
              `Authorization function returned an error response: (λ: ${authFunName})`,
              error,
            );

            return reject(Boom.unauthorized('Unauthorized'));
          };

          if (err) {
            onError(err);

            return;
          }

          const onSuccess = (policy) => {
            // Validate that the policy document has the principalId set
            if (!policy.principalId) {
              serverlessLog(
                `Authorization response did not include a principalId: (λ: ${authFunName})`,
                err,
              );

              return reject(
                Boom.forbidden('No principalId set on the Response'),
              );
            }

            if (
              !authCanExecuteResource(policy.policyDocument, event.methodArn)
            ) {
              serverlessLog(
                `Authorization response didn't authorize user to access resource: (λ: ${authFunName})`,
                err,
              );

              return reject(
                Boom.forbidden(
                  'User is not authorized to access this resource',
                ),
              );
            }

            serverlessLog(
              `Authorization function returned a successful response: (λ: ${authFunName})`,
              policy,
            );

            // Set the credentials for the rest of the pipeline
            return resolve(
              h.authenticated({
                credentials: {
                  context: policy.context,
                  usageIdentifierKey: policy.usageIdentifierKey,
                  user: policy.principalId,
                },
              }),
            );
          };

          if (data && typeof data.then === 'function') {
            debugLog('Auth function returned a promise');
            data.then(onSuccess).catch(onError);
          } else if (data instanceof Error) {
            onError(data);
          } else {
            onSuccess(data);
          }
        };

        // Creat the Lambda Context for the Auth function
        const lambdaContext = new LambdaContext({
          callback,
          functionName: authFun.name,
          memorySize:
            authFun.memorySize || serverlessService.provider.memorySize,
          timeout: authFun.timeout || serverlessService.provider.timeout,
        });

        const result = handler(event, lambdaContext, callback);

        // Promise support
        if (result && typeof result.then === 'function') {
          result
            .then((data) => callback(null, data))
            .catch((err) => callback(err, null));
        } else if (result instanceof Error) {
          callback(result, null);
        }
      });
    },
  });
};
