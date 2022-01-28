# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
