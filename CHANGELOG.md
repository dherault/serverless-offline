# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [13.3.4](https://github.com/dherault/serverless-offline/compare/v13.3.3...v13.3.4) (2024-04-19)

### Bug Fixes

- responses without default key ([#1751](https://github.com/dherault/serverless-offline/issues/1751)) ([9ce688a](https://github.com/dherault/serverless-offline/commit/9ce688af2ed6534500d312c8fe0f57af85a13b03))

## [13.3.3](https://github.com/dherault/serverless-offline/compare/v13.3.2...v13.3.3) (2024-01-20)

### Bug Fixes

- Custom Authorizer Lambda Request context missing accountId and apiId fields ([#1640](https://github.com/dherault/serverless-offline/issues/1640)) ([3a5fca9](https://github.com/dherault/serverless-offline/commit/3a5fca96958d4b9026202d2e61b20897af01d7fe))

### Maintenance Improvements

- remove create unique id util function ([4fbb9bf](https://github.com/dherault/serverless-offline/commit/4fbb9bf8c1b14b8a3d4bf52442ab0ae4c7a4b72c))
- use default crypto import ([3d1467d](https://github.com/dherault/serverless-offline/commit/3d1467dfa119447ede5e444162d60435ccddfe29))

## [13.3.2](https://github.com/dherault/serverless-offline/compare/v13.3.1...v13.3.2) (2023-12-13)

### Bug Fixes

- Allow string values in provider.apiGateway.apiKeys ([#1662](https://github.com/dherault/serverless-offline/issues/1662)) ([d0b7606](https://github.com/dherault/serverless-offline/commit/d0b76068439b66f12099acba7a7bd0fe9cfdc880))

### Maintenance Improvements

- use crypto web api ([6ccbb80](https://github.com/dherault/serverless-offline/commit/6ccbb809f395befa10812eda2cce00d09a83e35b))

## [13.3.1](https://github.com/dherault/serverless-offline/compare/v13.3.0...v13.3.1) (2023-12-08)

### Maintenance Improvements

- fix no-lonely-if ([2b15f42](https://github.com/dherault/serverless-offline/commit/2b15f4280ec591b3535e538b8de4cc12ebddb703))

## [13.3.0](https://github.com/dherault/serverless-offline/compare/v13.2.1...v13.3.0) (2023-11-16)

### Features

- Add support for nodejs20.x runtime ([#1743](https://github.com/dherault/serverless-offline/issues/1743)) ([63167df](https://github.com/dherault/serverless-offline/commit/63167df2c59d2605f38a3eb5558c64df4ad696dd))

### [13.2.1](https://github.com/dherault/serverless-offline/compare/v13.2.0...v13.2.1) (2023-11-06)

### Maintenance Improvements

- use nullish coalescing ([04d8cfb](https://github.com/dherault/serverless-offline/commit/04d8cfb658f1eccc3be5a141c67aff78f942cedf))

## [13.2.0](https://github.com/dherault/serverless-offline/compare/v13.1.2...v13.2.0) (2023-10-04)

### Features

- Add support for golang workspace ([#1738](https://github.com/dherault/serverless-offline/issues/1738)) ([b8f99fb](https://github.com/dherault/serverless-offline/commit/b8f99fbe503872ccbf9c4d10c5bb6881fb7ea522))

### Maintenance Improvements

- remove setTimeout promisify wrapper, use built-in ([10d5f3b](https://github.com/dherault/serverless-offline/commit/10d5f3bcfbd7d0c87b53a8969db958ce95d31c20))

### [13.1.2](https://github.com/dherault/serverless-offline/compare/v13.1.1...v13.1.2) (2023-09-30)

### Bug Fixes

- LambdaProxyIntegrationEventV2 authorizer context ([#1630](https://github.com/dherault/serverless-offline/issues/1630)) ([5b82612](https://github.com/dherault/serverless-offline/commit/5b82612910a86c38c2a9ab2229c627b4eaf090c0))

### [13.1.1](https://github.com/dherault/serverless-offline/compare/v13.1.0...v13.1.1) (2023-09-26)

### Bug Fixes

- Support alb with no method conditions ([#1653](https://github.com/dherault/serverless-offline/issues/1653)) ([5e6514c](https://github.com/dherault/serverless-offline/commit/5e6514c08272d63ec81f7eff814a4c1b5d2b5e96))

## [13.1.0](https://github.com/dherault/serverless-offline/compare/v13.0.0...v13.1.0) (2023-09-25)

### Features

- Adding handling for multiple identitySource headers in the REST API. ([#1675](https://github.com/dherault/serverless-offline/issues/1675)) ([6fceed3](https://github.com/dherault/serverless-offline/commit/6fceed382a171be23054bf6f71872d500bc492ad))

## [13.0.0](https://github.com/dherault/serverless-offline/compare/v12.0.4...v13.0.0) (2023-09-21)

### ⚠ BREAKING CHANGES

- remove unsupported runtimes
- remove node.js v16 support, remove node-fetch
- remove node.js v14 support

### Bug Fixes

- **InvocationsControllor:** typo in error message ([49d94f2](https://github.com/dherault/serverless-offline/commit/49d94f2f3a16f1ab3b813eb886ab31fad4e3fc2d))
- support authorizer with no identity source specified ([#1639](https://github.com/dherault/serverless-offline/issues/1639)) ([43aaa2e](https://github.com/dherault/serverless-offline/commit/43aaa2e1960de15ce28748583919b0759879d147))

### chore

- remove node.js v14 support ([03e2745](https://github.com/dherault/serverless-offline/commit/03e27452bc84f10796dea93f1149d249eb5ee5b1))
- remove unsupported runtimes ([d2d92fe](https://github.com/dherault/serverless-offline/commit/d2d92fe289b153bcbca5ffc569f486598cdf2219))

### Maintenance Improvements

- bup eslint-plugin-unicorn, fix linting ([c93dd98](https://github.com/dherault/serverless-offline/commit/c93dd984de9729f056db55c0780b07f1aca222b1))
- re-activate unicorn/no-array-push-push ([69a1261](https://github.com/dherault/serverless-offline/commit/69a12611dda635a71113f437ccf23758620857bb))
- re-activate unicorn/no-useless-promise-resolve-reject ([3b88aa0](https://github.com/dherault/serverless-offline/commit/3b88aa0125da346a864d730bbe6da7c6edb6e928))
- re-activate unicorn/prefer-number-properties ([46391f1](https://github.com/dherault/serverless-offline/commit/46391f1924f7524d8a23d22d723065a7e9df6844))
- re-activate unicorn/prefer-ternary ([4606829](https://github.com/dherault/serverless-offline/commit/46068299281c3b48e42916b2a581fb3089f02982))
- remove node.js v16 support, remove node-fetch ([8dbcfa6](https://github.com/dherault/serverless-offline/commit/8dbcfa65c8abf76243b5815b5056b0a604f69ff5))
- remove Object.hasOwn polyfill ([8ea15b5](https://github.com/dherault/serverless-offline/commit/8ea15b5a6d924c0d612d520e998eb50edc53de75))

### [12.0.4](https://github.com/dherault/serverless-offline/compare/v12.0.3...v12.0.4) (2023-01-04)

### Maintenance Improvements

- use desm ([#1641](https://github.com/dherault/serverless-offline/issues/1641)) ([572097e](https://github.com/dherault/serverless-offline/commit/572097e0873d9494bd57967095c77980e2411dfc))

### [12.0.3](https://github.com/dherault/serverless-offline/compare/v12.0.2...v12.0.3) (2022-12-17)

### Maintenance Improvements

- remove default parameter ([402e11e](https://github.com/dherault/serverless-offline/commit/402e11e55e910533ab9761c616be843d8ac5f158))
- use array-unflat-js ([#1632](https://github.com/dherault/serverless-offline/issues/1632)) ([3ee4b30](https://github.com/dherault/serverless-offline/commit/3ee4b30ef4fac49f2d5ecc3ba73e6f6d748f64a9))

### [12.0.2](https://github.com/dherault/serverless-offline/compare/v12.0.1...v12.0.2) (2022-12-12)

### Bug Fixes

- set status code 200 for empty responses ([#1627](https://github.com/dherault/serverless-offline/issues/1627)) ([5c1efcf](https://github.com/dherault/serverless-offline/commit/5c1efcf632eb028323c13655c70ac67d4fbc7046))

### Maintenance Improvements

- **alb:** remove unused last request options ([cc5064c](https://github.com/dherault/serverless-offline/commit/cc5064c89787971cbbef27bd5da06f6a066c4aa0))
- order nit ([5fe57af](https://github.com/dherault/serverless-offline/commit/5fe57afaba4b2948992e6075e8162c919ddb9408))

### [12.0.1](https://github.com/dherault/serverless-offline/compare/v12.0.0...v12.0.1) (2022-12-07)

### Bug Fixes

- Lambda timeout status code ([#1620](https://github.com/dherault/serverless-offline/issues/1620)) ([56d986b](https://github.com/dherault/serverless-offline/commit/56d986b672602b3600fe9b552ecb4ee392ca2201))

## [12.0.0](https://github.com/dherault/serverless-offline/compare/v11.6.0...v12.0.0) (2022-12-03)

### Features

- add support for ALB ([#1521](https://github.com/dherault/serverless-offline/issues/1521)) ([bfcc4de](https://github.com/dherault/serverless-offline/commit/bfcc4defc598bfb0033810e4acc26ac5d6d38f2f))

### Maintenance Improvements

- dont return result of resolver function ([d0cba92](https://github.com/dherault/serverless-offline/commit/d0cba92d1fbb30cabab0745690b071050c36b899))
- use named import ([6be0a1b](https://github.com/dherault/serverless-offline/commit/6be0a1bc126573edadaccd302ab2d105bafd4004))
- use nullish coalescing ([9404173](https://github.com/dherault/serverless-offline/commit/940417305971ce8eb99ea87ac3c5708e377e23bf))

## [11.6.0](https://github.com/dherault/serverless-offline/compare/v11.5.0...v11.6.0) (2022-11-26)

### Features

- request authorizers with null identitySource should return 401 ([#1618](https://github.com/dherault/serverless-offline/issues/1618)) ([48c5a18](https://github.com/dherault/serverless-offline/commit/48c5a18e6f3d4954c9718fb72ff5f15bb0958fb3))

## [11.5.0](https://github.com/dherault/serverless-offline/compare/v11.4.0...v11.5.0) (2022-11-18)

### Features

- Add support for nodejs18.x runtime ([#1616](https://github.com/dherault/serverless-offline/issues/1616)) ([accefa3](https://github.com/dherault/serverless-offline/commit/accefa34b50c65d0497d310e5507f0fb5f1db8a4))

## [11.4.0](https://github.com/dherault/serverless-offline/compare/v11.3.0...v11.4.0) (2022-11-17)

### Features

- Add support for request authorizers to have a querystring identity source ([#1610](https://github.com/dherault/serverless-offline/issues/1610)) ([8d83e44](https://github.com/dherault/serverless-offline/commit/8d83e443d372398e67ae9cf0c22e20bab1d0281d))

## [11.3.0](https://github.com/dherault/serverless-offline/compare/v11.2.3...v11.3.0) (2022-11-08)

### Features

- httpApi with request authorizer ([#1600](https://github.com/dherault/serverless-offline/issues/1600)) ([ec0d31c](https://github.com/dherault/serverless-offline/commit/ec0d31c07b10bd015707b5f984229e1e35e5a8e6))

### [11.2.3](https://github.com/dherault/serverless-offline/compare/v11.2.2...v11.2.3) (2022-11-01)

### Bug Fixes

- prevent overwriting host.docker.internal in wsl ([#1605](https://github.com/dherault/serverless-offline/issues/1605)) ([c7f6f6d](https://github.com/dherault/serverless-offline/commit/c7f6f6d62cffc2a16efa9f8bc7bb835123734590))

### Maintenance Improvements

- call now from Date namespace ([5342bec](https://github.com/dherault/serverless-offline/commit/5342bec985d49967c5f37dc7b6d695a1b5c86919))
- use Date.prototype.getTime instead of valueOf ([0fdfff7](https://github.com/dherault/serverless-offline/commit/0fdfff74f2e6d2ba0a881ab4fdcf085c146abaa7))

### [11.2.2](https://github.com/dherault/serverless-offline/compare/v11.2.1...v11.2.2) (2022-10-31)

### Bug Fixes

- path access with trailing slash ([#1606](https://github.com/dherault/serverless-offline/issues/1606)) ([73b95bc](https://github.com/dherault/serverless-offline/commit/73b95bc8119c69a09d05e2ae564e33b6cd42c832))
- remove redundant and faulty condition in hapi path generation ([e756be6](https://github.com/dherault/serverless-offline/commit/e756be6a5f620a76501ddf43becdd37ce8dd947d))

### [11.2.1](https://github.com/dherault/serverless-offline/compare/v11.2.0...v11.2.1) (2022-10-27)

### Maintenance Improvements

- remove default get method from fetch ([8f40327](https://github.com/dherault/serverless-offline/commit/8f4032707d6a0eee880fb1435ffea47929f31601))
- replace aws-sdk lambda client with more lightweight [@aws-sdk](https://github.com/aws-sdk) scoped package ([1a482ad](https://github.com/dherault/serverless-offline/commit/1a482ad49d567eedca5e9c34907c27545118b39c))
- use array destructuring ([97de51b](https://github.com/dherault/serverless-offline/commit/97de51bd005c8380d60818f4ee83a6246e2c93ba))
- use Array.prototype.map to iterate layers ([6fc9e90](https://github.com/dherault/serverless-offline/commit/6fc9e90032515d7e30ee309a6aed76c54b0cd286))
- use destructuring ([414cf4a](https://github.com/dherault/serverless-offline/commit/414cf4a86242b8e6d3afcff3c7e8facb3d2620ef))

## [11.2.0](https://github.com/dherault/serverless-offline/compare/v11.1.3...v11.2.0) (2022-10-27)

### Features

- add node.js v19 to supported runtimes ([#1598](https://github.com/dherault/serverless-offline/issues/1598)) ([cf39519](https://github.com/dherault/serverless-offline/commit/cf3951925e6200ad224a22cca01721bd63aa9390))

### Bug Fixes

- logging for unhandled exceptions in handler ([#1604](https://github.com/dherault/serverless-offline/issues/1604)) ([43dfea4](https://github.com/dherault/serverless-offline/commit/43dfea4fc97f57d439186523ab5e7b3bc3770e55))

### [11.1.3](https://github.com/dherault/serverless-offline/compare/v11.1.2...v11.1.3) (2022-10-18)

### Maintenance Improvements

- create http server ([132dd7f](https://github.com/dherault/serverless-offline/commit/132dd7f18eda078a79ac486c6f63763ae8321b97))
- remove typeof operator for undefined checks ([312d4f0](https://github.com/dherault/serverless-offline/commit/312d4f0819d0a589a7b75f5f0f8b037413445642))
- split get events for http and httpApi ([51a30e9](https://github.com/dherault/serverless-offline/commit/51a30e9a209c16be3b4efca9f406a2b6ffe6017e))

### [11.1.2](https://github.com/dherault/serverless-offline/compare/v11.1.1...v11.1.2) (2022-10-13)

### [11.1.1](https://github.com/dherault/serverless-offline/compare/v11.1.0...v11.1.1) (2022-10-10)

### Bug Fixes

- await cleanup in timer ([f5b8c68](https://github.com/dherault/serverless-offline/commit/f5b8c689b17163cebb8526ddf149ebe830f2b288))
- empty complete pool on cleanup ([3377e7a](https://github.com/dherault/serverless-offline/commit/3377e7abae0e55febfca350ec9c7cefa48ebf521))
- free memory, empty lambda function pool ([b03cf79](https://github.com/dherault/serverless-offline/commit/b03cf79b29c9eb9bc8bdb62a4e76c75ef31064df))

### Maintenance Improvements

- await cleanup, then empty map ([f00383e](https://github.com/dherault/serverless-offline/commit/f00383ec716d8a71abaa55b5ea5d1b7ef4ad4014))
- use async function ([d03194f](https://github.com/dherault/serverless-offline/commit/d03194ff8761b721f329d6b40b25677764447381))

## [11.1.0](https://github.com/dherault/serverless-offline/compare/v11.0.3...v11.1.0) (2022-10-09)

### Features

- remove noStripTrailingSlashInUrl option ([71ee21d](https://github.com/dherault/serverless-offline/commit/71ee21db253f601f5355377e1a67d641fc447bea))

### Maintenance Improvements

- remove stripTrailingSlash from hapi config ([22fd667](https://github.com/dherault/serverless-offline/commit/22fd66774e6ed867d3c2c8ccc3d3c989c50d4467))

### [11.0.3](https://github.com/dherault/serverless-offline/compare/v11.0.2...v11.0.3) (2022-10-06)

### Bug Fixes

- memory leak with lambda timeout ([c9c8c14](https://github.com/dherault/serverless-offline/commit/c9c8c1411ee93a86d8eee448a4dbb350a7e67674))

### [11.0.2](https://github.com/dherault/serverless-offline/compare/v11.0.1...v11.0.2) (2022-10-05)

### Bug Fixes

- remove unreachable condition ([ae1c8b3](https://github.com/dherault/serverless-offline/commit/ae1c8b3d62c378f4ebf604e6d60117622c22a4ed))
- timeout terminating process ([#1593](https://github.com/dherault/serverless-offline/issues/1593)) ([552081c](https://github.com/dherault/serverless-offline/commit/552081c0756a31bca6a13230274f8a3b01c73a7c))

### [11.0.1](https://github.com/dherault/serverless-offline/compare/v11.0.0...v11.0.1) (2022-10-01)

### Bug Fixes

- add to set ([8befa04](https://github.com/dherault/serverless-offline/commit/8befa0468ab7d84aa24eb6afb23920724b6c859c))
- checking generated api key ([#1589](https://github.com/dherault/serverless-offline/issues/1589)) ([5d9d769](https://github.com/dherault/serverless-offline/commit/5d9d76956651abda24f8967b0690da5a93dcbd9c))

### Performance Improvements

- create api keys only when needed (again) ([d614fc8](https://github.com/dherault/serverless-offline/commit/d614fc896dc7b8c36c0603e5e75a303b88fd9917))

## [11.0.0](https://github.com/dherault/serverless-offline/compare/v10.3.2...v11.0.0) (2022-09-29)

### ⚠ BREAKING CHANGES

- remove apiKey option (#1585)
- remove disableScheduledEvents option (#1582)

### Bug Fixes

- remove apiKey option ([#1585](https://github.com/dherault/serverless-offline/issues/1585)) ([3bec2dc](https://github.com/dherault/serverless-offline/commit/3bec2dc51fa3715fca21ee9eef608b3342d8e41f))
- remove disableScheduledEvents option ([#1582](https://github.com/dherault/serverless-offline/issues/1582)) ([a640c37](https://github.com/dherault/serverless-offline/commit/a640c3728213fba50ac2af143366f4683bace7fd))

### [10.3.2](https://github.com/dherault/serverless-offline/compare/v10.3.1...v10.3.2) (2022-09-27)

### Performance Improvements

- create api keys set only when needed ([a6df83a](https://github.com/dherault/serverless-offline/commit/a6df83a9165191c46f4e5e95ffdd9a87cc75ed77))

### Maintenance Improvements

- private endpoint with api keys ([8638635](https://github.com/dherault/serverless-offline/commit/8638635feb5d7ebed6e91e135c77235280ea4ed3))
- private endpoint with api keys, Part 2 ([9d57872](https://github.com/dherault/serverless-offline/commit/9d578725babad0aa12da9560fd48f7db03182245))

### [10.3.1](https://github.com/dherault/serverless-offline/compare/v10.3.0...v10.3.1) (2022-09-27)

### Bug Fixes

- private endpoints ([76c8215](https://github.com/dherault/serverless-offline/commit/76c8215111eaad0f6ab43de48b6476eb70bdbd6d))

## [10.3.0](https://github.com/dherault/serverless-offline/compare/v10.2.1...v10.3.0) (2022-09-25)

### Features

- deprecate disableScheduledEvents option ([e7ad109](https://github.com/dherault/serverless-offline/commit/e7ad1097c245cacfe7796df3b67d988f10a3b4d1))

### Bug Fixes

- --disableCookieValidation flag throws error ([7ebcc65](https://github.com/dherault/serverless-offline/commit/7ebcc65e240587676644cf410771f6084a27fc47))
- set cookies to undefined ([bf7fed6](https://github.com/dherault/serverless-offline/commit/bf7fed6cf04f15edec426b7848bc9d3d2fdc2a96))

### Maintenance Improvements

- move private http event condition to http class ([a2d3438](https://github.com/dherault/serverless-offline/commit/a2d34384877f824768c8a6ae1aecfb634ef7cb33))

### [10.2.1](https://github.com/dherault/serverless-offline/compare/v10.2.0...v10.2.1) (2022-09-23)

### Bug Fixes

- usage identifier key condition ([c0b8d75](https://github.com/dherault/serverless-offline/commit/c0b8d7574742dfd1a3a576193912b44623ea51a4))

### Maintenance Improvements

- create lambda only when needed ([5aa44ae](https://github.com/dherault/serverless-offline/commit/5aa44aef98e45184f98d0eeb7a15366dc3c43906))
- replace jsonwebtoken with jose ([#1579](https://github.com/dherault/serverless-offline/issues/1579)) ([877463b](https://github.com/dherault/serverless-offline/commit/877463b3747455b4ae278c9adc8f8aab67df350b))

## [10.2.0](https://github.com/dherault/serverless-offline/compare/v10.1.0...v10.2.0) (2022-09-22)

### Features

- secure web sockets ([#1468](https://github.com/dherault/serverless-offline/issues/1468)) ([311fc52](https://github.com/dherault/serverless-offline/commit/311fc52327f60af3de09cf0187b6873b71b7aa94))

### Maintenance Improvements

- http server instantation for websockets ([4c7a034](https://github.com/dherault/serverless-offline/commit/4c7a03441efff04878005be20d20aa38f2870eaf))
- use node:fs/promises ([b1a6121](https://github.com/dherault/serverless-offline/commit/b1a612117f3b6b8922f28be78aeb50bb6b444e9c))
- use optional chaining ([0000ba7](https://github.com/dherault/serverless-offline/commit/0000ba7e2ed47eb5afd098d21897b138e7c2e2ca))
- websocket server instantation ([2843e86](https://github.com/dherault/serverless-offline/commit/2843e866f5f4af6ca825abaf2f849629159747e4))
- websocket servers instantiation ([4788e04](https://github.com/dherault/serverless-offline/commit/4788e04a312add77ba78496e113b0842ff100358))

## [10.1.0](https://github.com/dherault/serverless-offline/compare/v10.0.2...v10.1.0) (2022-09-18)

### Features

- add support for apiGateway.apiKeys ([#1572](https://github.com/dherault/serverless-offline/issues/1572)) ([20f6e8b](https://github.com/dherault/serverless-offline/commit/20f6e8bb0d9fbafe47b244c818adbb3ea96ceec9))
- deprecate api keys option ([#1571](https://github.com/dherault/serverless-offline/issues/1571)) ([7b03efe](https://github.com/dherault/serverless-offline/commit/7b03efe3f052a027dd3595cadf6c4b3a0359b3a0))

### Performance Improvements

- remove contributors from package.json ([0b9f007](https://github.com/dherault/serverless-offline/commit/0b9f007ba7ca0ad901489e5b743d8072b8092b39))

### [10.0.2](https://github.com/dherault/serverless-offline/compare/v10.0.1...v10.0.2) (2022-09-11)

### Performance Improvements

- create instance in worker thread helper module scope ([53a799e](https://github.com/dherault/serverless-offline/commit/53a799e7c281f67f6bff11166a89a92b8aebc9a3))

### [10.0.1](https://github.com/dherault/serverless-offline/compare/v10.0.0...v10.0.1) (2022-09-10)

### Bug Fixes

- await promise ([335993e](https://github.com/dherault/serverless-offline/commit/335993ef4bbdfa0f2a313b2fdd9e2b8ae9ef6d31))
- Support multiple of same query string for LambdaProxyIntegrationEventV2 ([#1525](https://github.com/dherault/serverless-offline/issues/1525)) ([7416c1c](https://github.com/dherault/serverless-offline/commit/7416c1cd9251efb37fba62941bd48e769c7ab18c))

## [10.0.0](https://github.com/dherault/serverless-offline/compare/v9.3.1...v10.0.0) (2022-09-03)

### ⚠ BREAKING CHANGES

- remove hide stack traces option
- rename option to terminate lambda time
- remove child process option (#1545)
- remove print output option (#1559)

### Features

- add Lambda class to package exports ([#1561](https://github.com/dherault/serverless-offline/issues/1561)) ([b043fe0](https://github.com/dherault/serverless-offline/commit/b043fe07fbd05ee1130766a5f7e958eaf9d99980))

### Bug Fixes

- add node.js v16 to unsupported docker runtimes ([6ab3928](https://github.com/dherault/serverless-offline/commit/6ab39287fb6c4c867873740b3aa2f2b3de9ccefe))
- remove child process option ([#1545](https://github.com/dherault/serverless-offline/issues/1545)) ([db395dd](https://github.com/dherault/serverless-offline/commit/db395dd168745ef5cbd9c02ec3420ec579ac438d))
- remove hide stack traces option ([1820771](https://github.com/dherault/serverless-offline/commit/1820771f7474c576ad139709f12a10fb203e2a9e))
- remove print output option ([#1559](https://github.com/dherault/serverless-offline/issues/1559)) ([9f31825](https://github.com/dherault/serverless-offline/commit/9f31825b90d69f4f37f9c75a409df873b8a81b21))

### Maintenance Improvements

- rename option to terminate lambda time ([3b9e45f](https://github.com/dherault/serverless-offline/commit/3b9e45fdfe9fbda88accaf3d8c9f05a4b643c1e8))
- unsupported docker runtimes ([c4a53d9](https://github.com/dherault/serverless-offline/commit/c4a53d9f32302e675beb73cd71579bcaa484114f))

### [9.3.1](https://github.com/dherault/serverless-offline/compare/v9.3.0...v9.3.1) (2022-09-01)

### Bug Fixes

- millis calculation ([6666e35](https://github.com/dherault/serverless-offline/commit/6666e3588fad319d07a4fc8f610b04278e551b6a))
- remove package.json main field ([11cc039](https://github.com/dherault/serverless-offline/commit/11cc039ae3505b1d84db421528190deb5bd1b2f2))
- unpin luxon ([ac2676a](https://github.com/dherault/serverless-offline/commit/ac2676aaada8a2c4a5e07fc5db738b7cc321852b))

### Maintenance Improvements

- remove unsupported dotnet, dotnet core runtimes ([b967b37](https://github.com/dherault/serverless-offline/commit/b967b376eca4ff2f3d597aab0fa8864740967ae9))
- rename time to millis ([c1158b2](https://github.com/dherault/serverless-offline/commit/c1158b2677a724053c53941b2e93450ff9c511df))
- simplify ruby runner ([10e7e82](https://github.com/dherault/serverless-offline/commit/10e7e8260b4d1840903786f2b9ece49df41416a6))

## [9.3.0](https://github.com/dherault/serverless-offline/compare/v9.2.6...v9.3.0) (2022-08-28)

### Features

- add timeout feature, hookup noTimeout option ([#1551](https://github.com/dherault/serverless-offline/issues/1551)) ([0896acc](https://github.com/dherault/serverless-offline/commit/0896accd8ae0ed080d07f9bf4b2877d454942458))

### Bug Fixes

- pin luxon to v3.0.1 ([#1555](https://github.com/dherault/serverless-offline/issues/1555)) ([7b3b264](https://github.com/dherault/serverless-offline/commit/7b3b26400d47f08ee073146ed9c911e88575c62a))

### Maintenance Improvements

- examples ([83835dd](https://github.com/dherault/serverless-offline/commit/83835dd294cd1af50a58bccc7f13e28686f0c4a0))
- examples to use es6 imports ([6953f23](https://github.com/dherault/serverless-offline/commit/6953f2363b302b91c1728698703c5c4f00bc2506))
- move examples handlers to src directory ([724b9e8](https://github.com/dherault/serverless-offline/commit/724b9e84fc91e24a720372fc94f6854ff87c141a))
- simplify ([dc8c46a](https://github.com/dherault/serverless-offline/commit/dc8c46a7f027d70dc9f7cf491cab0ac4aeaef33d))

### [9.2.6](https://github.com/dherault/serverless-offline/compare/v9.2.5...v9.2.6) (2022-08-21)

### Bug Fixes

- add handler exception logging ([06d348d](https://github.com/dherault/serverless-offline/commit/06d348df399b0f6241fca241aa96a637d1b17d46))
- Log uncaught exceptions in worker thread handlers ([#1544](https://github.com/dherault/serverless-offline/issues/1544)) ([498ce29](https://github.com/dherault/serverless-offline/commit/498ce29baac9d5b11e17f26e8cee89f41d5c9a3f))

### Maintenance Improvements

- move child process deprecation to the end for more visibility ([310a535](https://github.com/dherault/serverless-offline/commit/310a5357f07bb0de927d1ede4dcdef55d390e7db))
- rename variables ([26f61a4](https://github.com/dherault/serverless-offline/commit/26f61a439663e28b31b36dc713d8188447d39d95))
- simplify return ([04d0ae0](https://github.com/dherault/serverless-offline/commit/04d0ae0887f4602822a4d46288c3ea0c8b0415c4))

### [9.2.5](https://github.com/dherault/serverless-offline/compare/v9.2.4...v9.2.5) (2022-08-18)

### Bug Fixes

- lambda integration returning object with body ([#1547](https://github.com/dherault/serverless-offline/issues/1547)) ([b053f57](https://github.com/dherault/serverless-offline/commit/b053f574b154efcaaf2e8294579fad5753555bc7))

### [9.2.4](https://github.com/dherault/serverless-offline/compare/v9.2.3...v9.2.4) (2022-08-18)

### Bug Fixes

- deprecate command option ([6541792](https://github.com/dherault/serverless-offline/commit/6541792d54b3cf5eded193e957db6b3b90ef81c0))
- deprecate use child processes ([#1546](https://github.com/dherault/serverless-offline/issues/1546)) ([410d1dd](https://github.com/dherault/serverless-offline/commit/410d1dd451ab0e032696e5b1b7420b5d7c3f41df))

### Maintenance Improvements

- destructuring order nit ([b44cf07](https://github.com/dherault/serverless-offline/commit/b44cf07c57a3fe10e47e5e9a0ee762fb281f8aa9))
- fix color name, import from utils ([ef17e31](https://github.com/dherault/serverless-offline/commit/ef17e3177e3fa6f2c38192a522f17ea062cf1536))
- move colors to config ([2cd3180](https://github.com/dherault/serverless-offline/commit/2cd31806a0e4d2996eae8bfeb3e1a1bb93ecab27))
- move colors to separate file ([6a32f29](https://github.com/dherault/serverless-offline/commit/6a32f298ec47e8da0583a0800aca4cedda03f7f6))

### [9.2.3](https://github.com/dherault/serverless-offline/compare/v9.2.2...v9.2.3) (2022-08-17)

### Bug Fixes

- [ERR_MISSING_ARGS]: The "message" argument must be specified when using --useChildProcesses ([#1385](https://github.com/dherault/serverless-offline/issues/1385)) ([91ae1e1](https://github.com/dherault/serverless-offline/commit/91ae1e15d4d941571f929e839bbaa2f672c27629))

### Maintenance Improvements

- path.resolve parameter ([733dcdf](https://github.com/dherault/serverless-offline/commit/733dcdf294823ce2dcaf2e120666c0137913e718))
- path.resolve parameter, Part 2 ([48ee32f](https://github.com/dherault/serverless-offline/commit/48ee32f2979707aa42667e025ef05736bedc2aba))
- remove default parameter ([b657cbf](https://github.com/dherault/serverless-offline/commit/b657cbf6e8d6cccd4c590bcbf204c793da9b3d66))
- use function statements ([d213921](https://github.com/dherault/serverless-offline/commit/d213921eec04421e9390d0e73b9cc1a12e952443))

### [9.2.2](https://github.com/dherault/serverless-offline/compare/v9.2.1...v9.2.2) (2022-08-16)

### Bug Fixes

- published package content ([#1542](https://github.com/dherault/serverless-offline/issues/1542)) ([79c7ffd](https://github.com/dherault/serverless-offline/commit/79c7ffd99207d6d60bf7ed9606a63ac8a55bc45f))

### [9.2.1](https://github.com/dherault/serverless-offline/compare/v9.2.0...v9.2.1) (2022-08-15)

### Bug Fixes

- region + stage startup log ([#1539](https://github.com/dherault/serverless-offline/issues/1539)) ([62f1e3b](https://github.com/dherault/serverless-offline/commit/62f1e3bbe3291fa354f58b064e7b60a0dc98fa96))

### Maintenance Improvements

- make handler process private ([df0c474](https://github.com/dherault/serverless-offline/commit/df0c4743b32cca58def9a0d6f52b658908d25652))
- pass function options ([c1f3c1b](https://github.com/dherault/serverless-offline/commit/c1f3c1b941a34324e25253794e80876123a11313))

## [9.2.0](https://github.com/dherault/serverless-offline/compare/v9.1.7...v9.2.0) (2022-08-11)

### Features

- use aws-lambda-ric UserFunction.js ([#1534](https://github.com/dherault/serverless-offline/issues/1534)) ([de92b9e](https://github.com/dherault/serverless-offline/commit/de92b9ee1a1ef04502b782ca3758d6d2c20b1dd9))

### Maintenance Improvements

- in-process constructor ([12ab4c9](https://github.com/dherault/serverless-offline/commit/12ab4c9512256627eef3f65ebbfbfc7d2c9d174f))
- move splitHandlerPathAndName call to runners ([690325b](https://github.com/dherault/serverless-offline/commit/690325bb5c68b3813eb9697e4552fd712b291687))
- use named import ([77f71cc](https://github.com/dherault/serverless-offline/commit/77f71ccaac3a87c905440a1b51a6c75f1b8bf934))

### [9.1.7](https://github.com/dherault/serverless-offline/compare/v9.1.5...v9.1.7) (2022-08-08)

### Bug Fixes

- https protocol option default value ([57f7d87](https://github.com/dherault/serverless-offline/commit/57f7d8742f21997514b502e60cedd62536f4e22a))

### Maintenance Improvements

- declare fields, remove from constructor ([0e82819](https://github.com/dherault/serverless-offline/commit/0e82819d30a5d101fb9fbe00458bdcc45205983a))
- declare fields, remove from constructor, part 2 ([364ef2c](https://github.com/dherault/serverless-offline/commit/364ef2c23a9849ff3a01b9e026333bd0f0f86367))
- https protocol ternary consistency ([2b2a8fa](https://github.com/dherault/serverless-offline/commit/2b2a8fa8659b7fc728e12f0e634c2771ac7b851c))
- load certs private method ([33e4e01](https://github.com/dherault/serverless-offline/commit/33e4e01b38e6cefcdd7b1050561012f1ef815714))
- use conditional spread ([5dfe577](https://github.com/dherault/serverless-offline/commit/5dfe57783c5dbd78050abdf49a009caf9fd1fe00))

### [9.1.6](https://github.com/dherault/serverless-offline/compare/v9.1.5...v9.1.6) (2022-08-05)

### Bug Fixes

- event.resource in catch-all route gets + changed to \* ([#1524](https://github.com/dherault/serverless-offline/issues/1524)) ([0494fdb](https://github.com/dherault/serverless-offline/commit/0494fdb27427c96a05313d1f9fc3bdcbeba30e0a))
- tls options ([#1529](https://github.com/dherault/serverless-offline/issues/1529)) ([c76939d](https://github.com/dherault/serverless-offline/commit/c76939d58b8cec40a6ae876076faaac8eb817344))

### [9.1.5](https://github.com/dherault/serverless-offline/compare/v9.1.4...v9.1.5) (2022-08-04)

### Bug Fixes

- child processes run mode ([#1527](https://github.com/dherault/serverless-offline/issues/1527)) ([05e5e3a](https://github.com/dherault/serverless-offline/commit/05e5e3aa8dd97d0516a6cdc143dcaea465c4a892))

### [9.1.4](https://github.com/dherault/serverless-offline/compare/v9.1.3...v9.1.4) (2022-08-03)

### Bug Fixes

- make @serverless/utils a direct dependency ([83a4885](https://github.com/dherault/serverless-offline/commit/83a4885187a8358c29a04c976373c81b7137f488))

### [9.1.3](https://github.com/dherault/serverless-offline/compare/v9.1.2...v9.1.3) (2022-08-02)

### Bug Fixes

- change protectedRoutes type from array to string ([38debc6](https://github.com/dherault/serverless-offline/commit/38debc6cc8344f816f7c404cbcb503c8f0cd35cf))
- remove unused parameter ([7cd4a5a](https://github.com/dherault/serverless-offline/commit/7cd4a5acecf2887eaaf6fc398f40a0a20997059f))

### Maintenance Improvements

- move create hapi handler into separate function ([45454af](https://github.com/dherault/serverless-offline/commit/45454aff01b3bc6f51db25c77c454a0fe6f688a6))
- move http server setup to separate function ([6f03251](https://github.com/dherault/serverless-offline/commit/6f03251105d5c2a4d91ce1abf2b796e609752851))
- move register plugins to create server ([5e101a6](https://github.com/dherault/serverless-offline/commit/5e101a6c6f2003c754bda81ac700a62231da3806))
- nit ([739273d](https://github.com/dherault/serverless-offline/commit/739273de7be49f94915762ecf3ba58aae3b2488c))
- remove corsAllowCredentials from default options ([26a9567](https://github.com/dherault/serverless-offline/commit/26a95679074fcecd9c123decbe949264b47088c3))
- replace arrow functions ([5e3e3d8](https://github.com/dherault/serverless-offline/commit/5e3e3d83154f1ebf35a0e93e5570dfda135ac964))
- use fs/promises ([7019d28](https://github.com/dherault/serverless-offline/commit/7019d285034883ca2df8eb7c3327bc15fa0f1119))

### [9.1.2](https://github.com/dherault/serverless-offline/compare/v9.1.1...v9.1.2) (2022-07-31)

### Bug Fixes

- Prevent logging `undefined` for event schedule ([#1520](https://github.com/dherault/serverless-offline/issues/1520)) ([3042bc2](https://github.com/dherault/serverless-offline/commit/3042bc2e8d92387800dedef0e491d737dd64c82a))
- remove unsupported stageVariables ([4648d39](https://github.com/dherault/serverless-offline/commit/4648d39837ee76b81cf5adedce0bb05c1e97f9c4))

### Maintenance Improvements

- make more payload identifier private static ([07ec960](https://github.com/dherault/serverless-offline/commit/07ec960d63a513fa1836c70b48624559735b9a40))
- make payload identifier private static ([7d4bf76](https://github.com/dherault/serverless-offline/commit/7d4bf76039237e4fd9d22a1271dc94c13ad175f2))
- simplify, remove else condition ([df77e14](https://github.com/dherault/serverless-offline/commit/df77e14bb761e8a12af1ac11f19f6b0cf823e37b))
- use Object.hasOwn ([ec1210a](https://github.com/dherault/serverless-offline/commit/ec1210a327aaaee61a9ca11b9604e411136b29b5))
- use PAYLOAD_IDENTIFIER ([d6eb227](https://github.com/dherault/serverless-offline/commit/d6eb227f932ea6b511fd2b9c249bd9351c84feca))
- use prototype.includes ([50679e1](https://github.com/dherault/serverless-offline/commit/50679e1e55200b63096245a7d5319106a08fda77))

### [9.1.1](https://github.com/dherault/serverless-offline/compare/v9.1.0...v9.1.1) (2022-07-30)

### Bug Fixes

- default lambda timeout ([ad217e2](https://github.com/dherault/serverless-offline/commit/ad217e268315062d338a9cefdc2a584728f5025b))
- round getRemainingTimeInMillis to nearest integer ([2106504](https://github.com/dherault/serverless-offline/commit/21065040f722898e96806d9c4d80eaae7245e938))
- use Math.floor() ([f6145d9](https://github.com/dherault/serverless-offline/commit/f6145d92aa2c55829269861b0b3e40b5d1c52e16))
- worker-runner timout option ([#1515](https://github.com/dherault/serverless-offline/issues/1515)) ([3437822](https://github.com/dherault/serverless-offline/commit/343782270df8f4a6c50236d68581553d81554d97))

### Maintenance Improvements

- nit ([6d82e3e](https://github.com/dherault/serverless-offline/commit/6d82e3e016420552ce4ff48701d4fdbdefa7035e))
- replace execaSync with execa (promise) ([#1518](https://github.com/dherault/serverless-offline/issues/1518)) ([7fe54c5](https://github.com/dherault/serverless-offline/commit/7fe54c5d403ab76a15d58a8ba0200a7dddddab45))
- use object shorthand for getRemainingTimeInMillis ([a9078df](https://github.com/dherault/serverless-offline/commit/a9078df619bbfd79dd325afb38e012ea8001fc5a))
- use try/finally ([58698fa](https://github.com/dherault/serverless-offline/commit/58698fab154f108d913744574745db2706382f2f))

## [9.1.0](https://github.com/dherault/serverless-offline/compare/v9.0.0...v9.1.0) (2022-07-27)

### Features

- add local environment variables flag ([#1513](https://github.com/dherault/serverless-offline/issues/1513)) ([4de5620](https://github.com/dherault/serverless-offline/commit/4de56207114d1133fb7ca05483af6625c858bc7d))
- copy all AWS_xxx environment variables from local ([c6d5546](https://github.com/dherault/serverless-offline/commit/c6d554662625637532bc941ffcaf7e84d30a9f7d))
- rename localEnvironmentVariables flag to localEnvironment ([b041577](https://github.com/dherault/serverless-offline/commit/b041577947bd519dadfa69c32e3deeb3f28e79e9))

### Bug Fixes

- change default lambda runtime to nodejs14.x ([1ad9fbd](https://github.com/dherault/serverless-offline/commit/1ad9fbd90447947578f4fa5b6ae4e5627d75acf1))
- Cleanly exit node process ([#1508](https://github.com/dherault/serverless-offline/issues/1508)) ([ff9d0b5](https://github.com/dherault/serverless-offline/commit/ff9d0b58b3b6866ccd54c4c54a457b74c051d603))
- env property is always a string ([a226d63](https://github.com/dherault/serverless-offline/commit/a226d6330dacd8f212f53c7aeea0ebf1d69c5e99))
- remove duplicate env.IS_OFFLINE variable ([b7f7072](https://github.com/dherault/serverless-offline/commit/b7f70729a4bf085bcec715d72975d79f53aad2e4))
- remove replay ([d325837](https://github.com/dherault/serverless-offline/commit/d325837c2e1193c175dae2b3a5958bc4b4a7fa91))

### Maintenance Improvements

- make handler private field ([fbdb162](https://github.com/dherault/serverless-offline/commit/fbdb1628c4777ee130e52e5ccddc88c391a29bfb))
- move \_HANDLER to aws env vars ([3c92cd4](https://github.com/dherault/serverless-offline/commit/3c92cd4bb2dc7460e45d3fb73cea883b3f3c2acd))
- remove #getEnv ([f6f40fd](https://github.com/dherault/serverless-offline/commit/f6f40fdf7afecf1cd3e5abe99bd54cc3fa9a1eb3))
- remove resolve joins in provider envs ([e459110](https://github.com/dherault/serverless-offline/commit/e459110b1aa327ea8ac5b7e5d9a47bab708445ca))

## [9.0.0](https://github.com/dherault/serverless-offline/compare/v8.8.0...v9.0.0) (2022-07-18)

### ⚠ BREAKING CHANGES

- use node: protocol imports (#1435)
- use fs/promises (#1432)
- remove serverless v1 support
- remove node.js v12 support, add v18 (#1424)

### Features

- add 'configValidationMode: error' option ([8de4008](https://github.com/dherault/serverless-offline/commit/8de400858de54ff9ac64b2eed855094541a2ddf6))
- add 'configValidationMode: error' option, Part 2 ([3610786](https://github.com/dherault/serverless-offline/commit/361078698c03f79602d1e1687c263c970bed6c04))
- add 'configValidationMode: error' option, Part 3 ([6f3e66b](https://github.com/dherault/serverless-offline/commit/6f3e66b7e4d12dc1b38dc2a504f133e50f2bd60b))
- add 'configValidationMode: error' option, Part 4 ([b7e73f2](https://github.com/dherault/serverless-offline/commit/b7e73f26eff6a69037fa68b91dedfac02ea94ed3))
- add 'configValidationMode: error' option, Part 5 ([39d37cb](https://github.com/dherault/serverless-offline/commit/39d37cb92599cf57f121d31f79fc4b8d73dce6c4))
- add new runtimes ([#1464](https://github.com/dherault/serverless-offline/issues/1464)) ([3ae08c4](https://github.com/dherault/serverless-offline/commit/3ae08c4c83d3455deac7d4946fef250b770fd97b))
- add object.hasown shim ([ea0aebf](https://github.com/dherault/serverless-offline/commit/ea0aebf25548f2e357dd2ae90cdc40e1077b2ac0))
- add package.json exports field ([2c263d0](https://github.com/dherault/serverless-offline/commit/2c263d004dcb6e34338a5130c68bbbb48620e99a))
- add reload handler flag ([f662dc5](https://github.com/dherault/serverless-offline/commit/f662dc56f3473cd1816c89331bfae96e8e5da715))
- bump esm-only deps ([#1456](https://github.com/dherault/serverless-offline/issues/1456)) ([5faa4d1](https://github.com/dherault/serverless-offline/commit/5faa4d1117d6bcb883d879b1ebbac176621ec890))
- display memory leak warning for in-process handlers ([2192a5f](https://github.com/dherault/serverless-offline/commit/2192a5ff7d856f5354c73160816fadd753ed65d9))
- remove babel, use esm ([#1455](https://github.com/dherault/serverless-offline/issues/1455)) ([1f4d836](https://github.com/dherault/serverless-offline/commit/1f4d83644f7aed5ed8572595ff7a511c7552c166))
- remove even more serverless v2 logging ([677d1b1](https://github.com/dherault/serverless-offline/commit/677d1b19a8c9c4f17df65ca39ae2197e0621b0b7))
- remove more serverless v2 logging ([6b101aa](https://github.com/dherault/serverless-offline/commit/6b101aa9c001a75708757beb5796234527ec1a5f))
- remove serverless v2 logging ([404093c](https://github.com/dherault/serverless-offline/commit/404093c8230ce572b8106ecef16ad52dd43a60b6))
- support serverless v3 ([#1444](https://github.com/dherault/serverless-offline/issues/1444)) ([1e9445e](https://github.com/dherault/serverless-offline/commit/1e9445efd7d925ebba7c03f43b3a81c28d5fd44c))

### Bug Fixes

- \_\_dirname in esm ([0cdf1b9](https://github.com/dherault/serverless-offline/commit/0cdf1b9096228334af633c4d0772fba3714f2135))
- add strict directive ([5d88bc4](https://github.com/dherault/serverless-offline/commit/5d88bc4e9c5773142a40cb948152ed19a1751875))
- await promise ([d01d3e3](https://github.com/dherault/serverless-offline/commit/d01d3e3714ddb0eb712af950be17ef1be329f7cc))
- aws-sdk import ([43ed77e](https://github.com/dherault/serverless-offline/commit/43ed77e4e62dae013b4a089aa138623cde86ffca))
- cleanup ([#1457](https://github.com/dherault/serverless-offline/issues/1457)) ([4e29466](https://github.com/dherault/serverless-offline/commit/4e294668f34dfce3d7a2fb5f275fde4a2d7d63ed))
- cli option message ([9e31eb3](https://github.com/dherault/serverless-offline/commit/9e31eb3d408c2ae3e985152b05a8f885a5a26e75))
- console.log ([d85bb15](https://github.com/dherault/serverless-offline/commit/d85bb15a212c8febcb1c6ae066864dda21021dcd))
- don't require context ([#1471](https://github.com/dherault/serverless-offline/issues/1471)) ([#1472](https://github.com/dherault/serverless-offline/issues/1472)) ([aaccf96](https://github.com/dherault/serverless-offline/commit/aaccf96a5905eaa60f5938b06e7b1d60b517269e))
- example plugin path ([da60c98](https://github.com/dherault/serverless-offline/commit/da60c98a1458357f4de0229d02634a01505afd03))
- execa import ([a2c599a](https://github.com/dherault/serverless-offline/commit/a2c599a3aee508e278bdbeba071475e5599bb18c))
- getter/setter map ([e56b190](https://github.com/dherault/serverless-offline/commit/e56b1906d89ce14e065ed65b06be8904b7c46e9b))
- Increase invocation payload limit to 6 mb ([0e13c8b](https://github.com/dherault/serverless-offline/commit/0e13c8bec06ad6213ac7450d1feb52f8263cc3b8))
- package.json files ([79ffb5e](https://github.com/dherault/serverless-offline/commit/79ffb5e67259acd6f9a2cec03a73b1c1aca3cbeb))
- remove allow cache option ([78fec17](https://github.com/dherault/serverless-offline/commit/78fec17b787639476f8ddfbdd436a4b6737e3a43))
- remove catch binding ([#1459](https://github.com/dherault/serverless-offline/issues/1459)) ([653aa5c](https://github.com/dherault/serverless-offline/commit/653aa5c23fca318891020937f4aeecde9d7c8963))
- remove NODE_ENV=test condition ([#1499](https://github.com/dherault/serverless-offline/issues/1499)) ([2eec40a](https://github.com/dherault/serverless-offline/commit/2eec40a7bba78ec0c1d7de603fbc711437481376))
- remove ruby v2.5 support ([ca85e7e](https://github.com/dherault/serverless-offline/commit/ca85e7e812eaecbd51da5c90a88410300d176196))
- serverless-offline v8.6 and later unloads all modules when running on Windows, breaking plugins ([#1461](https://github.com/dherault/serverless-offline/issues/1461)) ([#1462](https://github.com/dherault/serverless-offline/issues/1462)) ([af441b2](https://github.com/dherault/serverless-offline/commit/af441b28aca3e50638f9d91601f1037c1e8446b9))
- stringify websocket data ([4b0f110](https://github.com/dherault/serverless-offline/commit/4b0f110139bf3ba5c6a6d1d2ab232f8f6a6afb9b))
- websocket imports ([eae5400](https://github.com/dherault/serverless-offline/commit/eae5400bdff7fb5d9121b69e84f83f63370decd6))

### ci

- remove node.js v12 support, add v18 ([#1424](https://github.com/dherault/serverless-offline/issues/1424)) ([e11da36](https://github.com/dherault/serverless-offline/commit/e11da3616615690c15d0fac7c187d8a3d62e1c36))
- remove serverless v1 support ([c812f3b](https://github.com/dherault/serverless-offline/commit/c812f3b2162e5c9a25b17310d6e0731a7fc0ec76))

### Maintenance Improvements

- conditionally install node-fetch globally vs. node.js v18+ ([0f2c313](https://github.com/dherault/serverless-offline/commit/0f2c313752a0f8860a4fe19a9ad6b00e7c3a5157))
- don't return from constructor ([cf101bd](https://github.com/dherault/serverless-offline/commit/cf101bd6c4d9f1055bcfedab6aeaa57ff9d13539))
- export internals ([37ff876](https://github.com/dherault/serverless-offline/commit/37ff876f2f7e33fa6cc9c4e03713486a1092784c))
- fix function name ([52e5f98](https://github.com/dherault/serverless-offline/commit/52e5f985d12de692c3bf21ee13b6992cf5436206))
- import log from @serverless/utils package ([63c7b43](https://github.com/dherault/serverless-offline/commit/63c7b43c07fc7a3c7b2036dfb071dfe55d9d1e1b))
- make cleanupFunctions private ([bb77350](https://github.com/dherault/serverless-offline/commit/bb7735045de1b6fdcdc97fcf4aa2bddebe9d84c7))
- make method private ([7fa36af](https://github.com/dherault/serverless-offline/commit/7fa36afaf9199a7fc213f7bf41d42ab6b6ac66de))
- nit ([5180b25](https://github.com/dherault/serverless-offline/commit/5180b25c2ab11254c7a7b12758a72de8976d8ae3))
- re-use path.resolve kimport ([732d374](https://github.com/dherault/serverless-offline/commit/732d37455e74e6472fb776db788804e7b47259ea))
- reduce try/catch block ([850ae3e](https://github.com/dherault/serverless-offline/commit/850ae3e010c65bb2e947cae8a75e8dd8c848f484))
- remove p-map module ([6d4b1af](https://github.com/dherault/serverless-offline/commit/6d4b1afe2cf125eedd5caf8b117a2c73c80abc7d))
- remove readfile function ([c417198](https://github.com/dherault/serverless-offline/commit/c4171987af228a7e7a28666c3ad21c660ac3b783))
- remove serverless compat check ([21779ff](https://github.com/dherault/serverless-offline/commit/21779ff59c9f4b321a2fd46519c410380cdcce86))
- remove update-notifier ([861ad84](https://github.com/dherault/serverless-offline/commit/861ad840f16467dc1cff3f11c7e13429fe66d4f5))
- remove var ([5f84931](https://github.com/dherault/serverless-offline/commit/5f84931b4ce98b0f96f523d8c44aa6755a30165d))
- replace cuid module with built-in crypto.randomUUID ([2cf6b41](https://github.com/dherault/serverless-offline/commit/2cf6b41f840f8bc6ae320ff2092cd3bc25271d55))
- replace printBlankLine ([b82028f](https://github.com/dherault/serverless-offline/commit/b82028ff822d6cfe8eb8b19812a4a6e398bc0f8c))
- simplify ([2943120](https://github.com/dherault/serverless-offline/commit/2943120e24869a0ee5d63f78bc9fccb3dc911257))
- simplify ([ac63c36](https://github.com/dherault/serverless-offline/commit/ac63c36c29def0f899e65aedf46062948b560d06))
- simplify condition ([acdf1b9](https://github.com/dherault/serverless-offline/commit/acdf1b98458ea697f0fdb90b95b8e052d059a74d))
- use a lot more Object.entries ([85361a5](https://github.com/dherault/serverless-offline/commit/85361a58ce5b6cf6e79ec3a100d2d05b10d664d7))
- use async fs/promises ([#1458](https://github.com/dherault/serverless-offline/issues/1458)) ([ae855ef](https://github.com/dherault/serverless-offline/commit/ae855ef518477fa3e2fc3b5b3e32cf34ee13742d))
- use async unlink ([#1480](https://github.com/dherault/serverless-offline/issues/1480)) ([2fccc87](https://github.com/dherault/serverless-offline/commit/2fccc8706b2bdd1cd461c3efc6403e9845ff149e))
- use destructuring ([f8c6533](https://github.com/dherault/serverless-offline/commit/f8c6533143614afd59394dd08947e79323965ef8))
- use even more Object.entries ([76582e0](https://github.com/dherault/serverless-offline/commit/76582e06b72ea0d5c26899f574d8962c7d47d5c6))
- use fs/promises ([#1432](https://github.com/dherault/serverless-offline/issues/1432)) ([f744897](https://github.com/dherault/serverless-offline/commit/f74489777e70459df2d6f5b1b126a8bf177b859f))
- use fs/promises ([#1445](https://github.com/dherault/serverless-offline/issues/1445)) ([969b37c](https://github.com/dherault/serverless-offline/commit/969b37c0098ac80a000de1a155294a8d4c2dc74d))
- use function statements, move into module scope ([4dc34c5](https://github.com/dherault/serverless-offline/commit/4dc34c57e0d0a62c45f4e656a0f68f343940154f))
- use more Object.entries ([c1552e4](https://github.com/dherault/serverless-offline/commit/c1552e44579d5b9eb857602f3fba9a83198dd92f))
- use named import ([669ebc6](https://github.com/dherault/serverless-offline/commit/669ebc64aebdca23fec75c973ee3737256901353))
- use node: protocol import ([e44182b](https://github.com/dherault/serverless-offline/commit/e44182bde24707e95285ae03a266d31b994e66ed))
- use node: protocol imports ([#1435](https://github.com/dherault/serverless-offline/issues/1435)) ([397e703](https://github.com/dherault/serverless-offline/commit/397e703c049f8be8b8678dba954879310c49014d))
- use Object.entries ([b864a35](https://github.com/dherault/serverless-offline/commit/b864a356433089c84217e6ae70c6ce1b44f862cb))
- use Object.entries ([257524c](https://github.com/dherault/serverless-offline/commit/257524c016bc9d04745f4231ddd74ccabe3eac0d))
- use object.entries ([#1446](https://github.com/dherault/serverless-offline/issues/1446)) ([7b25196](https://github.com/dherault/serverless-offline/commit/7b25196bc839f8711a4524d791c6eb9ba81a8a31))
- use Object.entries/.fromEntries ([18c2b41](https://github.com/dherault/serverless-offline/commit/18c2b41c99f127dd2e7ce26e7141b12b413e5cf6))
- use private methods ([#1423](https://github.com/dherault/serverless-offline/issues/1423)) ([a332dbf](https://github.com/dherault/serverless-offline/commit/a332dbf62e8d05e77cbf2ed2cdf5536b4e05e1a4))
- use private methods ([#1425](https://github.com/dherault/serverless-offline/issues/1425)) ([f04e57c](https://github.com/dherault/serverless-offline/commit/f04e57c80254b19b3f448ed335f90de02d54f1bb))
- use way more Object.entries ([86c5280](https://github.com/dherault/serverless-offline/commit/86c5280a0d33d45640d1cc915743c881f7dd304e))
- use worker threads by default, remove flag, introduce in-process flag ([80091fb](https://github.com/dherault/serverless-offline/commit/80091fb207335a82461a753e317c452f94e0c0ee))
- **websockets:** use async/await ([4377f45](https://github.com/dherault/serverless-offline/commit/4377f457db6a871850e8152efd432d968ee92cb0))

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
