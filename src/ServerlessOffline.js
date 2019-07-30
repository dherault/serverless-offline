'use strict';

const { exec } = require('child_process');
const path = require('path');
const ApiGateway = require('./ApiGateway');
const ApiGatewayWebSocket = require('./ApiGatewayWebSocket');
const debugLog = require('./debugLog');
const {
  functionCacheCleanup,
  getFunctionOptions,
} = require('./functionHelper');
const { satisfiesVersionRange } = require('./utils');
const {
  defaults,
  commands: commandOptions,
  CUSTOM_OPTION,
  SERVER_SHUTDOWN_TIMEOUT,
  supportedRuntimes,
} = require('./config/index.js');
const { peerDependencies } = require('../package.json');

const { stringify } = JSON;

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
            options: commandOptions,
            usage:
              'Simulates API Gateway to call your lambda functions offline using backward compatible initialization.',
          },
        },
        lifecycleEvents: ['start'],
        options: commandOptions,
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
  async start() {
    this._verifyServerlessVersionCompatibility();

    // Some users would like to know their environment outside of the handler
    process.env.IS_OFFLINE = true;

    await this._buildServer();
    await this.apiGateway._listen();

    if (this.hasWebsocketRoutes) {
      await this.apiGatewayWebSocket._listen();
    }

    if (process.env.NODE_ENV === 'test') {
      return;
    }

    if (this.options.exec) {
      await this._executeShellScript();
    } else {
      await this._listenForTermination();
    }
  }

  /**
   * Entry point for the plugin (sls offline) when running 'sls offline'
   * The call to this.end() would terminate the process before 'offline:start:end' could be consumed
   * by downstream plugins. When running sls offline that can be expected, but docs say that
   * 'sls offline start' will provide the init and end hooks for other plugins to consume
   * */
  async startWithExplicitEnd() {
    await this.start();
    this.end();
  }

  async _listenForTermination() {
    const command = await new Promise((resolve) => {
      process
        // SIGINT will be usually sent when user presses ctrl+c
        .on('SIGINT', () => resolve('SIGINT'))
        // SIGTERM is a default termination signal in many cases,
        // for example when "killing" a subprocess spawned in node
        // with child_process methods
        .on('SIGTERM', () => resolve('SIGTERM'));
    });

    this.log(`Got ${command} signal. Offline Halting...`);
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

  async _buildServer() {
    // Methods
    this._setOptions(); // Will create meaningful options from cli options
    this._storeOriginalEnvironment(); // stores the original process.env for assigning upon invoking the handlers

    this.apiGateway = new ApiGateway(
      this.serverless,
      this.options,
      this.velocityContextOptions,
    );

    await this.apiGateway._createServer();

    this.hasWebsocketRoutes = false;
    this.apiGatewayWebSocket = new ApiGatewayWebSocket(
      this.serverless,
      this.options,
    );
    await this.apiGatewayWebSocket._createWebSocket();

    this._setupEvents();
    this.apiGateway._createResourceRoutes(); // HTTP Proxy defined in Resource
    this.apiGateway._create404Route(); // Not found handling
  }

  _storeOriginalEnvironment() {
    this.originalEnvironment = { ...process.env };
  }

  _setOptions() {
    // In the constructor, stage and regions are set to undefined
    if (this.options.region === undefined) delete this.options.region;
    if (this.options.stage === undefined) delete this.options.stage;

    // TODO FIXME remove, leftover from default options
    const defaultsTEMP = {
      region: this.service.provider.region,
      stage: this.service.provider.stage,
    };

    // custom options
    const { [CUSTOM_OPTION]: customOptions } = this.service.custom || {};

    // merge options
    // order of Precedence: command line options, custom options, defaults.
    this.options = {
      ...defaults,
      ...defaultsTEMP, // TODO FIXME, see above
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

  async end() {
    this.log('Halting offline server');
    functionCacheCleanup();
    await this.apiGateway.stop(SERVER_SHUTDOWN_TIMEOUT);

    if (process.env.NODE_ENV === 'test') {
      return;
    }

    process.exit(this.exitCode);
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

    let { runtime } = this.service.provider;

    if (runtime === 'provided') {
      runtime = this.options.providedRuntime;
    }

    Object.entries(this.service.functions).forEach(([key, functionObj]) => {
      const funName = key;

      const servicePath = path.join(
        this.serverless.config.servicePath,
        this.options.location,
      );

      const funOptions = getFunctionOptions(
        functionObj,
        key,
        servicePath,
        runtime,
      );

      debugLog(`funOptions ${stringify(funOptions, null, 2)} `);
      this.printBlankLine();
      debugLog(funName, 'runtime', runtime);
      this.log(`Routes for ${funName}:`);

      if (!functionObj.events) {
        functionObj.events = [];
      }

      // TODO `fun.name` is not set in the jest test run
      // possible serverless BUG?
      if (process.env.NODE_ENV !== 'test') {
        // Add proxy for lamda invoke
        functionObj.events.push({
          http: {
            integration: 'lambda',
            method: 'POST',
            path: `{apiVersion}/functions/${functionObj.name}/invocations`,
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
      }

      // Adds a route for each http endpoint
      functionObj.events.forEach((event) => {
        if (event.websocket) {
          this.hasWebsocketRoutes = true;

          this._experimentalWebSocketSupportWarning();

          this.apiGatewayWebSocket._createWsAction(
            functionObj,
            funName,
            servicePath,
            funOptions,
            event,
          );

          return;
        }

        if (!event.http) {
          return;
        }

        this.apiGateway._createRoutes(
          event,
          funOptions,
          protectedRoutes,
          funName,
          servicePath,
          runtime,
          defaultContentType,
          key,
          functionObj,
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
          `Runtime "provided" is not supported by "Serverless-Offline".
           Please specify the additional "providedRuntime" option.
          `,
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
