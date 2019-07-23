'use strict';

const { exec } = require('child_process');
const path = require('path');
const objectFromEntries = require('object.fromentries');
const ApiGateway = require('./ApiGateway');
const ApiGatewayWebSocket = require('./ApiGatewayWebSocket');
const debugLog = require('./debugLog');
const functionHelper = require('./functionHelper');
const { createDefaultApiKey, satisfiesVersionRange } = require('./utils');
const { CUSTOM_OPTION, supportedRuntimes } = require('./config/index.js');
const { peerDependencies } = require('../package.json');

objectFromEntries.shim();

const { entries, fromEntries } = Object;

module.exports = class ServerlessOffline {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.service = serverless.service;
    this.log = serverless.cli.log.bind(serverless.cli);
    this.options = options;
    this.exitCode = 0;
    this._experimentalWarningNotified = false;

    this.commands = {
      offline: {
        // add start nested options
        commands: {
          start: {
            lifecycleEvents: ['init', 'end'],
            usage:
              'Simulates API Gateway to call your lambda functions offline using backward compatible initialization.',
          },
        },
        lifecycleEvents: ['start'],
        options: {
          apiKey: {
            default: createDefaultApiKey(),
            usage:
              'Defines the API key value to be used for endpoints marked as private. Defaults to a random hash.',
          },
          binPath: {
            shortcut: 'b',
            usage: 'Path to the Serverless binary.',
          },
          cacheInvalidationRegex: {
            default: 'node_modules',
            usage:
              'Provide the plugin with a regexp to use for cache invalidation. Default: node_modules',
          },
          corsAllowHeaders: {
            default: 'accept,content-type,x-api-key,authorization',
            usage:
              'Used to build the Access-Control-Allow-Headers header for CORS support.',
          },
          corsAllowOrigin: {
            default: '*',
            usage:
              'Used to build the Access-Control-Allow-Origin header for CORS support.',
          },
          corsDisallowCredentials: {
            usage:
              'Used to override the Access-Control-Allow-Credentials default (which is true) to false.',
          },
          corsExposedHeaders: {
            default: 'WWW-Authenticate,Server-Authorization',
            usage:
              'USed to build the Access-Control-Exposed-Headers response header for CORS support',
          },
          disableCookieValidation: {
            default: false,
            usage: 'Used to disable cookie-validation on hapi.js-server',
          },
          enforceSecureCookies: {
            default: false,
            usage: 'Enforce secure cookies',
          },
          exec: {
            default: '',
            usage:
              'When provided, a shell script is executed when the server starts up, and the server will shut down after handling this command.',
          },
          hideStackTraces: {
            default: false,
            usage: 'Hide the stack trace on lambda failure. Default: false',
          },
          host: {
            default: 'localhost',
            shortcut: 'o',
            usage: 'The host name to listen on. Default: localhost',
          },
          httpsProtocol: {
            default: '',
            shortcut: 'H',
            usage:
              'To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.',
          },
          location: {
            default: '.',
            shortcut: 'l',
            usage: "The root location of the handlers' files.",
          },
          noAuth: {
            default: false,
            usage: 'Turns off all authorizers',
          },
          noEnvironment: {
            default: false,
            usage:
              'Turns off loading of your environment variables from serverless.yml. Allows the usage of tools such as PM2 or docker-compose.',
          },
          noTimeout: {
            default: false,
            shortcut: 't',
            usage: 'Disables the timeout feature.',
          },
          port: {
            default: 3000,
            shortcut: 'P',
            usage: 'Port to listen on. Default: 3000',
          },
          prefix: {
            default: '/',
            shortcut: 'p',
            usage:
              'Adds a prefix to every path, to send your requests to http://localhost:3000/prefix/[your_path] instead.',
          },
          preserveTrailingSlash: {
            default: false,
            usage: 'Used to keep trailing slashes on the request path',
          },
          printOutput: {
            default: false,
            usage: 'Outputs your lambda response to the terminal.',
          },
          providedRuntime: {
            default: '',
            usage: 'Sets the provided runtime for lambdas',
          },
          region: {
            shortcut: 'r',
            usage: 'The region used to populate your templates.',
          },
          resourceRoutes: {
            default: false,
            usage:
              'Turns on loading of your HTTP proxy settings from serverless.yml.',
          },
          showDuration: {
            default: false,
            usage: 'Show the execution time duration of the lambda function.',
          },
          skipCacheInvalidation: {
            default: false,
            shortcut: 'c',
            usage:
              'Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed',
          },
          stage: {
            shortcut: 's',
            usage: 'The stage used to populate your templates.',
          },
          useSeparateProcesses: {
            default: false,
            usage: 'Uses separate node processes for handlers',
          },
          websocketPort: {
            default: 3001,
            usage: 'Websocket port to listen on. Default: 3001',
          },
        },
        usage: 'Simulates API Gateway to call your lambda functions offline.',
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
    this.log(
      'If you think this is an issue with the plugin please submit it, thanks!',
    );
    this.log('https://github.com/dherault/serverless-offline/issues');
  }

  // Entry point for the plugin (sls offline) when running 'sls offline start'
  start() {
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
      this.log(`Got ${command} signal. Offline Halting...`);
    });
  }

  _executeShellScript() {
    const command = this.options.exec;
    const options = {
      env: {
        IS_OFFLINE: true,
        ...this.service.provider.environment,
        ...this.originalEnvironment,
      },
    };

    this.log(`Offline executing script [${command}]`);

    return new Promise((resolve) => {
      exec(command, options, (error, stdout, stderr) => {
        this.log(`exec stdout: [${stdout}]`);
        this.log(`exec stderr: [${stderr}]`);

        if (error) {
          // Use the failed command's exit code, proceed as normal so that shutdown can occur gracefully
          this.log(`Offline error executing script [${error}]`);
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
    this.originalEnvironment = { ...process.env };
  }

  _setOptions() {
    // In the constructor, stage and regions are set to undefined
    if (this.options.region === undefined) delete this.options.region;
    if (this.options.stage === undefined) delete this.options.stage;

    // default options (from commands)
    const defaultOptions = fromEntries(
      entries(this.commands.offline.options)
        // remove options without 'default' property
        .filter(([, value]) => Reflect.has(value, 'default'))
        .map(([key, value]) => [key, value.default]),
    );

    // TODO FIXME remove, leftover from default options
    // should be noved to command options defaults
    const defaultOptionsTEMP = {
      corsAllowCredentials: true, // ???
      region: this.service.provider.region,
      stage: this.service.provider.stage,
    };

    // custom options
    const { [CUSTOM_OPTION]: customOptions } = this.service.custom || {};

    // merge options
    // order of Precedence: command line options, custom options, defaults.
    this.options = {
      ...defaultOptions,
      ...defaultOptionsTEMP, // TODO FIXME, see above
      ...customOptions,
      ...this.options,
    };

    // Prefix must start and end with '/'
    if (!this.options.prefix.startsWith('/')) {
      this.options.prefix = `/${this.options.prefix}`;
    }
    if (!this.options.prefix.endsWith('/')) this.options.prefix += '/';

    this.velocityContextOptions = {
      stage: this.options.stage,
      stageVariables: {}, // this.service.environment.stages[this.options.stage].vars,
    };

    // Parse CORS options
    this.options.corsAllowHeaders = this.options.corsAllowHeaders
      .replace(/\s/g, '')
      .split(',');
    this.options.corsAllowOrigin = this.options.corsAllowOrigin
      .replace(/\s/g, '')
      .split(',');
    this.options.corsExposedHeaders = this.options.corsExposedHeaders
      .replace(/\s/g, '')
      .split(',');

    if (this.options.corsDisallowCredentials) {
      this.options.corsAllowCredentials = false;
    }

    this.options.corsConfig = {
      credentials: this.options.corsAllowCredentials,
      exposedHeaders: this.options.corsExposedHeaders,
      headers: this.options.corsAllowHeaders,
      origin: this.options.corsAllowOrigin,
    };

    this.options.cacheInvalidationRegex = new RegExp(
      this.options.cacheInvalidationRegex,
    );

    this.log(`Starting Offline: ${this.options.stage}/${this.options.region}.`);
    debugLog('options:', this.options);
  }

  end() {
    this.log('Halting offline server');
    functionHelper.cleanup();
    this.apiGateway.server
      .stop({ timeout: 5000 })
      .then(() => process.exit(this.exitCode));
  }

  _setupEvents() {
    this._verifySupportedRuntime();

    const defaultContentType = 'application/json';
    const { apiKeys } = this.service.provider;
    const protectedRoutes = [];

    // for simple API Key authentication model
    if (apiKeys) {
      this.log(`Key with token: ${this.options.apiKey}`);

      if (this.options.noAuth) {
        this.log(
          'Authorizers are turned off. You do not need to use x-api-key header.',
        );
      } else {
        this.log('Remember to use x-api-key on the request headers');
      }
    }

    let serviceRuntime = this.service.provider.runtime;

    if (serviceRuntime === 'provided') {
      serviceRuntime = this.options.providedRuntime;
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
      this.log(`Routes for ${funName}:`);

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

          this._experimentalWebSocketSupportWarning();

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

  _verifySupportedRuntime() {
    let { runtime } = this.service.provider;

    if (runtime === 'provided') {
      runtime = this.options.providedRuntime;

      if (!runtime) {
        throw new Error(
          'Runtime "provided" is unsupported. Please add a --providedRuntime CLI option.',
        );
      }
    }

    // print message but keep working (don't error out or exit process)
    if (!supportedRuntimes.has(runtime)) {
      this.printBlankLine();
      this.log(`Warning: found unsupported runtime '${runtime}'`);
    }
  }

  // TODO: missing tests
  _verifyServerlessVersionCompatibility() {
    const { version: currentVersion } = this.serverless;
    const { serverless: requiredVersion } = peerDependencies;

    const versionIsSatisfied = satisfiesVersionRange(
      requiredVersion,
      currentVersion,
    );

    if (!versionIsSatisfied) {
      this.log(
        `"Serverless-Offline" requires "Serverless" version ${requiredVersion} but found version ${currentVersion}.
         Be aware that functionality might be limited or has serious bugs.
         To avoid any issues update "Serverless" to a later version.
        `,
        'serverless-offline',
        { color: 'red' },
      );
    }
  }

  // TODO: eventually remove WARNING after release has been deemed stable
  _experimentalWebSocketSupportWarning() {
    // notify only once
    if (this._experimentalWarningNotified) {
      return;
    }

    this.log(
      `WebSocket support in "Serverless-Offline is experimental.
       For any bugs, missing features or other feedback file an issue at https://github.com/dherault/serverless-offline/issues
      `,
      'serverless-offline',
      { color: 'magenta' },
    );

    this._experimentalWarningNotified = true;
  }
};
