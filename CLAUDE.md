# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`serverless-offline` is a plugin for the [Serverless Framework](https://github.com/serverless/serverless) (peer dependency `serverless@^4`). It emulates AWS Lambda + API Gateway (plus ALB, WebSocket, and scheduled events) locally by starting HTTP servers that replicate the AWS request lifecycle and invoke your handlers. It is **pure ESM** (`"type": "module"`) and requires Node `>=20`.

The package is consumed as a Serverless plugin, not run directly. The Serverless Framework loads the class exported from [src/index.js](src/index.js) and drives it through plugin hooks (`offline:start:init` → `start()`, `offline:start:ready`, `offline:start:end` → `end()`).

## Commands

```bash
npm run lint              # eslint .
npm run lint:fix          # eslint . --fix
npm run prettier          # prettier --check .
npm run prettier:fix      # prettier --write .
npm run code-quality      # prettier check + lint (run before committing)

npm test                  # all tests (mocha)
npm run test:unit         # unit tests only (src/**/*.test.js + tests/old-unit)
npm run test:e2e          # end-to-end tests (tests/end-to-end)
npm run test:node         # node-runtime-focused suite
npm run test:docker       # docker integration tests
npm run test:cov          # coverage via nyc
```

Run a single test file or filter:

```bash
npx mocha --require ./tests/mochaHooks.cjs path/to/file.test.js
npx mocha --require ./tests/mochaHooks.cjs --grep "partial test name"
```

**Tests require `SERVERLESS_ACCESS_KEY` to be set** — [tests/mochaHooks.cjs](tests/mochaHooks.cjs) hard-exits otherwise (get one via `npx serverless login`). The hook also auto-detects `java`, `python3`, `ruby`, `docker`, and `go` on the machine and sets `*_DETECTED` env vars; runtime-specific tests skip themselves when their toolchain is absent. The `TEST` env var selects which spec globs mocha runs — see [.mocharc.cjs](.mocharc.cjs). Test timeout is 300s.

## Architecture

### Plugin lifecycle and event dispatch

[src/ServerlessOffline.js](src/ServerlessOffline.js) is the orchestrator. On `start()` it:

1. `#mergeOptions()` — merges options with precedence **CLI options > `custom.serverless-offline` in serverless.yml > [defaultOptions](src/config/defaultOptions.js)**, then derives CORS config.
2. `#getEvents()` — walks every function in the Serverless service and buckets its events into `lambdas`, `httpEvents`, `httpApiEvents`, `albEvents`, `scheduleEvents`, `webSocketEvents`. Note `httpApi` events are normalized here into a `routeKey` form and tagged `isHttpApi`, with payload version (`1.0`/`2.0`) resolved.
3. Lazily `import()`s and instantiates only the event modules that have events. **All event modules and runtime runners are dynamically imported** so an unused subsystem (e.g. Docker, Python) is never loaded.

