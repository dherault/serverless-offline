'use strict';

const { exec } = require('child_process');
const path = require('path');
const updateNotifier = require('update-notifier');
const ApiGateway = require('./ApiGateway');
const ApiGatewayWebSocket = require('./ApiGatewayWebSocket');
const debugLog = require('./debugLog');
const functionHelper = require('./functionHelper');
const { createDefaultApiKey, satisfiesVersionRange } = require('./utils');
const pkg = require('../package.json');

module.exports = class ServerlessOffline {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.service = serverless.service;
    this.serverlessLog = serverless.cli.log.bind(serverless.cli);
    this.options = options;
    this.exitCode = 0;

    this.commands = {
      offline: {
        usage: 'Simulates API Gateway to call your lambda functions offline.',
        lifecycleEvents: ['start'],
        // add start nested options
        commands: {
          start: {
            usage:
              'Simulates API Gateway to call your lambda functions offline using backward compatible initialization.',
            lifecycleEvents: ['init', 'end'],
          },
        },
        options: {
          apiKey: {
            usage:
              'Defines the API key value to be used for endpoints marked as private. Defaults to a random hash.',
          },
          binPath: {
            usage: 'Path to the Serverless binary.',
            shortcut: 'b',
          },
          cacheInvalidationRegex: {
            usage:
              'Provide the plugin with a regexp to use for cache invalidation. Default: node_modules',
          },
          corsAllowHeaders: {
            usage:
              'Used to build the Access-Control-Allow-Headers header for CORS support.',
          },
          corsAllowOrigin: {
            usage:
              'Used to build the Access-Control-Allow-Origin header for CORS support.',
          },
          corsDisallowCredentials: {
            usage:
              'Used to override the Access-Control-Allow-Credentials default (which is true) to false.',
          },
          corsExposedHeaders: {
            usage:
              'USed to build the Access-Control-Exposed-Headers response header for CORS support',
          },
          disableCookieValidation: {
            usage: 'Used to disable cookie-validation on hapi.js-server',
          },
          enforceSecureCookies: {
            usage: 'Enforce secure cookies',
          },
          exec: {
            usage:
              'When provided, a shell script is executed when the server starts up, and the server will shut down after handling this command.',
          },
          hideStackTraces: {
            usage: 'Hide the stack trace on lambda failure. Default: false',
          },
          host: {
            usage: 'The host name to listen on. Default: localhost',
            shortcut: 'o',
          },
          httpsProtocol: {
            usage:
              'To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.',
            shortcut: 'H',
          },
          location: {
            usage: "The root location of the handlers' files.",
            shortcut: 'l',
          },
          noAuth: {
            usage: 'Turns off all authorizers',
          },
          noEnvironment: {
            usage:
              'Turns off loading of your environment variables from serverless.yml. Allows the usage of tools such as PM2 or docker-compose.',
          },
          port: {
            usage: 'Port to listen on. Default: 3000',
            shortcut: 'P',
          },
          prefix: {
            usage:
              'Adds a prefix to every path, to send your requests to http://localhost:3000/prefix/[your_path] instead.',
            shortcut: 'p',
          },
          preserveTrailingSlash: {
            usage: 'Used to keep trailing slashes on the request path',
          },
          printOutput: {
            usage: 'Outputs your lambda response to the terminal.',
          },
          providedRuntime: {
            usage: 'Sets the provided runtime for lambdas',
          },
          region: {
            usage: 'The region used to populate your templates.',
            shortcut: 'r',
          },
          resourceRoutes: {
            usage:
              'Turns on loading of your HTTP proxy settings from serverless.yml.',
          },
          showDuration: {
            usage: 'Show the execution time duration of the lambda function.',
          },
          skipCacheInvalidation: {
            usage:
              'Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed',
            shortcut: 'c',
          },
          stage: {
            usage: 'The stage used to populate your templates.',
            shortcut: 's',
          },
          useSeparateProcesses: {
            usage: 'Uses separate node processes for handlers',
          },
          websocketPort: {
            usage: 'Websocket port to listen on. Default: 3001',
          },
        },
      },
    };

    this.hooks = {
      'offline:start:init': this.start.bind(this),
      'offline:start': this.startWithExplicitEnd.bind(this),
      'offline:start:end': this.end.bind(this),
    };
  }

  printBlankLine() {
    console.log();
  }

  logPluginIssue() {
    this.serverlessLog(
      'If you think this is an issue with the plugin please submit it, thanks!',
    );
    this.serverlessLog('https://github.com/dherault/serverless-offline/issues');
  }

  // Entry point for the plugin (sls offline) when running 'sls offline start'
  async start() {
    // check if update is available
    updateNotifier({ pkg }).notify();

    this._verifyServerlessVersionCompatibility();

    // Some users would like to know their environment outside of the handler
    process.env.IS_OFFLINE = true;

    return Promise.resolve(this._buildServer())
      .then(() => this.apiGateway._listen())
      .then(() => this.hasWebsocketRoutes && this.apiGatewayWebSocket._listen())
      .then(() =>
        this.options.exec
          ? this._executeShellScript()
          : this._listenForTermination(),
      );
  }

  /**
   * Entry point for the plugin (sls offline) when running 'sls offline'
   * The call to this.end() would terminate the process before 'offline:start:end' could be consumed
   * by downstream plugins. When running sls offline that can be expected, but docs say that
   * 'sls offline start' will provide the init and end hooks for other plugins to consume
   * */
  startWithExplicitEnd() {
    return this.start().then(() => this.end());
  }

  _listenForTermination() {
    // SIGINT will be usually sent when user presses ctrl+c
    const waitForSigInt = new Promise((resolve) => {
      process.on('SIGINT', () => resolve('SIGINT'));
    });

    // SIGTERM is a default termination signal in many cases,
    // for example when "killing" a subprocess spawned in node
    // with child_process methods
    const waitForSigTerm = new Promise((resolve) => {
      process.on('SIGTERM', () => resolve('SIGTERM'));
    });

    return Promise.race([waitForSigInt, waitForSigTerm]).then((command) => {
      this.serverlessLog(`Got ${command} signal. Offline Halting...`);
    });
  }

  _executeShellScript() {
    const command = this.options.exec;
    const options = {
      env: Object.assign(
        { IS_OFFLINE: true },
        this.service.provider.environment,
        this.originalEnvironment,
      ),
    };

    this.serverlessLog(`Offline executing script [${command}]`);

    return new Promise((resolve) => {
      exec(command, options, (error, stdout, stderr) => {
        this.serverlessLog(`exec stdout: [${stdout}]`);
        this.serverlessLog(`exec stderr: [${stderr}]`);

        if (error) {
          // Use the failed command's exit code, proceed as normal so that shutdown can occur gracefully
          this.serverlessLog(`Offline error executing script [${error}]`);
          this.exitCode = error.code || 1;
        }
        resolve();
      });
    });
  }

  _buildServer() {
    // Methods
    this._setOptions(); // Will create meaningful options from cli options
    this._storeOriginalEnvironment(); // stores the original process.env for assigning upon invoking the handlers

    this.apiGateway = new ApiGateway(
      this.serverless,
      this.options,
      this.velocityContextOptions,
    );

    const server = this.apiGateway._createServer();

    this.hasWebsocketRoutes = false;
    this.apiGatewayWebSocket = new ApiGatewayWebSocket(
      this.serverless,
      this.options,
    );
    this.apiGatewayWebSocket._createWebSocket();

    this._setupEvents();
    this.apiGateway._createResourceRoutes(); // HTTP Proxy defined in Resource
    this.apiGateway._create404Route(); // Not found handling

    return server;
  }

  _storeOriginalEnvironment() {
    this.originalEnvironment = Object.assign({}, process.env);
  }

  _setOptions() {
    // Merge the different sources of values for this.options
    // Precedence is: command line options, YAML options, defaults.
    const defaultOptions = {
      apiKey: createDefaultApiKey(),
      cacheInvalidationRegex: 'node_modules',
      corsAllowOrigin: '*',
      corsAllowCredentials: true,
      corsAllowHeaders: 'accept,content-type,x-api-key,authorization',
      corsExposedHeaders: 'WWW-Authenticate,Server-Authorization',
      disableCookieValidation: false,
      enforceSecureCookies: false,
      exec: '',
      hideStackTraces: false,
      host: 'localhost',
      httpsProtocol: '',
      location: '.',
      noAuth: false,
      noEnvironment: false,
      noTimeout: false,
      port: 3000,
      prefix: '/',
      preserveTrailingSlash: false,
      printOutput: false,
      providedRuntime: '',
      showDuration: false,
      stage: this.service.provider.stage,
      region: this.service.provider.region,
      resourceRoutes: false,
      skipCacheInvalidation: false,
      useSeparateProcesses: false,
      websocketPort: 3001,
    };

    // In the constructor, stage and regions are set to undefined
    if (this.options.stage === undefined) delete this.options.stage;
    if (this.options.region === undefined) delete this.options.region;

    const yamlOptions = (this.service.custom || {})['serverless-offline'];
    this.options = Object.assign({}, defaultOptions, yamlOptions, this.options);

    // Prefix must start and end with '/'
    if (!this.options.prefix.startsWith('/'))
      this.options.prefix = `/${this.options.prefix}`;
    if (!this.options.prefix.endsWith('/')) this.options.prefix += '/';

    this.velocityContextOptions = {
      stageVariables: {}, // this.service.environment.stages[this.options.stage].vars,
      stage: this.options.stage,
    };

    // Parse CORS options
    this.options.corsAllowOrigin = this.options.corsAllowOrigin
      .replace(/\s/g, '')
      .split(',');
    this.options.corsAllowHeaders = this.options.corsAllowHeaders
      .replace(/\s/g, '')
      .split(',');
    this.options.corsExposedHeaders = this.options.corsExposedHeaders
      .replace(/\s/g, '')
      .split(',');

    if (this.options.corsDisallowCredentials)
      this.options.corsAllowCredentials = false;

    this.options.corsConfig = {
      credentials: this.options.corsAllowCredentials,
      exposedHeaders: this.options.corsExposedHeaders,
      headers: this.options.corsAllowHeaders,
      origin: this.options.corsAllowOrigin,
    };

    this.options.cacheInvalidationRegex = new RegExp(
      this.options.cacheInvalidationRegex,
    );

    this.serverlessLog(
      `Starting Offline: ${this.options.stage}/${this.options.region}.`,
    );
    debugLog('options:', this.options);
  }

  end() {
    this.serverlessLog('Halting offline server');
    functionHelper.cleanup();
    this.apiGateway.server
      .stop({ timeout: 5000 })
      .then(() => process.exit(this.exitCode));
  }

  _setupEvents() {
    let serviceRuntime = this.service.provider.runtime;
    const defaultContentType = 'application/json';
    const { apiKeys } = this.service.provider;
    const protectedRoutes = [];

    if (!serviceRuntime) {
      throw new Error('Missing required property "runtime" for provider.');
    }

    if (typeof serviceRuntime !== 'string') {
      throw new Error(
        'Provider configuration property "runtime" wasn\'t a string.',
      );
    }

    if (serviceRuntime === 'provided') {
      if (this.options.providedRuntime) {
        serviceRuntime = this.options.providedRuntime;
      } else {
        throw new Error(
          'Runtime "provided" is unsupported. Please add a --providedRuntime CLI option.',
        );
      }
    }

    if (
      !(
        serviceRuntime.startsWith('nodejs') ||
        serviceRuntime.startsWith('python') ||
        serviceRuntime.startsWith('ruby') ||
        serviceRuntime.startsWith('go')
      )
    ) {
      this.printBlankLine();
      this.serverlessLog(
        `Warning: found unsupported runtime '${serviceRuntime}'`,
      );

      return;
    }

    // for simple API Key authentication model
    if (apiKeys) {
      this.serverlessLog(`Key with token: ${this.options.apiKey}`);

      if (this.options.noAuth) {
        this.serverlessLog(
          'Authorizers are turned off. You do not need to use x-api-key header.',
        );
      } else {
        this.serverlessLog('Remember to use x-api-key on the request headers');
      }
    }

    Object.keys(this.service.functions).forEach((key) => {
      const fun = this.service.getFunction(key);
      const funName = key;
      const servicePath = path.join(
        this.serverless.config.servicePath,
        this.options.location,
      );
      const funOptions = functionHelper.getFunctionOptions(
        fun,
        key,
        servicePath,
        serviceRuntime,
      );

      debugLog(`funOptions ${JSON.stringify(funOptions, null, 2)} `);
      this.printBlankLine();
      debugLog(funName, 'runtime', serviceRuntime);
      this.serverlessLog(`Routes for ${funName}:`);

      if (!fun.events) {
        fun.events = [];
      }

      // Add proxy for lamda invoke
      fun.events.push({
        http: {
          integration: 'lambda',
          method: 'POST',
          path: `{apiVersion}/functions/${fun.name}/invocations`,
          request: {
            template: {
              // AWS SDK for NodeJS specifies as 'binary/octet-stream' not 'application/json'
              'binary/octet-stream': '$input.body',
            },
          },
          response: {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        },
      });

      // Adds a route for each http endpoint
      fun.events.forEach((event) => {
        if (event.websocket) {
          this.hasWebsocketRoutes = true;

          experimentalWebSocketSupportWarning();

          this.apiGatewayWebSocket._createWsAction(
            fun,
            funName,
            servicePath,
            funOptions,
            event,
          );

          return;
        }

        if (!event.http) return;

        this.apiGateway._createRoutes(
          event,
          funOptions,
          protectedRoutes,
          funName,
          servicePath,
          serviceRuntime,
          defaultContentType,
          key,
          fun,
        );
      });
    });
  }

  // TODO: missing tests
  _verifyServerlessVersionCompatibility() {
    const { version: currentVersion } = this.serverless;
    const { serverless: requiredVersion } = pkg.peerDependencies;

    const versionIsSatisfied = satisfiesVersionRange(
      requiredVersion,
      currentVersion,
    );

    if (!versionIsSatisfied) {
      this.serverlessLog(
        `"Serverless-Offline" requires "Serverless" version ${requiredVersion} but found version ${currentVersion}.
          Be aware that functionality might be limited or has serious bugs.
          To avoid any issues update "Serverless" to a later version.
        `,
        'serverless-offline',
        { color: 'red' },
      );
    }
  }
};

let experimentalWarningNotified = false;

function experimentalWebSocketSupportWarning() {
  // notify only once
  if (experimentalWarningNotified) {
    return;
  }

  console.warn(
    'WebSocket support in serverless-offline is experimental.\nFor any bugs, missing features or other feedback file an issue at https://github.com/dherault/serverless-offline/issues',
  );

  experimentalWarningNotified = true;
}
