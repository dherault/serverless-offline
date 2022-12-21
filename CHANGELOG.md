# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [8.8.1](https://github.com/dherault/serverless-offline/compare/v8.8.0...v8.8.1) (2022-07-09)

### Maintenance Improvements

- remove update-notifier ([fbcd41e](https://github.com/dherault/serverless-offline/commit/fbcd41eb29fd5aa60d3ce52a734b89ed4113d893))

## [8.8.0](https://github.com/dherault/serverless-offline/compare/v8.7.0...v8.8.0) (2022-05-17)

### Features

- Support using go build ([#1334](https://github.com/dherault/serverless-offline/issues/1334)) ([#1356](https://github.com/dherault/serverless-offline/issues/1356)) ([a79b15c](https://github.com/dherault/serverless-offline/commit/a79b15c529b60ac0d037716cf6e475bcda8f822e))

### Bug Fixes

- lowercase API gateway V2 event headers ([#1288](https://github.com/dherault/serverless-offline/issues/1288)) ([9ff4cf3](https://github.com/dherault/serverless-offline/commit/9ff4cf38c4f620545d95d815d0b420d134be5cb1))
- remove (now) useless worker thread support check ([#1406](https://github.com/dherault/serverless-offline/issues/1406)) ([1b2ae00](https://github.com/dherault/serverless-offline/commit/1b2ae0016cec385416c240b55669df038ddc5d1e))
- remove babel-eslint ([17adeb5](https://github.com/dherault/serverless-offline/commit/17adeb5b923d990f64e96e234297999baaca30a0))
- remove engine check ([#1407](https://github.com/dherault/serverless-offline/issues/1407)) ([58b2199](https://github.com/dherault/serverless-offline/commit/58b21998e2ced5eeab3ebf0a30fd1849e974befe))
- remove unneeded deps ([95e1fe5](https://github.com/dherault/serverless-offline/commit/95e1fe5bbc4aceb83bd8135503c3c4123006d61b))
- solve merge issues ([99a2578](https://github.com/dherault/serverless-offline/commit/99a25789ce6d4be718dcae470e99bde5f3ab8b86))
- temporary revert nested modules ([#1419](https://github.com/dherault/serverless-offline/issues/1419)) ([f4317e4](https://github.com/dherault/serverless-offline/commit/f4317e4f6bd818ed6d243b440cab9d7030b1c30d))

### Maintenance Improvements

- import from namespace ([#1405](https://github.com/dherault/serverless-offline/issues/1405)) ([ed9d6cd](https://github.com/dherault/serverless-offline/commit/ed9d6cd48fbdba26cf7a4b5aa096464fba94193e))
- import process explicit ([#1418](https://github.com/dherault/serverless-offline/issues/1418)) ([8893c67](https://github.com/dherault/serverless-offline/commit/8893c67718259b7d760194c74f31ee56fcd7e789))
- prettify docs ([2ee5b1e](https://github.com/dherault/serverless-offline/commit/2ee5b1ef56133aecbc120f2d20858411b30956d3))
- remove extend module, replace with Object.assign ([#1417](https://github.com/dherault/serverless-offline/issues/1417)) ([90d5169](https://github.com/dherault/serverless-offline/commit/90d516909c3c41e907d728afd47cf436f078bf97))

## [8.7.0](https://github.com/dherault/serverless-offline/compare/v8.6.0...v8.7.0) (2022-04-13)

- [Validate authorizer context response to better mimic API Gateway](https://github.com/dherault/serverless-offline/pull/1376)
- [Add support for the AUTHORIZER env variable for LambdaIntegration](https://github.com/dherault/serverless-offline/pull/1308)

## [8.6.0](https://github.com/dherault/serverless-offline/compare/v8.5.0...v8.6.0) (2022-04-13)

- [POC for externally triggering cleanup of lambda functions](https://github.com/dherault/serverless-offline/pull/1093)
- [Fixing AWS env vars](https://github.com/dherault/serverless-offline/pull/1108)
- [Ensure gateway IP is truthy before adding to docker args](https://github.com/dherault/serverless-offline/pull/1174)
- [update debugging instructions](https://github.com/dherault/serverless-offline/pull/1221)
- [Never remove cached node_modules or binary modules](https://github.com/dherault/serverless-offline/pull/1230)
- [Handle multiple cookies with the same name in the same way API Gateway does.](https://github.com/dherault/serverless-offline/pull/1249)

## [8.5.0](https://github.com/dherault/serverless-offline/compare/v8.4.0...v8.5.0) (2022-02-18)

### Features

- Add `httpEvent.operationId` to the request context ([#1325](https://github.com/dherault/serverless-offline/issues/1325)) ([e217fcb](https://github.com/dherault/serverless-offline/commit/e217fcba61fe3eae110f506268c71b350e1937da)) ([Quenby Mitchell](https://github.com/qswinson))
- Ensure `websocket` parity with API Gateway ([#1301](https://github.com/dherault/serverless-offline/issues/1301)) ([8f02226](https://github.com/dherault/serverless-offline/commit/8f0222644e5946c2bba8853c7ee6c224e7a33b41)) ([Christian Nuss](https://github.com/cnuss))
- Introduce header to override authorizer response ([#1328](https://github.com/dherault/serverless-offline/issues/1328)) ([a5158a4](https://github.com/dherault/serverless-offline/commit/a5158a489048ceee007cefa41441f841b51db59c)) ([ericctsf](https://github.com/ericctsf))
- Support injection of custom authentication strategy ([#1314](https://github.com/dherault/serverless-offline/issues/1314)) ([febfe77](https://github.com/dherault/serverless-offline/commit/febfe77d470b2e5e4fbfe5243b265d6a27fb84f3)) ([tom-stclair](https://github.com/tom-stclair))

### Bug Fixes

- Fix payload normalization ([#1332](https://github.com/dherault/serverless-offline/issues/1332)) ([e9e8169](https://github.com/dherault/serverless-offline/commit/e9e816996e8da9605a4a9856a60ddfbbe885e1b1)) ([Taras Romaniv](https://github.com/trsrm))
- Skip clearing undefined modules in `InProcessRunner` ([#1339](https://github.com/dherault/serverless-offline/issues/1339)) ([5026e43](https://github.com/dherault/serverless-offline/commit/5026e43974dd73de66bf2c82b742cc7341f7c55b)) ([Kevin Rueter](https://github.com/kerueter))

## [8.4.0](https://github.com/dherault/serverless-offline/compare/v8.3.1...v8.4.0) (2022-01-28)

### Features

- `go-runner` implementation ([#1320](https://github.com/dherault/serverless-offline/issues/1320)) ([6bb54fd](https://github.com/dherault/serverless-offline/commit/6bb54fdccebd3db61221a9b8f709414876086324))
- `--disableScheduledEvents` CLI param support ([#1185](https://github.com/dherault/serverless-offline/issues/1185)) ([4503567](https://github.com/dherault/serverless-offline/commit/4503567cdb8fa31ac9df98b667a403b0408f8444))

### Bug Fixes

- Handle custom authorizer 401 in non in-process runners ([#1319](https://github.com/dherault/serverless-offline/issues/1319)) ([8d61bde](https://github.com/dherault/serverless-offline/commit/8d61bde74cdfb37410a5c1952ca608e815eeb1cf))
- Support `httpApi` payload override on function level ([#1312](https://github.com/dherault/serverless-offline/issues/1312)) ([8db63dd](https://github.com/dherault/serverless-offline/commit/8db63dda6054198775ed3b567dc3c1dbf73eb574))

### [8.3.1](https://github.com/dherault/serverless-offline/compare/v8.3.0...v8.3.1) (2021-11-25)

### Bug Fixes

- Fix handling of modern logs (`Cannot read properties of undefined (reading 'notice')` error)