Each event subsystem lives under [src/events/](src/events/) and follows the same shape: an `index.js` re-exporting a class, an `*EventDefinition.js` that parses the serverless.yml event config, an `HttpServer.js` (Hapi server), and a top-level class (`Http`, `Alb`, `Schedule`, `WebSocket`) with `createServer()` / `create(events)` / `start()` / `stop()`. The HTTP/ALB/WebSocket servers are all [Hapi](https://hapi.dev) servers.

### Lambda invocation pipeline

This is the core. The chain is:

`Lambda` → `LambdaFunctionPool` → `LambdaFunction` → `HandlerRunner` → a concrete runner.

- [src/lambda/Lambda.js](src/lambda/Lambda.js) — registry of functions by key and by AWS function name; also owns the local **Lambda invoke HTTP server (default port 3002)** that emulates the AWS SDK `Invoke` / `InvokeAsync` APIs (see [src/lambda/routes/](src/lambda/routes/)). This is what lets one local lambda call another via the AWS SDK pointed at `http://localhost:3002`.
- [src/lambda/LambdaFunctionPool.js](src/lambda/LambdaFunctionPool.js) — pools `LambdaFunction` instances per function key. Reuses any `IDLE` instance unless `reloadHandler` is set (which forces a fresh instance each call). A background timer reaps instances idle longer than `terminateIdleLambdaTime` seconds.
- [src/lambda/LambdaFunction.js](src/lambda/LambdaFunction.js) — one invocation context: builds the env vars (always copies `AWS_*` from the host; copies all of `process.env` only when `localEnvironment` is set; applies `provider.environment` + function `environment` through `renderIntrinsicFunction`), extracts the deployment artifact zip if `package.artifact` is set, enforces the timeout via `Promise.race` against a `LambdaTimeoutError`, and tracks BUSY/IDLE status + billed duration.
- [src/lambda/handler-runner/HandlerRunner.js](src/lambda/handler-runner/HandlerRunner.js) — picks the concrete runner from the runtime string and options. This is the **run-mode decision point**.

### Run modes (per [src/lambda/handler-runner/](src/lambda/handler-runner/))

Node.js runtimes:

- **worker-thread-runner** (default) — handler runs in an isolated Worker thread; no shared `process.env`/global state; supports reload.
- **in-process-runner** — handler runs in the same process as serverless-offline (shared env/globals, no reload). Selected with `--useInProcess`.

Other runtimes run in a child process: **python-runner**, **ruby-runner**, **go-runner**, **java-runner** (uses `java-invoke-local`). **docker-runner** runs any supported runtime in a container, selected with `--useDocker`.

Supported runtimes and their architectures are declared in [src/config/supportedRuntimes.js](src/config/supportedRuntimes.js). An unsupported runtime warns but does not abort.

### Authorizers

HTTP authorizers live in [src/events/http/](src/events/http/): `createAuthScheme.js` (custom/token/request authorizers, registered as Hapi auth schemes), `createJWTAuthScheme.js` + `authJWTSettingsExtractor.js` (JWT for httpApi), and policy evaluation in [src/events/](src/events/) (`authCanExecuteResource.js`, `authMatchPolicyResource.js`, `authValidateContext.js`). WebSocket authorizers are under [src/events/websocket/lambda-events/](src/events/websocket/lambda-events/).

## Conventions

- **Pure ESM, file extensions required in imports** (`./foo.js`, enforced by the `import/extensions` ESLint rule). Dynamic `import()` is used deliberately for lazy-loading subsystems — keep it that way.
- **No bare `Buffer` / `process` globals** — import them from `node:buffer` / `node:process` (enforced by `no-restricted-globals`).
- ESLint extends Airbnb base + `unicorn` + Prettier; `sort-keys` is **on** (object keys must be alphabetical). Config files use the `.cjs` extension. See [.eslintrc.cjs](.eslintrc.cjs).
- Classes use native `#private` fields heavily (see `LambdaFunction`, `ServerlessOffline`).
- Logging goes through [src/utils/log.js](src/utils/log.js) (`log.notice` / `log.debug` / `log.warning` / `log.error`), not `console`.
- `ServerlessOffline.internals()` exists only to expose private methods to the test suite — note the `TODO FIXME` markers; don't rely on it in production code.

## Tests layout

- `src/**/__tests__/*.test.js` — unit tests colocated with source.
- [tests/integration/](tests/integration/) — per-feature service fixtures (authorizers, cors, websocket, alb, docker, lambda-invoke, etc.); each spins up an actual offline server.
- [tests/end-to-end/](tests/end-to-end/), [tests/runtimes/](tests/runtimes/) (go/python/java), [tests/handler-module-formats/](tests/handler-module-formats/), [tests/lambda-run-mode/](tests/lambda-run-mode/) (in-process vs worker-threads), [tests/timeout/](tests/timeout/).
- [tests/\_testHelpers/](tests/_testHelpers/) — `setup`/`teardown` that launch the real serverless binary against a fixture, plus artifact-compression and docker-image helpers.
