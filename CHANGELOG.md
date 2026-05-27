### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### [v14.7.1](https://github.com/dherault/serverless-offline/compare/v14.7.0...v14.7.1)

- fix: invalid cookie error [`#1885`](https://github.com/dherault/serverless-offline/pull/1885)
- Edit CHANGELOG [`0486ff5`](https://github.com/dherault/serverless-offline/commit/0486ff548f9ed64b3a7544a28ec4cc6a0eaa1da8)
- chore: make generateHapicookie more robust [`35ba124`](https://github.com/dherault/serverless-offline/commit/35ba1242e6633a446b39f32b315c588ed90e03fa)
- chore(generateHapiCookie): added test cases, cater for max-age with expires attribute scenario [`56cde0e`](https://github.com/dherault/serverless-offline/commit/56cde0ed4f9f945f20e9de0f3df1c85ad7222e88)
- chore(generateHapiCookie): test case update [`7b5692e`](https://github.com/dherault/serverless-offline/commit/7b5692e4756086036c0809f33ec5c0870dca23de)
- Edit script [`7fd39fc`](https://github.com/dherault/serverless-offline/commit/7fd39fcd86d041a7bd9ecc641af01df1deda902d)
- chore(generateHapicookie): revised with feedback add test cases [`4d6fa83`](https://github.com/dherault/serverless-offline/commit/4d6fa83beb5e5d09d44d4427ae0f9bd3e1664b77)
- chore: remove redundant import [`52988b2`](https://github.com/dherault/serverless-offline/commit/52988b2f5af8f790654e15672945dced18f92443)
- chore: remove redundant import [`19347ae`](https://github.com/dherault/serverless-offline/commit/19347aeccb2afd1a67f58f0db68d83da9805631a)

#### [v14.7.0](https://github.com/dherault/serverless-offline/compare/v14.6.0...v14.7.0)

> 22 May 2026

- Improve ruby performance [`#1873`](https://github.com/dherault/serverless-offline/pull/1873)
- Install auto-changelog [`c3f8e85`](https://github.com/dherault/serverless-offline/commit/c3f8e85b3031cd8dd5b672de584bee667e556ca8)
- Update dependencies [`3ff34fb`](https://github.com/dherault/serverless-offline/commit/3ff34fbfe1aae91a72382ee5e0f06bcbb83633a4)
- Update mocha [`bc7fd5b`](https://github.com/dherault/serverless-offline/commit/bc7fd5bdb5c71de65c94fe33976a60ff3a4c4f12)
- Add hot reload [`146b625`](https://github.com/dherault/serverless-offline/commit/146b6254110cb2b6889142cd2edbb5c2b875f5dc)
- fix: address Copilot review feedback on Ruby runner [`1941ade`](https://github.com/dherault/serverless-offline/commit/1941adec7820c5c0c9b5c7f5c3fd4492e7d11b94)
- Edit README [`c0cc3e4`](https://github.com/dherault/serverless-offline/commit/c0cc3e48b1bc3f1a690fdbfed424cd15d76c3f11)
- Add watchDires [`1aaa866`](https://github.com/dherault/serverless-offline/commit/1aaa866f78bf9207971a7e6821ae9d3850c11ced)
- fix: address second round of Copilot review feedback on Ruby runner [`6f2f2c4`](https://github.com/dherault/serverless-offline/commit/6f2f2c4d7ea0c79b84dae42efee524cf9d5b1a1a)
- fix(ruby): guard against null stdio streams on spawn failure [`d36cab0`](https://github.com/dherault/serverless-offline/commit/d36cab09e1515fa35737952dae7800762bc2db32)
- Document rubyWatchDirs option in README [`dc45cab`](https://github.com/dherault/serverless-offline/commit/dc45cab4170e73b5ac736f0629ed69620dd86fdd)
- Apply suggestions from code review [`52d0a3b`](https://github.com/dherault/serverless-offline/commit/52d0a3b052f5845619adedf9bb1ec00044dbb62b)
- Potential fix for pull request finding [`c2e2303`](https://github.com/dherault/serverless-offline/commit/c2e2303d3faed2f700564004165f1fa77007299c)
- fix: sort defaultOptions keys alphabetically [`50a3dfc`](https://github.com/dherault/serverless-offline/commit/50a3dfce121a41c2eaf4aa5a189a31c0f3b61bc8)
- Remove Airbnb style guide mention in README [`3506988`](https://github.com/dherault/serverless-offline/commit/3506988178c9d823bdaadbe80ca0ce9301abc4ca)

#### [v14.6.0](https://github.com/dherault/serverless-offline/compare/v14.5.0...v14.6.0)

> 11 May 2026

- Update dependencies [`#1889`](https://github.com/dherault/serverless-offline/pull/1889)
- Resolves #1771 [`#1772`](https://github.com/dherault/serverless-offline/pull/1772)
- chore(aws-sdk): bump client-lambda version (fixing critical vulnerability) [`#1884`](https://github.com/dherault/serverless-offline/pull/1884)
- Add ruby 3.4 support [`#1878`](https://github.com/dherault/serverless-offline/pull/1878)
- chore: replace fs-extra with native Node.js fs APIs [`#1876`](https://github.com/dherault/serverless-offline/pull/1876)
- ci: bump actions/setup-go@v5 [`#1821`](https://github.com/dherault/serverless-offline/pull/1821)
- Fix tests [`#1886`](https://github.com/dherault/serverless-offline/pull/1886)
- Merge pull request #1772 from apokryfos/issue-1771 [`#1771`](https://github.com/dherault/serverless-offline/issues/1771)
- Resolves #1771 [`#1771`](https://github.com/dherault/serverless-offline/issues/1771)
- chore(aws-sdk): bump client-lambda version [`4ac5858`](https://github.com/dherault/serverless-offline/commit/4ac5858ba26a04872c3b0f01a1f8aa89f5eda7e4)
- Edit README [`a6fac8a`](https://github.com/dherault/serverless-offline/commit/a6fac8a01f812ed000cf72b452f9c9f94aa409cf)
- Edit contributors list [`491ad62`](https://github.com/dherault/serverless-offline/commit/491ad6261a93850ea58c97480646cab47d64c70e)
- Remove Symmetrics promotional section from README [`a4bc472`](https://github.com/dherault/serverless-offline/commit/a4bc4726d824ed932a5bd2d8d81822f26aa39df7)
- Edit changelog [`b93ebb5`](https://github.com/dherault/serverless-offline/commit/b93ebb5a8e5720261a971149ac0672d0eecdda34)
- Run prettier [`c1a428f`](https://github.com/dherault/serverless-offline/commit/c1a428f6a3f480d5f33222113ff3208cd9b1fe70)
- Update src/config/supportedRuntimes.js [`11f4197`](https://github.com/dherault/serverless-offline/commit/11f41975b2213d5c4a327424f2479f9113380cd6)
- Edit CI [`8fb7561`](https://github.com/dherault/serverless-offline/commit/8fb75619a8de977c2d8cd56ab3205e3fab6eb05a)
- ci: limit matrix to ubuntu-latest, drop macos/windows [`946bc1a`](https://github.com/dherault/serverless-offline/commit/946bc1ab46b37343cedea5921dc9c13af6d44e67)
- Edit LICENSE [`755a375`](https://github.com/dherault/serverless-offline/commit/755a375d81b6db408039740e98513a222dc4da23)
- Run prettier [`6a5902f`](https://github.com/dherault/serverless-offline/commit/6a5902f0918a5541777f862ed4a9477899fc5d93)

#### [v14.5.0](https://github.com/dherault/serverless-offline/compare/v14.4.0...v14.5.0)

> 24 February 2026

- Add python 3.13 support [`#1865`](https://github.com/dherault/serverless-offline/pull/1865)
- Add ruby 3.3 support [`#1862`](https://github.com/dherault/serverless-offline/pull/1862)
- feat: Support CloudFormation Join & Sub function in environment variable [`#1842`](https://github.com/dherault/serverless-offline/pull/1842)
- Load TypeScript in ESM mode if package.json type is module [`#1849`](https://github.com/dherault/serverless-offline/pull/1849)
- ci: delete release workflow [`97d1c90`](https://github.com/dherault/serverless-offline/commit/97d1c9069099f15ab44b97a95b1de2a6fb47c2b1)
- Publish v14.5.0 [`4d90f40`](https://github.com/dherault/serverless-offline/commit/4d90f4099ad66d3a94bae90335781811536dfaf8)
- Merge pull request #1867 from dherault/nodejs24 [`f51fe41`](https://github.com/dherault/serverless-offline/commit/f51fe41b2829b754169e6d94194b2c97c659428f)
- feat: Drop Node.js 14/16/18 support and fix test authentication [`672c85a`](https://github.com/dherault/serverless-offline/commit/672c85a186dd28b38808e8ec54d6bc4c8d865af1)
- feat: Add support for Node.js 24.x in Docker environment [`d170c44`](https://github.com/dherault/serverless-offline/commit/d170c44b89f99412a7a0a98ada2d3cdfea8aac65)
- Add ts-extension-load-esm test [`7a8d77a`](https://github.com/dherault/serverless-offline/commit/7a8d77a9924f9744da21fe84fd138dafef8af01c)
- Update README.md [`483a870`](https://github.com/dherault/serverless-offline/commit/483a870563644458f474fa17a19a4c0c4cadcde2)
- Edit README [`426cdb8`](https://github.com/dherault/serverless-offline/commit/426cdb853d2caaba6cec7f4cb930b114538b6cad)
- Delete .claude/settings.local.json [`add5ee9`](https://github.com/dherault/serverless-offline/commit/add5ee9ca402cca804d670e608a198780d279ee1)
- Load in ESM mode if package.json type is module [`7dbcf91`](https://github.com/dherault/serverless-offline/commit/7dbcf91a9b392e0e92b2cafa97407657016b9627)
- Update README.md [`c35b39e`](https://github.com/dherault/serverless-offline/commit/c35b39eb52e2fcdaa642b3a51a35c65b8ead5308)
- Update README.md [`e7bbc51`](https://github.com/dherault/serverless-offline/commit/e7bbc51aab4320f2ea8bd6ee90d0b9ce0c03a107)
- Update README.md [`c0c27b2`](https://github.com/dherault/serverless-offline/commit/c0c27b2d40df5792a4b5296e7e0eda35bb51efb9)
- Add missing test usage for commonjs [`071b4f0`](https://github.com/dherault/serverless-offline/commit/071b4f0717a44737e3bf0527c9466ef23fe425c6)
- add gitignore [`03a07a8`](https://github.com/dherault/serverless-offline/commit/03a07a898af9778e0acf999228580e91131ec09b)
- Fix pretter [`07955f1`](https://github.com/dherault/serverless-offline/commit/07955f1a1092d2c274923584dd7f6a454587e36c)
- Edit README [`badaa05`](https://github.com/dherault/serverless-offline/commit/badaa0508204ca2a824b17498e486e16aa7b2439)
- Update LICENSE [`b92478f`](https://github.com/dherault/serverless-offline/commit/b92478f27a063a6da41a3e29f17305a5d58645c5)

#### [v14.4.0](https://github.com/dherault/serverless-offline/compare/v14.3.4...v14.4.0)

> 9 December 2024

- feat: add support for nodejs22.x runtime [`#1837`](https://github.com/dherault/serverless-offline/pull/1837)
- ci: mock serverless api response for tests [`#1840`](https://github.com/dherault/serverless-offline/pull/1840)
- fix: update jsonpath-plus to close vulnerability [`#1835`](https://github.com/dherault/serverless-offline/pull/1835)
- Publish v14.4.0 [`d92b697`](https://github.com/dherault/serverless-offline/commit/d92b697bcbd1f94d1a4cd2da60a594d5c4537f7a)
- Add Airfriend brag on README [`e0e605b`](https://github.com/dherault/serverless-offline/commit/e0e605bdd3da0f3ec4bc903096d320e00b02bc62)

#### [v14.3.4](https://github.com/dherault/serverless-offline/compare/v14.3.3...v14.3.4)

> 6 November 2024

- ci: release workflow [`#1834`](https://github.com/dherault/serverless-offline/pull/1834)
- Remove sponsor logging [`1d2a9b9`](https://github.com/dherault/serverless-offline/commit/1d2a9b90eb61e082dfc5fc409c6b957badffed3d)
- Publish v14.3.4 [`c101d4b`](https://github.com/dherault/serverless-offline/commit/c101d4b3941840a700f8e27b4cc6841bb6b5e3e6)
- ci: fix major_version in release.yml workflow [`710bfaa`](https://github.com/dherault/serverless-offline/commit/710bfaa31def48f94c9875c4d5d615ccdd985be0)
- Re-add missing console.log [`7f2fcb3`](https://github.com/dherault/serverless-offline/commit/7f2fcb303c2cbfdb0ea09fe0ea477a512607cf6c)

#### [v14.3.3](https://github.com/dherault/serverless-offline/compare/v14.3.2...v14.3.3)

> 17 October 2024

- fix(deps): vulnerability in jsonpath-plus [`#1827`](https://github.com/dherault/serverless-offline/pull/1827)
- Publish v14.3.3 [`6f786ce`](https://github.com/dherault/serverless-offline/commit/6f786ce667941a983425437c2db1e9379c5765ff)
- chore: fix prettier [`9bd2fe6`](https://github.com/dherault/serverless-offline/commit/9bd2fe67a1989d87e632ed8cb4f5e6fb3dd5e325)

#### [v14.3.2](https://github.com/dherault/serverless-offline/compare/v14.3.1...v14.3.2)

> 23 September 2024

- chore: update FUNDING [`#1822`](https://github.com/dherault/serverless-offline/pull/1822)
- Publish v14.3.2 [`dde6147`](https://github.com/dherault/serverless-offline/commit/dde6147d0c06b34a92120df843782374ec3a8361)

#### [v14.3.1](https://github.com/dherault/serverless-offline/compare/v14.3.0...v14.3.1)

> 30 August 2024

- Revert "fix: return 500 Internal Server Error on python error" [`#1818`](https://github.com/dherault/serverless-offline/pull/1818)
- Publish v14.3.1 [`b854b73`](https://github.com/dherault/serverless-offline/commit/b854b733d1ddd4924e7c307edf3fda547d9466bb)
- Improve README [`76bb20b`](https://github.com/dherault/serverless-offline/commit/76bb20b716f1f11864c0cdf670572dc2a36ccf4a)
- Merge branches 'master' and 'master' of github.com:dherault/serverless-offline [`209272d`](https://github.com/dherault/serverless-offline/commit/209272de2030acb4e6996df1543adc301c581524)
- Edit README [`937a7d7`](https://github.com/dherault/serverless-offline/commit/937a7d7967f60babf31f1a2333cc74ccb536eec7)
- Edit README [`b5c6bc1`](https://github.com/dherault/serverless-offline/commit/b5c6bc10f7cbebb0383ffadecf1681579c4fd119)
- Publish v14.3.0 [`ff8ec5d`](https://github.com/dherault/serverless-offline/commit/ff8ec5d2c3c9d65885c0c0fb1da2f974d54054b7)
- Lint [`993e06e`](https://github.com/dherault/serverless-offline/commit/993e06eb959fa675a7016fa3ea9ba7ae92a901b1)
- Edit README [`323ec31`](https://github.com/dherault/serverless-offline/commit/323ec31c1510e5ab86e59a8df81ec5ec37b9efd9)
- Fix preLoadModules [`7662038`](https://github.com/dherault/serverless-offline/commit/766203847061af81d2545726299ea251a497b765)
- Edit README [`7548cc4`](https://github.com/dherault/serverless-offline/commit/7548cc4b9f99e1c3dd13f2311c68aea366e0e01d)
- Edit README [`f5a19d3`](https://github.com/dherault/serverless-offline/commit/f5a19d338e133d1447c0f52ac8f9f819b970da49)
- Lint [`07827fc`](https://github.com/dherault/serverless-offline/commit/07827fcadfc339b1b70e97525e5ae9aa16a1adcc)
- Remove image [`a1281bb`](https://github.com/dherault/serverless-offline/commit/a1281bb355f752770f8fd72d2f88f6540fe09def)

#### [v14.3.0](https://github.com/dherault/serverless-offline/compare/v14.2.0...v14.3.0)

> 30 August 2024

- handle result structure without body [`#1814`](https://github.com/dherault/serverless-offline/pull/1814)
- Add preLoadModules option to import modules on main thread [`#1777`](https://github.com/dherault/serverless-offline/pull/1777)
- fix: return 500 Internal Server Error on python error [`#1796`](https://github.com/dherault/serverless-offline/pull/1796)
- Add test for Python to return 500 on unhandled error [`969b7a5`](https://github.com/dherault/serverless-offline/commit/969b7a5cecd29e2949cb4179d9f50ede820b19a5)
- Edit CHANGELOG [`dedd00f`](https://github.com/dherault/serverless-offline/commit/dedd00f2d529f6123b402a4529840b43b7320271)
- update to use hasattr [`482dc75`](https://github.com/dherault/serverless-offline/commit/482dc753a3e71d112c60d7d3c6475738ded20635)
- Return error responses with the right status code [`60011bf`](https://github.com/dherault/serverless-offline/commit/60011bf2cd31884f82e5dda1e59cc77c52a0d067)
- Add README document [`707fa6b`](https://github.com/dherault/serverless-offline/commit/707fa6bc2dcae7fa1be5d31a4ab2b89f93ef91b8)
- Edit README [`d6a3c1e`](https://github.com/dherault/serverless-offline/commit/d6a3c1e248069e208575f1bcce647dc912fc4520)
- chore: fix prettier error [`2bb4579`](https://github.com/dherault/serverless-offline/commit/2bb45795c775d4c933732ac3dc3a4e081b9261c5)
- chore: prettier fix [`423cab9`](https://github.com/dherault/serverless-offline/commit/423cab92b3f8e66b7cb983a78b6a7e67541690f2)
- Raise error when Python handler fails [`789b686`](https://github.com/dherault/serverless-offline/commit/789b68696f6d6944d808b028588c2761895d10c9)
- Change default error status code to 500 to match AWS Lambda [`38f74e7`](https://github.com/dherault/serverless-offline/commit/38f74e7918941e93133d245849c5108e3e19cef3)

#### [v14.2.0](https://github.com/dherault/serverless-offline/compare/v14.1.1...v14.2.0)

> 22 August 2024

- Arccode sponsoring [`#1811`](https://github.com/dherault/serverless-offline/pull/1811)
- Update deps and edit README [`128c653`](https://github.com/dherault/serverless-offline/commit/128c653bb0adb061a6b96285ab10885972b5564f)
- Add sponsor message [`4fb1bdd`](https://github.com/dherault/serverless-offline/commit/4fb1bdd647aa4a074976f22d39eecb34c1cc53f7)
- Complete sponsoring function [`e860250`](https://github.com/dherault/serverless-offline/commit/e860250bb85bd2682cead1293a81c1eae3cadb11)
- Fix logRoutes [`dde8f4a`](https://github.com/dherault/serverless-offline/commit/dde8f4a186a097bfaf21d06f84e8fe0249fce9d6)
- Edit sponsor message [`f7f3efb`](https://github.com/dherault/serverless-offline/commit/f7f3efb634a70000bd44ebd8e234e4a7c4316c87)
- Publish v14.2.0 [`351cc5b`](https://github.com/dherault/serverless-offline/commit/351cc5b830d8e8df60aabd7fe13c1540b9bd2e3d)

#### [v14.1.1](https://github.com/dherault/serverless-offline/compare/v14.1.0...v14.1.1)

> 17 August 2024

- Fix [`2012c8b`](https://github.com/dherault/serverless-offline/commit/2012c8ba44c3c8267c9e61e2e10dddabf67b1190)
- Publish v14.1.1 [`50a1d22`](https://github.com/dherault/serverless-offline/commit/50a1d228bff2474214baeecaf38def50006095e7)

#### [v14.1.0](https://github.com/dherault/serverless-offline/compare/v14.0.0...v14.1.0)

> 17 August 2024

- Python handle base64 encoded binary response from aws lambda function [`#1678`](https://github.com/dherault/serverless-offline/pull/1678)
- Add pathParameters and queryStringParameters to payload version 2.0 [`#1667`](https://github.com/dherault/serverless-offline/pull/1667)
- ci: use macos-latest [`#1787`](https://github.com/dherault/serverless-offline/pull/1787)
- Update deps [`203facb`](https://github.com/dherault/serverless-offline/commit/203facb1684daceefec9077a4f5275d4531527a8)
- Edit contributors list on README [`43a8c76`](https://github.com/dherault/serverless-offline/commit/43a8c76bdb68cbff17f858f41f818809fcc9f603)
- Publish version 14.1.0 [`ffdf1e9`](https://github.com/dherault/serverless-offline/commit/ffdf1e98bdfd3a308e2010b3441da1eeab08e3d6)
- Lint [`a2c2930`](https://github.com/dherault/serverless-offline/commit/a2c2930153fb6f6b2b288e6852d1a67b005d4dfb)
- Run npm audit fix [`6cdab1f`](https://github.com/dherault/serverless-offline/commit/6cdab1faaf99564d9205a46deaa69ab5d4085891)
- chore: fix prettier [`b03e70a`](https://github.com/dherault/serverless-offline/commit/b03e70a52f4a865db53b0ea17b0a46e87b1898f9)
- Edit LICENSE [`98076c0`](https://github.com/dherault/serverless-offline/commit/98076c0a8eb7419e252a94b7f08e56c21267c62b)
- feat: add python 3.12 to supportedRuntimesArchitecture [`ab8565a`](https://github.com/dherault/serverless-offline/commit/ab8565a8fd5144dcd0b766da5ef0fac90fce8cb1)

### [v14.0.0](https://github.com/dherault/serverless-offline/compare/v13.10.0...v14.0.0)

> 1 August 2024

- feat: add support for serverless v4 and typescript [`#1806`](https://github.com/dherault/serverless-offline/pull/1806)

#### [v13.10.0](https://github.com/dherault/serverless-offline/compare/v13.9.0...v13.10.0)

> 11 May 2026

- Fix v13 tests [`#1888`](https://github.com/dherault/serverless-offline/pull/1888)
- feat: add support for nodejs24.x runtime to v13. Closes #1879 [`#1880`](https://github.com/dherault/serverless-offline/pull/1880)
- feat: add support for python 3.12 and 3.13 to v13 [`#1850`](https://github.com/dherault/serverless-offline/pull/1850)
- Merge pull request #1880 from ElChapitan/feat/v13-nodejs24x [`#1879`](https://github.com/dherault/serverless-offline/issues/1879)
- feat: add support for nodejs24.x runtime to v13. Closes #1879 [`#1879`](https://github.com/dherault/serverless-offline/issues/1879)
- ci: remove sparticuz chrome failing tests [`648c4e3`](https://github.com/dherault/serverless-offline/commit/648c4e370e13d8d2149d0b7d2c06a066ee18ea8f)
- Remove auto release [`d1ccc6a`](https://github.com/dherault/serverless-offline/commit/d1ccc6a10d1e432abe8663a81b0563b3a63d3eeb)
- Edit tests [`d38fccc`](https://github.com/dherault/serverless-offline/commit/d38fccce721e4bf1460186311eff3c702749b6eb)

#### [v13.9.0](https://github.com/dherault/serverless-offline/compare/v13.8.3...v13.9.0)

> 9 December 2024

- fix: update v13 to close jsonpath vulnerability [`#1841`](https://github.com/dherault/serverless-offline/pull/1841)
- feat: add support for nodejs22.x runtime to v13 [`#1838`](https://github.com/dherault/serverless-offline/pull/1838)
- Publish v13.9.0 [`fee0470`](https://github.com/dherault/serverless-offline/commit/fee0470032436165dcf3a80699eeafea8c9fbfe0)

#### [v13.8.3](https://github.com/dherault/serverless-offline/compare/v13.8.2...v13.8.3)

> 6 November 2024

- ci: release workflow [`#1834`](https://github.com/dherault/serverless-offline/pull/1834)
- Remove sponsor logging [`c180fb5`](https://github.com/dherault/serverless-offline/commit/c180fb5c1587bc1288228ff6a16dbdda2f826c17)
- Publish v13.8.3 [`63f4199`](https://github.com/dherault/serverless-offline/commit/63f419948b67ab3789ce836f2f8764b0781c8b1a)
- ci: fix major_version in release.yml workflow [`dfe80a4`](https://github.com/dherault/serverless-offline/commit/dfe80a4777f0e7499a6da123b52c8ae766edb8a5)

#### [v13.8.2](https://github.com/dherault/serverless-offline/compare/v13.7.1...v13.8.2)

> 6 November 2024

- fix(deps): vulnerability in jsonpath-plus [`#1828`](https://github.com/dherault/serverless-offline/pull/1828)
- Publish v13.8.2 [`93b24c2`](https://github.com/dherault/serverless-offline/commit/93b24c2bf51397f8044eeacfd90087679f36d12f)
- Fix dependencies [`01eb48b`](https://github.com/dherault/serverless-offline/commit/01eb48b98dd4d5ba2ce073a8019e7cca9c669051)
- Publish v13.8.0 [`d70323b`](https://github.com/dherault/serverless-offline/commit/d70323b005cb155fe2e790cbab8fe819f7780e92)
- Publish v13.8.1 [`8a4167f`](https://github.com/dherault/serverless-offline/commit/8a4167f567f32a44e7869a45a4681dc258b778c5)
- Publish v13.7.1 [`a5182ca`](https://github.com/dherault/serverless-offline/commit/a5182ca0978d283cf6eaafe92daf4b902b34ed94)

#### [v13.7.1](https://github.com/dherault/serverless-offline/compare/v13.6.0...v13.7.1)

> 30 August 2024

- v13.8.0 lint and test [`#1817`](https://github.com/dherault/serverless-offline/pull/1817)
- Add preLoadModules option to import modules on main thread [`#1777`](https://github.com/dherault/serverless-offline/pull/1777)
- fix: return 500 Internal Server Error on python error [`#1796`](https://github.com/dherault/serverless-offline/pull/1796)
- Updates to v13 [`#1813`](https://github.com/dherault/serverless-offline/pull/1813)
- chore: bump test dependencies [`#1804`](https://github.com/dherault/serverless-offline/pull/1804)
- chore: bump deps (major) [`#1803`](https://github.com/dherault/serverless-offline/pull/1803)
- chore: bump deps (minor, patch) [`#1802`](https://github.com/dherault/serverless-offline/pull/1802)
- ci: remove node.js v21, add v22 [`#1801`](https://github.com/dherault/serverless-offline/pull/1801)
- fix: improve wildcard handling in authorizer policy resource parser [`#1797`](https://github.com/dherault/serverless-offline/pull/1797)
- fix: ensure resource policy matches the whole arn [`#1798`](https://github.com/dherault/serverless-offline/pull/1798)
- feat: support dev Okta JWT tokens [`#1790`](https://github.com/dherault/serverless-offline/pull/1790)
- fix: Support httpApi authorizer with different config and function names [`#1763`](https://github.com/dherault/serverless-offline/pull/1763)
- fix: Support ALB Event response headers [`#1756`](https://github.com/dherault/serverless-offline/pull/1756)
- Run npm audit and update README [`c6d308e`](https://github.com/dherault/serverless-offline/commit/c6d308ed74d18a66dd54d5d1078f08919f1ff5d5)
- Revert audit fix [`8f6093e`](https://github.com/dherault/serverless-offline/commit/8f6093e288d06dc721da0bf46b7e2dbbaf943f26)
- Edit contributors list on README [`9c8f89f`](https://github.com/dherault/serverless-offline/commit/9c8f89f268cb0aeb0ef63dba8a77ce407dab80f2)
- Lint [`f3be1f2`](https://github.com/dherault/serverless-offline/commit/f3be1f260b342ce6d2e3a4ba7fdedeffda3b8eb6)
- Remove VerboseLog [`21946c6`](https://github.com/dherault/serverless-offline/commit/21946c63e7b2c94e65e0fa02fcb141ec63864446)
- Add sponsor message [`61ed0b8`](https://github.com/dherault/serverless-offline/commit/61ed0b82009e0f779d333bb7f65cdccca656f526)
- Complete sponsoring function [`2ebb53c`](https://github.com/dherault/serverless-offline/commit/2ebb53c5df012b728e6c893c9743cdacc1fa92d8)
- Edit README [`5e3e1b5`](https://github.com/dherault/serverless-offline/commit/5e3e1b5e10f434d2aac5fc0f4c0983bcea440646)
- Edit README [`c37be9d`](https://github.com/dherault/serverless-offline/commit/c37be9db2d9254bf48af38ee659b424efb5df415)
- Fix tests [`b1980bb`](https://github.com/dherault/serverless-offline/commit/b1980bbad508c1e678817c3c5d05dee6252e2843)
- Fix logRoutes [`e966eb5`](https://github.com/dherault/serverless-offline/commit/e966eb56a1bf5a2f1721afed8d08ce4dd553c37b)
- Revert [`63c6149`](https://github.com/dherault/serverless-offline/commit/63c614966e280284de9eb6e013e6a7222130f57f)
- Edit sponsor message [`7af2acd`](https://github.com/dherault/serverless-offline/commit/7af2acd093ffc4f98a43ec53637d132d1661be7f)
- Edit CHANGELOG [`866a451`](https://github.com/dherault/serverless-offline/commit/866a451343e4eec9e92623ab7896969327571366)
- Improve CHANGELOG [`78807e1`](https://github.com/dherault/serverless-offline/commit/78807e1c38c3c9321613f4c8f023d33a07b0ea89)
- Edit CI [`e29a259`](https://github.com/dherault/serverless-offline/commit/e29a2593129cadbf360d896e8c7de59207699801)
- Lint [`e571570`](https://github.com/dherault/serverless-offline/commit/e5715701eac53b8d62961bd59427c1ba855ff742)
- update to use hasattr [`cfd65da`](https://github.com/dherault/serverless-offline/commit/cfd65da695b8c038dd3c72a5b2b09c60bb3441bf)
- handle result structure without body [`287313f`](https://github.com/dherault/serverless-offline/commit/287313f93041253a2482edb7b3d7f16fd29677d6)
- Python handle base64 encoded binary response from aws lambda function [`944e881`](https://github.com/dherault/serverless-offline/commit/944e881ee1c67f155dd61957adb376e090fec65b)
- Edit README [`2caa693`](https://github.com/dherault/serverless-offline/commit/2caa6930095e66d7319fcddf04f66e7b038fbf7d)
- Improve README [`a582ff7`](https://github.com/dherault/serverless-offline/commit/a582ff75ddafe32d341914e1319077feebe0db80)
- Edit CI [`52509b2`](https://github.com/dherault/serverless-offline/commit/52509b2dbfb563646c2cf2a546fca883877979f1)
- Publish v13.7.0 [`49f170a`](https://github.com/dherault/serverless-offline/commit/49f170af9edd69085934f190cdd76d1ce12487f0)
- Improve README [`3e3bd16`](https://github.com/dherault/serverless-offline/commit/3e3bd16213967cc8418d60bd24fda2e4aee582de)
- Fix preLoadModules [`66afa70`](https://github.com/dherault/serverless-offline/commit/66afa70330ea32decdbb579644f5aa33f88bffef)
- Edit README [`f6249bc`](https://github.com/dherault/serverless-offline/commit/f6249bcd166e673765f71570c362806308f11de9)
- Edit README [`61dd345`](https://github.com/dherault/serverless-offline/commit/61dd345fba01ff8f331c129f3734e674e054d9e4)
- Edit LICENSE [`2d79463`](https://github.com/dherault/serverless-offline/commit/2d794639e51e5c1ed9430a376c139f553f63b66c)
- Add pathParameters and queryStringParameters to payload version 2.0 [`57bdbe1`](https://github.com/dherault/serverless-offline/commit/57bdbe14fd7ae225b15ac6d49d01dc8753bdd27b)
- Lint [`d350710`](https://github.com/dherault/serverless-offline/commit/d350710012b1be7928b3802cc228d4c5e47f872b)
- Remove image [`d6a467a`](https://github.com/dherault/serverless-offline/commit/d6a467a9dd4756c2b70e65c4f8df56b75a9e99eb)

#### [v13.6.0](https://github.com/dherault/serverless-offline/compare/v13.5.1...v13.6.0)

> 21 May 2024

- fix: treat application/octet-stream as a binary encoding [`#1587`](https://github.com/dherault/serverless-offline/pull/1587)
- feat: add support for provided.al2023 [`#1788`](https://github.com/dherault/serverless-offline/pull/1788)

#### [v13.5.1](https://github.com/dherault/serverless-offline/compare/v13.5.0...v13.5.1)

> 19 May 2024

- refactor: use provided log utils [`#1784`](https://github.com/dherault/serverless-offline/pull/1784)
- fix: skip adding authorizer to event if no authorizer is configured [`#1786`](https://github.com/dherault/serverless-offline/pull/1786)
- Update README.md [`ee20b48`](https://github.com/dherault/serverless-offline/commit/ee20b48cc31f15b2684b640f15b600c288d74cf3)

#### [v13.5.0](https://github.com/dherault/serverless-offline/compare/v13.4.0...v13.5.0)

> 28 April 2024

- feat: convert multipart/form-data to base64 encoded payloads [`#1776`](https://github.com/dherault/serverless-offline/pull/1776)
- chore: bump deps [`836449e`](https://github.com/dherault/serverless-offline/commit/836449ee040b1a9e9d49a3b4a00cc4827c564767)
- chore: formatting for README [`d8cb9ba`](https://github.com/dherault/serverless-offline/commit/d8cb9ba221644f9081a32d925a15feeae87fdbf5)
- chore: update contributors in README [`b4c7bd8`](https://github.com/dherault/serverless-offline/commit/b4c7bd8645814db197aa6624a128282f016ecb8c)

#### [v13.4.0](https://github.com/dherault/serverless-offline/compare/v13.3.4...v13.4.0)

> 24 April 2024

- test: add more docker tests [`#1779`](https://github.com/dherault/serverless-offline/pull/1779)
- feat: update docker images and add support for different architectures [`#1755`](https://github.com/dherault/serverless-offline/pull/1755)

#### [v13.3.4](https://github.com/dherault/serverless-offline/compare/v13.3.3...v13.3.4)

> 19 April 2024

- fix: responses without default key [`#1751`](https://github.com/dherault/serverless-offline/pull/1751)
- chore: bump deps [`fd8617b`](https://github.com/dherault/serverless-offline/commit/fd8617ba2e1e96471825a1af5eb6cb882eef2e0d)
- chore: remove .npmrc [`2bdc17a`](https://github.com/dherault/serverless-offline/commit/2bdc17a9ca78476cbd216a9d867f18d7f5f7e83b)
- chore: bump deps [`c85a192`](https://github.com/dherault/serverless-offline/commit/c85a19272c59ad9e7cf1aea74e3442c7607b533a)
- chore: fix prettier [`eea2c7e`](https://github.com/dherault/serverless-offline/commit/eea2c7e16eb671a1615154ec4350678771627564)
- test: skip docker tests [`0e883f7`](https://github.com/dherault/serverless-offline/commit/0e883f75627d6d88297e0faf0e98b47e2e4a2499)

#### [v13.3.3](https://github.com/dherault/serverless-offline/compare/v13.3.2...v13.3.3)

> 19 January 2024

- fix: Custom Authorizer Lambda Request context missing accountId and apiId fields [`#1640`](https://github.com/dherault/serverless-offline/pull/1640)
- chore: bump deps [`4621ec4`](https://github.com/dherault/serverless-offline/commit/4621ec4d872aef662aee7f8eac7bd80abe0216ec)
- chore: unpin deps [`ec180fd`](https://github.com/dherault/serverless-offline/commit/ec180fd2146479fa123224ef8261c65d7c08bd2b)
- chore: use double quotes (default) [`1200dc8`](https://github.com/dherault/serverless-offline/commit/1200dc8639246672df820c1daa76c37a6d0d0991)
- chore: bump deps [`4f43477`](https://github.com/dherault/serverless-offline/commit/4f434776491cc64a5ae9feeae6b3aec72c9ea873)
- refactor: remove create unique id util function [`4fbb9bf`](https://github.com/dherault/serverless-offline/commit/4fbb9bf8c1b14b8a3d4bf52442ab0ae4c7a4b72c)
- refactor: use default crypto import [`3d1467d`](https://github.com/dherault/serverless-offline/commit/3d1467dfa119447ede5e444162d60435ccddfe29)
- chore: add code quality script [`fef5777`](https://github.com/dherault/serverless-offline/commit/fef577790923140d79350bc431b62c53d1047357)

#### [v13.3.2](https://github.com/dherault/serverless-offline/compare/v13.3.1...v13.3.2)

> 12 December 2023

- fix: Allow string values in provider.apiGateway.apiKeys [`#1662`](https://github.com/dherault/serverless-offline/pull/1662)
- chore: bump deps [`cb6d7ad`](https://github.com/dherault/serverless-offline/commit/cb6d7ad3e7050e73c703a59083da5c8c03421c4e)
- Revert "refactor: use crypto web api" [`ac5840e`](https://github.com/dherault/serverless-offline/commit/ac5840e994ffa2918cc3be6cccd1b9618691e90e)
- refactor: use crypto web api [`6ccbb80`](https://github.com/dherault/serverless-offline/commit/6ccbb809f395befa10812eda2cce00d09a83e35b)

#### [v13.3.1](https://github.com/dherault/serverless-offline/compare/v13.3.0...v13.3.1)

> 8 December 2023

- docs: change to serverless-dynamodb [`#1745`](https://github.com/dherault/serverless-offline/pull/1745)
- chore: bump deps [`61d9537`](https://github.com/dherault/serverless-offline/commit/61d9537a8ee938aaa7f7f7d63f961550fb3c636e)
- chore: replace standard-version with commit-and-tag-version [`74130b9`](https://github.com/dherault/serverless-offline/commit/74130b93164be63a743f1d3abbff69068cd74863)
- chore: bump deps [`eae9566`](https://github.com/dherault/serverless-offline/commit/eae95669be44821328c0fc20cbfd0f6bf18f3f5a)
- chore: remove lint-staged [`b531f43`](https://github.com/dherault/serverless-offline/commit/b531f4302e959c4d4b78216ca2f0b207d6092b01)
- refactor: fix no-lonely-if [`2b15f42`](https://github.com/dherault/serverless-offline/commit/2b15f4280ec591b3535e538b8de4cc12ebddb703)
- chore: remove git-list-updated [`b095f6e`](https://github.com/dherault/serverless-offline/commit/b095f6e6fefcc6503a989fa8c96f35b4316fd851)
- chore: remove husky [`497e0be`](https://github.com/dherault/serverless-offline/commit/497e0becf1309fc958ed6122c99ddefc65c35523)
- chore: rename lint fix script [`7f2b893`](https://github.com/dherault/serverless-offline/commit/7f2b893d25529c36cf765e35ddf1ab6e32a6644f)
- chore: remove unused scripts [`d9b4d39`](https://github.com/dherault/serverless-offline/commit/d9b4d39b7dd80de480e62893851a38fd512c3516)

#### [v13.3.0](https://github.com/dherault/serverless-offline/compare/v13.2.1...v13.3.0)

> 16 November 2023

- feat: Add support for nodejs20.x runtime [`#1743`](https://github.com/dherault/serverless-offline/pull/1743)
- chore: bump deps [`c3ef481`](https://github.com/dherault/serverless-offline/commit/c3ef481142e0943373fec017101ac3aa6e42c63a)
- chore: run prettier [`acb1257`](https://github.com/dherault/serverless-offline/commit/acb1257ee8f78821fb625f073ae142b50cd13b52)

#### [v13.2.1](https://github.com/dherault/serverless-offline/compare/v13.2.0...v13.2.1)

> 6 November 2023

- chore: bump deps [`18532e2`](https://github.com/dherault/serverless-offline/commit/18532e2e26d701508792f5e6d4de77fe3ef5e88c)
- chore: bump deps [`c7ec058`](https://github.com/dherault/serverless-offline/commit/c7ec058eac7c715b3c4401223ff2c1a6a320e42b)
- chore: bump deps [`5457cca`](https://github.com/dherault/serverless-offline/commit/5457cca7fb1efac41997ad46a104129d55a9fb8d)
- chore: bump deps [`165feae`](https://github.com/dherault/serverless-offline/commit/165feae6b133b647363667a58cb9cc2352fbce11)
- refactor: use nullish coalescing [`04d8cfb`](https://github.com/dherault/serverless-offline/commit/04d8cfb658f1eccc3be5a141c67aff78f942cedf)
- ci: add support for node.js v21 [`e306bb5`](https://github.com/dherault/serverless-offline/commit/e306bb5453a6325120f046c15754a686e284e3cf)
- chore: bump actions/setup-node v4 [`6439517`](https://github.com/dherault/serverless-offline/commit/64395172ca3f700dcd53cd09b7bd0e8fe069f820)
- chore: skip test [`ee6ed95`](https://github.com/dherault/serverless-offline/commit/ee6ed9521e8e8b3eec8201bd5664b7e6900eb80c)
- chore: use prettier end-of-line default [`6af7170`](https://github.com/dherault/serverless-offline/commit/6af71701edf8dade1c06c7fc28b7e6dd1707d410)

#### [v13.2.0](https://github.com/dherault/serverless-offline/compare/v13.1.2...v13.2.0)

> 4 October 2023

- feat: Add support for golang workspace [`#1738`](https://github.com/dherault/serverless-offline/pull/1738)
- chore: bump deps [`85405c1`](https://github.com/dherault/serverless-offline/commit/85405c149f9fd7ca649ef6b222f11e7db536180a)
- refactor: remove setTimeout promisify wrapper, use built-in [`10d5f3b`](https://github.com/dherault/serverless-offline/commit/10d5f3bcfbd7d0c87b53a8969db958ce95d31c20)

#### [v13.1.2](https://github.com/dherault/serverless-offline/compare/v13.1.1...v13.1.2)

> 29 September 2023

- fix: LambdaProxyIntegrationEventV2 authorizer context [`#1630`](https://github.com/dherault/serverless-offline/pull/1630)
- chore: bump deps [`c7ba440`](https://github.com/dherault/serverless-offline/commit/c7ba440d111382697fb71c2bce49fee1c23e69b0)

#### [v13.1.1](https://github.com/dherault/serverless-offline/compare/v13.1.0...v13.1.1)

> 26 September 2023

- fix: Support alb with no method conditions [`#1653`](https://github.com/dherault/serverless-offline/pull/1653)
- chore: bump deps [`9974832`](https://github.com/dherault/serverless-offline/commit/9974832d266c88db582d9854ef5754297b4275c8)

#### [v13.1.0](https://github.com/dherault/serverless-offline/compare/v13.0.0...v13.1.0)

> 24 September 2023

- feat: Adding handling for multiple identitySource headers in the REST API. [`#1675`](https://github.com/dherault/serverless-offline/pull/1675)
- doc: Fix customAuthenticationProvider documentation [`#1683`](https://github.com/dherault/serverless-offline/pull/1683)
- chore: bump deps for example [`05c7829`](https://github.com/dherault/serverless-offline/commit/05c7829a7d9d105b060b30b8e0699d53617ce0ef)
- chore: bump deps [`77df750`](https://github.com/dherault/serverless-offline/commit/77df750c97fa586bdab721f84acd249a0e2c103d)
- Update README.md [`5a04d02`](https://github.com/dherault/serverless-offline/commit/5a04d02952100cec66524f91c78681dca91716fe)
- doc: fix prettier [`70baeb0`](https://github.com/dherault/serverless-offline/commit/70baeb07451f3fda34e831a89ba8dbfcd6abc087)
- chore: add prettier:fix script [`2081634`](https://github.com/dherault/serverless-offline/commit/2081634d6bc9d9672129c499140df17eee0737f9)
- chore: remove default prettier setting [`6f228dc`](https://github.com/dherault/serverless-offline/commit/6f228dc1d3eced407cf6b8bae83abd1e2aa9047b)

### [v13.0.0](https://github.com/dherault/serverless-offline/compare/v12.0.4...v13.0.0)

> 21 September 2023

- fix: support authorizer with no identity source specified [`#1639`](https://github.com/dherault/serverless-offline/pull/1639)
- Add support for python3.10 and 3.11 [`#1727`](https://github.com/dherault/serverless-offline/pull/1727)
- fix(InvocationsController): typo in error message [`#1715`](https://github.com/dherault/serverless-offline/pull/1715)
- chore: Bump Apollo deps (#1717) [`#1717`](https://github.com/dherault/serverless-offline/pull/1717)
- Upgrade aws-sdk/client-lambda [`#1702`](https://github.com/dherault/serverless-offline/pull/1702)
- chore: bump scenario test deps [`44132a6`](https://github.com/dherault/serverless-offline/commit/44132a685894ce17a50bebd2967c47976547806e)
- chore: bump @aws-sdk/client-lambda [`da784fb`](https://github.com/dherault/serverless-offline/commit/da784fbf88b05042539312355195cd9589c8434c)
- chore: bump deps, fix package-lock [`6d84d52`](https://github.com/dherault/serverless-offline/commit/6d84d52df501bfdccd30d0842a3d62fbe047f334)
- chore: bump lambda invoke test deps [`795186b`](https://github.com/dherault/serverless-offline/commit/795186ba2d926f2252abaf26879e63b7558e9c32)
- chore: bump apollo graphql deps, fix test scenarios [`c71319f`](https://github.com/dherault/serverless-offline/commit/c71319f2ce773442f3d798f261859ed8723eb691)
- chore: bump serverless, remove unsupported node.js v12 docker tests [`fc87320`](https://github.com/dherault/serverless-offline/commit/fc873201e223245cef4e1b35b6e03de2a7227258)
- chore: bump eslint + plugins [`0e38203`](https://github.com/dherault/serverless-offline/commit/0e38203c87dc56fa92020783a4ee21d32b8454e3)
- bump apollo deps [`67f4b6b`](https://github.com/dherault/serverless-offline/commit/67f4b6b33f49c7e54843b02da72a2d74038f00a0)
- chore: bump archiver (major) [`7501837`](https://github.com/dherault/serverless-offline/commit/7501837748e293b547b996d0afcdc7d0b8b23d06)
- chore: bump deps (minor) [`b5c1236`](https://github.com/dherault/serverless-offline/commit/b5c1236c8810dcc096f499741721da21c296674d)
- chore: bump hapi deps [`f5bdfed`](https://github.com/dherault/serverless-offline/commit/f5bdfedc1905cc32ac5e88a55ff68e1598026aad)
- chore: bump deps (patch) [`7dce228`](https://github.com/dherault/serverless-offline/commit/7dce228fe450fdeccf390aabc8bda1f812c26af3)
- refactor!: remove node.js v16 support, remove node-fetch [`8dbcfa6`](https://github.com/dherault/serverless-offline/commit/8dbcfa65c8abf76243b5815b5056b0a604f69ff5)
- chore: bump @serverless/utils [`cae6bba`](https://github.com/dherault/serverless-offline/commit/cae6bba64ea1e0618a446ee8ac9c472ef6d14c60)
- chore: bump execa [`6e51059`](https://github.com/dherault/serverless-offline/commit/6e510599ce41d47b6ec3c723984c607702a47368)
- refactor: bup eslint-plugin-unicorn, fix linting [`c93dd98`](https://github.com/dherault/serverless-offline/commit/c93dd984de9729f056db55c0780b07f1aca222b1)
- chore: bump is-wsl (major) [`05de263`](https://github.com/dherault/serverless-offline/commit/05de26364f18831a9a9fce7d51ba990828267139)
- refactor: remove Object.hasOwn polyfill [`8ea15b5`](https://github.com/dherault/serverless-offline/commit/8ea15b5a6d924c0d612d520e998eb50edc53de75)
- refactor: re-activate unicorn/prefer-ternary [`4606829`](https://github.com/dherault/serverless-offline/commit/46068299281c3b48e42916b2a581fb3089f02982)
- chore: bump p-retry (major) [`ff578e9`](https://github.com/dherault/serverless-offline/commit/ff578e9b59b3b273b53cae232f7ed4472e94f052)
- chore: bump prettier [`5895f79`](https://github.com/dherault/serverless-offline/commit/5895f79fe02e78fb72b20a655c5878551e266eb6)
- chore: bump lint-staged (major) [`d1b42c2`](https://github.com/dherault/serverless-offline/commit/d1b42c2254f14f320f896c2e6b2531086b63a6b9)
- chore!: remove node.js v14 support [`03e2745`](https://github.com/dherault/serverless-offline/commit/03e27452bc84f10796dea93f1149d249eb5ee5b1)
- refactor: re-activate unicorn/prefer-number-properties [`46391f1`](https://github.com/dherault/serverless-offline/commit/46391f1924f7524d8a23d22d723065a7e9df6844)
- chore: re-activate unicorn/no-abusive-eslint-disable [`dfc863a`](https://github.com/dherault/serverless-offline/commit/dfc863ac0cde02e6d6514d55948c511e89ea1b55)
- refactor: re-activate unicorn/no-array-push-push [`69a1261`](https://github.com/dherault/serverless-offline/commit/69a12611dda635a71113f437ccf23758620857bb)
- chore: remove alb experimental warning [`2f066ac`](https://github.com/dherault/serverless-offline/commit/2f066acb6200957a7c1c5a0272f174eb2f24db53)
- refactor: re-activate unicorn/no-useless-promise-resolve-reject [`3b88aa0`](https://github.com/dherault/serverless-offline/commit/3b88aa0125da346a864d730bbe6da7c6edb6e928)
- chore: use commitlint.config esm [`d89fef7`](https://github.com/dherault/serverless-offline/commit/d89fef774fbd753147969794fd8ccee5e4d41ff2)
- chore: use prettier.config esm [`6f973cb`](https://github.com/dherault/serverless-offline/commit/6f973cb35c7bd5c972e4cb360defdc779f013268)
- chore: add supported runtimes [`84e07f6`](https://github.com/dherault/serverless-offline/commit/84e07f68cc3012708346b2169d39f43567e8f157)
- Update README.md [`973309a`](https://github.com/dherault/serverless-offline/commit/973309ad4dba71d87d4adc5b43c561a6524c846f)
- chore!: remove unsupported runtimes [`d2d92fe`](https://github.com/dherault/serverless-offline/commit/d2d92fe289b153bcbca5ffc569f486598cdf2219)
- chore: fix package.json engines [`ee6b971`](https://github.com/dherault/serverless-offline/commit/ee6b971a463f6a6b8ba9e711c5bc9d186f24fc7e)
- ci: bump actions/setup-go [`1b39a78`](https://github.com/dherault/serverless-offline/commit/1b39a78898ddc5709597a7514b1f361e956af9a2)
- ci: bump actions/checkout [`053936d`](https://github.com/dherault/serverless-offline/commit/053936d16e3bf4cbf95cb4fc8c9029871bbc1e0c)
- ci: add node.js v20, remove v19 [`68731a1`](https://github.com/dherault/serverless-offline/commit/68731a1b81fd84c6a5b3d6bac9e3138e7eaed4b2)
- fix(InvocationsControllor): typo in error message [`49d94f2`](https://github.com/dherault/serverless-offline/commit/49d94f2f3a16f1ab3b813eb886ab31fad4e3fc2d)
- Update README.md [`bbcd086`](https://github.com/dherault/serverless-offline/commit/bbcd086dad509209586c8650df7d53eac52ecd5f)

#### [v12.0.4](https://github.com/dherault/serverless-offline/compare/v12.0.3...v12.0.4)

> 3 January 2023

- refactor: use desm [`#1641`](https://github.com/dherault/serverless-offline/pull/1641)
- chore: bump deps [`1c6fc27`](https://github.com/dherault/serverless-offline/commit/1c6fc2735afb4f50c615962c28d13ab12d94cf97)
- chore: bump deps [`f9f1f79`](https://github.com/dherault/serverless-offline/commit/f9f1f795d3c77054fd43c17077c5d94c082003b5)
- chore: add eslint-plugin-unicorn [`12c9176`](https://github.com/dherault/serverless-offline/commit/12c91764174be3450607c4afcf13e5677c5f596e)
- chore(lint): fix switch-case-braces [`4578992`](https://github.com/dherault/serverless-offline/commit/4578992455b26f65b823498a9c1c5bdc99c568bf)
- chore(lint): fix unicorn/text-encoding-identifier-case [`0152069`](https://github.com/dherault/serverless-offline/commit/01520691650c5030aa1d3b2bc7343e3b740f5885)
- ci: add npm test scripts [`dfe6ac3`](https://github.com/dherault/serverless-offline/commit/dfe6ac38d685f4217a3a147a72e1eb6231f3e5f8)
- chore(lint): fix unicorn/no-negated-condition [`d151b0a`](https://github.com/dherault/serverless-offline/commit/d151b0a40db6f2034226283ee79b4edd3597be84)
- chore(lint): fix unicorn/new-for-builtins [`9d22fde`](https://github.com/dherault/serverless-offline/commit/9d22fde5356bd5ff3bcd2a5ad9e7cdacecfda781)
- chore: nit [`8ffbe09`](https://github.com/dherault/serverless-offline/commit/8ffbe09b3b231a2b33ce4d6b883bc450d79563f8)
- chore(lint): fix unicorn/prefer-regexp-test [`5b39e60`](https://github.com/dherault/serverless-offline/commit/5b39e601ade906865e62d0af431fd079c1d0c148)
- chore(lint): fix unicorn/explicit-length-check [`0dbde70`](https://github.com/dherault/serverless-offline/commit/0dbde7098532fcac455c7b6a3c2a1db2c1734cf5)
- chore: remove unused npm test scripts [`88faadf`](https://github.com/dherault/serverless-offline/commit/88faadf00dbc10e55312d7dfd64f4f5c0523f046)
- chore: simplify, use ternary [`016bd42`](https://github.com/dherault/serverless-offline/commit/016bd4241dd9d92e384e6729c08d0c1ad5eabfb7)
- chore(lint): fix unicorn/numeric-separators-style [`634b159`](https://github.com/dherault/serverless-offline/commit/634b159ddc59ff1f586067651fc2ea5521007f73)
- chore: remove eslint-disable-next-line [`606fab5`](https://github.com/dherault/serverless-offline/commit/606fab5ef340fe86166b71c63e6e87cf9024452f)
- chore(lint): fix unicorn/better-regex [`e3601f2`](https://github.com/dherault/serverless-offline/commit/e3601f2369ba636b7f26623bafe121e9859bcc7a)
- chore(lint): set es2022 [`2bb7f0b`](https://github.com/dherault/serverless-offline/commit/2bb7f0b5b80ba01e0b861018e1ddb8ccfa091ded)

#### [v12.0.3](https://github.com/dherault/serverless-offline/compare/v12.0.2...v12.0.3)

> 17 December 2022

- refactor: use array-unflat-js [`#1632`](https://github.com/dherault/serverless-offline/pull/1632)
- chore: bump deps, use npm package-lock v3 [`#1629`](https://github.com/dherault/serverless-offline/pull/1629)
- refactor: remove default parameter [`402e11e`](https://github.com/dherault/serverless-offline/commit/402e11e55e910533ab9761c616be843d8ac5f158)

#### [v12.0.2](https://github.com/dherault/serverless-offline/compare/v12.0.1...v12.0.2)

> 12 December 2022

- fix: set status code 200 for empty responses [`#1627`](https://github.com/dherault/serverless-offline/pull/1627)
- chore: fix broken test [`#1626`](https://github.com/dherault/serverless-offline/pull/1626)
- chore: bump deps [`5ea4437`](https://github.com/dherault/serverless-offline/commit/5ea44378bf5d5695c2e3329d26291a03ee58e505)
- test: add http code test with timeout [`f22b999`](https://github.com/dherault/serverless-offline/commit/f22b999a758f59ce752905f0c5bfb312fe485a00)
- test: scenario tests, revert middy to v3 -&gt; node v14 compat [`7f06b0a`](https://github.com/dherault/serverless-offline/commit/7f06b0a79113339c4ed369431f805b4d86da682a)
- refactor(alb): remove unused last request options [`cc5064c`](https://github.com/dherault/serverless-offline/commit/cc5064c89787971cbbef27bd5da06f6a066c4aa0)
- chore: formatting [`3ae0c7e`](https://github.com/dherault/serverless-offline/commit/3ae0c7e87f508e18c312e0c5feaff7f6dd675b03)
- refactor: order nit [`5fe57af`](https://github.com/dherault/serverless-offline/commit/5fe57afaba4b2948992e6075e8162c919ddb9408)

#### [v12.0.1](https://github.com/dherault/serverless-offline/compare/v12.0.0...v12.0.1)

> 7 December 2022

- fix: Lambda timeout status code [`#1620`](https://github.com/dherault/serverless-offline/pull/1620)
- chore: bump examples, scenario tests deps [`f9e7aeb`](https://github.com/dherault/serverless-offline/commit/f9e7aeb63bb49183d587f6e3507c773252ce1a1c)
- chore: bump deps [`55101d3`](https://github.com/dherault/serverless-offline/commit/55101d3c74c6513300c65036ba267e229eb1e965)

### [v12.0.0](https://github.com/dherault/serverless-offline/compare/v11.6.0...v12.0.0)

> 2 December 2022

- feat: add support for ALB [`#1521`](https://github.com/dherault/serverless-offline/pull/1521)
- feat: add support for ALB (#1521) [`#598`](https://github.com/dherault/serverless-offline/issues/598)
- chore: refactor alb example to module [`c23e826`](https://github.com/dherault/serverless-offline/commit/c23e82680e65dfd4f5241223fc70e918c69cd0a9)
- chore: bump deps [`cbadedf`](https://github.com/dherault/serverless-offline/commit/cbadedf7c0accc3e84fd71b740e6515c60e04c95)
- chor: bump deps [`aac475f`](https://github.com/dherault/serverless-offline/commit/aac475f97b302648f76b2194673cab4c9198c668)
- chore: ordering nit [`1ff6300`](https://github.com/dherault/serverless-offline/commit/1ff63009fa805a69dff5f0f4061b2617e0e9db89)
- refactor: dont return result of resolver function [`d0cba92`](https://github.com/dherault/serverless-offline/commit/d0cba92d1fbb30cabab0745690b071050c36b899)
- refactor: use nullish coalescing [`9404173`](https://github.com/dherault/serverless-offline/commit/940417305971ce8eb99ea87ac3c5708e377e23bf)
- chore: add alb experimental warning [`c588743`](https://github.com/dherault/serverless-offline/commit/c588743f1a7ba940e6b2e28ae342b7958a38c41d)
- refactor: use named import [`6be0a1b`](https://github.com/dherault/serverless-offline/commit/6be0a1bc126573edadaccd302ab2d105bafd4004)
- chore: ordering nit [`05c7e2b`](https://github.com/dherault/serverless-offline/commit/05c7e2b2330ecf61b531986127317162c1ec678b)
- ci: unlock v19 [`c9b6cbd`](https://github.com/dherault/serverless-offline/commit/c9b6cbdf27df21e1d7ab1e8862f3905ae7b36d3a)
- chore: ordering nit [`713ae51`](https://github.com/dherault/serverless-offline/commit/713ae51aecdf6efe21711a19ab2f3ce1719711f0)

#### [v11.6.0](https://github.com/dherault/serverless-offline/compare/v11.5.0...v11.6.0)

> 25 November 2022

- feat: request authorizers with null identitySource should return 401 [`#1618`](https://github.com/dherault/serverless-offline/pull/1618)
- doc: mention native modules in worker-threads, closes #1603 [`#1603`](https://github.com/dherault/serverless-offline/issues/1603)
- chore: bump deps [`6190586`](https://github.com/dherault/serverless-offline/commit/61905869f159e13259f409dae1f5b928ed523856)
- chore: fix scenario tests package-lock [`39086be`](https://github.com/dherault/serverless-offline/commit/39086be21657addca1570e698df781c7c2178fd1)
- chore: bump to nodejs runtime v18.x [`bda4fa2`](https://github.com/dherault/serverless-offline/commit/bda4fa2d19a77518a69fa891b938e24b7c7e4b40)
- chore: fix prettier [`3b5573d`](https://github.com/dherault/serverless-offline/commit/3b5573d2af85a4c7985fd9cf67dd2980c6781594)
- doc: run modes explainer [`0caf003`](https://github.com/dherault/serverless-offline/commit/0caf003298c6ca43c86af05564706f492ab60625)
- chore: temporary lock ci to nodejs v19.0.1 [`e7194c4`](https://github.com/dherault/serverless-offline/commit/e7194c4cc84882db1b3089ae46e6d59db785926f)

#### [v11.5.0](https://github.com/dherault/serverless-offline/compare/v11.4.0...v11.5.0)

> 18 November 2022

- feat: Add support for nodejs18.x runtime [`#1616`](https://github.com/dherault/serverless-offline/pull/1616)
- feat: Add support for nodejs18.x runtime (#1616) [`#1615`](https://github.com/dherault/serverless-offline/issues/1615)
- chore: examples, add eslint ignore rule [`de19ad3`](https://github.com/dherault/serverless-offline/commit/de19ad397721ae5364e5af910c9a7d0761169faf)

#### [v11.4.0](https://github.com/dherault/serverless-offline/compare/v11.3.0...v11.4.0)

> 16 November 2022

- feat: Add support for request authorizers to have a querystring identity source [`#1610`](https://github.com/dherault/serverless-offline/pull/1610)
- chore: bump deps [`a3dc84f`](https://github.com/dherault/serverless-offline/commit/a3dc84fd2f7c13af21b2e802c24c147bb788ebd6)

#### [v11.3.0](https://github.com/dherault/serverless-offline/compare/v11.2.3...v11.3.0)

> 7 November 2022

- feat: httpApi with request authorizer [`#1600`](https://github.com/dherault/serverless-offline/pull/1600)
- test: fix lambda invoke with aws-sdk v3 [`#1607`](https://github.com/dherault/serverless-offline/pull/1607)
- chore: add example for lambda invoke with aws-sdk v3 [`#1557`](https://github.com/dherault/serverless-offline/pull/1557)
- chore: bump deps [`0a84603`](https://github.com/dherault/serverless-offline/commit/0a84603ba2e8973497c4b70592d9d7015cbc8ac8)
- test: pin dependencies from manual websocket tests [`bddc8ba`](https://github.com/dherault/serverless-offline/commit/bddc8ba54ec6a20d26c4b4504fe0f88398ff05c6)
- chore: bump deps, hapi v21 major [`a808ed2`](https://github.com/dherault/serverless-offline/commit/a808ed28cb7a74bffbbed7a262bc08e6f68f65cc)
- test: add lambda invoke tests with aws-sdk v3 [`5a33832`](https://github.com/dherault/serverless-offline/commit/5a33832208daf951d38a495cbfe1e736c646dd2f)
- test: install aws-sdk v2 dependency for lambda invoke tests [`7c82b11`](https://github.com/dherault/serverless-offline/commit/7c82b111499286bb9d952560c8ee7c0632bdfa6e)
- chore: fix websocket example, add one-way message [`70bc8ec`](https://github.com/dherault/serverless-offline/commit/70bc8ecf54b1c5daecac325ebe2a97db1ebe11b5)
- chore: remove default comment [`0e44433`](https://github.com/dherault/serverless-offline/commit/0e444332d044604b5f3a0b991438ffaf0ff8399d)
- chore: return event, context in examples [`5720922`](https://github.com/dherault/serverless-offline/commit/57209220efd2cd874e76998a2023fb9585dda68e)
- test: refactor to make lambda invoke test deployable to aws [`2668e8c`](https://github.com/dherault/serverless-offline/commit/2668e8cf25b889993168841f5f9d18d0202c108b)
- test: cleanup tests [`d51eb23`](https://github.com/dherault/serverless-offline/commit/d51eb23ee92557da23028fc31a8738b530a51003)
- chore: property order nit [`b1b9cb0`](https://github.com/dherault/serverless-offline/commit/b1b9cb0e80b55e92997dbc9e75d521d56d418955)
- doc: lambda invoke cleanup [`e35cd4c`](https://github.com/dherault/serverless-offline/commit/e35cd4c8977f4c33b02ff4217a1c93064bb99f9c)
- chore: consolidate lambda invoke examples [`873f347`](https://github.com/dherault/serverless-offline/commit/873f3472e64d8269e48aa53c8f99b0480bd9cee5)
- chore: fix lambda invoke v2 example [`001f5fd`](https://github.com/dherault/serverless-offline/commit/001f5fd3b1f2dec61a43641c3a58ff634ad809d7)
- chore: fix lambda funcion names for invoke tests [`08598bd`](https://github.com/dherault/serverless-offline/commit/08598bde0213b84fa662ed5e0c91a3cc7728492e)
- chore: rename lambda invoke aws-sdk v2 tests [`9f6a525`](https://github.com/dherault/serverless-offline/commit/9f6a5256dc5b8cb2391a3eb921bb26ecccc76143)
- chore: bump memory, use arm64, direct deployment [`96c5a27`](https://github.com/dherault/serverless-offline/commit/96c5a27eabd244a3cf46d72efda2ff0bf29aa673)
- test: pass URL directly to constructor, remove toString [`f02d167`](https://github.com/dherault/serverless-offline/commit/f02d1672cce3886730c2adf39127021e0764e5da)
- chore: remove console.log [`f9e2d86`](https://github.com/dherault/serverless-offline/commit/f9e2d86c6618ae6c4e6cb8649421186a46a83ecf)
- doc: fix header [`bf701a9`](https://github.com/dherault/serverless-offline/commit/bf701a95bb72842a421f0ed7eef97c5158377ae2)
- doc: fix link [`9f84c53`](https://github.com/dherault/serverless-offline/commit/9f84c53875e2bb0c6c2fdd287dc250c17b0e4d90)
- test: skip test [for now] [`306a76f`](https://github.com/dherault/serverless-offline/commit/306a76f6b4adcd9a7046cb774a2719a9712a5a90)
- chore: remove unused eslint rule [`d8ebc4f`](https://github.com/dherault/serverless-offline/commit/d8ebc4f6d8beb26213aeade9ab2a34c6d7650919)

#### [v11.2.3](https://github.com/dherault/serverless-offline/compare/v11.2.2...v11.2.3)

> 31 October 2022

- fix: prevent overwriting host.docker.internal in wsl [`#1605`](https://github.com/dherault/serverless-offline/pull/1605)
- chore: bump deps [`f472d89`](https://github.com/dherault/serverless-offline/commit/f472d893376dd4f126e719dd79cebd1920dd4283)
- refactor: call now from Date namespace [`5342bec`](https://github.com/dherault/serverless-offline/commit/5342bec985d49967c5f37dc7b6d695a1b5c86919)
- chore: import order nit [`b3346aa`](https://github.com/dherault/serverless-offline/commit/b3346aaf0922c056bd58fe17044ce3265698ca5c)
- refactor: use Date.prototype.getTime instead of valueOf [`0fdfff7`](https://github.com/dherault/serverless-offline/commit/0fdfff74f2e6d2ba0a881ab4fdcf085c146abaa7)

#### [v11.2.2](https://github.com/dherault/serverless-offline/compare/v11.2.1...v11.2.2)

> 31 October 2022

- fix: path access with trailing slash [`#1606`](https://github.com/dherault/serverless-offline/pull/1606)
- chore: bump deps [`a96cd6e`](https://github.com/dherault/serverless-offline/commit/a96cd6e44f89c0c563553f6210e349b033ead1eb)
- chore: remove wrong test [`e635da8`](https://github.com/dherault/serverless-offline/commit/e635da84955d12e873799babf5696848ae20dfee)
- chore: test formatting nit [`4a2df15`](https://github.com/dherault/serverless-offline/commit/4a2df15ebfe5f0538e96b6a88810b59b6cd1feb3)
- chore: fix test description [`21126b4`](https://github.com/dherault/serverless-offline/commit/21126b44467f2d27c38d2579b9ec1452f2ede35c)
- fix: remove redundant and faulty condition in hapi path generation [`e756be6`](https://github.com/dherault/serverless-offline/commit/e756be6a5f620a76501ddf43becdd37ce8dd947d)

#### [v11.2.1](https://github.com/dherault/serverless-offline/compare/v11.2.0...v11.2.1)

> 27 October 2022

- refactor: replace aws-sdk lambda client with more lightweight @aws-sdk scoped package [`1a482ad`](https://github.com/dherault/serverless-offline/commit/1a482ad49d567eedca5e9c34907c27545118b39c)
- refactor: use Array.prototype.map to iterate layers [`6fc9e90`](https://github.com/dherault/serverless-offline/commit/6fc9e90032515d7e30ee309a6aed76c54b0cd286)
- refactor: use destructuring [`414cf4a`](https://github.com/dherault/serverless-offline/commit/414cf4a86242b8e6d3afcff3c7e8facb3d2620ef)
- refactor: remove default get method from fetch [`8f40327`](https://github.com/dherault/serverless-offline/commit/8f4032707d6a0eee880fb1435ffea47929f31601)
- refactor: use array destructuring [`97de51b`](https://github.com/dherault/serverless-offline/commit/97de51bd005c8380d60818f4ee83a6246e2c93ba)

#### [v11.2.0](https://github.com/dherault/serverless-offline/compare/v11.1.3...v11.2.0)

> 26 October 2022

- fix: logging for unhandled exceptions in handler [`#1604`](https://github.com/dherault/serverless-offline/pull/1604)
- test: add apollo federation scenario test [`#1599`](https://github.com/dherault/serverless-offline/pull/1599)
- feat: add node.js v19 to supported runtimes [`#1598`](https://github.com/dherault/serverless-offline/pull/1598)
- test: refactor apollo server integrations test to use new module [`ec93e47`](https://github.com/dherault/serverless-offline/commit/ec93e47e113e275170176ee2c11dbc34940412a0)
- test: refactor apollo federation supergraph test to use new modules [`841ecb3`](https://github.com/dherault/serverless-offline/commit/841ecb391bcddaed82c6b14ebed584992b686f22)
- chore: bump deps [`066711b`](https://github.com/dherault/serverless-offline/commit/066711bd21d9fe295f91af975676ad82a8d39fed)
- chore: bump deps [`0be4c31`](https://github.com/dherault/serverless-offline/commit/0be4c312f129c13f69af743bdd8e146be36ff2f9)
- chore: use 1024 MB as memory size default [`7bff5f8`](https://github.com/dherault/serverless-offline/commit/7bff5f8df3f91c0c4e829409e2a30745b07bdf71)
- chore: add architecture: arm64 to serverless.yml [`468dc98`](https://github.com/dherault/serverless-offline/commit/468dc98ff7988bee31eb6b454a7cc99b8a2002f2)
- chore: add deploymentMethod: direct to serverless.yml [`a85430e`](https://github.com/dherault/serverless-offline/commit/a85430e9a386fe9818cb7decc392eaae6d1d00c1)
- test: add API_GATEWAY environment variable to apollo federation test [`be78cd3`](https://github.com/dherault/serverless-offline/commit/be78cd32def7dfa16f014f07302c633552cb82ff)
- chore: rename test variable [`3f23148`](https://github.com/dherault/serverless-offline/commit/3f23148d48613984bfad0153ee9d562f2522ab20)
- test: refactor apollo federation gateway url parameters [`4f64d2f`](https://github.com/dherault/serverless-offline/commit/4f64d2f15a8b6dfb43a7c08c66ec1ae78d3d94c1)

#### [v11.1.3](https://github.com/dherault/serverless-offline/compare/v11.1.2...v11.1.3)

> 17 October 2022

- chore: bump deps [`c19211d`](https://github.com/dherault/serverless-offline/commit/c19211d4d18cb37571fcfc416133bad351c64eb5)
- refactor: split get events for http and httpApi [`51a30e9`](https://github.com/dherault/serverless-offline/commit/51a30e9a209c16be3b4efca9f406a2b6ffe6017e)
- refactor: remove typeof operator for undefined checks [`312d4f0`](https://github.com/dherault/serverless-offline/commit/312d4f0819d0a589a7b75f5f0f8b037413445642)
- refactor: create http server [`132dd7f`](https://github.com/dherault/serverless-offline/commit/132dd7f18eda078a79ac486c6f63763ae8321b97)
- test: nit, remove arrows [`9a07736`](https://github.com/dherault/serverless-offline/commit/9a077366439b316adbd49d12a59c99a54a4b847b)

#### [v11.1.2](https://github.com/dherault/serverless-offline/compare/v11.1.1...v11.1.2)

> 12 October 2022

- test: add scenario test for middy, issue #1595 [`#1596`](https://github.com/dherault/serverless-offline/pull/1596)
- revert: remove unreachable condition, fixes #1595 [`#1595`](https://github.com/dherault/serverless-offline/issues/1595)
- chore: bump deps [`4b62dfc`](https://github.com/dherault/serverless-offline/commit/4b62dfc907335dbfe1c6cbecfd0c9c3223e97a3d)
- chore: bump deps [`ad48011`](https://github.com/dherault/serverless-offline/commit/ad48011a0d4af4b1cec2f9e00ff45dd167245605)
- chore: remove unused @middy/http-error-handler [`7070416`](https://github.com/dherault/serverless-offline/commit/7070416ae11966051a02c38b94afba27dba2b7be)
- chore: destructuring order nit [`4c421a3`](https://github.com/dherault/serverless-offline/commit/4c421a3bfd9f8c86fc4c42caef6d7a2363954d87)

#### [v11.1.1](https://github.com/dherault/serverless-offline/compare/v11.1.0...v11.1.1)

> 9 October 2022

- fix: await cleanup in timer [`f5b8c68`](https://github.com/dherault/serverless-offline/commit/f5b8c689b17163cebb8526ddf149ebe830f2b288)
- refactor: await cleanup, then empty map [`f00383e`](https://github.com/dherault/serverless-offline/commit/f00383ec716d8a71abaa55b5ea5d1b7ef4ad4014)
- fix: free memory, empty lambda function pool [`b03cf79`](https://github.com/dherault/serverless-offline/commit/b03cf79b29c9eb9bc8bdb62a4e76c75ef31064df)
- refactor: use async function [`d03194f`](https://github.com/dherault/serverless-offline/commit/d03194ff8761b721f329d6b40b25677764447381)
- fix: empty complete pool on cleanup [`3377e7a`](https://github.com/dherault/serverless-offline/commit/3377e7abae0e55febfca350ec9c7cefa48ebf521)

#### [v11.1.0](https://github.com/dherault/serverless-offline/compare/v11.0.3...v11.1.0)

> 8 October 2022

- chore: bump deps [`7f8887c`](https://github.com/dherault/serverless-offline/commit/7f8887c2eadb64a24baf18f79dee9d6800d8978e)
- feat: remove noStripTrailingSlashInUrl option [`71ee21d`](https://github.com/dherault/serverless-offline/commit/71ee21db253f601f5355377e1a67d641fc447bea)
- refactor: remove stripTrailingSlash from hapi config [`22fd667`](https://github.com/dherault/serverless-offline/commit/22fd66774e6ed867d3c2c8ccc3d3c989c50d4467)

#### [v11.0.3](https://github.com/dherault/serverless-offline/compare/v11.0.2...v11.0.3)

> 5 October 2022

- chore: bump deps [`dfbc567`](https://github.com/dherault/serverless-offline/commit/dfbc56768116b5f3c01345d82e7aeab707ce23a2)
- fix: memory leak with lambda timeout [`c9c8c14`](https://github.com/dherault/serverless-offline/commit/c9c8c1411ee93a86d8eee448a4dbb350a7e67674)

#### [v11.0.2](https://github.com/dherault/serverless-offline/compare/v11.0.1...v11.0.2)

> 5 October 2022

- fix: timeout terminating process [`#1593`](https://github.com/dherault/serverless-offline/pull/1593)
- test: add test for generated api key [`#1590`](https://github.com/dherault/serverless-offline/pull/1590)
- chore: bump deps [`d7305ca`](https://github.com/dherault/serverless-offline/commit/d7305ca0a9a8210babe5967c9a46844de781ade5)
- test: add tests for timeout termination bug #1592 [`0ef0dad`](https://github.com/dherault/serverless-offline/commit/0ef0dad7c9b140639b3227488ec7bf18068833d1)
- chore: move provider.apiGateway.apiKeys tests [`290ca5f`](https://github.com/dherault/serverless-offline/commit/290ca5ff6be6fd01d187e3a29caa2b86f0e8b897)
- chore: move private lambda tests [`97b569d`](https://github.com/dherault/serverless-offline/commit/97b569d35eb0ba3740eded8cdff47d6f499d3015)
- fix: remove unreachable condition [`ae1c8b3`](https://github.com/dherault/serverless-offline/commit/ae1c8b3d62c378f4ebf604e6d60117622c22a4ed)
- chore: destructuring order nit [`979d6b7`](https://github.com/dherault/serverless-offline/commit/979d6b7f0f7511403c178d827582a8b535d6f7d6)
- chore: remove test.only [`0318821`](https://github.com/dherault/serverless-offline/commit/03188214bce6d57b239b638c84de12611fa98f2d)

#### [v11.0.1](https://github.com/dherault/serverless-offline/compare/v11.0.0...v11.0.1)

> 1 October 2022

- fix: checking generated api key [`#1589`](https://github.com/dherault/serverless-offline/pull/1589)
- perf: create api keys only when needed (again) [`d614fc8`](https://github.com/dherault/serverless-offline/commit/d614fc896dc7b8c36c0603e5e75a303b88fd9917)
- chore: fix plugin path in example [`abd279c`](https://github.com/dherault/serverless-offline/commit/abd279c45706952d0cfa0564b12d2931841ecb8e)
- fix: add to set [`8befa04`](https://github.com/dherault/serverless-offline/commit/8befa0468ab7d84aa24eb6afb23920724b6c859c)

### [v11.0.0](https://github.com/dherault/serverless-offline/compare/v10.3.2...v11.0.0)

> 28 September 2022

- fix!: remove apiKey option [`#1585`](https://github.com/dherault/serverless-offline/pull/1585)
- fix!: remove disableScheduledEvents option [`#1582`](https://github.com/dherault/serverless-offline/pull/1582)
- chore: bump deps [`a5bc076`](https://github.com/dherault/serverless-offline/commit/a5bc076c36f154227822620825d5828f92477a24)
- doc: remove recommendation [`d8cafde`](https://github.com/dherault/serverless-offline/commit/d8cafde92ef322aadf451e0333331dfad2b67139)

#### [v10.3.2](https://github.com/dherault/serverless-offline/compare/v10.3.1...v10.3.2)

> 27 September 2022

- refactor: private endpoint with api keys, Part 2 [`9d57872`](https://github.com/dherault/serverless-offline/commit/9d578725babad0aa12da9560fd48f7db03182245)
- refactor: private endpoint with api keys [`8638635`](https://github.com/dherault/serverless-offline/commit/8638635feb5d7ebed6e91e135c77235280ea4ed3)
- perf: create api keys set only when needed [`a6df83a`](https://github.com/dherault/serverless-offline/commit/a6df83a9165191c46f4e5e95ffdd9a87cc75ed77)
- chore: order nit [`c459ad8`](https://github.com/dherault/serverless-offline/commit/c459ad8f31f0890a2602f9b15da2b7a3deb8e30c)

#### [v10.3.1](https://github.com/dherault/serverless-offline/compare/v10.3.0...v10.3.1)

> 27 September 2022

- chore: bump deps [`10f0d8c`](https://github.com/dherault/serverless-offline/commit/10f0d8cd2a035ac3d9510e003d501a6a8c596744)
- chore: move split handler path [`d424e4f`](https://github.com/dherault/serverless-offline/commit/d424e4fb764e9018aa121bc23ba181e4ffa8410f)
- fix: private endpoints [`76c8215`](https://github.com/dherault/serverless-offline/commit/76c8215111eaad0f6ab43de48b6476eb70bdbd6d)

#### [v10.3.0](https://github.com/dherault/serverless-offline/compare/v10.2.1...v10.3.0)

> 25 September 2022

- chore: bump deps [`2cf2160`](https://github.com/dherault/serverless-offline/commit/2cf2160db263e81a337b686c39310e5ff2147d3a)
- refactor: move private http event condition to http class [`a2d3438`](https://github.com/dherault/serverless-offline/commit/a2d34384877f824768c8a6ae1aecfb634ef7cb33)
- chore: adds dots to option description [`c391389`](https://github.com/dherault/serverless-offline/commit/c391389b12fc92ff515c464d268b4a356a008436)
- fix: --disableCookieValidation flag throws error [`7ebcc65`](https://github.com/dherault/serverless-offline/commit/7ebcc65e240587676644cf410771f6084a27fc47)
- feat: deprecate disableScheduledEvents option [`e7ad109`](https://github.com/dherault/serverless-offline/commit/e7ad1097c245cacfe7796df3b67d988f10a3b4d1)
- chore: fix deprecated option [`265ef99`](https://github.com/dherault/serverless-offline/commit/265ef999206ff0910d93ea0449cc8f288a9cba88)
- chore: exclude nyc from prettier [`2e3ba91`](https://github.com/dherault/serverless-offline/commit/2e3ba9108d469ea4208688e40bc7d4295522a9a9)
- chore: deprecate disableScheduledEvents in options overview [`5f0ce46`](https://github.com/dherault/serverless-offline/commit/5f0ce46c8d89a9f81ba3a3fecbed5bb5880a6b1f)
- fix: set cookies to undefined [`bf7fed6`](https://github.com/dherault/serverless-offline/commit/bf7fed6cf04f15edec426b7848bc9d3d2fdc2a96)
- doc: deprecate disableScheduledEvents option in README [`56dc373`](https://github.com/dherault/serverless-offline/commit/56dc373669e7c10ea41cb86082464a5c7b36eadd)

#### [v10.2.1](https://github.com/dherault/serverless-offline/compare/v10.2.0...v10.2.1)

> 23 September 2022

- refactor: replace jsonwebtoken with jose [`#1579`](https://github.com/dherault/serverless-offline/pull/1579)
- chore: add quotes to log vars [`ac45a34`](https://github.com/dherault/serverless-offline/commit/ac45a340f5db1563091415ff45c51b636c6627ac)
- refactor: create lambda only when needed [`5aa44ae`](https://github.com/dherault/serverless-offline/commit/5aa44aef98e45184f98d0eeb7a15366dc3c43906)
- fix: usage identifier key condition [`c0b8d75`](https://github.com/dherault/serverless-offline/commit/c0b8d7574742dfd1a3a576193912b44623ea51a4)
- chore: destructuring order nit [`28b68e8`](https://github.com/dherault/serverless-offline/commit/28b68e8db11be75ce89fc5706516526c0bbdcaf7)

#### [v10.2.0](https://github.com/dherault/serverless-offline/compare/v10.1.0...v10.2.0)

> 22 September 2022

- feat: secure web sockets [`#1468`](https://github.com/dherault/serverless-offline/pull/1468)
- chore: bump deps [`52b0176`](https://github.com/dherault/serverless-offline/commit/52b0176655a9f86e19c006f8fe85e66d53f5b64f)
- chore: bump deps [`af68056`](https://github.com/dherault/serverless-offline/commit/af68056782645cee304626ea9dcb3ed0b8436602)
- refactor: use node:fs/promises [`b1a6121`](https://github.com/dherault/serverless-offline/commit/b1a612117f3b6b8922f28be78aeb50bb6b444e9c)
- refactor: websocket servers instantiation [`4788e04`](https://github.com/dherault/serverless-offline/commit/4788e04a312add77ba78496e113b0842ff100358)
- refactor: websocket server instantation [`2843e86`](https://github.com/dherault/serverless-offline/commit/2843e866f5f4af6ca825abaf2f849629159747e4)
- refactor: http server instantation for websockets [`4c7a034`](https://github.com/dherault/serverless-offline/commit/4c7a03441efff04878005be20d20aa38f2870eaf)
- chore: await websocket start [`1a6c2fe`](https://github.com/dherault/serverless-offline/commit/1a6c2fedcbb79bbba1dc825f7a9f00b9765e539c)
- chore: import order nit [`dda6e57`](https://github.com/dherault/serverless-offline/commit/dda6e5763315b0452a3db2b8be8407549e89ac1f)
- refactor: use optional chaining [`0000ba7`](https://github.com/dherault/serverless-offline/commit/0000ba7e2ed47eb5afd098d21897b138e7c2e2ca)

#### [v10.1.0](https://github.com/dherault/serverless-offline/compare/v10.0.2...v10.1.0)

> 18 September 2022

- feat: add support for apiGateway.apiKeys [`#1572`](https://github.com/dherault/serverless-offline/pull/1572)
- feat: deprecate api keys option [`#1571`](https://github.com/dherault/serverless-offline/pull/1571)
- test: add code coverage [`6027d46`](https://github.com/dherault/serverless-offline/commit/6027d4698149c32f2a4e028a741c0c732a700f67)
- chore: bump deps [`4749b9a`](https://github.com/dherault/serverless-offline/commit/4749b9ad212c2a4aff81cba061214539cc2f731e)
- doc: reformat options [`546cca1`](https://github.com/dherault/serverless-offline/commit/546cca1b293d6b7db35b3761d47862380a525dec)
- perf: remove contributors from package.json [`0b9f007`](https://github.com/dherault/serverless-offline/commit/0b9f007ba7ca0ad901489e5b743d8072b8092b39)
- chore: add configValidationMode and deprecationNotificationMode to remaining configs [`fa64ff4`](https://github.com/dherault/serverless-offline/commit/fa64ff4298e4797ed663ede4672b6e301c5add70)
- chore: add deprecationNotificationMode to serverless config [`4a5945a`](https://github.com/dherault/serverless-offline/commit/4a5945ab4c58f0aa16cc8a0d85210f2cdb8d9c2c)
- test: fix provider.iam.role.statements config [`24a3f9b`](https://github.com/dherault/serverless-offline/commit/24a3f9bee282ae8b574289a0027af37daafdc068)
- test: remove api keys from builder [`b7b8e36`](https://github.com/dherault/serverless-offline/commit/b7b8e36b50ac58b0308ce1d2e8ca6e426e67150a)
- doc: fix option line breaks [`e877cef`](https://github.com/dherault/serverless-offline/commit/e877cef124d1aa87d1e70d151849207b686cf6ab)
- test: fix deprecated package patterns [`0ab5ec2`](https://github.com/dherault/serverless-offline/commit/0ab5ec22d34179768322f855308eb567cb8d18af)
- chore: rename old npm scripts [`97a2c34`](https://github.com/dherault/serverless-offline/commit/97a2c3470bf8d94ed21668969242a73934887f38)
- chore: rename api key header variable [`5a3da42`](https://github.com/dherault/serverless-offline/commit/5a3da420ae95eb5e95d5d85a4f37b308234c7e8f)
- test: move tests [`e896f53`](https://github.com/dherault/serverless-offline/commit/e896f53c55021a6a84e154c68fda056735f27767)
- chore: quote x-api-key header name [`c6749da`](https://github.com/dherault/serverless-offline/commit/c6749da0be2e3f285c5724c8bdc34ef1a6ec61bc)
- chore: order nit [`654cdab`](https://github.com/dherault/serverless-offline/commit/654cdabc5355fb44e42b6c01551444861a197774)
- chore: space nit [`18d4e8a`](https://github.com/dherault/serverless-offline/commit/18d4e8a30fec122bbfa86888c12bf35033496fcd)

#### [v10.0.2](https://github.com/dherault/serverless-offline/compare/v10.0.1...v10.0.2)

> 11 September 2022

- test: add chrome-aws-lambda http api scenario tests [`a3f5ae5`](https://github.com/dherault/serverless-offline/commit/a3f5ae5ffa172751d045b85dadc158a7f88a270f)
- test: remove arrow function, use object shorthand [`84dd8e0`](https://github.com/dherault/serverless-offline/commit/84dd8e0f9ecd2621c45ca1e5505dfad1c040836a)
- perf: create instance in worker thread helper module scope [`53a799e`](https://github.com/dherault/serverless-offline/commit/53a799e7c281f67f6bff11166a89a92b8aebc9a3)
- chore" remove .only from tests [`9099847`](https://github.com/dherault/serverless-offline/commit/9099847ba574d7979b2406459fdcbf5f14a4be5e)

#### [v10.0.1](https://github.com/dherault/serverless-offline/compare/v10.0.0...v10.0.1)

> 9 September 2022

- test: add chrome-aws-lambda scenario tests [`#1569`](https://github.com/dherault/serverless-offline/pull/1569)
- fix: Support multiple of same query string for LambdaProxyIntegrationEventV2 [`#1525`](https://github.com/dherault/serverless-offline/pull/1525)
- ci: setup python [`#1565`](https://github.com/dherault/serverless-offline/pull/1565)
- ci: add matrix setup [`#1564`](https://github.com/dherault/serverless-offline/pull/1564)
- ci: add macos [`#1563`](https://github.com/dherault/serverless-offline/pull/1563)
- chore: bump deps [`1b993ed`](https://github.com/dherault/serverless-offline/commit/1b993ed326b975765371a84d379add1b03c043ed)
- test: nit, use function statements [`6cded93`](https://github.com/dherault/serverless-offline/commit/6cded93a9891e6e56bb88d076e7a933646ea85c2)
- chore: remove outdated maintainers section from package.json [`acb821c`](https://github.com/dherault/serverless-offline/commit/acb821cc8db4f6157ec3eb2b8db1cf9253c4452a)
- chore: add .prettierignore file [`154e191`](https://github.com/dherault/serverless-offline/commit/154e1915a3cd2bce266f590cc978705a7fc5febc)
- fix: await promise [`335993e`](https://github.com/dherault/serverless-offline/commit/335993ef4bbdfa0f2a313b2fdd9e2b8ae9ef6d31)
- test: remove headers [`33b856f`](https://github.com/dherault/serverless-offline/commit/33b856f143de4db00ae5e272a4c1dd68689599c0)
- chore: add prettier script [`1b1d049`](https://github.com/dherault/serverless-offline/commit/1b1d049d461751f3ded0c41af00dbbb883a018bc)
- chore: rename test file [`aea5b6e`](https://github.com/dherault/serverless-offline/commit/aea5b6e779dab6dd4269908d1761191ef6c36720)

### [v10.0.0](https://github.com/dherault/serverless-offline/compare/v9.3.1...v10.0.0)

> 3 September 2022

- fix!: remove child process option [`#1545`](https://github.com/dherault/serverless-offline/pull/1545)
- fix!: remove print output option [`#1559`](https://github.com/dherault/serverless-offline/pull/1559)
- feat: add Lambda class to package exports [`#1561`](https://github.com/dherault/serverless-offline/pull/1561)
- chore: bump deps [`3173a5f`](https://github.com/dherault/serverless-offline/commit/3173a5f53ddd074cb465a1144fdb4f7e849a0904)
- refactor!: rename option to terminate lambda time [`3b9e45f`](https://github.com/dherault/serverless-offline/commit/3b9e45fdfe9fbda88accaf3d8c9f05a4b643c1e8)
- refactor: unsupported docker runtimes [`c4a53d9`](https://github.com/dherault/serverless-offline/commit/c4a53d9f32302e675beb73cd71579bcaa484114f)
- fix!: remove hide stack traces option [`1820771`](https://github.com/dherault/serverless-offline/commit/1820771f7474c576ad139709f12a10fb203e2a9e)
- fix: add node.js v16 to unsupported docker runtimes [`6ab3928`](https://github.com/dherault/serverless-offline/commit/6ab39287fb6c4c867873740b3aa2f2b3de9ccefe)

#### [v9.3.1](https://github.com/dherault/serverless-offline/compare/v9.3.0...v9.3.1)

> 31 August 2022

- fix: remove package.json main field [`11cc039`](https://github.com/dherault/serverless-offline/commit/11cc039ae3505b1d84db421528190deb5bd1b2f2)
- fix: unpin luxon [`ac2676a`](https://github.com/dherault/serverless-offline/commit/ac2676aaada8a2c4a5e07fc5db738b7cc321852b)
- refactor: rename time to millis [`c1158b2`](https://github.com/dherault/serverless-offline/commit/c1158b2677a724053c53941b2e93450ff9c511df)
- refactor: remove unsupported dotnet, dotnet core runtimes [`b967b37`](https://github.com/dherault/serverless-offline/commit/b967b376eca4ff2f3d597aab0fa8864740967ae9)
- refactor: simplify ruby runner [`10e7e82`](https://github.com/dherault/serverless-offline/commit/10e7e8260b4d1840903786f2b9ece49df41416a6)
- chore: remove commented code [`a660813`](https://github.com/dherault/serverless-offline/commit/a660813c294dd49ced3af163a4ec17975aaa59da)
- fix: millis calculation [`6666e35`](https://github.com/dherault/serverless-offline/commit/6666e3588fad319d07a4fc8f610b04278e551b6a)
- test: refactor serverless-plugin-typescript to use es6 modules [`013cc6f`](https://github.com/dherault/serverless-offline/commit/013cc6f55f21daafab087e367fe15e41413cef4c)

#### [v9.3.0](https://github.com/dherault/serverless-offline/compare/v9.2.6...v9.3.0)

> 28 August 2022

- fix: pin luxon to v3.0.1 [`#1555`](https://github.com/dherault/serverless-offline/pull/1555)
- feat: add timeout feature, hookup noTimeout option [`#1551`](https://github.com/dherault/serverless-offline/pull/1551)
- chore: bump deps [`e65e1a2`](https://github.com/dherault/serverless-offline/commit/e65e1a21989c2b66ed30b4ff6df7eed956fbe39d)
- test: refactor more handlers to use es6 modules [`ff4f581`](https://github.com/dherault/serverless-offline/commit/ff4f5812336fd0e22c7eab28321637f04941bca8)
- chore: bump deps [`888678b`](https://github.com/dherault/serverless-offline/commit/888678b9a4821347722f62202d8c7fc2bd1aac07)
- test: refactor handlers to use es6 modules [`2942763`](https://github.com/dherault/serverless-offline/commit/29427632a0b23a9b47f6596ca4f042baeb930393)
- refactor: examples to use es6 imports [`6953f23`](https://github.com/dherault/serverless-offline/commit/6953f2363b302b91c1728698703c5c4f00bc2506)
- refactor: examples [`83835dd`](https://github.com/dherault/serverless-offline/commit/83835dd294cd1af50a58bccc7f13e28686f0c4a0)
- refactor: simplify [`dc8c46a`](https://github.com/dherault/serverless-offline/commit/dc8c46a7f027d70dc9f7cf491cab0ac4aeaef33d)
- test: fix handler path [`676b184`](https://github.com/dherault/serverless-offline/commit/676b18495ff226b167ea086c457109d83c435b2f)
- doc: use es6 modules [`08caa7e`](https://github.com/dherault/serverless-offline/commit/08caa7e4e4aa48177cea06d9ce948e9330106d3e)
- refactor: move examples handlers to src directory [`724b9e8`](https://github.com/dherault/serverless-offline/commit/724b9e84fc91e24a720372fc94f6854ff87c141a)
- chore: import order nit [`e6f5d34`](https://github.com/dherault/serverless-offline/commit/e6f5d3472bc217a09fa44ccfbe8f183e29cb9a66)

#### [v9.2.6](https://github.com/dherault/serverless-offline/compare/v9.2.5...v9.2.6)

> 21 August 2022

- fix: Log uncaught exceptions in worker thread handlers [`#1544`](https://github.com/dherault/serverless-offline/pull/1544)
- chore: re-organize scenario tests (again) [`0f3e1ce`](https://github.com/dherault/serverless-offline/commit/0f3e1cee147267f69e9aec5c24d89b3f067c3684)
- refactor: move child process deprecation to the end for more visibility [`310a535`](https://github.com/dherault/serverless-offline/commit/310a5357f07bb0de927d1ede4dcdef55d390e7db)
- chore: organize scenario tests [`07cdd04`](https://github.com/dherault/serverless-offline/commit/07cdd042230b268fdc4cc268a381a3795a5ac4e8)
- fix: add handler exception logging [`06d348d`](https://github.com/dherault/serverless-offline/commit/06d348df399b0f6241fca241aa96a637d1b17d46)
- refactor: rename variables [`26f61a4`](https://github.com/dherault/serverless-offline/commit/26f61a439663e28b31b36dc713d8188447d39d95)
- chore: re move unused variable [`1fdcee1`](https://github.com/dherault/serverless-offline/commit/1fdcee13472b85ded83602136c0c2ce14689abf1)
- refactor: simplify return [`04d0ae0`](https://github.com/dherault/serverless-offline/commit/04d0ae0887f4602822a4d46288c3ea0c8b0415c4)
- test: re-activate test [`2fb6e2e`](https://github.com/dherault/serverless-offline/commit/2fb6e2e66067c64bdedf3df4157a06066d8e2e45)

#### [v9.2.5](https://github.com/dherault/serverless-offline/compare/v9.2.4...v9.2.5)

> 18 August 2022

- fix: lambda integration returning object with body [`#1547`](https://github.com/dherault/serverless-offline/pull/1547)
- chore: remove incomplete commented test [`1742545`](https://github.com/dherault/serverless-offline/commit/174254506a38c3fd0e174c0f9e900a5c38d769df)
- chore: fix spelling [`4f6b1e6`](https://github.com/dherault/serverless-offline/commit/4f6b1e6099c23ee6a2378c19f486bdbe84a6775f)

#### [v9.2.4](https://github.com/dherault/serverless-offline/compare/v9.2.3...v9.2.4)

> 17 August 2022

- fix: deprecate use child processes [`#1546`](https://github.com/dherault/serverless-offline/pull/1546)
- refactor: move colors to separate file [`6a32f29`](https://github.com/dherault/serverless-offline/commit/6a32f298ec47e8da0583a0800aca4cedda03f7f6)
- refactor: move colors to config [`2cd3180`](https://github.com/dherault/serverless-offline/commit/2cd31806a0e4d2996eae8bfeb3e1a1bb93ecab27)
- refactor: fix color name, import from utils [`ef17e31`](https://github.com/dherault/serverless-offline/commit/ef17e3177e3fa6f2c38192a522f17ea062cf1536)
- fix: deprecate command option [`6541792`](https://github.com/dherault/serverless-offline/commit/6541792d54b3cf5eded193e957db6b3b90ef81c0)
- doc: deprecate option in README (again) [`abbe74c`](https://github.com/dherault/serverless-offline/commit/abbe74cb78047c2e12dfec6899ea9682480965c2)
- doc: deprecate option in README [`fa213d9`](https://github.com/dherault/serverless-offline/commit/fa213d9fede725b7d4834da253cb742d0f31af95)
- refactor: destructuring order nit [`b44cf07`](https://github.com/dherault/serverless-offline/commit/b44cf07c57a3fe10e47e5e9a0ee762fb281f8aa9)

#### [v9.2.3](https://github.com/dherault/serverless-offline/compare/v9.2.2...v9.2.3)

> 16 August 2022

- fix: [ERR_MISSING_ARGS]: The "message" argument must be specified when using --useChildProcesses [`#1385`](https://github.com/dherault/serverless-offline/pull/1385)
- refactor: use function statements [`d213921`](https://github.com/dherault/serverless-offline/commit/d213921eec04421e9390d0e73b9cc1a12e952443)
- refactor: path.resolve parameter, Part 2 [`48ee32f`](https://github.com/dherault/serverless-offline/commit/48ee32f2979707aa42667e025ef05736bedc2aba)
- refactor: path.resolve parameter [`733dcdf`](https://github.com/dherault/serverless-offline/commit/733dcdf294823ce2dcaf2e120666c0137913e718)
- refactor: remove default parameter [`b657cbf`](https://github.com/dherault/serverless-offline/commit/b657cbf6e8d6cccd4c590bcbf204c793da9b3d66)

#### [v9.2.2](https://github.com/dherault/serverless-offline/compare/v9.2.1...v9.2.2)

> 16 August 2022

- fix: published package content [`#1542`](https://github.com/dherault/serverless-offline/pull/1542)
- chore: bump deps [`f3535e2`](https://github.com/dherault/serverless-offline/commit/f3535e21a3d8284bfc44590544aa73c5aaf180c8)

#### [v9.2.1](https://github.com/dherault/serverless-offline/compare/v9.2.0...v9.2.1)

> 15 August 2022

- fix: region + stage startup log [`#1539`](https://github.com/dherault/serverless-offline/pull/1539)
- chore: bump deps [`fac6d8c`](https://github.com/dherault/serverless-offline/commit/fac6d8cb044429abeaf0b7aeb9ee792b518588d9)
- test: add serverless-express scenario test [`039bddd`](https://github.com/dherault/serverless-offline/commit/039bddd0049a35be7233701825f8c77bbeb60b60)
- chore: bump deps [`f167ba6`](https://github.com/dherault/serverless-offline/commit/f167ba60d75ae55d75a1500ac6b5429b4407bde0)
- refactor: make handler process private [`df0c474`](https://github.com/dherault/serverless-offline/commit/df0c4743b32cca58def9a0d6f52b658908d25652)
- test: add @vendia/serverless-express binary test [`6183eb6`](https://github.com/dherault/serverless-offline/commit/6183eb6505ec5f19180ed2b6e8556c522e8ea515)
- refactor: pass function options [`c1f3c1b`](https://github.com/dherault/serverless-offline/commit/c1f3c1b941a34324e25253794e80876123a11313)
- chore: remove commented code [`d602a6b`](https://github.com/dherault/serverless-offline/commit/d602a6bf3efe147711fa149171d791c26d2d7f71)
- chore: skip vendia serverless express image test [`2089eb0`](https://github.com/dherault/serverless-offline/commit/2089eb06deefbfcf4e690537d3af1d8da347f638)

#### [v9.2.0](https://github.com/dherault/serverless-offline/compare/v9.1.7...v9.2.0)

> 11 August 2022

- feat: use aws-lambda-ric UserFunction.js [`#1534`](https://github.com/dherault/serverless-offline/pull/1534)
- refactor: move splitHandlerPathAndName call to runners [`690325b`](https://github.com/dherault/serverless-offline/commit/690325bb5c68b3813eb9697e4552fd712b291687)
- refactor: in-process constructor [`12ab4c9`](https://github.com/dherault/serverless-offline/commit/12ab4c9512256627eef3f65ebbfbfc7d2c9d174f)
- refactor: use named import [`77f71cc`](https://github.com/dherault/serverless-offline/commit/77f71ccaac3a87c905440a1b51a6c75f1b8bf934)
- chore: remove comented options [`3129908`](https://github.com/dherault/serverless-offline/commit/3129908119ad9eedb2e2935a84e7a1737460bd3c)
- chore: rename file [`11cd6d4`](https://github.com/dherault/serverless-offline/commit/11cd6d4a95a84dbaea3c76873029fe260e7b87ce)

#### [v9.1.7](https://github.com/dherault/serverless-offline/compare/v9.1.6...v9.1.7)

> 8 August 2022

- refactor: declare fields, remove from constructor [`0e82819`](https://github.com/dherault/serverless-offline/commit/0e82819d30a5d101fb9fbe00458bdcc45205983a)
- refactor: declare fields, remove from constructor, part 2 [`364ef2c`](https://github.com/dherault/serverless-offline/commit/364ef2c23a9849ff3a01b9e026333bd0f0f86367)
- refactor: use conditional spread [`5dfe577`](https://github.com/dherault/serverless-offline/commit/5dfe57783c5dbd78050abdf49a009caf9fd1fe00)
- refactor: load certs private method [`33e4e01`](https://github.com/dherault/serverless-offline/commit/33e4e01b38e6cefcdd7b1050561012f1ef815714)
- refactor: https protocol ternary consistency [`2b2a8fa`](https://github.com/dherault/serverless-offline/commit/2b2a8fa8659b7fc728e12f0e634c2771ac7b851c)
- fix: https protocol option default value [`57f7d87`](https://github.com/dherault/serverless-offline/commit/57f7d8742f21997514b502e60cedd62536f4e22a)

#### [v9.1.6](https://github.com/dherault/serverless-offline/compare/v9.1.5...v9.1.6)

> 5 August 2022

- fix: event.resource in catch-all route gets + changed to \* [`#1524`](https://github.com/dherault/serverless-offline/pull/1524)
- fix: tls options [`#1529`](https://github.com/dherault/serverless-offline/pull/1529)
- chore: remove console.log [`692c05f`](https://github.com/dherault/serverless-offline/commit/692c05fd3e617fd83469004b840c8014cdebaa07)

#### [v9.1.5](https://github.com/dherault/serverless-offline/compare/v9.1.4...v9.1.5)

> 4 August 2022

- fix: child processes run mode [`#1527`](https://github.com/dherault/serverless-offline/pull/1527)

#### [v9.1.4](https://github.com/dherault/serverless-offline/compare/v9.1.3...v9.1.4)

> 3 August 2022

- chore: bump deps [`2817bf3`](https://github.com/dherault/serverless-offline/commit/2817bf3bda485cf9d7f01ae15fcff7486bf7118b)
- fix: make @serverless/utils a direct dependency [`83a4885`](https://github.com/dherault/serverless-offline/commit/83a4885187a8358c29a04c976373c81b7137f488)

#### [v9.1.3](https://github.com/dherault/serverless-offline/compare/v9.1.2...v9.1.3)

> 1 August 2022

- chore: bump deps [`bea87eb`](https://github.com/dherault/serverless-offline/commit/bea87eb6fb26232fb181ba3fe0c75fd7ea918174)
- refactor: move create hapi handler into separate function [`45454af`](https://github.com/dherault/serverless-offline/commit/45454aff01b3bc6f51db25c77c454a0fe6f688a6)
- refactor: move register plugins to create server [`5e101a6`](https://github.com/dherault/serverless-offline/commit/5e101a6c6f2003c754bda81ac700a62231da3806)
- fix: change protectedRoutes type from array to string [`38debc6`](https://github.com/dherault/serverless-offline/commit/38debc6cc8344f816f7c404cbcb503c8f0cd35cf)
- refactor: replace arrow functions [`5e3e3d8`](https://github.com/dherault/serverless-offline/commit/5e3e3d83154f1ebf35a0e93e5570dfda135ac964)
- refactor: remove corsAllowCredentials from default options [`26a9567`](https://github.com/dherault/serverless-offline/commit/26a95679074fcecd9c123decbe949264b47088c3)
- refactor: move http server setup to separate function [`6f03251`](https://github.com/dherault/serverless-offline/commit/6f03251105d5c2a4d91ce1abf2b796e609752851)
- refactor: use fs/promises [`7019d28`](https://github.com/dherault/serverless-offline/commit/7019d285034883ca2df8eb7c3327bc15fa0f1119)
- refactor: nit [`739273d`](https://github.com/dherault/serverless-offline/commit/739273de7be49f94915762ecf3ba58aae3b2488c)
- fix: remove unused parameter [`7cd4a5a`](https://github.com/dherault/serverless-offline/commit/7cd4a5acecf2887eaaf6fc398f40a0a20997059f)
- chore: remove commented code [`be2415a`](https://github.com/dherault/serverless-offline/commit/be2415a052a62e152ed900b41244e8ff696ebb21)

#### [v9.1.2](https://github.com/dherault/serverless-offline/compare/v9.1.1...v9.1.2)

> 31 July 2022

- fix: Prevent logging `undefined` for event schedule [`#1520`](https://github.com/dherault/serverless-offline/pull/1520)
- test: move scenario test files to sub-folder [`7ea4892`](https://github.com/dherault/serverless-offline/commit/7ea4892134f7b48641c80fbdd29ed531a6c04130)
- chore: bump deps [`2eddc16`](https://github.com/dherault/serverless-offline/commit/2eddc1600c1d1b203e99a9ac55e11ce43b132d02)
- fix: remove unsupported stageVariables [`4648d39`](https://github.com/dherault/serverless-offline/commit/4648d39837ee76b81cf5adedce0bb05c1e97f9c4)
- refactor: make payload identifier private static [`7d4bf76`](https://github.com/dherault/serverless-offline/commit/7d4bf76039237e4fd9d22a1271dc94c13ad175f2)
- refactor: use Object.hasOwn [`ec1210a`](https://github.com/dherault/serverless-offline/commit/ec1210a327aaaee61a9ca11b9604e411136b29b5)
- refactor: make more payload identifier private static [`07ec960`](https://github.com/dherault/serverless-offline/commit/07ec960d63a513fa1836c70b48624559735b9a40)
- test: move go http test to runtimes [`2a91ad3`](https://github.com/dherault/serverless-offline/commit/2a91ad32026756d322dc768b716ea2f402e0c357)
- refactor: use prototype.includes [`50679e1`](https://github.com/dherault/serverless-offline/commit/50679e1e55200b63096245a7d5319106a08fda77)
- chore(lint): remove allow no-underscore-dangle exception [`840d804`](https://github.com/dherault/serverless-offline/commit/840d804173588ea7b3ebb56b0bf24f56e0314b49)
- refactor: use PAYLOAD_IDENTIFIER [`d6eb227`](https://github.com/dherault/serverless-offline/commit/d6eb227f932ea6b511fd2b9c249bd9351c84feca)
- refactor: simplify, remove else condition [`df77e14`](https://github.com/dherault/serverless-offline/commit/df77e14bb761e8a12af1ac11f19f6b0cf823e37b)

#### [v9.1.1](https://github.com/dherault/serverless-offline/compare/v9.1.0...v9.1.1)

> 29 July 2022

- refactor: replace execaSync with execa (promise) [`#1518`](https://github.com/dherault/serverless-offline/pull/1518)
- fix: worker-runner timout option [`#1515`](https://github.com/dherault/serverless-offline/pull/1515)
- chore: bump deps [`6869d5f`](https://github.com/dherault/serverless-offline/commit/6869d5fc83e2845ca33ceddaf76e58260bbc397f)
- test: move test helpers to test root [`7a32968`](https://github.com/dherault/serverless-offline/commit/7a32968e8218f8cff4f660cc0023b55f02001a3a)
- test: add tests for getRemainingTimeInMillis with worker threads [`3dd2841`](https://github.com/dherault/serverless-offline/commit/3dd2841958a3aaa20e91f65d2ab713032ca9e731)
- doc: add initial section about run modes for node.js handlers [`601a3bc`](https://github.com/dherault/serverless-offline/commit/601a3bc9f3de719f33f79573cd1daa28dc681dc9)
- test: move java tests to runtimes [`86cab33`](https://github.com/dherault/serverless-offline/commit/86cab3361e2f2c89419942dc8e2525957cb8d464)
- doc: nit [`0ca2d26`](https://github.com/dherault/serverless-offline/commit/0ca2d2690f83d4fc8271569c750647c6ae582bbd)
- refactor: nit [`6d82e3e`](https://github.com/dherault/serverless-offline/commit/6d82e3e016420552ce4ff48701d4fdbdefa7035e)
- doc: extend lambda.invoke example [`2afea77`](https://github.com/dherault/serverless-offline/commit/2afea77740cc3e1adc1ecec786433a42a3b07e06)
- refactor: use try/finally [`58698fa`](https://github.com/dherault/serverless-offline/commit/58698fab154f108d913744574745db2706382f2f)
- test: move python tests to runtimes [`61f829d`](https://github.com/dherault/serverless-offline/commit/61f829d246e39a1ef5170f927079e5b0dd528b8c)
- test: fix java tests [`7beb785`](https://github.com/dherault/serverless-offline/commit/7beb785e4c0037c0aff92ac24b0f70b10764abf6)
- test: fix plugin path [`9003a84`](https://github.com/dherault/serverless-offline/commit/9003a84cdc056991fc46b4a534831b670c77d8cb)
- doc: add markdown yml file extension [`ebb0bec`](https://github.com/dherault/serverless-offline/commit/ebb0becc8c78e557173e0f9d3b41538259efb50d)
- doc: add markdown yml file extension [`b1b1328`](https://github.com/dherault/serverless-offline/commit/b1b13287b346a3380f82934cf71dec243033812c)
- test: move go tests to runtimes [`e980164`](https://github.com/dherault/serverless-offline/commit/e980164b76d4e4285d4f7544ed4a72340e7c998d)
- test: move ruby tests to runtimes [`a5ac1c8`](https://github.com/dherault/serverless-offline/commit/a5ac1c855c3836d73811d06b3b04129c53402d74)
- doc: add java to supported runtimes [`1bc0057`](https://github.com/dherault/serverless-offline/commit/1bc0057dd49d457ea0da9f5429bacdea4bf13dba)
- doc: import ApiGatewayManagementApi from aws-sdk [`c250a8c`](https://github.com/dherault/serverless-offline/commit/c250a8cd8f8bbe325a2b2997fdb86f4b2f251b55)
- doc: fix github actions build badge [`2ce2b4c`](https://github.com/dherault/serverless-offline/commit/2ce2b4c0d378576f2c1fd523392fd5a99f3d8d3f)
- fix: use Math.floor() [`f6145d9`](https://github.com/dherault/serverless-offline/commit/f6145d92aa2c55829269861b0b3e40b5d1c52e16)
- doc: import env from node:process [`c4d4a42`](https://github.com/dherault/serverless-offline/commit/c4d4a426b13850a1676aba6c41e22a35d7f42b77)
- doc: remove some comments [`5667f11`](https://github.com/dherault/serverless-offline/commit/5667f11b02e4b61efcc9d5ee8a4a227cc4d62529)
- fix: round getRemainingTimeInMillis to nearest integer [`2106504`](https://github.com/dherault/serverless-offline/commit/21065040f722898e96806d9c4d80eaae7245e938)
- doc: fix versions [`83bc3ba`](https://github.com/dherault/serverless-offline/commit/83bc3ba47fbc986f0d1ca8aaba18e5ae02f516ca)
- test: fix go plugin path [`e7c8a3c`](https://github.com/dherault/serverless-offline/commit/e7c8a3c8ac4e51c4a169bec0973aa5903d2a4951)
- test: remove .only [`c38f292`](https://github.com/dherault/serverless-offline/commit/c38f2928021a2030958ff2e89566b010c64a2cd1)
- doc: fix spelling [`eb23333`](https://github.com/dherault/serverless-offline/commit/eb2333387d6d1fa0f6a14684a618293a2c76bd1f)
- doc: remove whitespace [`dde91f5`](https://github.com/dherault/serverless-offline/commit/dde91f51786be610383a1fdd24fbb45a86240def)
- doc: fix badge link [`ddb1218`](https://github.com/dherault/serverless-offline/commit/ddb1218afb83f260dfde876b2eb177a80d5a9981)
- doc: use IS_OFFLINE env variable in example [`9bd6e95`](https://github.com/dherault/serverless-offline/commit/9bd6e953fef533b26c1e9ce909aa04526c291550)
- doc: process.env.IS_OFFLINE description [`91b8c6b`](https://github.com/dherault/serverless-offline/commit/91b8c6bc0b6df3aa0af228f6dfcc953795b028e1)
- fix: default lambda timeout [`ad217e2`](https://github.com/dherault/serverless-offline/commit/ad217e268315062d338a9cefdc2a584728f5025b)
- refactor: use object shorthand for getRemainingTimeInMillis [`a9078df`](https://github.com/dherault/serverless-offline/commit/a9078df619bbfd79dd325afb38e012ea8001fc5a)
- doc: add missing run modes link [`46ea2b1`](https://github.com/dherault/serverless-offline/commit/46ea2b1d03fd95caf5573b0a2756b085ebb4f599)

#### [v9.1.0](https://github.com/dherault/serverless-offline/compare/v9.0.0...v9.1.0)

> 27 July 2022

- feat: add local environment variables flag [`#1513`](https://github.com/dherault/serverless-offline/pull/1513)
- Fix golang runner failing on `go mod tidy` [`#1505`](https://github.com/dherault/serverless-offline/pull/1505)
- fix: Cleanly exit node process [`#1508`](https://github.com/dherault/serverless-offline/pull/1508)
- chore: bump deps [`2c5c25c`](https://github.com/dherault/serverless-offline/commit/2c5c25c2d5b59c3e3b575ad76376a0aaa268cc20)
- test: remove unmaintained esm module from examples [`d8cfe84`](https://github.com/dherault/serverless-offline/commit/d8cfe84d4f5a1a7d0daab2b03010c657b424eba1)
- test: add esbuild scenario test [`07826c6`](https://github.com/dherault/serverless-offline/commit/07826c6d67acb98c7ebbb69bf4acb72fdca32b3b)
- test: fix serverless-esbuild test naming [`d175d5d`](https://github.com/dherault/serverless-offline/commit/d175d5dce10db35e21a16a893e81cd47bc19e7c0)
- test: refactor integration tests to use URL [`f8262d7`](https://github.com/dherault/serverless-offline/commit/f8262d78f98dda66ef3b9bc0223dc5e51509955d)
- chore: bump deps [`25dc282`](https://github.com/dherault/serverless-offline/commit/25dc2828a3becd1757364d923fba1d1b79abc2ee)
- test: refactor end-to-end tests to use URL [`a116eae`](https://github.com/dherault/serverless-offline/commit/a116eae092a2f153480311ef59c1d245b65399c8)
- test: refactor lambda-run-mode tests to use URL [`b3955b3`](https://github.com/dherault/serverless-offline/commit/b3955b31e7234edcc1798b1adf06abdf3e7a7bfd)
- test: refactor scenario tests to use URL [`3052ef9`](https://github.com/dherault/serverless-offline/commit/3052ef91a333f1d89f9068131db1ec9b4ce2d2c5)
- test: remove npm install [`2082fe0`](https://github.com/dherault/serverless-offline/commit/2082fe0197d833f489dcf90a9b272ee6bf18d9cf)
- fix: remove replay [`d325837`](https://github.com/dherault/serverless-offline/commit/d325837c2e1193c175dae2b3a5958bc4b4a7fa91)
- refactor: remove resolve joins in provider envs [`e459110`](https://github.com/dherault/serverless-offline/commit/e459110b1aa327ea8ac5b7e5d9a47bab708445ca)
- test: use destructuring [`f7ff427`](https://github.com/dherault/serverless-offline/commit/f7ff4272520164e3b1c97ea8a71f8d2caa492232)
- chore: add configValidationMode, order nit [`ebcf562`](https://github.com/dherault/serverless-offline/commit/ebcf562f357acb9a25fbb0ad59381c92d5c58bc6)
- refactor: remove #getEnv [`f6f40fd`](https://github.com/dherault/serverless-offline/commit/f6f40fdf7afecf1cd3e5abe99bd54cc3fa9a1eb3)
- feat: copy all AWS_xxx environment variables from local [`c6d5546`](https://github.com/dherault/serverless-offline/commit/c6d554662625637532bc941ffcaf7e84d30a9f7d)
- doc: order nit [`d1ffb91`](https://github.com/dherault/serverless-offline/commit/d1ffb9191d57192f06cfe9802293fedb32f4ac01)
- test: fix folder names [`d825db6`](https://github.com/dherault/serverless-offline/commit/d825db62c4320998077f2e715c2d0418d031dc70)
- test: skip go test if not detected [`3c1b145`](https://github.com/dherault/serverless-offline/commit/3c1b14534156833c61afd333a048365dca2d410f)
- feat: rename localEnvironmentVariables flag to localEnvironment [`b041577`](https://github.com/dherault/serverless-offline/commit/b041577947bd519dadfa69c32e3deeb3f28e79e9)
- test: remove unused RUN_TEST_AGAINST_AWS env [`21b994a`](https://github.com/dherault/serverless-offline/commit/21b994ac29a48c4adb004285fca6301f29ff72ca)
- chore: fix prettier [`061546b`](https://github.com/dherault/serverless-offline/commit/061546b9acc3a640503963b402dd41a9beed36d6)
- refactor: make handler private field [`fbdb162`](https://github.com/dherault/serverless-offline/commit/fbdb1628c4777ee130e52e5ccddc88c391a29bfb)
- test: remove unused joinUrl function [`e2da574`](https://github.com/dherault/serverless-offline/commit/e2da574cac2211c9b5cfe1dd990e4b935dc98bcb)
- fix: remove duplicate env.IS_OFFLINE variable [`b7f7072`](https://github.com/dherault/serverless-offline/commit/b7f70729a4bf085bcec715d72975d79f53aad2e4)
- refactor: move \_HANDLER to aws env vars [`3c92cd4`](https://github.com/dherault/serverless-offline/commit/3c92cd4bb2dc7460e45d3fb73cea883b3f3c2acd)
- test: remove more duplicate npm install [`b98deb6`](https://github.com/dherault/serverless-offline/commit/b98deb6bab08189af242d40680528360b19fe6e5)
- test: refactor remaining scenario test to use URL [`08818c4`](https://github.com/dherault/serverless-offline/commit/08818c412c0c84d57df7db611f373b0ab345e78c)
- test: remove unused TEST_BASE_URL [`6c7af7d`](https://github.com/dherault/serverless-offline/commit/6c7af7d4e6fe4aedd69050de930603ef561b4f7e)
- test: remove duplicate npm install [`9e3d480`](https://github.com/dherault/serverless-offline/commit/9e3d48096c5d17ebc7322a5b993ced49821d70ab)
- doc: remove whitespace [`73f2922`](https://github.com/dherault/serverless-offline/commit/73f292293f69ae32704f9b2e45feb611310adf13)
- test: remove .only [`a95a29a`](https://github.com/dherault/serverless-offline/commit/a95a29a097d8c1d87fb8e6504d94686d746565f5)
- chore: remove log [`632d269`](https://github.com/dherault/serverless-offline/commit/632d26972e6bbddca946767d3d43549e7a91a684)
- chore: remove comment [`76a60d7`](https://github.com/dherault/serverless-offline/commit/76a60d788067206bc2b5d6aac310b68b6244cf3a)
- fix: env property is always a string [`a226d63`](https://github.com/dherault/serverless-offline/commit/a226d6330dacd8f212f53c7aeea0ebf1d69c5e99)
- fix: change default lambda runtime to nodejs14.x [`1ad9fbd`](https://github.com/dherault/serverless-offline/commit/1ad9fbd90447947578f4fa5b6ae4e5627d75acf1)

### [v9.0.0](https://github.com/dherault/serverless-offline/compare/v8.8.1...v9.0.0)

> 17 July 2022

- test: re-activate websocket tests, add temp workaround [`#1506`](https://github.com/dherault/serverless-offline/pull/1506)
- test: fix docker-in-docker tests [`#1503`](https://github.com/dherault/serverless-offline/pull/1503)
- fix: remove NODE_ENV=test condition [`#1499`](https://github.com/dherault/serverless-offline/pull/1499)
- test: fix docker layers tests [`#1488`](https://github.com/dherault/serverless-offline/pull/1488)
- test: fix docker go tests [`#1484`](https://github.com/dherault/serverless-offline/pull/1484)
- test: fix python tests [`#1495`](https://github.com/dherault/serverless-offline/pull/1495)
- test: fix java/kotlin/groovy/scala tests [`#1494`](https://github.com/dherault/serverless-offline/pull/1494)
- test: fix go tests [`#1493`](https://github.com/dherault/serverless-offline/pull/1493)
- test: fix ruby tests [`#1492`](https://github.com/dherault/serverless-offline/pull/1492)
- test: fix docker serverless webpack tests [`#1490`](https://github.com/dherault/serverless-offline/pull/1490)
- test: fix docker access host tests [`#1489`](https://github.com/dherault/serverless-offline/pull/1489)
- test: fix docker artifact tests [`#1487`](https://github.com/dherault/serverless-offline/pull/1487)
- test: fix docker multiple tests [`#1486`](https://github.com/dherault/serverless-offline/pull/1486)
- test: fix docker node.js tests [`#1485`](https://github.com/dherault/serverless-offline/pull/1485)
- test: fix docker provided tests [`#1483`](https://github.com/dherault/serverless-offline/pull/1483)
- test: fix python docker tests [`#1481`](https://github.com/dherault/serverless-offline/pull/1481)
- refactor: use async unlink [`#1480`](https://github.com/dherault/serverless-offline/pull/1480)
- fix: serverless-offline v8.6 and later unloads all modules when running on Windows, breaking plugins (#1461) [`#1462`](https://github.com/dherault/serverless-offline/pull/1462)
- fix: don't require context (#1471) [`#1472`](https://github.com/dherault/serverless-offline/pull/1472)
- Fix http payload schemas validation [`#1474`](https://github.com/dherault/serverless-offline/pull/1474)
- doc: fix CONTRIBUTING.md for v9 [`#1469`](https://github.com/dherault/serverless-offline/pull/1469)
- doc: fix a typo in README [`#1470`](https://github.com/dherault/serverless-offline/pull/1470)
- feat: add new runtimes [`#1464`](https://github.com/dherault/serverless-offline/pull/1464)
- fix: remove catch binding [`#1459`](https://github.com/dherault/serverless-offline/pull/1459)
- refactor: use async fs/promises [`#1458`](https://github.com/dherault/serverless-offline/pull/1458)
- fix: cleanup [`#1457`](https://github.com/dherault/serverless-offline/pull/1457)
- feat: bump esm-only deps [`#1456`](https://github.com/dherault/serverless-offline/pull/1456)
- feat: remove babel, use esm [`#1455`](https://github.com/dherault/serverless-offline/pull/1455)
- test: refactor to use mocha [`#1453`](https://github.com/dherault/serverless-offline/pull/1453)
- build: set babel target to node.js v14.18 [`#1450`](https://github.com/dherault/serverless-offline/pull/1450)
- refactor: use object.entries [`#1446`](https://github.com/dherault/serverless-offline/pull/1446)
- refactor: use fs/promises [`#1445`](https://github.com/dherault/serverless-offline/pull/1445)
- feat: support serverless v3 [`#1444`](https://github.com/dherault/serverless-offline/pull/1444)
- test: fix scenario settings, deps [`#1443`](https://github.com/dherault/serverless-offline/pull/1443)
- chore: bump @hapi/boom [`#1442`](https://github.com/dherault/serverless-offline/pull/1442)
- chore: bump husky [`#1441`](https://github.com/dherault/serverless-offline/pull/1441)
- chore: bump ws v8+, lint-staged v12+ [`#1439`](https://github.com/dherault/serverless-offline/pull/1439)
- test: revert go/python detection [`#1440`](https://github.com/dherault/serverless-offline/pull/1440)
- chore: bump examples deps [`#1436`](https://github.com/dherault/serverless-offline/pull/1436)
- refactor!: use node: protocol imports [`#1435`](https://github.com/dherault/serverless-offline/pull/1435)
- test: bump jest [`#1434`](https://github.com/dherault/serverless-offline/pull/1434)
- refactor!: use fs/promises [`#1432`](https://github.com/dherault/serverless-offline/pull/1432)
- chore: bump apollo server lambda scenario deps [`#1429`](https://github.com/dherault/serverless-offline/pull/1429)
- test: bump scenario test deps [`#1427`](https://github.com/dherault/serverless-offline/pull/1427)
- test: fix failing tests on node.js v18 [`#1426`](https://github.com/dherault/serverless-offline/pull/1426)
- ci!: remove node.js v12 support, add v18 [`#1424`](https://github.com/dherault/serverless-offline/pull/1424)
- refactor: use private methods [`#1425`](https://github.com/dherault/serverless-offline/pull/1425)
- refactor: use private methods [`#1423`](https://github.com/dherault/serverless-offline/pull/1423)
- build: use @babel/preset-env [`#1422`](https://github.com/dherault/serverless-offline/pull/1422)
- chore: bump examples, scenario tests [`a7ae9e7`](https://github.com/dherault/serverless-offline/commit/a7ae9e7b8c48636c106adadd9b1044bee7c057be)
- chore: bump deps from examples [`95fa4ea`](https://github.com/dherault/serverless-offline/commit/95fa4ea6d485c56f8208f354da71a8cfe38a5b02)
- chore: bump deps [`dc1cfa1`](https://github.com/dherault/serverless-offline/commit/dc1cfa14de139c30a54a65b458c5969fa178fc90)
- chore: bump deps [`97fab46`](https://github.com/dherault/serverless-offline/commit/97fab465c8b66137f7dc2dc6fae27239a4f7b5b9)
- chore: bump luxon (major) [`7e1aef5`](https://github.com/dherault/serverless-offline/commit/7e1aef5601d630b35cc1f4ac034a5ae2b8adf56a)
- chore: bump deps from tests [`f8dd9a4`](https://github.com/dherault/serverless-offline/commit/f8dd9a4e10ac8107c4a65155e5bc13991a0043b4)
- chore: add httpApi example [`2eff5c8`](https://github.com/dherault/serverless-offline/commit/2eff5c8656b1239761bcad69ac31945305cc2d5b)
- feat: remove serverless v2 logging [`404093c`](https://github.com/dherault/serverless-offline/commit/404093c8230ce572b8106ecef16ad52dd43a60b6)
- test: add serverless-http scenario test [`e87bf48`](https://github.com/dherault/serverless-offline/commit/e87bf488397484944a83055de01a84f76b849bb1)
- chore: bump update-modifier (major) [`9646602`](https://github.com/dherault/serverless-offline/commit/96466022431c352099a269b1bdbb5a27f1bfe6a3)
- refactor: use worker threads by default, remove flag, introduce in-process flag [`80091fb`](https://github.com/dherault/serverless-offline/commit/80091fb207335a82461a753e317c452f94e0c0ee)
- test: refactor old unit tests to mocha [`479d006`](https://github.com/dherault/serverless-offline/commit/479d006cc24d8b8d454dcc5cc4bacf890364ec7b)
- chore: bump deps [`d428d35`](https://github.com/dherault/serverless-offline/commit/d428d35564adc94bcc37a913069b0d75e70657f7)
- refactor: import log from @serverless/utils package [`63c7b43`](https://github.com/dherault/serverless-offline/commit/63c7b43c07fc7a3c7b2036dfb071dfe55d9d1e1b)
- refactor: remove update-notifier [`861ad84`](https://github.com/dherault/serverless-offline/commit/861ad840f16467dc1cff3f11c7e13429fe66d4f5)
- chore: bump boxen (major) [`8297ced`](https://github.com/dherault/serverless-offline/commit/8297ced20498b74fff1b7c505c891763ab883071)
- feat: remove even more serverless v2 logging [`677d1b1`](https://github.com/dherault/serverless-offline/commit/677d1b19a8c9c4f17df65ca39ae2197e0621b0b7)
- chore: remove comments [`d1c747f`](https://github.com/dherault/serverless-offline/commit/d1c747f30b5aabcfb0c7de6593af9ca0fb075cfd)
- chore: order props [`acb0817`](https://github.com/dherault/serverless-offline/commit/acb0817571b542e6535b98a60b8625109fa124df)
- chore: props order [`0914e7a`](https://github.com/dherault/serverless-offline/commit/0914e7a85932389e950a6a6c9a88efac5b640a62)
- refactor: remove p-map module [`6d4b1af`](https://github.com/dherault/serverless-offline/commit/6d4b1afe2cf125eedd5caf8b117a2c73c80abc7d)
- test: add in-process runner tests [`bc8bc90`](https://github.com/dherault/serverless-offline/commit/bc8bc90db98048208e414f1607f3c4925974d12a)
- chore: bump deps [`3a7a1aa`](https://github.com/dherault/serverless-offline/commit/3a7a1aa160c38aaaaf35c2655a85b32b2ff25bce)
- test: add worker thread runner tests [`b5559cc`](https://github.com/dherault/serverless-offline/commit/b5559cc4b93d65b00c843113376e3f465cb582bd)
- feat: add 'configValidationMode: error' option [`8de4008`](https://github.com/dherault/serverless-offline/commit/8de400858de54ff9ac64b2eed855094541a2ddf6)
- fix: remove allow cache option [`78fec17`](https://github.com/dherault/serverless-offline/commit/78fec17b787639476f8ddfbdd436a4b6737e3a43)
- test: fix unit tests [`33fa31b`](https://github.com/dherault/serverless-offline/commit/33fa31b36b49746f519fe83875f095aa0a15e79f)
- refactor: replace cuid module with built-in crypto.randomUUID [`2cf6b41`](https://github.com/dherault/serverless-offline/commit/2cf6b41f840f8bc6ae320ff2092cd3bc25271d55)
- chore: bump deps [`0a3a1aa`](https://github.com/dherault/serverless-offline/commit/0a3a1aa8b330820571e460c7ee8fe364283a0852)
- chore: bump deps [`f50fe01`](https://github.com/dherault/serverless-offline/commit/f50fe012f620e4f1380b2c95c908513f33a93c94)
- chore(eslint): fix lines-between-class-members [`466a1e9`](https://github.com/dherault/serverless-offline/commit/466a1e903bbb4df39bd5f972ca151553b0586041)
- feat: add reload handler flag [`f662dc5`](https://github.com/dherault/serverless-offline/commit/f662dc56f3473cd1816c89331bfae96e8e5da715)
- refactor: remove serverless compat check [`21779ff`](https://github.com/dherault/serverless-offline/commit/21779ff59c9f4b321a2fd46519c410380cdcce86)
- chore: bump deps [`aa8ed79`](https://github.com/dherault/serverless-offline/commit/aa8ed794c5545bc1a0adbf449185dabe9196becd)
- test: use global config timeout [`6ceba1c`](https://github.com/dherault/serverless-offline/commit/6ceba1c5fa5d7b823ff10b4284565b28c1f8a963)
- chore: bump deps [`cac991a`](https://github.com/dherault/serverless-offline/commit/cac991acb3533f8f43297382b80448b1c16fa5b2)
- chore: bump deps [`f14291b`](https://github.com/dherault/serverless-offline/commit/f14291b590a85f553664c47aed0f2d4ac35babca)
- chore: bump deps [`b657401`](https://github.com/dherault/serverless-offline/commit/b6574011c433c898a8858d049c5d5edfee05efbe)
- test: fix satisfiesVersionRange tests [`178b484`](https://github.com/dherault/serverless-offline/commit/178b4843714d0b43f1c1f941e3548fdda480bccd)
- chore: bump deps [`f88352a`](https://github.com/dherault/serverless-offline/commit/f88352a9feebcc5a9497cc7152daf028b7493880)
- refactor: use function statements, move into module scope [`4dc34c5`](https://github.com/dherault/serverless-offline/commit/4dc34c57e0d0a62c45f4e656a0f68f343940154f)
- chore: remove unused file [`c94d859`](https://github.com/dherault/serverless-offline/commit/c94d859c3f42bf910a6247c1db7f5749826a94a2)
- chore: bump deps [`32cc7ce`](https://github.com/dherault/serverless-offline/commit/32cc7ce5f87b978adc288ec0822d636860bd2efd)
- fix: remove ruby v2.5 support [`ca85e7e`](https://github.com/dherault/serverless-offline/commit/ca85e7e812eaecbd51da5c90a88410300d176196)
- test(integration): add Python with `module` tests [`5164da6`](https://github.com/dherault/serverless-offline/commit/5164da6f159576faecbe6bb072b4e661306f70ba)
- chore: bump deps [`1547c1c`](https://github.com/dherault/serverless-offline/commit/1547c1c88aaa37572ee9ba0badbe0316b8ecd662)
- refactor: conditionally install node-fetch globally vs. node.js v18+ [`0f2c313`](https://github.com/dherault/serverless-offline/commit/0f2c313752a0f8860a4fe19a9ad6b00e7c3a5157)
- refactor: export internals [`37ff876`](https://github.com/dherault/serverless-offline/commit/37ff876f2f7e33fa6cc9c4e03713486a1092784c)
- chore: bump jsonpath-plus (major), deps [`adc84a8`](https://github.com/dherault/serverless-offline/commit/adc84a8f3a2bf28e1509e01d73ec3e7fa445e9ab)
- chore: bump and fix prettier [`8a4cb01`](https://github.com/dherault/serverless-offline/commit/8a4cb01c237f9112c9d9e51c7bd8cf5b9749f39c)
- feat: add object.hasown shim [`ea0aebf`](https://github.com/dherault/serverless-offline/commit/ea0aebf25548f2e357dd2ae90cdc40e1077b2ac0)
- feat: remove more serverless v2 logging [`6b101aa`](https://github.com/dherault/serverless-offline/commit/6b101aa9c001a75708757beb5796234527ec1a5f)
- chore: bump deps [`c23ec89`](https://github.com/dherault/serverless-offline/commit/c23ec89eb2676b2b0d593ddecf13d155e01e1d23)
- chore: remove unused copyfiles module [`de9a311`](https://github.com/dherault/serverless-offline/commit/de9a311f49c93670708063e814f2a0fab3dc8a90)
- chore: bump deps [`ffa3583`](https://github.com/dherault/serverless-offline/commit/ffa358306dab1b6eb4239323ab357ac7ece791cd)
- fix: \_\_dirname in esm [`0cdf1b9`](https://github.com/dherault/serverless-offline/commit/0cdf1b9096228334af633c4d0772fba3714f2135)
- chore: bump deps [`583a873`](https://github.com/dherault/serverless-offline/commit/583a8738260b7868f1834211cb9a963212a4dd83)
- test: fix config [`884ee7c`](https://github.com/dherault/serverless-offline/commit/884ee7caebfb35ec9e2ad9059a448e28a03ba171)
- test: use mocha hooks [`2217d08`](https://github.com/dherault/serverless-offline/commit/2217d08760331f89cba3a6886d638434549b8f1a)
- test: fix invocations controller tests [`562647e`](https://github.com/dherault/serverless-offline/commit/562647e7095db5ccb01240b67d4a793ee0eb1216)
- refactor: reduce try/catch block [`850ae3e`](https://github.com/dherault/serverless-offline/commit/850ae3e010c65bb2e947cae8a75e8dd8c848f484)
- test: re-write worker thread test [`41131f3`](https://github.com/dherault/serverless-offline/commit/41131f3593fc78efe504b613563b70aab100662c)
- chore: bump deps [`42b43e1`](https://github.com/dherault/serverless-offline/commit/42b43e1e6a1d07e2ab98dbef120fa3a59a8b68d6)
- chore: bump deps [`1cb026d`](https://github.com/dherault/serverless-offline/commit/1cb026d010c7c7c355dc3df9e4edf6b7ccf6cee2)
- chore: bump p-memoize (major) [`7a69a46`](https://github.com/dherault/serverless-offline/commit/7a69a469dc81a40375e8d9929f46e6a08bc0977c)
- refactor(websockets): use async/await [`4377f45`](https://github.com/dherault/serverless-offline/commit/4377f457db6a871850e8152efd432d968ee92cb0)
- chore: bump deps [`2d49958`](https://github.com/dherault/serverless-offline/commit/2d4995852e46f7925c22ac4b53b45291e6d6e0e8)
- chore: bump deps [`5a57b23`](https://github.com/dherault/serverless-offline/commit/5a57b23d1d0204f0c49a3311e664e3805e827d39)
- test: re-write worker thread reload handler test [`b3873e5`](https://github.com/dherault/serverless-offline/commit/b3873e5c7e9be48b4ed26a40ef67fdd517ac2489)
- feat: add 'configValidationMode: error' option, Part 5 [`39d37cb`](https://github.com/dherault/serverless-offline/commit/39d37cb92599cf57f121d31f79fc4b8d73dce6c4)
- chore: nits [`fbc46c7`](https://github.com/dherault/serverless-offline/commit/fbc46c71a4e12cd39bce1d2e8f2f55a9a64e8783)
- test: make offline properties private [`a4b4cf8`](https://github.com/dherault/serverless-offline/commit/a4b4cf809f8727f06dd6cd8cae54ee4d004d8337)
- refactor: simplify [`2943120`](https://github.com/dherault/serverless-offline/commit/2943120e24869a0ee5d63f78bc9fccb3dc911257)
- test: fix plugin path [`d61dcbe`](https://github.com/dherault/serverless-offline/commit/d61dcbee23e615e6e9f86c7d4faaf44f017fc998)
- test: temporary skip websocket authorizer tests [`0591cc3`](https://github.com/dherault/serverless-offline/commit/0591cc36facc206e6378faba3a7acff168e4a52b)
- test: bump node.js runtime [`d2742eb`](https://github.com/dherault/serverless-offline/commit/d2742ebe7d4cb0cbc53e37d691a6d5fd0b5e21d1)
- test: fix uncategorized config [`a488ef3`](https://github.com/dherault/serverless-offline/commit/a488ef3010c9aa9433d68671bd59b4baad750e98)
- feat: add 'configValidationMode: error' option, Part 2 [`3610786`](https://github.com/dherault/serverless-offline/commit/361078698c03f79602d1e1687c263c970bed6c04)
- test: make request builder properties private [`59bd506`](https://github.com/dherault/serverless-offline/commit/59bd5063352e32aad55d67d7d3b7a10d94127edd)
- test: perf, use Promise.all [`8c1a919`](https://github.com/dherault/serverless-offline/commit/8c1a91963ec6cab932800539f927a1c0f9f5d657)
- test: run npm install once per test block [`8925b26`](https://github.com/dherault/serverless-offline/commit/8925b26553a381414ad4c4cb2974059446f044b4)
- refactor: replace printBlankLine [`b82028f`](https://github.com/dherault/serverless-offline/commit/b82028ff822d6cfe8eb8b19812a4a6e398bc0f8c)
- test: fix schema [`23a1f7f`](https://github.com/dherault/serverless-offline/commit/23a1f7fececa66fbba4356563dfa65e9dff4bd58)
- chore: remove unused p-queue module [`34b664e`](https://github.com/dherault/serverless-offline/commit/34b664e5a72c8764375651109d6377b873097056)
- feat: add 'configValidationMode: error' option, Part 3 [`6f3e66b`](https://github.com/dherault/serverless-offline/commit/6f3e66b7e4d12dc1b38dc2a504f133e50f2bd60b)
- feat: display memory leak warning for in-process handlers [`2192a5f`](https://github.com/dherault/serverless-offline/commit/2192a5ff7d856f5354c73160816fadd753ed65d9)
- refactor: use way more Object.entries [`86c5280`](https://github.com/dherault/serverless-offline/commit/86c5280a0d33d45640d1cc915743c881f7dd304e)
- test: pass url directly to websocket [`8ea5a8d`](https://github.com/dherault/serverless-offline/commit/8ea5a8d4ed8e7b881b934772b1ca1d694d00fabd)
- fix: console.log [`d85bb15`](https://github.com/dherault/serverless-offline/commit/d85bb15a212c8febcb1c6ae066864dda21021dcd)
- refactor: remove readfile function [`c417198`](https://github.com/dherault/serverless-offline/commit/c4171987af228a7e7a28666c3ad21c660ac3b783)
- test: fix ruby docker tests [`e05c927`](https://github.com/dherault/serverless-offline/commit/e05c92711edd8722904f2803b8469378270f4c02)
- test: fix more unit tests [`b33ee37`](https://github.com/dherault/serverless-offline/commit/b33ee378d21714dd3d881d0d2a5c8179d5418617)
- chore: bump templates [`e0125b8`](https://github.com/dherault/serverless-offline/commit/e0125b86ab036543f7a39ccbd5e81e2d316644de)
- chore: order nits [`8454923`](https://github.com/dherault/serverless-offline/commit/84549236049dd8f1d5da2e3fd62c44cfb00c30c6)
- chore: rename vars, remove underscore [`bf2053c`](https://github.com/dherault/serverless-offline/commit/bf2053ce5454d00c1edbb27067cc9ceb18dc5756)
- feat: add 'configValidationMode: error' option, Part 4 [`b7e73f2`](https://github.com/dherault/serverless-offline/commit/b7e73f26eff6a69037fa68b91dedfac02ea94ed3)
- chore: order nits [`e86444f`](https://github.com/dherault/serverless-offline/commit/e86444f31eac6790ce7d212d1c2c99a6f12bb491)
- chore: nits [`6f6e93d`](https://github.com/dherault/serverless-offline/commit/6f6e93d906117edcd73015741a2483bd47f42323)
- fix: websocket imports [`eae5400`](https://github.com/dherault/serverless-offline/commit/eae5400bdff7fb5d9121b69e84f83f63370decd6)
- chore: rename more vars, remove underscore [`55dcc78`](https://github.com/dherault/serverless-offline/commit/55dcc78247f14002ee6b631d26039050fb80ce52)
- chore: order nit [`ca37b02`](https://github.com/dherault/serverless-offline/commit/ca37b02aa4ee862f089d6ae2b3e51b0ef9156270)
- test: remove commented config [`b7cf0c8`](https://github.com/dherault/serverless-offline/commit/b7cf0c8929dccee392ac846d34bfd2618d1950ff)
- refactor: use destructuring [`f8c6533`](https://github.com/dherault/serverless-offline/commit/f8c6533143614afd59394dd08947e79323965ef8)
- refactor: remove var [`5f84931`](https://github.com/dherault/serverless-offline/commit/5f84931b4ce98b0f96f523d8c44aa6755a30165d)
- refactor: use Object.entries [`b864a35`](https://github.com/dherault/serverless-offline/commit/b864a356433089c84217e6ae70c6ce1b44f862cb)
- refactor: use Object.entries/.fromEntries [`18c2b41`](https://github.com/dherault/serverless-offline/commit/18c2b41c99f127dd2e7ce26e7141b12b413e5cf6)
- chore: bump deps [`db95dc6`](https://github.com/dherault/serverless-offline/commit/db95dc685cfaa161af080830712d173c459b4668)
- test: fix serverless.yml [`acac5bb`](https://github.com/dherault/serverless-offline/commit/acac5bb8fc3cb9cf92edb11d42992e4d1f70d569)
- test: remove semver checks [`3e55735`](https://github.com/dherault/serverless-offline/commit/3e55735534cdcadaa8421c3ae1b313d44e7f5f40)
- refactor: don't return from constructor [`cf101bd`](https://github.com/dherault/serverless-offline/commit/cf101bd6c4d9f1055bcfedab6aeaa57ff9d13539)
- chore: cleanup [`1f66cba`](https://github.com/dherault/serverless-offline/commit/1f66cba228ed5e9e195213914cc31fc29d90e553)
- test: use .mocharc config file [`6019e8f`](https://github.com/dherault/serverless-offline/commit/6019e8f892b5a476f13f9b6777480d63fbfd3ed7)
- fix: await promise [`d01d3e3`](https://github.com/dherault/serverless-offline/commit/d01d3e3714ddb0eb712af950be17ef1be329f7cc)
- chore: order nit [`b2a320d`](https://github.com/dherault/serverless-offline/commit/b2a320dab055cbbde65ba9189c095a229d350c4f)
- chore: overwrite no-underscore-dangle eslint rule [`f164baa`](https://github.com/dherault/serverless-offline/commit/f164baa4275359430f014c96c52fce14e8ed5813)
- chore: rename even more vars, remove underscore [`db44692`](https://github.com/dherault/serverless-offline/commit/db44692cc87d06f29f2625bd0cc20b8cdb3ec4b9)
- refactor: use Object.entries [`257524c`](https://github.com/dherault/serverless-offline/commit/257524c016bc9d04745f4231ddd74ccabe3eac0d)
- doc: add v8.8.1 changelog [`517329b`](https://github.com/dherault/serverless-offline/commit/517329bccf545aaf31f6793534c8d3321901422e)
- refactor: make method private [`7fa36af`](https://github.com/dherault/serverless-offline/commit/7fa36afaf9199a7fc213f7bf41d42ab6b6ac66de)
- test: more perf, use Promise.all [`aa00d16`](https://github.com/dherault/serverless-offline/commit/aa00d168db726621cb59f645b2446282f91a0856)
- test: quote nit [`a5b5348`](https://github.com/dherault/serverless-offline/commit/a5b5348a4e84a10e2cee97a0e5703a38b5bcd6df)
- refactor: use even more Object.entries [`76582e0`](https://github.com/dherault/serverless-offline/commit/76582e06b72ea0d5c26899f574d8962c7d47d5c6)
- test: rename variable [`084d9e1`](https://github.com/dherault/serverless-offline/commit/084d9e14fe4e3de7a9dd3065ece9b4be392b8aae)
- chore: fix comments [`14fc457`](https://github.com/dherault/serverless-offline/commit/14fc457b6c8f5106ea2840143bbc8333a14a89ea)
- fix: getter/setter map [`e56b190`](https://github.com/dherault/serverless-offline/commit/e56b1906d89ce14e065ed65b06be8904b7c46e9b)
- refactor: simplify [`ac63c36`](https://github.com/dherault/serverless-offline/commit/ac63c36c29def0f899e65aedf46062948b560d06)
- chore: nit [`28b2cfa`](https://github.com/dherault/serverless-offline/commit/28b2cfa16539cd5b024ddc6b6405a08e6ac28682)
- test: fix http-api headers config [`256eddd`](https://github.com/dherault/serverless-offline/commit/256edddeafbda94093b8d042a262b484ec57cbe0)
- test: fix override authorizer config [`f68a350`](https://github.com/dherault/serverless-offline/commit/f68a350081f50c32dd4269bbbf4868767d8cb164)
- test: fix http-api cors default config [`0ceafab`](https://github.com/dherault/serverless-offline/commit/0ceafab222a8b0a1585ade74c196e2eeb33935ab)
- refactor: fix function name [`52e5f98`](https://github.com/dherault/serverless-offline/commit/52e5f985d12de692c3bf21ee13b6992cf5436206)
- refactor: re-use path.resolve kimport [`732d374`](https://github.com/dherault/serverless-offline/commit/732d37455e74e6472fb776db788804e7b47259ea)
- refactor: use a lot more Object.entries [`85361a5`](https://github.com/dherault/serverless-offline/commit/85361a58ce5b6cf6e79ec3a100d2d05b10d664d7)
- chore: remove commented code [`5c74494`](https://github.com/dherault/serverless-offline/commit/5c74494088749369b4ea29d61dc86eef44ea00fa)
- refactor: nit [`5180b25`](https://github.com/dherault/serverless-offline/commit/5180b25c2ab11254c7a7b12758a72de8976d8ae3)
- refactor: simplify condition [`acdf1b9`](https://github.com/dherault/serverless-offline/commit/acdf1b98458ea697f0fdb90b95b8e052d059a74d)
- fix: cli option message [`9e31eb3`](https://github.com/dherault/serverless-offline/commit/9e31eb3d408c2ae3e985152b05a8f885a5a26e75)
- refactor: use named import [`669ebc6`](https://github.com/dherault/serverless-offline/commit/669ebc64aebdca23fec75c973ee3737256901353)
- fix: stringify websocket data [`4b0f110`](https://github.com/dherault/serverless-offline/commit/4b0f110139bf3ba5c6a6d1d2ab232f8f6a6afb9b)
- fix: aws-sdk import [`43ed77e`](https://github.com/dherault/serverless-offline/commit/43ed77e4e62dae013b4a089aa138623cde86ffca)
- test: fix jwt-authorizer config [`b4157a2`](https://github.com/dherault/serverless-offline/commit/b4157a2d4e4cd1108eed42d0d4d9e97e2229bb86)
- test: fix http-api cors config [`36ff8ff`](https://github.com/dherault/serverless-offline/commit/36ff8ff5591d1788f66b6345a8dd229bd406c306)
- test: fix custom auth config [`abc134a`](https://github.com/dherault/serverless-offline/commit/abc134ab2aaccd5d6d9285ebbabcce4acace7352)
- refactor: make cleanupFunctions private [`bb77350`](https://github.com/dherault/serverless-offline/commit/bb7735045de1b6fdcdc97fcf4aa2bddebe9d84c7)
- fix: execa import [`a2c599a`](https://github.com/dherault/serverless-offline/commit/a2c599a3aee508e278bdbeba071475e5599bb18c)
- chore: import order nits [`41ef9bc`](https://github.com/dherault/serverless-offline/commit/41ef9bcde462d6d6e9609d095c09e3b86f642226)
- refactor: use more Object.entries [`c1552e4`](https://github.com/dherault/serverless-offline/commit/c1552e44579d5b9eb857602f3fba9a83198dd92f)
- chore: remove memory leak warning from commands (for now) [`1378284`](https://github.com/dherault/serverless-offline/commit/13782847db5ff748ee49b67f753c92738bce2cda)
- test: fix module path [`85eb3ab`](https://github.com/dherault/serverless-offline/commit/85eb3ab11bc3e420710af436bc54cd0d8f87c531)
- feat: add package.json exports field [`2c263d0`](https://github.com/dherault/serverless-offline/commit/2c263d004dcb6e34338a5130c68bbbb48620e99a)
- test: remove .only [`c652242`](https://github.com/dherault/serverless-offline/commit/c652242fad600145657fe4ced6ab289e181f1172)
- test: remove async [`7d9e87d`](https://github.com/dherault/serverless-offline/commit/7d9e87d3838add98e28ebefcfd375407ec3d9f91)
- test: remove .only [`d101775`](https://github.com/dherault/serverless-offline/commit/d101775ad62d530679bd185cb4f98f7d3a4adc17)
- chore: fix spelling [`0f5a630`](https://github.com/dherault/serverless-offline/commit/0f5a63039b51696ef2bed3f1834a95189296f0d1)
- test: remove .only [`91dcee5`](https://github.com/dherault/serverless-offline/commit/91dcee52ff55cf65f15e47ed193557cd9d932f19)
- test: remove .only [`2dff1be`](https://github.com/dherault/serverless-offline/commit/2dff1be0630e880034b5130f6b79ec1e3d558736)
- chore(lint): fix eslint config [`fda2c3d`](https://github.com/dherault/serverless-offline/commit/fda2c3d57657a7e7740a56f9e5212d990c7726b7)
- fix: package.json files [`79ffb5e`](https://github.com/dherault/serverless-offline/commit/79ffb5e67259acd6f9a2cec03a73b1c1aca3cbeb)
- chore: remove commented code [`b068183`](https://github.com/dherault/serverless-offline/commit/b06818351313bd36ec0ac2ed81ade321febb3c09)
- chore(lint): remove eslint-disable-line [`2a1ee46`](https://github.com/dherault/serverless-offline/commit/2a1ee46779b07e71a792fd6efefb455b27ba1707)
- fix: Increase invocation payload limit to 6 mb [`0e13c8b`](https://github.com/dherault/serverless-offline/commit/0e13c8bec06ad6213ac7450d1feb52f8263cc3b8)
- chore: order nit [`6f2cf91`](https://github.com/dherault/serverless-offline/commit/6f2cf91054fcf17ee94eb6d8c473a3b44a178d5b)
- test: fix description [`b06f32a`](https://github.com/dherault/serverless-offline/commit/b06f32a7d4a7de62bb667ff2b8acd052cb27c025)
- test: fix jwt-authorizer config (again) [`ddca830`](https://github.com/dherault/serverless-offline/commit/ddca830d0e65c41eb277a0f817e00c25ad55524c)
- test: temporary fix configValidationMode [`561fbc1`](https://github.com/dherault/serverless-offline/commit/561fbc103d67fdccceabfc543bd8edfa4970ce19)
- fix: add strict directive [`5d88bc4`](https://github.com/dherault/serverless-offline/commit/5d88bc4e9c5773142a40cb948152ed19a1751875)
- fix: example plugin path [`da60c98`](https://github.com/dherault/serverless-offline/commit/da60c98a1458357f4de0229d02634a01505afd03)
- test: activate more tests [`5b8e4d3`](https://github.com/dherault/serverless-offline/commit/5b8e4d3eab38de4906e6c6cbb8e86fa2c422fde0)
- chore: remove eslint-disable-line [`7c1454b`](https://github.com/dherault/serverless-offline/commit/7c1454b423079e6742cccc00544b062d7537753a)
- refactor: use node: protocol import [`e44182b`](https://github.com/dherault/serverless-offline/commit/e44182bde24707e95285ae03a266d31b994e66ed)
- ci!: remove serverless v1 support [`c812f3b`](https://github.com/dherault/serverless-offline/commit/c812f3b2162e5c9a25b17310d6e0731a7fc0ec76)
- doc: add in-process option [`2ac8f49`](https://github.com/dherault/serverless-offline/commit/2ac8f49eb2c5edbb62328d4203cf745468db7e91)
- doc: remove worker threads option from readme [`a94c553`](https://github.com/dherault/serverless-offline/commit/a94c553abd7a420fd532b44ded3679891c0d37c0)
- chore: remove comment [`fae8a84`](https://github.com/dherault/serverless-offline/commit/fae8a84fbc62524e30facd0e2f7409724bfa6cdb)
- chore: remove unused rimraf module [`a136a58`](https://github.com/dherault/serverless-offline/commit/a136a5863657d3d4feb0f96d82146464b663fa2a)

#### [v8.8.1](https://github.com/dherault/serverless-offline/compare/v8.8.0...v8.8.1)

> 9 July 2022

- refactor: remove update-notifier [`fbcd41e`](https://github.com/dherault/serverless-offline/commit/fbcd41eb29fd5aa60d3ce52a734b89ed4113d893)

#### [v8.8.0](https://github.com/dherault/serverless-offline/compare/v8.7.0...v8.8.0)

> 16 May 2022

- chore: bump deps [`#1420`](https://github.com/dherault/serverless-offline/pull/1420)
- fix: temporary revert nested modules [`#1419`](https://github.com/dherault/serverless-offline/pull/1419)
- fix: lowercase API gateway V2 event headers [`#1288`](https://github.com/dherault/serverless-offline/pull/1288)
- Reduce log level of CORS settings [`#1411`](https://github.com/dherault/serverless-offline/pull/1411)
- refactor: import process explicit [`#1418`](https://github.com/dherault/serverless-offline/pull/1418)
- refactor: remove extend module, replace with Object.assign [`#1417`](https://github.com/dherault/serverless-offline/pull/1417)
- Revert "chore: bump deps" [`#1415`](https://github.com/dherault/serverless-offline/pull/1415)
- chore: bump deps [`#1414`](https://github.com/dherault/serverless-offline/pull/1414)
- doc: remove unused dependency [`#1413`](https://github.com/dherault/serverless-offline/pull/1413)
- doc: remove worker thread version requirement [`#1412`](https://github.com/dherault/serverless-offline/pull/1412)
- fix: remove engine check [`#1407`](https://github.com/dherault/serverless-offline/pull/1407)
- fix: remove (now) useless worker thread support check [`#1406`](https://github.com/dherault/serverless-offline/pull/1406)
- refactor: import from namespace [`#1405`](https://github.com/dherault/serverless-offline/pull/1405)
- update serverless version [`#1404`](https://github.com/dherault/serverless-offline/pull/1404)
- Update serverless version [`#1388`](https://github.com/dherault/serverless-offline/pull/1388)
- feat: Support using go build (#1334) [`#1356`](https://github.com/dherault/serverless-offline/pull/1356)
- Fix websocket authorizers data located in wrong place [`#1360`](https://github.com/dherault/serverless-offline/pull/1360)
- Bugfix [`#1380`](https://github.com/dherault/serverless-offline/pull/1380)
- Revert "Revert "Revert "fixed hanging when python raises exception or return nothing""" [`#1394`](https://github.com/dherault/serverless-offline/pull/1394)
- Revert "Revert "fixed hanging when python raises exception or return nothing"" [`#1393`](https://github.com/dherault/serverless-offline/pull/1393)
- Revert "fixed hanging when python raises exception or return nothing" [`#1392`](https://github.com/dherault/serverless-offline/pull/1392)
- Revert "Reduced duplicated code" [`#1391`](https://github.com/dherault/serverless-offline/pull/1391)
- fixed hanging when python raises exception or return nothing [`#1365`](https://github.com/dherault/serverless-offline/pull/1365)
- Reduced duplicated code [`#1378`](https://github.com/dherault/serverless-offline/pull/1378)
- Improve docs [`#1171`](https://github.com/dherault/serverless-offline/pull/1171)
- fix: remove unneeded deps [`95e1fe5`](https://github.com/dherault/serverless-offline/commit/95e1fe5bbc4aceb83bd8135503c3c4123006d61b)
- chore: bump eslint packages [`2273473`](https://github.com/dherault/serverless-offline/commit/22734738b8f69980c6353492d4b53429befd5837)
- revise the test for python [`2d1972e`](https://github.com/dherault/serverless-offline/commit/2d1972ea08dd88fcc74eb419d10d21eb9cc8d4cc)
- docs: consolidate velocity information in one section [`ae80c9c`](https://github.com/dherault/serverless-offline/commit/ae80c9c3af02b0c31d3ae1df5206b16828fd31be)
- Support catch-all routes with method and path properties [`ebc0c9f`](https://github.com/dherault/serverless-offline/commit/ebc0c9f29e783db4c810de587e61a669b27996ca)
- fixed hanging when python raises execption or return nothing [`f1bc574`](https://github.com/dherault/serverless-offline/commit/f1bc574ba4d5ca657f0beb804eb9f83560c575a3)
- fix lint issues [`3e3c85d`](https://github.com/dherault/serverless-offline/commit/3e3c85dc55084bca9faadb67d41a609cff61fde8)
- ci: bump github actions [`71f92c4`](https://github.com/dherault/serverless-offline/commit/71f92c476d22f74428828a95962a488b892ced72)
- refactor: prettify docs [`2ee5b1e`](https://github.com/dherault/serverless-offline/commit/2ee5b1ef56133aecbc120f2d20858411b30956d3)
- docs: document better usage when combining with other plugins [`3712dfd`](https://github.com/dherault/serverless-offline/commit/3712dfdee2082719170b91ec79edb8eb6247a146)
- fix: remove babel-eslint [`17adeb5`](https://github.com/dherault/serverless-offline/commit/17adeb5b923d990f64e96e234297999baaca30a0)
- Enable support for cron schedules [`0a19335`](https://github.com/dherault/serverless-offline/commit/0a193359d96b57d1b9b8c110e4ddd44478e4f56b)
- docs: consolidates authorizers info under a single section [`4edcae6`](https://github.com/dherault/serverless-offline/commit/4edcae6eb6992e8688fc9939ff081e1fff94dbc6)
- Add .vscode [`2c7e01b`](https://github.com/dherault/serverless-offline/commit/2c7e01b15bd8e020ff253692be12140ac3ed7aee)
- chore(eslint): no-promise-executor-return [`64ec6ba`](https://github.com/dherault/serverless-offline/commit/64ec6ba90e7745b37f99c94759faf5788b8f97bf)
- chore(eslint): fix default-param-last [`4d7e1b5`](https://github.com/dherault/serverless-offline/commit/4d7e1b57fbc02d34b636120e4572d43c1416a758)
- fix: solve merge issues [`99a2578`](https://github.com/dherault/serverless-offline/commit/99a25789ce6d4be718dcae470e99bde5f3ab8b86)
- test: temporary skip tests [`26bb93f`](https://github.com/dherault/serverless-offline/commit/26bb93ffde48ead1a3337248af7c727f8c958603)
- docs: remove webpack section since it's covered in other plugins [`9844ae0`](https://github.com/dherault/serverless-offline/commit/9844ae09b44d845d926611e9476044a723a51ad2)
- docs: remove "Scoped execution" section from docs. [`cacce44`](https://github.com/dherault/serverless-offline/commit/cacce44b9ff7d934b154f1fd3b53792d7009fd16)
- chore: remove prettier default, add test folder to gitignore [`6380b6d`](https://github.com/dherault/serverless-offline/commit/6380b6d9437008c2fbfc077f2ebc861af42d6fa8)
- chore(eslint): turn off import/no-relative-packages [`ac671f9`](https://github.com/dherault/serverless-offline/commit/ac671f90ea1d381e547ec115f6bbf2bca5c7ccb0)
- Add support for nodejs16.x [`3c68146`](https://github.com/dherault/serverless-offline/commit/3c681465101dc83f056dd0e09c1f2ee4106b93fb)

#### [v8.7.0](https://github.com/dherault/serverless-offline/compare/v8.6.0...v8.7.0)

> 13 April 2022

- Add support for the AUTHORIZER env variable for LambdaIntegration [`#1308`](https://github.com/dherault/serverless-offline/pull/1308)
- Validate authorizer context response to better mimic API Gateway (resubmit) [`#1376`](https://github.com/dherault/serverless-offline/pull/1376)
- Added support for the AUTHORIZER env variable for LambdaIntegration (non-proxy) http requests [`#816`](https://github.com/dherault/serverless-offline/issues/816)
- validate authorizer context response to better mimic api gateway [`0e786f3`](https://github.com/dherault/serverless-offline/commit/0e786f3e4f48acc6b0209be308446f2303ba2fd6)
- Update CHANGELOG [`d29e7e6`](https://github.com/dherault/serverless-offline/commit/d29e7e605dd86431b7e475e700d641cba3c048c5)
- Fixed authorizer scope [`059e061`](https://github.com/dherault/serverless-offline/commit/059e061d94f36231facfdd0d8b599a2471b6be3c)

#### [v8.6.0](https://github.com/dherault/serverless-offline/compare/v8.5.0...v8.6.0)

> 13 April 2022

- chore: remove unused portfinder dependency [`#1368`](https://github.com/dherault/serverless-offline/pull/1368)
- docs: fix minor typo [`#1361`](https://github.com/dherault/serverless-offline/pull/1361)
- fix: Support handlers exported from nested modules [`#1348`](https://github.com/dherault/serverless-offline/pull/1348)
- fix: Do not pass `allowCache` to `java-invoke-local` server [`#1349`](https://github.com/dherault/serverless-offline/pull/1349)
- feat: Support `websockets` authorizers [`#1350`](https://github.com/dherault/serverless-offline/pull/1350)
- fix: Don't override Ruby `stdout` with `stderr` [`#1336`](https://github.com/dherault/serverless-offline/pull/1336)
- Add package-lock.json [`6db368c`](https://github.com/dherault/serverless-offline/commit/6db368c2a7b0b1bd83d3a550b5df02e999910539)
- update debugging instructions [`977798d`](https://github.com/dherault/serverless-offline/commit/977798de2e283a3c5488996768a941aa39ee3574)
- chore: Bump dependencies [`dc510b3`](https://github.com/dherault/serverless-offline/commit/dc510b3eec4567aa4d1558b6218cc7a40c297031)
- Add functionsUpdated entrypoint command [`31af8f2`](https://github.com/dherault/serverless-offline/commit/31af8f2462a2d7d4bbb6715cc81a648d6d1bf7ad)
- Adding support for not unloading binary modules [`52d1efd`](https://github.com/dherault/serverless-offline/commit/52d1efde9810ffcc929e045737f54ac7a6da1ba9)
- fix: Handle multiple cookies with the same name in the same way API Gateway does. [`bcddae5`](https://github.com/dherault/serverless-offline/commit/bcddae5f00132c926869077032d5ff329369ac25)
- Revert "linux only: fall back to host networking if gateway IP not found" [`d84647b`](https://github.com/dherault/serverless-offline/commit/d84647b5f134a9278895b2c6333eb082b14435b9)
- linux only: fall back to host networking if gateway IP not found [`01c9f97`](https://github.com/dherault/serverless-offline/commit/01c9f97a6382381a5fca03a042618f28da9957a1)
- ci: Enforce printing offline output for debugging [`6462373`](https://github.com/dherault/serverless-offline/commit/6462373ac5b570a9c91b2d85b9fab473265d5f4c)
- Ensure gateway IP is truthy before adding to the command [`9bfb208`](https://github.com/dherault/serverless-offline/commit/9bfb2081d520aed0a4944c153534d0bc8448d165)
- Never removed cached node_modules [`b4bed3e`](https://github.com/dherault/serverless-offline/commit/b4bed3e4e51fd07699549d19d702528acf4b7f7e)
- Implement style guide [`84c0bf8`](https://github.com/dherault/serverless-offline/commit/84c0bf82a8259f28a8efaf584ca66bd7fbdeeeed)
- Fixing AWS env vars [`92b2fff`](https://github.com/dherault/serverless-offline/commit/92b2fff80f79b0a1c9a9e1b689fcc25625cea301)

#### [v8.5.0](https://github.com/dherault/serverless-offline/compare/v8.4.0...v8.5.0)

> 18 February 2022

- fix: Skip clearing undefined modules in `InProcessRunner` [`#1339`](https://github.com/dherault/serverless-offline/pull/1339)
- feat: Ensure `websocket` parity with API Gateway [`#1301`](https://github.com/dherault/serverless-offline/pull/1301)
- fix: Fix payload normalization [`#1332`](https://github.com/dherault/serverless-offline/pull/1332)
- feat: Support injection of custom authentication strategy [`#1314`](https://github.com/dherault/serverless-offline/pull/1314)
- feat: Introduce header to override authorizer response [`#1328`](https://github.com/dherault/serverless-offline/pull/1328)
- feat: Add `httpEvent.operationId` to the request context [`#1325`](https://github.com/dherault/serverless-offline/pull/1325)
- chore: Release v8.5.0 [`0f7ec23`](https://github.com/dherault/serverless-offline/commit/0f7ec23c0995efc9a74928ce40194cf6b06a6c66)
- chore: Bump dependencies [`94ae582`](https://github.com/dherault/serverless-offline/commit/94ae582dc3ed9dd4f2cee2dfffbfb1df1404081d)

#### [v8.4.0](https://github.com/dherault/serverless-offline/compare/v8.3.1...v8.4.0)

> 28 January 2022

- feat: go-runner implementation [`#1320`](https://github.com/dherault/serverless-offline/pull/1320)
- fix: Handle custom authorizer 401 in non in-process runners [`#1319`](https://github.com/dherault/serverless-offline/pull/1319)
- fix: Support `httpApi` payload override on function level [`#1312`](https://github.com/dherault/serverless-offline/pull/1312)
- chore: Setup auto CHANGELOG generation [`7092f3f`](https://github.com/dherault/serverless-offline/commit/7092f3f570a31195a1901fae7841d374a1323773)
- chore: Bump dependencies [`aef1cc7`](https://github.com/dherault/serverless-offline/commit/aef1cc7f241d4251c26c3c6be2b90af6c2f608f4)
- chore: Release v8.4.0 [`5df70c8`](https://github.com/dherault/serverless-offline/commit/5df70c8043ca59f34bf8c7c58670254fa68a83fc)
- Add command line option for disabling scheduled events. [`4503567`](https://github.com/dherault/serverless-offline/commit/4503567cdb8fa31ac9df98b667a403b0408f8444)
- Add missing command type for disableScheduledEvents [`15916f3`](https://github.com/dherault/serverless-offline/commit/15916f3b1120427688b1ab3213b90396c0962434)

#### [v8.3.1](https://github.com/dherault/serverless-offline/compare/v8.3.0...v8.3.1)

> 25 November 2021

- fix: Fix handling of modern logs [`a1d27b5`](https://github.com/dherault/serverless-offline/commit/a1d27b54aa9f0ea7be74d846a0cd31cdc7bb57d8)
- chore: Bump dependencies [`b41466a`](https://github.com/dherault/serverless-offline/commit/b41466aca816703a36077f166b19f4dec337fd87)
- chore: Release v8.3.1 [`4c879bf`](https://github.com/dherault/serverless-offline/commit/4c879bf44b3db9953df9b52da083bfac2cd98a59)
- chore: Mark as v3 ready [`7c47e8a`](https://github.com/dherault/serverless-offline/commit/7c47e8abd09c486b9b63dc94d3c62c245fc130b8)
- refactor: Fix log typo [`2ac804b`](https://github.com/dherault/serverless-offline/commit/2ac804b81d2e155b6dd8453291c67437ae66357e)

#### [v8.3.0](https://github.com/dherault/serverless-offline/compare/v8.2.0...v8.3.0)

> 19 November 2021

- chore: Update package-lock.json [`ddb2734`](https://github.com/dherault/serverless-offline/commit/ddb273491b9b409ba1b9bca14e1abd11c537f14b)
- chore: Remove `package-lock.json` [`2ce260f`](https://github.com/dherault/serverless-offline/commit/2ce260fad7a6d2b19eb189ff50793c0c623ca281)
- chore: Upgrade `serverless` [`a70e012`](https://github.com/dherault/serverless-offline/commit/a70e012b804ccd1613ba18cfb4482e1d6b6b7865)
- refactor: Moder logs for `logRoutes` [`8982df9`](https://github.com/dherault/serverless-offline/commit/8982df972d7a3996d713e39b5cb1435820d0c1be)
- style: Prettify [`033f2f6`](https://github.com/dherault/serverless-offline/commit/033f2f60eaa67b74f3d0ad44dcd78a9ceecb94b0)
- refactor: Modern logs for debug logs [`7179f84`](https://github.com/dherault/serverless-offline/commit/7179f84b8f7234af6e028e46c9c5909135b8a2b6)
- ci: New CI setup based on GitHub Actions [`197ef78`](https://github.com/dherault/serverless-offline/commit/197ef7858320f904a923511938b81d0cb10ea1cb)
- refactor: Refactor `console.log` to modern logs [`f057b49`](https://github.com/dherault/serverless-offline/commit/f057b495bf9f29d11e3e425dfecc427e2189426b)
- refactor: Modern logs for `logLayers` [`3894ae8`](https://github.com/dherault/serverless-offline/commit/3894ae8f8a9d28cbd8c7de223bae23a0f0a33227)
- refactor: Configure modern warning logs [`9b6238e`](https://github.com/dherault/serverless-offline/commit/9b6238e5c70ec9472eb3e10619809663344182b8)
- refactor: Refactor `console.error` logs to modern logs [`81a81a1`](https://github.com/dherault/serverless-offline/commit/81a81a102b03921a10cca9d8cade84fb3aff953a)
- chore: Bump dependencies [`cb50910`](https://github.com/dherault/serverless-offline/commit/cb50910a35355950f5c73fc9e801fc714c700a9a)
- chore: Improve pre-commit hook configuration [`3b28536`](https://github.com/dherault/serverless-offline/commit/3b28536849af1ca061f197f053bd49a11f6a3760)
- test: Ensure to stop immediatelly on offline start failure [`b22ebd8`](https://github.com/dherault/serverless-offline/commit/b22ebd8a829ab79b5d3cfbe943aabe1ae7128ed2)
- refactor: Adapt v3 log writing interfaces [`f39f3b1`](https://github.com/dherault/serverless-offline/commit/f39f3b1668d3ad64fa4269807e0f609fbbde4c96)
- fix: Do not validate compatibility against serverless pre-releases [`8c7afb3`](https://github.com/dherault/serverless-offline/commit/8c7afb3b15e0ec9f7cf807aff45f19efc00d003e)
- test: Option to unconditionally print underlying output [`6497b44`](https://github.com/dherault/serverless-offline/commit/6497b44ab47291acac4b940e9a9d2f796fd32582)
- chore: Alphabetical order of scripts [`e4eeb90`](https://github.com/dherault/serverless-offline/commit/e4eeb906fe412777f524b923d9d1232401188a2e)
- style: Fix lint issues [`b051321`](https://github.com/dherault/serverless-offline/commit/b0513218b6d41e637e31bd14e846870081576199)
- chore: Release v8.3.0 [`911c336`](https://github.com/dherault/serverless-offline/commit/911c336815d895bb5f0c6aefc804523a8f6bb654)

#### [v8.2.0](https://github.com/dherault/serverless-offline/compare/v8.1.0...v8.2.0)

> 14 September 2021

- docs: Update README.md [`#1260`](https://github.com/dherault/serverless-offline/pull/1260)
- fix: Ensure support for array-based schedule event rates [`#1276`](https://github.com/dherault/serverless-offline/pull/1276)
- fix: Wrap native string responses from lambda invocation endpoint [`3bd294b`](https://github.com/dherault/serverless-offline/commit/3bd294bc3d6c114ebd76679c0c373d83a1eaaac8)
- chore: Release v8.2.0 [`b7f216e`](https://github.com/dherault/serverless-offline/commit/b7f216ea5f93c3a7b38e555ef3b1089b435335cf)

#### [v8.1.0](https://github.com/dherault/serverless-offline/compare/v8.0.0...v8.1.0)

> 6 September 2021

- feat: Add support for Python 3.9 runtime [`#1267`](https://github.com/dherault/serverless-offline/pull/1267)
- chore: Release v8.1.0 [`77b3659`](https://github.com/dherault/serverless-offline/commit/77b3659f6d72fdcd23bdb23e1cfb082b008836d2)

### [v8.0.0](https://github.com/dherault/serverless-offline/compare/v7.1.0...v8.0.0)

> 28 July 2021

- feat: Update `hapi` version to support Node 16 and drop Node 10 [`#1235`](https://github.com/dherault/serverless-offline/pull/1235)
- chore: Release v8.0.0 [`6eb15d7`](https://github.com/dherault/serverless-offline/commit/6eb15d78379b37ce1793c1a53c12fa31e435a042)

#### [v7.1.0](https://github.com/dherault/serverless-offline/compare/v7.0.0...v7.1.0)

> 28 July 2021

- fix: Remove multiplication of `this.#timeout` by 1000 [`#1177`](https://github.com/dherault/serverless-offline/pull/1177)
- feat: Support Ruby handlers with `::` in path definition [`#1218`](https://github.com/dherault/serverless-offline/pull/1218)
- Add '--noStripTrailingSlashInUrl' option [`#1178`](https://github.com/dherault/serverless-offline/pull/1178)
- fix: Child processes are cleaned up when `useChildProcesses` is used [`3fb5b69`](https://github.com/dherault/serverless-offline/commit/3fb5b696cd7b7055a11f90f7d9b5fc9b4913bffd)
- chore: Release 7.1.0 [`60d034b`](https://github.com/dherault/serverless-offline/commit/60d034bd79e8f5df755959111d70e19ca15e7067)

### [v7.0.0](https://github.com/dherault/serverless-offline/compare/v6.9.0...v7.0.0)

> 29 April 2021

- Fix docker engine v20.10.6 compatibility [`#1217`](https://github.com/dherault/serverless-offline/pull/1217)
- test: Fix http cors integration test URL paths [`#1216`](https://github.com/dherault/serverless-offline/pull/1216)
- Fix: Log ruby stdout to console [`#1214`](https://github.com/dherault/serverless-offline/pull/1214)
- refactor: add types to cli command options [`#1205`](https://github.com/dherault/serverless-offline/pull/1205)
- Add support for HttpApi cors configuration [`f6447c4`](https://github.com/dherault/serverless-offline/commit/f6447c438fd672f22ca424b512c56d2d87266740)
- Fixed integration issues with HttpApi (event payload, stage, $default route and CORS) [`0d5f55d`](https://github.com/dherault/serverless-offline/commit/0d5f55d5c24c10937fea2bb27a826e412f33cb81)
- Prettier [`77d5f23`](https://github.com/dherault/serverless-offline/commit/77d5f23e8ecc8e4a816b31bbe0e81dea34c760c2)
- Reverted changes to CORS in favor of #1153 [`229894a`](https://github.com/dherault/serverless-offline/commit/229894a5c1af42ffe27396b17b37485f3bef822e)
- Remove stage prefix from tests [`4f1baee`](https://github.com/dherault/serverless-offline/commit/4f1baeeddfcc7b046c8406e3a36947d16f480536)
- Path should be obtained from requested URL path, not the route - route info is now available in routeKey [`5ce8f87`](https://github.com/dherault/serverless-offline/commit/5ce8f873ba8d729451b6c41ba824302dc55d8544)
- Consistently apply stage [`7d57dfc`](https://github.com/dherault/serverless-offline/commit/7d57dfcef9c3c95c7f8e0ccac666fc6eb8fec224)
- Fix bug where ruby stdout not printed to console [`6dae515`](https://github.com/dherault/serverless-offline/commit/6dae51540f17afa3536097970b1d1340392c5b2e)
- Ensure 2.0 payload is used by default [`80091f4`](https://github.com/dherault/serverless-offline/commit/80091f42665843f15e22bb92b629265f51cb1fa9)
- Remove line causing broken build [`645aa3d`](https://github.com/dherault/serverless-offline/commit/645aa3d8d12c1af80ad7ffaaeb0f7b863bf60c12)
- Add temporisation to start [`985a8cd`](https://github.com/dherault/serverless-offline/commit/985a8cd2f0c787630474b69c4b32da607fa9c5f4)
- chore: Release 7.0.0 [`0a5ded7`](https://github.com/dherault/serverless-offline/commit/0a5ded72ac1a668e9f7a91246a6fd62658d09b88)
- Merge pull request #1175 from apancutt/master [`5f29fe3`](https://github.com/dherault/serverless-offline/commit/5f29fe35c83b2ac743b033b6a9fe97855a80db50)
- Merge pull request #1153 from Ahana-Inc/http-api-cors [`6d9a573`](https://github.com/dherault/serverless-offline/commit/6d9a573d1f85200893791468cd2526008bb810d5)
- fix plugin path [`bdd41d3`](https://github.com/dherault/serverless-offline/commit/bdd41d33335db0454306b5f2855a0fd8b8410abe)
- chore: Improve Framework dependency version range [`58dc8ae`](https://github.com/dherault/serverless-offline/commit/58dc8ae19c0f1ce8ef95912a890cbaf3266c58ba)
- Remove unused import [`5ff639d`](https://github.com/dherault/serverless-offline/commit/5ff639db771e3b3a3963016af7681559525319ac)

#### [v6.9.0](https://github.com/dherault/serverless-offline/compare/v6.8.0...v6.9.0)

> 26 March 2021

- chore: Release v6.9.0 [`#1200`](https://github.com/dherault/serverless-offline/pull/1200)
- Use .includes within a safe array variable "validAudiences" [`#1165`](https://github.com/dherault/serverless-offline/pull/1165)
- feature: add support for nodejs14.x [`#1170`](https://github.com/dherault/serverless-offline/pull/1170)
- Docker options for running Docker Lambda within a Docker container [`#1164`](https://github.com/dherault/serverless-offline/pull/1164)
- Update billing to nearest ms [`#1155`](https://github.com/dherault/serverless-offline/pull/1155)
- Fix #1035 - Add apiKeyId to identity information [`#1169`](https://github.com/dherault/serverless-offline/pull/1169)
- chore: rebuild lockfile to update deps and patch vulnerabilities [`#1167`](https://github.com/dherault/serverless-offline/pull/1167)
- Migrate from Travis-CI to GitHub actions [`#1168`](https://github.com/dherault/serverless-offline/pull/1168)
- Get event.resource by removing stage from route.path [`#1142`](https://github.com/dherault/serverless-offline/pull/1142)
- Lambda-Event-Path-and-Resource-Sync [`#1137`](https://github.com/dherault/serverless-offline/pull/1137)
- Jwt audience validation [`#1116`](https://github.com/dherault/serverless-offline/pull/1116)
- chore(deps): upgrade development dependencies and node-fetch for vulnerability [`#1103`](https://github.com/dherault/serverless-offline/pull/1103)
- Fix jwt authorizers payload v2 [`#1109`](https://github.com/dherault/serverless-offline/pull/1109)
- Merge pull request #1169 from jeroenvollenbrock/patch-1 [`#1035`](https://github.com/dherault/serverless-offline/issues/1035)
- Fix #1035 - Add apiKeyId to identity information [`#1035`](https://github.com/dherault/serverless-offline/issues/1035)
- chore: upgrade test deps, remove test lockfiles, add fsevents resolv for webpack [`db07181`](https://github.com/dherault/serverless-offline/commit/db071813caeda32d2f137fdafb756dad7773c3bb)
- fix: scenario based tests need the lockfiles [`67ca325`](https://github.com/dherault/serverless-offline/commit/67ca3254f84956bf757b1f9ddadd59c987ac0cab)
- chore: upgrade scenario test dependencies [`f90d2e1`](https://github.com/dherault/serverless-offline/commit/f90d2e14fee53c1629e04a2b7a5e13ebab901d0d)
- Add test for docker-in-docker [`5c142da`](https://github.com/dherault/serverless-offline/commit/5c142daa49680027e089f2e807faa8003407cb5a)
- chore(deps): upgrade development dependencies and node-fetch for vulnerability [`9b60fd0`](https://github.com/dherault/serverless-offline/commit/9b60fd0260228e48c36d741c76b0e6a4287504d1)
- chore: update example dependencies to latest [`68dd110`](https://github.com/dherault/serverless-offline/commit/68dd110f95c384fdf3aecd8d72e45aaee33d7bef)
- chore: update dependencies [`b80580a`](https://github.com/dherault/serverless-offline/commit/b80580ae9b7122bcfc2e91b8d3ac251fe658d94c)
- chore: re-update lockfile [`e983ec9`](https://github.com/dherault/serverless-offline/commit/e983ec90741bbfc0a5744998c095f9696dacd76c)
- Migrate from Travis CI to GitHub Actions [`ca12f75`](https://github.com/dherault/serverless-offline/commit/ca12f751d7de2e39c79d99aa031d4ad559f029c5)
- chore: bump `fs-extra` to avoid windows test failures due to fsevents [`ff5c4e5`](https://github.com/dherault/serverless-offline/commit/ff5c4e5edd915debc022ce10132e750ecd09713a)
- Docker options docs [`c7c659f`](https://github.com/dherault/serverless-offline/commit/c7c659f6bc09b69cd7433456d5c32bb907a44e65)
- dynamic port binding for Docker runner [`d5c9b99`](https://github.com/dherault/serverless-offline/commit/d5c9b9930653d20bec881df89c0adf27570878c7)
- handle array-based jwt audience data [`82a9dc6`](https://github.com/dherault/serverless-offline/commit/82a9dc6b5e2e3afa174443f93bfd6f3952fff5eb)
- Remove unused code [`9ca993a`](https://github.com/dherault/serverless-offline/commit/9ca993abab2db13cd8395aa1e81445991fe5e03e)
- array audience in jwt authorizer test [`fec147a`](https://github.com/dherault/serverless-offline/commit/fec147ae2da065aad4f78758976f703724734516)
- dockerHost feature [`d29f80c`](https://github.com/dherault/serverless-offline/commit/d29f80c1721ce316b7c4239adee4aae0dd2ddb29)
- Fix layer dir for docker container [`6e532ce`](https://github.com/dherault/serverless-offline/commit/6e532ce4dda7cc98cd92665905dad516463777ff)
- Refactor docker container port [`9b6cd6b`](https://github.com/dherault/serverless-offline/commit/9b6cd6bdff57f8beffd55c5f2c6b9893bc204f26)
- Resolve prettier issues [`a5ef191`](https://github.com/dherault/serverless-offline/commit/a5ef1913a18121734918c5a1331ca66bd014be0e)
- Remove principalId [`acd35a2`](https://github.com/dherault/serverless-offline/commit/acd35a2ecaa3c760c5bbd422df253da18486626b)
- Added dockerNetwork option [`5566ef2`](https://github.com/dherault/serverless-offline/commit/5566ef22e6789bca56a15a1b67b95c10c2e52399)
- dockerHostServicePath param [`43dd282`](https://github.com/dherault/serverless-offline/commit/43dd2826205c435a8af106798dcc69e283b0b967)
- Add unsupported runtime handling for docker-runner [`7fdd795`](https://github.com/dherault/serverless-offline/commit/7fdd79532a99110a9e98cf4ffaa2bd08c65d1d55)
- Fix code dir for docker container [`2b164e5`](https://github.com/dherault/serverless-offline/commit/2b164e5d2f2758444037373c7c22b3150053013c)
- Whitespace fixes [`854e45e`](https://github.com/dherault/serverless-offline/commit/854e45e90d509c1a5947dfa9e99c2b629aafe7db)
- eslint fix [`1c0b7db`](https://github.com/dherault/serverless-offline/commit/1c0b7dbb41bac71132fc44adc4a60d07f012b09f)
- Code style [`7cbb54e`](https://github.com/dherault/serverless-offline/commit/7cbb54e67a7b006c77fd7f734b6103a37da437bb)
- Move lamda dir into service path [`c9340d0`](https://github.com/dherault/serverless-offline/commit/c9340d04447d86c79c510d6aa12b511bc5083c5c)
- sync jwt authorizer error message with tests [`4e9fa6d`](https://github.com/dherault/serverless-offline/commit/4e9fa6dcc24dac2044afff695e20a9a7aeff4ff4)
- Nest claims and scopes correctly [`086a67c`](https://github.com/dherault/serverless-offline/commit/086a67c0d11172cdb1a7eb28dd1f4ac0ebb3de54)
- Overwrite codeDir with hostServicePath only if function is not published from an artifact [`8b5352a`](https://github.com/dherault/serverless-offline/commit/8b5352af298ec0318fd6c243d48e612f14c1afff)
- Restore image pull on start [`c44de53`](https://github.com/dherault/serverless-offline/commit/c44de5325f565fcb01478592179a0edf01bac0d8)
- Fix artifact extracting [`7421725`](https://github.com/dherault/serverless-offline/commit/74217253628083d3031750fd7d5b53361173522f)
- Remove redundant var [`a983dd8`](https://github.com/dherault/serverless-offline/commit/a983dd868cfb9ae991d730f572d8f943baa1c0b7)
- eslint fix [`609c92c`](https://github.com/dherault/serverless-offline/commit/609c92cbced436bd2d6ae1809fa3de30b35f68e7)
- Use .includes within a safe array validAudiences [`726f756`](https://github.com/dherault/serverless-offline/commit/726f7565412faa5e77c6d545ac182c0553dc9a44)
- Fix typo [`9bbbb4e`](https://github.com/dherault/serverless-offline/commit/9bbbb4e657518335e4f32600514bbaf1ef365bdc)
- Enable docker watch mode [`d892ce2`](https://github.com/dherault/serverless-offline/commit/d892ce25a8179a82e9ce4023b2375b7b6f4937a4)
- Changed LambdaProxyIntegrationEvent resource to this.#path - effectively removing the stage variable from resource [`316fefe`](https://github.com/dherault/serverless-offline/commit/316fefed9d1c65ddee99c7aaf140c1409d7a0992)
- fix: end of line format for windows https://github.com/prettier/prettier/issues/7825 [`72dbbad`](https://github.com/dherault/serverless-offline/commit/72dbbad545967d31157b71bc7c2e5a6b9b3aa3fd)
- chore: run linting and formatting [`e1110ea`](https://github.com/dherault/serverless-offline/commit/e1110eaac5d4ea09196f9d09af4b63e35206ba17)
- Add SLS_API_KEY_ID env var to readme [`e212a7a`](https://github.com/dherault/serverless-offline/commit/e212a7a70f96f02eafe3a54e3ec466e8a3ddf7e9)

#### [v6.8.0](https://github.com/dherault/serverless-offline/compare/v6.7.0...v6.8.0)

> 23 September 2020

- Fix for reloading with shared modules [`#1091`](https://github.com/dherault/serverless-offline/pull/1091)
- chore: update example deps and remove example package lock files [`#1086`](https://github.com/dherault/serverless-offline/pull/1086)
- chore: update sub-dependency `bl` using resolution for critical cve [`#1087`](https://github.com/dherault/serverless-offline/pull/1087)
- Add support for Apigatewayv2 payload 2.0 [`#1092`](https://github.com/dherault/serverless-offline/pull/1092)
- chore: add PR template and change node 13 to 14 for tests [`#1088`](https://github.com/dherault/serverless-offline/pull/1088)
- Fix schema logging [`#1077`](https://github.com/dherault/serverless-offline/pull/1077)
- [Docs] Fix #1084 [`#1085`](https://github.com/dherault/serverless-offline/pull/1085)
- Improved lambda invoke [`#1079`](https://github.com/dherault/serverless-offline/pull/1079)
- Merge pull request #1085 from vivganes/patch-1 [`#1084`](https://github.com/dherault/serverless-offline/issues/1084)
- [Docs] Fix #1084 [`#1084`](https://github.com/dherault/serverless-offline/issues/1084)
- stash [`0d5cb6b`](https://github.com/dherault/serverless-offline/commit/0d5cb6b8d335c02eb52d3152a4e41e1e7467283f)
- Add ApiGatewayV2 payload 2.0 request [`34976a7`](https://github.com/dherault/serverless-offline/commit/34976a7e829d390f227a5d2f6574f62008c538a4)
- Added tests for new lamda error and lambda does not exist responses [`7e8bf70`](https://github.com/dherault/serverless-offline/commit/7e8bf7031ea636f0c3e97f2b4771ed2b074bc3c6)
- Add debug list of lambda invocation paths and graceful rejection of functions that do not exist [`818aa92`](https://github.com/dherault/serverless-offline/commit/818aa9205030f72f555c93c74e009d7dabebef39)
- Fix for shared modules [`ed943bf`](https://github.com/dherault/serverless-offline/commit/ed943bf528e80d698316c77246885222996ffd30)
- Correctly returns function not found error to aws cli in the AWS format [`85be3d2`](https://github.com/dherault/serverless-offline/commit/85be3d287c28e94fe343eb7880880e226858a886)
- Handle apigatewayv2 response payload format 2.0 [`d86766e`](https://github.com/dherault/serverless-offline/commit/d86766e5f1f025d79d4b2e49becdb11fa6f6bf2c)
- Updated README with new lambda invoke details [`4a20019`](https://github.com/dherault/serverless-offline/commit/4a200195b52ff04ee37296481516e7a7dd9c8c78)
- Add back const [`60a711b`](https://github.com/dherault/serverless-offline/commit/60a711b77cdaaa3ac171a9c1e54ad753ac76750b)
- Added proper error handling, status codes, and error types to lambda invoke [`04c59ed`](https://github.com/dherault/serverless-offline/commit/04c59edf3ec09cf6842463f78bde3253e0910170)
- fix spelling mistakes and add better explanation of debug statements [`76740ff`](https://github.com/dherault/serverless-offline/commit/76740ffa675686aa9ea6bcc57abe383257c157e9)
- revert main.js so it doesn't change [`e2a6e2e`](https://github.com/dherault/serverless-offline/commit/e2a6e2eff751867917923d83c0aa15c8ff1dacf8)
- Added some comments [`4eacf7e`](https://github.com/dherault/serverless-offline/commit/4eacf7ec8b7af5fa847825fd8f0091fbae2619de)
- Trigger build [`0646865`](https://github.com/dherault/serverless-offline/commit/0646865264ce31040b87cf7bf4bad94e7ec8b010)
- Trigger build [`129d6c7`](https://github.com/dherault/serverless-offline/commit/129d6c7b70f23958aedb3e51e3a4d6a073483b5e)

#### [v6.7.0](https://github.com/dherault/serverless-offline/compare/v6.6.0...v6.7.0)

> 27 August 2020

- Issue #931 fix for not allowing caching [`#1050`](https://github.com/dherault/serverless-offline/pull/1050)
- Fixing test script [`20bd9a4`](https://github.com/dherault/serverless-offline/commit/20bd9a488d88a467b057f083c0dc595b59fd2de4)
- Fixing conflicts [`1d0ff7d`](https://github.com/dherault/serverless-offline/commit/1d0ff7d68c3d44d06b6300b344cc0afe03d3c844)
- Updating allowing CLI options, help, and documentation [`6689c02`](https://github.com/dherault/serverless-offline/commit/6689c02dd44d2fd03fb9b54be090306f5bef8d36)
- Test update for invoke's recursive nature [`4a4bdf6`](https://github.com/dherault/serverless-offline/commit/4a4bdf6b5d7bde7bd2714fb858bfaeb605d2ea2b)

#### [v6.6.0](https://github.com/dherault/serverless-offline/compare/v6.5.0...v6.6.0)

> 26 August 2020

- Handle undefined environment variables in resolveJoins [`#1047`](https://github.com/dherault/serverless-offline/pull/1047)
- Schema validation should be for any integration type [`#1049`](https://github.com/dherault/serverless-offline/pull/1049)
- Update README.md [`#1065`](https://github.com/dherault/serverless-offline/pull/1065)
- Regression: randomly generated API key is not displayed if no API key is defined [`#1066`](https://github.com/dherault/serverless-offline/pull/1066)
- Support WebSocket timeouts limits & fix connectedAt context attribute [`#1068`](https://github.com/dherault/serverless-offline/pull/1068)
- JWT token contains multiple audience values (eg, Auth0) [`#1070`](https://github.com/dherault/serverless-offline/pull/1070)
- Add support for layers to Docker runtimes [`#950`](https://github.com/dherault/serverless-offline/pull/950)
- Update deps [`63a2b29`](https://github.com/dherault/serverless-offline/commit/63a2b296cc92396dfe90d9c21488f7f27fc407fe)
- Updated to include layer support [`740584d`](https://github.com/dherault/serverless-offline/commit/740584dc6f23397af077a489217d433ab441121c)
- updated layers identification [`4525a72`](https://github.com/dherault/serverless-offline/commit/4525a72391aa18c001ca8e31713709c02758fea3)
- Added a test for the environment variable handling. [`2e6f593`](https://github.com/dherault/serverless-offline/commit/2e6f59320ab18616d5e7c01d0b878faaa168e2fc)
- Updated documentation [`5398b0c`](https://github.com/dherault/serverless-offline/commit/5398b0c2d28e62358fddce188f5107100b59ea2a)
- Updated readme [`39bb7b8`](https://github.com/dherault/serverless-offline/commit/39bb7b8f8d88951bb3c8220824a76f580b508942)
- Updated layers code [`1796b22`](https://github.com/dherault/serverless-offline/commit/1796b227b30d187df711298db545877a30be604f)
- checking if any http even is private to display auto-generated key, regardless it apiKeys are set or not [`0d954d9`](https://github.com/dherault/serverless-offline/commit/0d954d9e46bc9ff8facdf4cd77abaad4155486cc)
- Fixed tests. Removed the thing I added to .gitignore [`ff31984`](https://github.com/dherault/serverless-offline/commit/ff3198424afa9ac8c11ee701060c060289321010)
- refactor: WebSocket hard timeout [`374850e`](https://github.com/dherault/serverless-offline/commit/374850e2e33f0f5ffc0d71999d690c3dc8a1195c)
- PR changes [`3f15c15`](https://github.com/dherault/serverless-offline/commit/3f15c15b5586d7291dd897dfe9f6e6e5d671fa06)
- feat: support AWS WebSocket idle timeout [`d186ec0`](https://github.com/dherault/serverless-offline/commit/d186ec05325316dd4695b8bffe16a771a2e7e7bc)
- fix: WebSocketContext connectedAt attribute [`d8af57f`](https://github.com/dherault/serverless-offline/commit/d8af57fecff0cfaffd84dc881fc5457beb0325e6)
- Updated the tests after fixing undefined values [`a273e0e`](https://github.com/dherault/serverless-offline/commit/a273e0e6bdd3a8ef902ee1fac883083e118ef141)
- feat: add webSocketIdleTimeout option [`0f68fa9`](https://github.com/dherault/serverless-offline/commit/0f68fa917b1dedf81538e45acb8359689b0ac8f0)
- updated readme [`ea66ea2`](https://github.com/dherault/serverless-offline/commit/ea66ea230b6cf52d8632b6bda202b46bf99c906d)
- Made test work without AWS [`752093b`](https://github.com/dherault/serverless-offline/commit/752093b550fd1cce66d75b72c9971f96c3d0e273)
- feat: add webSocketHardTimeout option [`a7a91f4`](https://github.com/dherault/serverless-offline/commit/a7a91f4d84a2daef7d946e627fa3f3843edf81a9)
- feat: support AWS WebSocket hard timeout [`5ab44b9`](https://github.com/dherault/serverless-offline/commit/5ab44b968cd71a28ae9c958e1aa5bb69c0369e3a)
- Updated tests [`e9e78db`](https://github.com/dherault/serverless-offline/commit/e9e78db13907ab64549f2864b45af733fbd94ddb)
- Updated README [`c9a1163`](https://github.com/dherault/serverless-offline/commit/c9a1163bba83225666a38296c8f258be5966cb0c)
- Changed error to message [`56494ca`](https://github.com/dherault/serverless-offline/commit/56494ca4872b9227ac2699b49e08baadc03bbd99)
- Updated test to rimraf correct dir [`bffa3a9`](https://github.com/dherault/serverless-offline/commit/bffa3a941ee1236fe45c43f1ff2c3e056e18474f)
- Fix lint issues [`ff5bdf3`](https://github.com/dherault/serverless-offline/commit/ff5bdf335c4ab5b5223eaa2f591920d190f13a75)
- Reduced test timeout [`2ab32dd`](https://github.com/dherault/serverless-offline/commit/2ab32ddba63880bd89b10adecc86847d82fda24d)
- Code fixes and conflict fixes [`e6a2d58`](https://github.com/dherault/serverless-offline/commit/e6a2d58e7b3c9db2e3c2c0906a0d22c55b5c0782)
- put silent back in npm test [`eacd283`](https://github.com/dherault/serverless-offline/commit/eacd2833e5e22400265b6ba9474fb8647a4c9dba)
- Testing failed build [`b3a6f51`](https://github.com/dherault/serverless-offline/commit/b3a6f510698dd17dadce86259144d79d66e833cb)
- Code fixes [`a6eadb8`](https://github.com/dherault/serverless-offline/commit/a6eadb86608539bce91d04c70c10ffcad251f4ab)
- Testing failed build [`fbb0ba3`](https://github.com/dherault/serverless-offline/commit/fbb0ba34af9004e7b7906dac45dad4d953ca962a)

#### [v6.5.0](https://github.com/dherault/serverless-offline/compare/v6.3.2...v6.5.0)

> 18 July 2020

- JSON schema validation for http request body [`#1046`](https://github.com/dherault/serverless-offline/pull/1046)
- Add IS_OFFLINE env var to all handler runners [`#1038`](https://github.com/dherault/serverless-offline/pull/1038)
- Fix Api Gateway Proxy logs [`#1042`](https://github.com/dherault/serverless-offline/pull/1042)
- fix greedy path for proxy [`#1030`](https://github.com/dherault/serverless-offline/pull/1030)
- feat: Resolve Fn::Join in environment variables [`#1032`](https://github.com/dherault/serverless-offline/pull/1032)
- Add optional JWT authorizer for HttpApi events [`#1022`](https://github.com/dherault/serverless-offline/pull/1022)
- Contributing updates [`#1019`](https://github.com/dherault/serverless-offline/pull/1019)
- Fix security vulnerabilities [`#1021`](https://github.com/dherault/serverless-offline/pull/1021)
- refactor: Script for running tests with --watch [`#1011`](https://github.com/dherault/serverless-offline/pull/1011)
- refactor: Star routes test, and added endToEnd test folder [`#1010`](https://github.com/dherault/serverless-offline/pull/1010)
- Bump apollo-server-lambda from 2.9.16 to 2.14.2 in /tests/scenario/apollo-server-lambda [`#1006`](https://github.com/dherault/serverless-offline/pull/1006)
- Java 8 Runtime Support [`#852`](https://github.com/dherault/serverless-offline/pull/852)
- fix: Allow explicitly setting headers within lambda [`#1003`](https://github.com/dherault/serverless-offline/pull/1003)
- Add scala and groovy tests [`8893ec0`](https://github.com/dherault/serverless-offline/commit/8893ec038aaa6cf89e9d3e764dd53a43a0199a37)
- add JWT authorizer for HttpApi events [`8cfa346`](https://github.com/dherault/serverless-offline/commit/8cfa34638bdf4878509eb8597db4d2db6d58f3ed)
- Add kotlin test [`00f61b7`](https://github.com/dherault/serverless-offline/commit/00f61b7b3efae948f796fd843c5484e5fe63c5f1)
- Bump apollo-server-lambda in /tests/scenario/apollo-server-lambda [`858991c`](https://github.com/dherault/serverless-offline/commit/858991c58e9d47e09a12fb6e191150a3c73bcc62)
- Java Runtime Support [`f37fe2c`](https://github.com/dherault/serverless-offline/commit/f37fe2caba8b2e5b8f36f85ceb2741759db9e3f7)
- Move option parameter tests to endToEnd folder [`da9623b`](https://github.com/dherault/serverless-offline/commit/da9623b99a98bf7627588fa71c20ecb68bf5e815)
- JSON schema validation for lambdas [`4f5513d`](https://github.com/dherault/serverless-offline/commit/4f5513d1c4032224f1771e2b4510c9ff3928ff49)
- Create end to end test for star routes [`9e2cf17`](https://github.com/dherault/serverless-offline/commit/9e2cf178372782f8edecf95d3bc3adcd402cdfbf)
- change status codes to match api gateway [`880362d`](https://github.com/dherault/serverless-offline/commit/880362d7d5ca46251839c6e4b4036e6ab5b290b4)
- require feature flag for this functionality [`4400b23`](https://github.com/dherault/serverless-offline/commit/4400b23050c031d562c28c24d3c4710092c43642)
- add documentation [`f8efd51`](https://github.com/dherault/serverless-offline/commit/f8efd51c2a08500175b1dbb7b1711fe30ffd318e)
- Update CONTRIBUTING.md [`c848126`](https://github.com/dherault/serverless-offline/commit/c8481269dc006ba6e119da9e1081a107e10cc290)
- feat: Resolve Fn::Join in environment variables [`fe07475`](https://github.com/dherault/serverless-offline/commit/fe07475c82f84ec8b03dc90f78f1f7f0ff228636)
- no longer filter '+' from resource paths [`1dacce2`](https://github.com/dherault/serverless-offline/commit/1dacce2c11d1bd0647dbcbfda7cfa1cef1301ddb)
- add support for events defined as a string [`6df1cef`](https://github.com/dherault/serverless-offline/commit/6df1cefcb53fdaa26479a99b0d8a62b020363317)
- Bump java-invoke-local version [`786dedf`](https://github.com/dherault/serverless-offline/commit/786dedf26d3eaf00d3ea55e083f4a99ae42214f3)
- Update package-lock.json [`bf7b44e`](https://github.com/dherault/serverless-offline/commit/bf7b44e1c652775db33f6e78feb08be1c5af2ba9)
- Handle undefined [`f089c13`](https://github.com/dherault/serverless-offline/commit/f089c13987580ef5d7ebb85e1f7c27d53a17590b)
- code review fix [`4366059`](https://github.com/dherault/serverless-offline/commit/4366059e0432de21178e901e3cfbd3228338eeaa)
- Fix tests [`ad1198a`](https://github.com/dherault/serverless-offline/commit/ad1198a4b04cd161ade5f28320f0a4e5920b2f3b)
- change request.url.path -&gt; request.url.pathname [`1d8230b`](https://github.com/dherault/serverless-offline/commit/1d8230b4a95215ffcdc03f2f8ad547f9a388e0c0)
- trigger ci [`8128fda`](https://github.com/dherault/serverless-offline/commit/8128fdaadb3cb73458e70eb66726313fc25db9c6)
- Update package.json [`224f728`](https://github.com/dherault/serverless-offline/commit/224f7287bcf10e9e9bef5cded10e4c73d4bb9135)
- Java Runtime Support [`3577909`](https://github.com/dherault/serverless-offline/commit/35779092be4b63597ff174b66932ef818fac2606)
- trigger build [`bc907b1`](https://github.com/dherault/serverless-offline/commit/bc907b1b03c0d7b4ff80ff077dd6adbcf36ea5a5)
- Add format npm script [`20e9399`](https://github.com/dherault/serverless-offline/commit/20e9399a1c0938c5868d87f03663fa8c5300435f)

#### [v6.3.2](https://github.com/dherault/serverless-offline/compare/v6.3.1...v6.3.2)

> 4 June 2020

- fix: resourcePath in authorizers should contain wildcards [`#980`](https://github.com/dherault/serverless-offline/pull/980)
- feat: Add tests for resource variable [`578ecc9`](https://github.com/dherault/serverless-offline/commit/578ecc907aee2f9309440e104233a6b067e45ad2)
- fix: Resource path should contain wildcards [`5ff81fb`](https://github.com/dherault/serverless-offline/commit/5ff81fb318a741f7d58f83ae4e550717c4d3bbbc)
- Update README.md [`e0b82ff`](https://github.com/dherault/serverless-offline/commit/e0b82ff135d73ad56e738c2b4f15dd8a2892d819)
- Update README.md [`a2493db`](https://github.com/dherault/serverless-offline/commit/a2493db02703b52c0f9733c3fc5173cb61362efe)
- fix: Add missing resource and path variables in auth event [`efc4866`](https://github.com/dherault/serverless-offline/commit/efc4866f583bb84b0a43c559d24e10604087cc8a)

#### [v6.3.1](https://github.com/dherault/serverless-offline/compare/v6.3.0...v6.3.1)

> 3 June 2020

- fix: Handle star routes [`#1000`](https://github.com/dherault/serverless-offline/pull/1000)
- chore(tests): generateHapiPath unit tests, prefix integration test [`#998`](https://github.com/dherault/serverless-offline/pull/998)
- NPM script for running only unit tests [`#997`](https://github.com/dherault/serverless-offline/pull/997)
- chore(tests): generateHapiPath unit tests [`79c5124`](https://github.com/dherault/serverless-offline/commit/79c51243a7e24367c7393a9a18de2b935f69860c)
- chore(tests): Add integration test for prefix option [`6dbd28f`](https://github.com/dherault/serverless-offline/commit/6dbd28fc405d066da6a36027313708bb33b948c5)
- Command for running only unit tests [`ec76237`](https://github.com/dherault/serverless-offline/commit/ec76237347460f57b2bddf99da090760b4ea7383)
- Fix typo [`540f03d`](https://github.com/dherault/serverless-offline/commit/540f03d29b2a6c11f0614d0d3d405eb08af9c9ed)

#### [v6.3.0](https://github.com/dherault/serverless-offline/compare/v6.2.0...v6.3.0)

> 28 May 2020

- refactor: Extract util for generating hapiPath [`#994`](https://github.com/dherault/serverless-offline/pull/994)

#### [v6.2.0](https://github.com/dherault/serverless-offline/compare/v6.1.7...v6.2.0)

> 27 May 2020

- Fix:#989 ModuleNotFoundError occur when running Python function on Windows OS [`#991`](https://github.com/dherault/serverless-offline/pull/991)
- feat(prefixes): Bring back prefix option [`#988`](https://github.com/dherault/serverless-offline/pull/988)
- Add prefix to paths [`8b8beaa`](https://github.com/dherault/serverless-offline/commit/8b8beaa01e2d1039054287b1d49a182a37272f35)
- Added prefix to commandOptions [`de32a37`](https://github.com/dherault/serverless-offline/commit/de32a376d6c3cca2f9faf2ae5cdfca2d16ac441f)
- Changed path separator from literal "/" to the separator for each operating system. [`e4dcb79`](https://github.com/dherault/serverless-offline/commit/e4dcb791d4e1f352baf637d99af439000503bf02)
- Add default [`a5ab194`](https://github.com/dherault/serverless-offline/commit/a5ab194b3cda45c2cae23d5fb4ffd7463363555c)
- Readd to readme [`95e9082`](https://github.com/dherault/serverless-offline/commit/95e9082f6639f321e9fada7d6d9102a0eb9abca6)

#### [v6.1.7](https://github.com/dherault/serverless-offline/compare/v6.1.5...v6.1.7)

> 20 May 2020

- Stage variables integration [`#976`](https://github.com/dherault/serverless-offline/pull/976)
- Edit README [`cfbdcc6`](https://github.com/dherault/serverless-offline/commit/cfbdcc634d230ed47a894ddb62185b0b96245ce3)
- Merge branches 'master' and 'master' of github.com:dherault/serverless-offline [`e03766c`](https://github.com/dherault/serverless-offline/commit/e03766c27ee87b812fa8ae214f54d3e943d38169)
- Update deps [`f9abe8d`](https://github.com/dherault/serverless-offline/commit/f9abe8d919afe7455a6235c4e006877b9c6674d8)
- stage variables integration [`a8d0144`](https://github.com/dherault/serverless-offline/commit/a8d0144e20d554345e5ff9fd320d765dca0835ac)
- Remove prepublish and push hooks [`5b61858`](https://github.com/dherault/serverless-offline/commit/5b618588336db33c58062210f6bc3c97006abf9e)
- Edit tests [`9222c52`](https://github.com/dherault/serverless-offline/commit/9222c52eea4c2628dbdec5d41e11eccd0b951ffe)

#### [v6.1.5](https://github.com/dherault/serverless-offline/compare/v6.1.4...v6.1.5)

> 5 May 2020

- Reuse Python handler processes for performance. [`#949`](https://github.com/dherault/serverless-offline/pull/949)
- Fixed the path and resourcePath in http event lambda proxy [`#964`](https://github.com/dherault/serverless-offline/pull/964)
- Also support `--disableCookieValidation` when we `createResourceRoutes`. [`#975`](https://github.com/dherault/serverless-offline/pull/975)
- Fix: serverless-offline crashes if a function definition does not have a handler [`#967`](https://github.com/dherault/serverless-offline/pull/967)
- Add aws cli invoke instructions to readme [`#968`](https://github.com/dherault/serverless-offline/pull/968)
- Revert "Revert "Support local artifact"" [`#952`](https://github.com/dherault/serverless-offline/pull/952)
- Also support `--disableCookieValidation` when we `createResourceRoutes`. [`#974`](https://github.com/dherault/serverless-offline/issues/974)
- Fix handling of handler process streams. [`c531811`](https://github.com/dherault/serverless-offline/commit/c531811b9ff64556cbdeca6abdf1d2beec8c5045)
- Fix linter issues. [`64ad837`](https://github.com/dherault/serverless-offline/commit/64ad8376930b3598f52eb1cda69014c0572fe494)
- Add command line option for function cleanup idle time. [`2551156`](https://github.com/dherault/serverless-offline/commit/2551156cda7eacdcb160b8d6115e5db4c4df2b46)
- Check for the existence of a handler property before trying to have serverless-offline set up an event handler. [`39742cc`](https://github.com/dherault/serverless-offline/commit/39742cc2f2906d6549a86ac270f5f2b0227b9f3e)
- Properly mop up Python handler runners. [`49e5121`](https://github.com/dherault/serverless-offline/commit/49e5121869aff40fe74f5a6b51f78f71b625b36c)
- Fixed the path and resourcePath in http event lambda proxy [`d8ecdc5`](https://github.com/dherault/serverless-offline/commit/d8ecdc582f5d21dd5b0e3784929d35ec3ed6debe)
- Match preferred linting style for serverless offline by removing double negation [`fdd043d`](https://github.com/dherault/serverless-offline/commit/fdd043da2312835405bb814cac6d344deb2d3b80)
- Add dedication [`778a18f`](https://github.com/dherault/serverless-offline/commit/778a18fcdbc66e8cdce510e0f761c6722157fbb8)
- Remove autogenerated files from repo [`4658464`](https://github.com/dherault/serverless-offline/commit/465846494c325505846187ebced3216e9d1021fc)

#### [v6.1.4](https://github.com/dherault/serverless-offline/compare/v6.1.3...v6.1.4)

> 2 April 2020

- ISSUE-947 cors options are ignored for the lambda server [`#948`](https://github.com/dherault/serverless-offline/pull/948)

#### [v6.1.3](https://github.com/dherault/serverless-offline/compare/v6.1.2...v6.1.3)

> 1 April 2020

- noPrependStageInUrl false should have a leading slash [`#946`](https://github.com/dherault/serverless-offline/pull/946)
- #942 Fix for child process sharing the stdio of parent [`#944`](https://github.com/dherault/serverless-offline/pull/944)
- Adding tests for url prepending [`62a7fbf`](https://github.com/dherault/serverless-offline/commit/62a7fbf5faefa86f1b1cd88a24c2a3cb3cf755b6)
- Removing comments [`8533205`](https://github.com/dherault/serverless-offline/commit/8533205e93d16fa6f745c7f36bf92b1c19915b9b)
- Fixing lint [`c2b990d`](https://github.com/dherault/serverless-offline/commit/c2b990deec8771676f081d562dbc1496a1ada233)
- Fix for noPrependStageInUrl affecting event.path [`24b0476`](https://github.com/dherault/serverless-offline/commit/24b0476b5982d199834c9f257c33115e8000e947)
- Fix for child process running [`e97ecd3`](https://github.com/dherault/serverless-offline/commit/e97ecd3cd178926784c09f2c5f588b8e0d34f0e9)
- Add FUNDING.yml file [`cabadc9`](https://github.com/dherault/serverless-offline/commit/cabadc92de94f3688be27bdce8513dd78b8b6c2c)

#### [v6.1.2](https://github.com/dherault/serverless-offline/compare/v6.1.1...v6.1.2)

> 25 March 2020

- Display route invoke path to terminal [`6e9f929`](https://github.com/dherault/serverless-offline/commit/6e9f929a82a94e2494a378dace3174ecaee1eb99)

#### [v6.1.1](https://github.com/dherault/serverless-offline/compare/v6.1.0...v6.1.1)

> 25 March 2020

- fix: fixup no prepend stage changes [`#941`](https://github.com/dherault/serverless-offline/pull/941)
- Fix for attempt to process undefined events property [`#940`](https://github.com/dherault/serverless-offline/pull/940)
- Adds support for httpApi [`#937`](https://github.com/dherault/serverless-offline/pull/937)

#### [v6.1.0](https://github.com/dherault/serverless-offline/compare/v6.0.0...v6.1.0)

> 24 March 2020

- ISSUE-934 Lambda default InvocationType not handled correctly [`#935`](https://github.com/dherault/serverless-offline/pull/935)
- Add option to disable prefixing of routes with stage name [`#926`](https://github.com/dherault/serverless-offline/pull/926)
- Support local artifact [`#906`](https://github.com/dherault/serverless-offline/pull/906)
- Support local artifacts [`026a54f`](https://github.com/dherault/serverless-offline/commit/026a54fd841d5f660ef2f9542c73958fd99d3b79)
- Revert prettier [`e7d4e69`](https://github.com/dherault/serverless-offline/commit/e7d4e694cfd7dbf1748a62b7cac61e0de6de3a4e)
- Add tests [`fbf9e3a`](https://github.com/dherault/serverless-offline/commit/fbf9e3aa4f38e81434d9b37a7826349765e2b495)
- Log route correctly [`a086a76`](https://github.com/dherault/serverless-offline/commit/a086a76d32a868991669208e68467892c9aea885)
- Use optional chaining [`c5bc393`](https://github.com/dherault/serverless-offline/commit/c5bc393746df7e6cb342019546367b576fda085d)
- pseudo push for ci [`8daf158`](https://github.com/dherault/serverless-offline/commit/8daf15893d7ee8af6b7b1aba6b4202de900aaaa1)

### [v6.0.0](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.67...v6.0.0)

> 19 March 2020

- Support ruby2.7 [`#912`](https://github.com/dherault/serverless-offline/pull/912)
- fix(http-server): change hapiHandler to use current request path [`#905`](https://github.com/dherault/serverless-offline/pull/905)
- "offline:ready" hook [`#914`](https://github.com/dherault/serverless-offline/pull/914)
- Update deps [`48d2912`](https://github.com/dherault/serverless-offline/commit/48d2912d03a877bb2490c98b98141e302b29d62e)
- Update @hapi/hoek [`47b7c3d`](https://github.com/dherault/serverless-offline/commit/47b7c3d4caa26acc6ee9274729b926ffc7162d58)
- Create "ready" serverless lifecycle hook [`450fb2e`](https://github.com/dherault/serverless-offline/commit/450fb2eb36a4cee92797a384b13b7c698e9d396d)
- JSON stringify string responses [`0f6f88c`](https://github.com/dherault/serverless-offline/commit/0f6f88c98fff3afa0289f46bf4eab469f45eebc6)
- Await termination in offline call w/o start [`2629086`](https://github.com/dherault/serverless-offline/commit/2629086d1cbd50be49919c8b711b93effa4836c0)
- Remove go binary from repo [`8187eee`](https://github.com/dherault/serverless-offline/commit/8187eeefd9512970806386e472fb51bc6b393e88)

#### [v6.0.0-alpha.67](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.66...v6.0.0-alpha.67)

> 17 February 2020

- Add contrib doc for dev-local with serverless.yml vs package.json [`#891`](https://github.com/dherault/serverless-offline/pull/891)
- Cleanup lambda function before delete [`#890`](https://github.com/dherault/serverless-offline/pull/890)
- Fix connection refused error on mac [`#889`](https://github.com/dherault/serverless-offline/pull/889)
- Update deps [`e7a39c9`](https://github.com/dherault/serverless-offline/commit/e7a39c9cd9f7acad6b61f5d53e672eb34bb2d73c)
- add doc for dev-local with serverless.yml vs package.json [`52d6043`](https://github.com/dherault/serverless-offline/commit/52d6043961e85989de5323c1f9280e90b81c0afb)
- Update deps [`df4e45b`](https://github.com/dherault/serverless-offline/commit/df4e45bff32e91e01a54cd621e87c8ab796d0f90)
- Use p-retry [`f6277dc`](https://github.com/dherault/serverless-offline/commit/f6277dce0e403a09feca70b94e53781cc3b27400)
- Make ping private [`4e57bc5`](https://github.com/dherault/serverless-offline/commit/4e57bc5eb2d3049c33a4288124d1fc8f6c264a8a)
- Recommend serverless peer dependency v1.60.0 [`c8dbfd3`](https://github.com/dherault/serverless-offline/commit/c8dbfd3337ad9fed2e7234b80524908d98de98e2)

#### [v6.0.0-alpha.66](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.65...v6.0.0-alpha.66)

> 10 February 2020

- Fix invalid call to createUniqueId, fixes #886 [`#886`](https://github.com/dherault/serverless-offline/issues/886)
- Fix schedule event time formatting, fixes #878 [`#878`](https://github.com/dherault/serverless-offline/issues/878)
- Revert "Update deps" [`9a09778`](https://github.com/dherault/serverless-offline/commit/9a097788f47b9ca5026a4f96c79e393776681741)
- Update deps [`4b81b3f`](https://github.com/dherault/serverless-offline/commit/4b81b3fe0371553e51966338f9bf32051ff1b310)
- Update README.md [`adba5e4`](https://github.com/dherault/serverless-offline/commit/adba5e439dfefb19451f3c5590d2b84aca309686)

#### [v6.0.0-alpha.65](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.64...v6.0.0-alpha.65)

> 5 February 2020

- Provide default event payload for scheduled when "input" not specified in serverless.yml, fixes #878 [`#878`](https://github.com/dherault/serverless-offline/issues/878)
- Update deps [`00c4ff3`](https://github.com/dherault/serverless-offline/commit/00c4ff3b87a927d8562f00b0990c7741614c99d9)
- Update deps [`9c2ac4e`](https://github.com/dherault/serverless-offline/commit/9c2ac4e544d4704ef505abafedf63540721e0c7b)
- Revert "Update deps" [`7c10f4c`](https://github.com/dherault/serverless-offline/commit/7c10f4c03da199b0543a440ce165f68d072f3862)
- Update deps [`cbe88fe`](https://github.com/dherault/serverless-offline/commit/cbe88fe12456f75dfb8483cb965614b646ac8820)
- Use schedule event class [`69338a5`](https://github.com/dherault/serverless-offline/commit/69338a5f4bacf45d62546236e14369214e87d776)
- Order nit [`f96fcd6`](https://github.com/dherault/serverless-offline/commit/f96fcd6b6bd1ae6aa025a0dbddf6e620f32c8040)
- Generate Ids [`a4212ee`](https://github.com/dherault/serverless-offline/commit/a4212ee1834991cd05d3373b5508a9bf403e7fad)
- Nit [`4a76f24`](https://github.com/dherault/serverless-offline/commit/4a76f243fceabc3cf52352f7bbcb5e5d874abccd)
- Typo fixes [`59ff77f`](https://github.com/dherault/serverless-offline/commit/59ff77f18745c11d527aaff78220b6c9b36a7249)
- Use nullish coalescing [`678ad05`](https://github.com/dherault/serverless-offline/commit/678ad05af94a27fea77d615bedd5aba84c7bda1b)
- Add resources property to schedule event [`40d491f`](https://github.com/dherault/serverless-offline/commit/40d491f6ef473c599d4267d3c2057a0463d8efeb)

#### [v6.0.0-alpha.64](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.63...v6.0.0-alpha.64)

> 29 January 2020

- Update example deps [`5c34174`](https://github.com/dherault/serverless-offline/commit/5c34174a1605e0a3342afe59200e66c375e22904)
- Update scenario test deps [`909a832`](https://github.com/dherault/serverless-offline/commit/909a83211a522a9a0e524ad669786246df6bf090)
- Update deps [`4ee68b5`](https://github.com/dherault/serverless-offline/commit/4ee68b5a1c6063c5c10532517fe75a8d7885d26f)

#### [v6.0.0-alpha.63](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.62...v6.0.0-alpha.63)

> 27 January 2020

- Fix lambda integration string responses, fixes #834, #702 [`#834`](https://github.com/dherault/serverless-offline/issues/834)
- Update deps [`52fe926`](https://github.com/dherault/serverless-offline/commit/52fe92661ef7532f1b5b56216dcf0f26d3564fc7)
- Update example deps [`210ceee`](https://github.com/dherault/serverless-offline/commit/210ceee291322dc28d7666354643c9d820d2380b)
- Update deps [`966bb61`](https://github.com/dherault/serverless-offline/commit/966bb618306aeba09693c93f3974755828fed476)
- Update scenario test deps [`72cd175`](https://github.com/dherault/serverless-offline/commit/72cd17581bb332194ca81ee38814e965d77354a3)
- Add lambda integration tests [`4085041`](https://github.com/dherault/serverless-offline/commit/40850415331edd69549e06a339d37051561841bb)
- Update deps [`a27fbf4`](https://github.com/dherault/serverless-offline/commit/a27fbf456204708f482d972e8cf83d8e20eaeebb)
- Update deps [`513c77b`](https://github.com/dherault/serverless-offline/commit/513c77b2185463ae53f12a74d407af11ec023c5b)
- Update README.md [`39d3407`](https://github.com/dherault/serverless-offline/commit/39d3407fbb76bfe7484f0fbb2f1d42f63d2941f8)

#### [v6.0.0-alpha.62](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.61...v6.0.0-alpha.62)

> 12 January 2020

- Remove response closure [`1d758ae`](https://github.com/dherault/serverless-offline/commit/1d758aecc1103331284420c05c7f833c4c8f53bd)
- Update deps [`4474a38`](https://github.com/dherault/serverless-offline/commit/4474a3826bf4bd1625b57197626dae2f4c90230f)
- Remove unused hapi-swagger module [`c2ac291`](https://github.com/dherault/serverless-offline/commit/c2ac29173a73af08e1716713cb70e8036f22b682)
- Simplify more [`860afb2`](https://github.com/dherault/serverless-offline/commit/860afb2622f9c23bff908b62d28be36a579af0e6)
- Restructure [`5d66f3f`](https://github.com/dherault/serverless-offline/commit/5d66f3f2e31d4c709141edff4863a4934ce60a87)
- Remove unused @hapi/inert module [`80bf2a5`](https://github.com/dherault/serverless-offline/commit/80bf2a54fa412d22065e0d410b2c65b4af123a9d)
- Add @babel/plugin-proposal-optional-chaining module [`b0c93cd`](https://github.com/dherault/serverless-offline/commit/b0c93cdc5d6255f648125020f08327dde4f86b6b)
- Remove unused @hapi/vision module [`68fbff7`](https://github.com/dherault/serverless-offline/commit/68fbff7acfe68c5cbbd3a9a1538a07f1994e9875)
- Simplify [`962f09c`](https://github.com/dherault/serverless-offline/commit/962f09c14525e207df78a279b63d95c51d5100f6)
- Simplify [`951d35d`](https://github.com/dherault/serverless-offline/commit/951d35d9ff34e65a15a352f784d1d1a9a3e084a7)
- Use more nullish coalescing [`0425de1`](https://github.com/dherault/serverless-offline/commit/0425de12dec1d6dbf1ea8224c623350f2e67748e)

#### [v6.0.0-alpha.61](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.60...v6.0.0-alpha.61)

> 11 January 2020

- Fix path/resource/resourcePath in Lambda events, fixes #868 [`#868`](https://github.com/dherault/serverless-offline/issues/868)
- Update deps [`9e8a837`](https://github.com/dherault/serverless-offline/commit/9e8a8372acc5e6485f7dcb051e3133ae0d45bcf4)
- destructure from namespace [`933fa2b`](https://github.com/dherault/serverless-offline/commit/933fa2b583411b1e2e3a25fef9d35c4f026b9b72)
- Simplify, destructure from request object [`3e82844`](https://github.com/dherault/serverless-offline/commit/3e828442c1c248fba29002cef02daa5e0080d2d2)
- Rename variable [`18398b7`](https://github.com/dherault/serverless-offline/commit/18398b77935cc49c80c8660b9033ce93e3528673)

#### [v6.0.0-alpha.60](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.59...v6.0.0-alpha.60)

> 8 January 2020

- Update example deps [`8a39083`](https://github.com/dherault/serverless-offline/commit/8a390839418b5fb783a5de658987f1b420fcb40d)
- Update deps [`738e066`](https://github.com/dherault/serverless-offline/commit/738e066e04604f7c7e8434de8e0526b690787a89)
- Update deps [`76aedb0`](https://github.com/dherault/serverless-offline/commit/76aedb00e8d7d31d91a4556c66bcdeaee3ba847d)
- Rename option port to httpPort [`78e862f`](https://github.com/dherault/serverless-offline/commit/78e862f82202138744e711e170e2d6d31825fd20)

#### [v6.0.0-alpha.59](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.58...v6.0.0-alpha.59)

> 5 January 2020

- Add support for Lambda.invokeAsync, closes #862 [`#862`](https://github.com/dherault/serverless-offline/issues/862)
- Update scenario test deps [`fc2b80d`](https://github.com/dherault/serverless-offline/commit/fc2b80d047ff193063294c2ffc17f39c9218e4c9)
- Add test for Lambda.invokeAsync [`ac90eb5`](https://github.com/dherault/serverless-offline/commit/ac90eb5f7bf788da263ec7890336a1b862e1764a)
- Order nit [`72a0e4b`](https://github.com/dherault/serverless-offline/commit/72a0e4ba1072c00b7c546891181e78ddad7a4de6)
- Add @babel/plugin-proposal-nullish-coalescing-operator plugin [`6c59ace`](https://github.com/dherault/serverless-offline/commit/6c59acec453bc0a82007b9ad329755ddfba8e33c)
- Rename folder [`d810196`](https://github.com/dherault/serverless-offline/commit/d81019673b28d7c997534df0067360290cadb352)
- Add additional cli colors for http methods [`5596832`](https://github.com/dherault/serverless-offline/commit/55968322ca659422bfa47c2cafef7eace6759d33)
- Rename test handlers [`b95efeb`](https://github.com/dherault/serverless-offline/commit/b95efeb5d31c20530340980c295e541bd2aaf402)
- Simplify cli colorization [`21e973a`](https://github.com/dherault/serverless-offline/commit/21e973a7d5c6545f3453eeb6bfc4b48e12ba4bfa)
- Rename test handlers [`ae6eab7`](https://github.com/dherault/serverless-offline/commit/ae6eab7cb8bcf7b58e528a180cc9510bba149a9c)
- Add api version [`53d3bdb`](https://github.com/dherault/serverless-offline/commit/53d3bdb43f6c5fb185b936d4a9cc01c24670ca30)
- Order nit [`2f050f7`](https://github.com/dherault/serverless-offline/commit/2f050f7d57cbbeecb487f81bf4920873f0ecd11a)
- Add version to invoke api path [`5cfc3f0`](https://github.com/dherault/serverless-offline/commit/5cfc3f0c1b56bf7fc51d282a80fda3d4031715eb)
- Use nullish coalescing operator [`66dacaa`](https://github.com/dherault/serverless-offline/commit/66dacaa7d132b628ec245da1789e4cd4afca9299)

#### [v6.0.0-alpha.58](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.57...v6.0.0-alpha.58)

> 3 January 2020

- Update deps [`83880b7`](https://github.com/dherault/serverless-offline/commit/83880b70680958b8da56b25252a8af35ded2d6c9)
- Add host.docker.internal to container on linux [`75e07be`](https://github.com/dherault/serverless-offline/commit/75e07be0ecd17b325d9f5b5a26509fb0fc4ce876)
- Rename name in package.json for scenario test [`2c12aa1`](https://github.com/dherault/serverless-offline/commit/2c12aa1f6bc44f96ff95818005185cef2a8e5106)

#### [v6.0.0-alpha.57](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.56...v6.0.0-alpha.57)

> 1 January 2020

- Use private fields with @babel/plugin-proposal-class-properties [`2d87610`](https://github.com/dherault/serverless-offline/commit/2d87610ab043b4da4e7d7824bb61357f1cb9cbee)
- Update deps [`9aee225`](https://github.com/dherault/serverless-offline/commit/9aee225165a4897582a26c538038c22a1cba1d95)
- Update deps [`07e45cc`](https://github.com/dherault/serverless-offline/commit/07e45cc1fe8fcaf8ecc6468de3dfaffac6bf2d3c)
- Remove import URL (global with node v10+) [`20f53f8`](https://github.com/dherault/serverless-offline/commit/20f53f81a392c5d7ab722a9000a217a080802147)

#### [v6.0.0-alpha.56](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.55...v6.0.0-alpha.56)

> 20 December 2019

- Fix empty path, fixes #857 [`#857`](https://github.com/dherault/serverless-offline/issues/857)
- Update deps [`9bfd3cc`](https://github.com/dherault/serverless-offline/commit/9bfd3ccfca705296a043a37ac2f583275753aafb)
- Update deps [`54f346f`](https://github.com/dherault/serverless-offline/commit/54f346fddd24d6fd798ea9e281b96f54c22d7b65)
- Simplify [`89892ef`](https://github.com/dherault/serverless-offline/commit/89892ef24ab582746133c872151f69ab9f4aa388)
- Fix port in example [`3c4b9c5`](https://github.com/dherault/serverless-offline/commit/3c4b9c583c409dc5a07bf1d263ef095f2c8b9e32)

#### [v6.0.0-alpha.55](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.54...v6.0.0-alpha.55)

> 19 December 2019

- Prepend stage to path, closes #857 [`#857`](https://github.com/dherault/serverless-offline/issues/857)
- Add scenario test for docker with serverless-webpack [`3a1ded9`](https://github.com/dherault/serverless-offline/commit/3a1ded98bc9eac8f712c8758dc685834dc305e90)
- Update deps [`0ac89a3`](https://github.com/dherault/serverless-offline/commit/0ac89a323cda54286bcaf99cc5930154bccfb147)
- Fix tests [`babb06d`](https://github.com/dherault/serverless-offline/commit/babb06d0fca75fc2879e6793d8fe4662a7fb05bc)
- Update deps [`510b428`](https://github.com/dherault/serverless-offline/commit/510b428c8fe2921165daf9ea06ea32f56c7940e2)
- Pass array of definitions to event sources [`f308fba`](https://github.com/dherault/serverless-offline/commit/f308fba597a75cd079849bc3a4ed38c698796bd9)
- Add boxen to group route information [`5c0c306`](https://github.com/dherault/serverless-offline/commit/5c0c306d95f53806cbf6a3d8b03163ca5f26de9d)
- Fix logging http routes [`09da635`](https://github.com/dherault/serverless-offline/commit/09da63540696f9a0113a7f0f937759fb36017f7f)
- Comment out hapi swagger support for now [`931a658`](https://github.com/dherault/serverless-offline/commit/931a6589228a7a4fe7ed42346f32d2d2a645ca47)

#### [v6.0.0-alpha.54](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.53...v6.0.0-alpha.54)

> 17 December 2019

- Add serverless-plugin-typescript example [`2afd0d2`](https://github.com/dherault/serverless-offline/commit/2afd0d242fcf2ca0da93a8eff4d7744ccf556a40)
- Use alpha.53 in examples [`662ff55`](https://github.com/dherault/serverless-offline/commit/662ff557c8a079c6257f6fa7d4a73cb7ab152dfe)
- Add serverless-plugin-typescript scenario test case [`844b957`](https://github.com/dherault/serverless-offline/commit/844b95765926aaab05bf7933d0f0eea5b64ffef1)
- Support docker [`c114ccc`](https://github.com/dherault/serverless-offline/commit/c114ccc467e1c55fa7aa21ef007b21caf72da4e1)
- Add docker integration tests [`de63367`](https://github.com/dherault/serverless-offline/commit/de633675f18b061fc900ab63920f19ef6748c5b9)
- Refactor skipping docker tests [`a4968db`](https://github.com/dherault/serverless-offline/commit/a4968dbb36b870e216b6486689eee9c522da1f87)
- Remove unused class [`134c036`](https://github.com/dherault/serverless-offline/commit/134c036363dbbafe8d2477c6a324488e750dbe0c)
- Update deps [`a956ab9`](https://github.com/dherault/serverless-offline/commit/a956ab99c7eedb9d4dcbaac86ad3e61608eaeb19)
- Create docker container instance in docker runner [`75e78a6`](https://github.com/dherault/serverless-offline/commit/75e78a6872a19a17bfd82157dda1649f63f926c8)
- Move remaining docker functionality [`ee76c47`](https://github.com/dherault/serverless-offline/commit/ee76c47b37d03c4911b90a24f6c11b9e2ac01c19)
- Allow handler in container to access to the host [`5100689`](https://github.com/dherault/serverless-offline/commit/5100689950fb7ddb058fb18d03a6f39ffc863f8f)
- Support Go with Docker [`b23b884`](https://github.com/dherault/serverless-offline/commit/b23b884c126dfdcc368e96ca9fd7f9885489ac83)
- Refactor, add docker image class [`ed79365`](https://github.com/dherault/serverless-offline/commit/ed79365fb99e78e255d54dfdcd6e5d0d1120256e)
- Initialize docker resources in Lambda [`c88b86e`](https://github.com/dherault/serverless-offline/commit/c88b86e1b12b268216f31c11bffeabdb1a77686e)
- Add multiple docker container tests [`3229b55`](https://github.com/dherault/serverless-offline/commit/3229b55af37bf02a8cfcfc83a6d3c97f24b50623)
- Rate limit test setup [`a056377`](https://github.com/dherault/serverless-offline/commit/a0563776781e53cf71cab4feb9cb84cb62eadf34)
- Add provided runtime test [`44b284a`](https://github.com/dherault/serverless-offline/commit/44b284afecf64d4d60b963db04e93e130cae5cf9)
- Add docker node.js 8.10 test [`6fea7fe`](https://github.com/dherault/serverless-offline/commit/6fea7fed69c0dd95554e3466ad225018e3ce09b5)
- Simplify, use promise memoize to pull image once [`3de5ac8`](https://github.com/dherault/serverless-offline/commit/3de5ac879d9a9098f4e52b2c9e085afaeb0fb1f9)
- Extract package in docker runner [`560bee4`](https://github.com/dherault/serverless-offline/commit/560bee4ed727bc6ac47502f379072130f4e0293e)
- Updat deps [`eec4e50`](https://github.com/dherault/serverless-offline/commit/eec4e5018b33f1ac3e28abf74c1d99db43e420b9)
- Update deps [`827a3ef`](https://github.com/dherault/serverless-offline/commit/827a3ef00838b8361abaa25f6c413565382df179)
- Fix finding dynamic ports [`5c4ad25`](https://github.com/dherault/serverless-offline/commit/5c4ad2562fc2b699b658d6c96af70015534d3c25)
- Update deps [`74ecfec`](https://github.com/dherault/serverless-offline/commit/74ecfec6800db0351c80f8e248a42170b90ffa55)
- Remove docker supported runtimes [`74a2dd7`](https://github.com/dherault/serverless-offline/commit/74a2dd7ebddfc37d201aff6aca6c70865a14d775)
- Prevent race condition for assuming docker image has been pulled already [`52c93fb`](https://github.com/dherault/serverless-offline/commit/52c93fb35c81ec037d1abb6e45c655052eaff1d9)
- Unskip test [still skip on linux] [`3b11618`](https://github.com/dherault/serverless-offline/commit/3b116187e185d906992fd61d3b4e06e46d9de08e)
- Update deps [`3e623f6`](https://github.com/dherault/serverless-offline/commit/3e623f6adf3385fd97e37f0ca16024af973a039c)
- Fix test plugin paths [`56cb973`](https://github.com/dherault/serverless-offline/commit/56cb973a42cf2385c4ec2d50bab0d470e75cea80)
- Use test.only [`1bcc50f`](https://github.com/dherault/serverless-offline/commit/1bcc50f0fafd7d00a094aaea4da6eba369bcde40)
- Fix docker on linux [`86fd6db`](https://github.com/dherault/serverless-offline/commit/86fd6db106dc9677da184f086c3bd2440b0ade69)
- Test version in docker nodejs tests [`eae30c9`](https://github.com/dherault/serverless-offline/commit/eae30c9ad54863fdf9c2521a7fb536a8c8d3523f)
- Move docker files into docker-runner folder [`0d4f40b`](https://github.com/dherault/serverless-offline/commit/0d4f40bad4b2bef62b390832badb973ab363705e)
- Use os.platform [`0ee38cb`](https://github.com/dherault/serverless-offline/commit/0ee38cb3231d4436c1e12dbffba4ea43e21548a7)
- Use const with array.push [`abdb061`](https://github.com/dherault/serverless-offline/commit/abdb061cf84bb7ce00361142d08993cb853b87ab)
- Fix package names [`3bddd02`](https://github.com/dherault/serverless-offline/commit/3bddd02bb26399e9e810aeebeaa3fccf3edb9f8a)
- Use nodemon.json in example [`e1238c0`](https://github.com/dherault/serverless-offline/commit/e1238c08026884a5d38cb95b462f50e73d73a9cd)
- Check constructor [`729a706`](https://github.com/dherault/serverless-offline/commit/729a7060445710b54e5ae3f5071f3959a3e71525)
- Load docker runner dynamically [`ea026a9`](https://github.com/dherault/serverless-offline/commit/ea026a9309f0b0c64673f05ad2154760236d58f0)
- Remove "private" field [`9df2a81`](https://github.com/dherault/serverless-offline/commit/9df2a81b68e96d096926a7c6ce958c978d0afae7)
- Move baseImage to utils [`1db4dce`](https://github.com/dherault/serverless-offline/commit/1db4dce70e69c749ad3e5f6e5c40bf762a996674)
- Only allow explicit docker usage for now [`4e29e3a`](https://github.com/dherault/serverless-offline/commit/4e29e3a34d3629f50dc7f32fb814a6f5f73d1920)
- Fix memoized docker image pull [`8146f1c`](https://github.com/dherault/serverless-offline/commit/8146f1ca6912b2f3f97a12e91d43253855914a89)
- Cleanup, reorganize prop order [`62bb08c`](https://github.com/dherault/serverless-offline/commit/62bb08c8d095bda4dd174402682c7f4ec45a0f84)
- Fix serverless-webpack scenario plugin paths [`8a3bd8d`](https://github.com/dherault/serverless-offline/commit/8a3bd8d8ab98c60d47a9be546fbe0820c8e63c98)
- Enable content trust checking when pulling images [`18fe6af`](https://github.com/dherault/serverless-offline/commit/18fe6af0708115fa4d0500fe541f74d7d096f1f6)
- Fix test description [`8aa3b7a`](https://github.com/dherault/serverless-offline/commit/8aa3b7a889a9509cc8bd7deac01113de2bbc96f4)
- Rename method [`7bfa3b5`](https://github.com/dherault/serverless-offline/commit/7bfa3b54d7deda7e393431d46ace455dac8e41a6)
- Move DockerContainer to src/lambda/handler-runner [`3ed7c45`](https://github.com/dherault/serverless-offline/commit/3ed7c45f7f873c9a4a01682b12bbf49f6b7bde71)
- Remove additional variable [`a2699da`](https://github.com/dherault/serverless-offline/commit/a2699da2cc8faf84b78b457d583ca16a8fd4da4c)
- Order nit [`372f264`](https://github.com/dherault/serverless-offline/commit/372f264044a2df80644ec95d8119013748abd9bd)
- Fix broken python2 integration test [`fe89e97`](https://github.com/dherault/serverless-offline/commit/fe89e97fd440ede696ed557e5e76f7777f8ee0c6)
- Skip test for now [`8361363`](https://github.com/dherault/serverless-offline/commit/8361363eb72f570c863c78c948e7577b7c0954e4)
- Fix function name [`b0a6fd6`](https://github.com/dherault/serverless-offline/commit/b0a6fd6a7d59c0a4c19a4e1e7272d5a6332899c2)
- Fix supported runtimes [`55d01d9`](https://github.com/dherault/serverless-offline/commit/55d01d9957f7926882d4b6a7d3514a5832828bd1)
- Remove non-existing field [`f43d5b1`](https://github.com/dherault/serverless-offline/commit/f43d5b1107416e150ea7a10044a067d4fb4b8276)
- Remove unused constant [`26fc743`](https://github.com/dherault/serverless-offline/commit/26fc7431c34fb7f3a4cf784e1ee19b9f8d6b5d64)
- Remove comment [`9f48663`](https://github.com/dherault/serverless-offline/commit/9f486631d74e592a4ebc9017b5a9a6706952bd9c)
- Add temp comment [`9201066`](https://github.com/dherault/serverless-offline/commit/92010662bac22109f494d025e6b182c0bf3a7bcf)
- Add useDocker option description to readme [`4520bbc`](https://github.com/dherault/serverless-offline/commit/4520bbc5f9890bd3c39c26098453805cd0beaf06)
- Fix folder name [`d940e24`](https://github.com/dherault/serverless-offline/commit/d940e24ce61e533e81505cdac6ea69b52bf0b819)
- Merge master [`c087c1e`](https://github.com/dherault/serverless-offline/commit/c087c1e70572565396e5d5beb9c266271ecc2318)
- Remove comment [`fb462db`](https://github.com/dherault/serverless-offline/commit/fb462db0571ee485bbb188ae227c541deaa16f19)
- Rename test file [`2f78b9c`](https://github.com/dherault/serverless-offline/commit/2f78b9c1941d40660c92ff8199716aaaf07e0ef3)

#### [v6.0.0-alpha.53](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.52...v6.0.0-alpha.53)

> 13 December 2019

- Fix python print() and logging, fixes #847 [`#847`](https://github.com/dherault/serverless-offline/issues/847)
- Update example deps [`2e6ebbe`](https://github.com/dherault/serverless-offline/commit/2e6ebbe5c0325bf7370d9337f1efefbb3f714e54)
- Update deps [`31a6e43`](https://github.com/dherault/serverless-offline/commit/31a6e438a8dedffb3c42304c9a25ab10119e2faf)
- Update deps [`244c44e`](https://github.com/dherault/serverless-offline/commit/244c44e13b0b782a2bc73225c2ae78e1acd6a165)
- Update scenario test deps [`3626a78`](https://github.com/dherault/serverless-offline/commit/3626a78f061370cb4c2aaf399ec1c50dbc22e2b7)
- Revert readme [`ccb6417`](https://github.com/dherault/serverless-offline/commit/ccb64177eb5a4d2b2d3b6c1f05045c1462e0bea7)
- Fix skipping tests [`f6588da`](https://github.com/dherault/serverless-offline/commit/f6588da8953ed2614e7b08686ebe43b2be6ee20d)
- Support integration types allowed by serverless [`7726ac5`](https://github.com/dherault/serverless-offline/commit/7726ac51448db89da95055997c1edccbd2f58138)
- Move runners into separate folders [`d6b38a0`](https://github.com/dherault/serverless-offline/commit/d6b38a083bfd8a9b45faec372590a34b0e98ec7a)
- Use test.only [`e9654bf`](https://github.com/dherault/serverless-offline/commit/e9654bf00bdcba6e3eabdcaf49862cce32a3202d)
- Remove console.log [`ee6640b`](https://github.com/dherault/serverless-offline/commit/ee6640b8da1bbdcd78dc9af00d85c13587634dad)
- Add comment [`1ae4dff`](https://github.com/dherault/serverless-offline/commit/1ae4dff131b65aadefd7d87317e0b7befe6d9824)

#### [v6.0.0-alpha.52](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.51...v6.0.0-alpha.52)

> 3 December 2019

- Update deps [`765bba2`](https://github.com/dherault/serverless-offline/commit/765bba2a1f3b1032ab2ae18b06f58767b161ee8f)
- Add more types [`da92cef`](https://github.com/dherault/serverless-offline/commit/da92cef2638eaf6baea8751d18e61ca1011daf53)
- Comment out unused props [`1d2cfb2`](https://github.com/dherault/serverless-offline/commit/1d2cfb20da81415e3b11bc8b4f7de98464a7f816)
- Merge master [`d6df9a9`](https://github.com/dherault/serverless-offline/commit/d6df9a954fec71fc410bc71ed3ac51c2bf76532e)
- Add lambda invoke example [`d2d9972`](https://github.com/dherault/serverless-offline/commit/d2d99729dbdceddd962343c8fe421e44306b616a)
- Initial typescript conversion [`78c3d39`](https://github.com/dherault/serverless-offline/commit/78c3d39243bbdca787425513213528224640b90c)
- Use alpha.47 for examples [`d453858`](https://github.com/dherault/serverless-offline/commit/d453858f3cd546c3baaea43ef02dd1d7af63b537)
- Initial typescript setup [`bd0c809`](https://github.com/dherault/serverless-offline/commit/bd0c8098ccf07563d68aaab9e98f6f521910b28f)
- Restructure readme, add getting started section [`82f83b1`](https://github.com/dherault/serverless-offline/commit/82f83b19680ffbd7a863b32dd154bdcbd3ec7679)
- Restructure readme event source support [`1cde15c`](https://github.com/dherault/serverless-offline/commit/1cde15c4142b16a54bd7e1ddfa19f4bf9931653d)
- Add more types [`b4c973f`](https://github.com/dherault/serverless-offline/commit/b4c973fa6fe5632ab0d273d8da41abb27e55b0c5)
- Add more types [`683428e`](https://github.com/dherault/serverless-offline/commit/683428ec5808d38b944e98ba1171b5ab2666d3e9)
- Re-add supported event sources to readme [`e7dff5d`](https://github.com/dherault/serverless-offline/commit/e7dff5de1050966ea2e2a9fd3b423f47ebe9610a)
- Add more types [`f5283b7`](https://github.com/dherault/serverless-offline/commit/f5283b7a0ff75fa7410a0d492436b9f8f2a4dd16)
- Add more types [`b10b4b3`](https://github.com/dherault/serverless-offline/commit/b10b4b3d33c58d0f75c46bc2d144d61f15397966)
- Use ts-node/register for development [`f7f5df6`](https://github.com/dherault/serverless-offline/commit/f7f5df6f694b88f416287a899cea1b61bad932a3)
- Add http event definition class [`ccae775`](https://github.com/dherault/serverless-offline/commit/ccae775b71626f219fe5effcea47363de9888f75)
- Add serverless types [`919188d`](https://github.com/dherault/serverless-offline/commit/919188da14fe845e4d6419c81d4bd1f7cdd692ec)
- Fix websocket string definition [`683d28d`](https://github.com/dherault/serverless-offline/commit/683d28db1483ec700edbcd0870aa3339f4bd03b0)
- Update deps [`d992ab1`](https://github.com/dherault/serverless-offline/commit/d992ab19cce57d9132c93c995f4a7f440aec417b)
- Add additional schedule example [`28bbf0c`](https://github.com/dherault/serverless-offline/commit/28bbf0c87f6cd4af0f0ff9f6fcb40acff2850030)
- Refactor event definitions [`bff5ac4`](https://github.com/dherault/serverless-offline/commit/bff5ac470eae7db2f9b5d8cc7c7c5e6fa50e3a94)
- Add cli option interface [`a6065c5`](https://github.com/dherault/serverless-offline/commit/a6065c59a308cc29eee5549408ff0f43fcda21bd)
- Fix schedule string definition [`7dcd2fb`](https://github.com/dherault/serverless-offline/commit/7dcd2fb5a49b4b6503f1c79466df66dc512ca751)
- Update deps [`91dadbc`](https://github.com/dherault/serverless-offline/commit/91dadbc9e4168acc41200763a943da51062b7be9)
- Update deps [`2bf098d`](https://github.com/dherault/serverless-offline/commit/2bf098dbbb3a3e29831d319a6c0d4b068cb6440c)
- Update deps [`84d414d`](https://github.com/dherault/serverless-offline/commit/84d414db12350469e318e9880c81bcffef8bda15)
- Rename class [`d8644c5`](https://github.com/dherault/serverless-offline/commit/d8644c5e432305371a89fc550b9ab588be301939)
- Readme, add missing headers [`a6ae0d1`](https://github.com/dherault/serverless-offline/commit/a6ae0d1d90c2af0ba3f0f93495681be43b874073)
- Fix temp types [`b8d5818`](https://github.com/dherault/serverless-offline/commit/b8d5818c28affe771bed7c08b186e042995dadba)
- Fix lambda http server [`1e29dee`](https://github.com/dherault/serverless-offline/commit/1e29dee6ed177d1c8b1a2c81ad826bba32575084)
- Add package.json keywords [`02ea131`](https://github.com/dherault/serverless-offline/commit/02ea13183f266b2cdd8613fed435d44836a8e281)
- Remove private access modifiers [`c974486`](https://github.com/dherault/serverless-offline/commit/c974486a2000332f76127a04a8c9365666cd5540)
- Fix build [`1b74712`](https://github.com/dherault/serverless-offline/commit/1b74712094f9f52763ee34346b9ef29196d45206)
- Remove comments [`59014ed`](https://github.com/dherault/serverless-offline/commit/59014edf64b061a126bc4b50f216d890f011b2af)
- Fix test types [`6ffa0bf`](https://github.com/dherault/serverless-offline/commit/6ffa0bf42e6baf9b564143fe19f0a3782b828e82)
- Fix types [`3174a59`](https://github.com/dherault/serverless-offline/commit/3174a595cfcebb4f9f77210a73e7123d0ccbac5f)
- Remove unused properties [`55d4037`](https://github.com/dherault/serverless-offline/commit/55d403704dce28b3fa7308b756832d8b555dc907)
- Fix types [`41e475c`](https://github.com/dherault/serverless-offline/commit/41e475cc5e93c01ff9b13fceb99ba832c8c0f5ec)
- Remove comments [`1b5cf62`](https://github.com/dherault/serverless-offline/commit/1b5cf6231b1dc27968a662c0d100e6b2fe855a3c)
- Fix readme link [`0e4d6bf`](https://github.com/dherault/serverless-offline/commit/0e4d6bfdb3ad7d169b609f7287c75dc093e75632)
- Readme fix [`e3d3051`](https://github.com/dherault/serverless-offline/commit/e3d3051e47d4035ae087a77bf105843e49cd6b3d)
- Fix headline [`9bde249`](https://github.com/dherault/serverless-offline/commit/9bde2496b45da25ed17b6a3f0f5abbe5ca436d79)
- Fix spelling [`1269ad0`](https://github.com/dherault/serverless-offline/commit/1269ad095d6922e6149c58c68bb6191897b4d7e9)
- Readme, add line break [`f06949a`](https://github.com/dherault/serverless-offline/commit/f06949ad951309a6c22d4cb3ad52c87f00514ced)
- Merge master [`b5daabf`](https://github.com/dherault/serverless-offline/commit/b5daabfd1ffbf853ffbc15c8cec7080d8b19c373)
- Merge master [`89cd123`](https://github.com/dherault/serverless-offline/commit/89cd123d1ff07fc5d1ed58be3fe46b87e8eee111)
- Merge master [`f4b4ea1`](https://github.com/dherault/serverless-offline/commit/f4b4ea101f6bbea7d159891aa87d656af591f7c1)
- Merge master [`31492d5`](https://github.com/dherault/serverless-offline/commit/31492d5e7f8abcf0e66fa4dd7508ca8ce55792c6)
- Merge master [`ffb024b`](https://github.com/dherault/serverless-offline/commit/ffb024b6212f9c38279fe8e669616bf072d7a08b)
- Merge master [`72afeb6`](https://github.com/dherault/serverless-offline/commit/72afeb61de4001661544e3c16ea2d61c7feb7f0d)
- Merge master [`1181cf3`](https://github.com/dherault/serverless-offline/commit/1181cf3258c0ca52555e46ef99f79e0333787509)
- Merge master [`a9070ab`](https://github.com/dherault/serverless-offline/commit/a9070ab83ba01dbe08f043bb148adc98023e71ac)
- Merge master [`c9b0cdb`](https://github.com/dherault/serverless-offline/commit/c9b0cdb8c932f76c7e73ed5adf13967dcdb84fa6)
- Merge master [`8ca6092`](https://github.com/dherault/serverless-offline/commit/8ca6092f7efec6395d7e46604323a84777f6e22a)
- Remove commented code [`617f976`](https://github.com/dherault/serverless-offline/commit/617f976e6d811f4f6a1908e8099376163d327065)
- Add hooks and commands types [`dc00eda`](https://github.com/dherault/serverless-offline/commit/dc00eda64f91b41be12dfff5cb515c2c9c16f433)
- Rename parameter [`595fd39`](https://github.com/dherault/serverless-offline/commit/595fd39734917e94e93ad86273a50e9ab6287ca5)
- Remove babel-build [`efbffc0`](https://github.com/dherault/serverless-offline/commit/efbffc0ae430c6bcb1734b48d52cef33d698db59)
- Merge master [`25252a2`](https://github.com/dherault/serverless-offline/commit/25252a2d169f8c45d80a80a812bc693695282c63)
- Point travis build badge to master [`a249d73`](https://github.com/dherault/serverless-offline/commit/a249d737c1717c38d2c355a756c90ef10e853893)

#### [v6.0.0-alpha.51](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.50...v6.0.0-alpha.51)

> 1 December 2019

- Use v6.0.0 alpha 50 in examples [`b3efaa3`](https://github.com/dherault/serverless-offline/commit/b3efaa30e8cf7890f645b5e3449b9148cdf86c1a)
- Pass serverless instance [`219682c`](https://github.com/dherault/serverless-offline/commit/219682cecf25b8f5105bec15681140ede7084a57)
- Add schedule event example and definition support [`2516746`](https://github.com/dherault/serverless-offline/commit/25167467e93f1f365ec77cd7ed39e0fbca9d552e)
- Remove unused function definition from web socket event [`0d3f022`](https://github.com/dherault/serverless-offline/commit/0d3f022bd12a8563d98eeea234af307a29dca85e)
- Update deps [`a8ded1e`](https://github.com/dherault/serverless-offline/commit/a8ded1e97ad76131e07204ba63f97a4c193aa840)
- Add websocket event examples and definition support [`276b115`](https://github.com/dherault/serverless-offline/commit/276b1158bace44dcfd38a91e5e0bad17f20d8e40)
- Remove unused function parameters [`0f05d66`](https://github.com/dherault/serverless-offline/commit/0f05d66c1bca91ad2b0f1742d75266eb6059945c)
- Add http example [`bd847f5`](https://github.com/dherault/serverless-offline/commit/bd847f52a0df1ddf5ad41656206f35a63f3c0b7d)
- Only pass handler to http event, remove function definition [`10c14f9`](https://github.com/dherault/serverless-offline/commit/10c14f9b5bea250d997f964c4d29f50dc3bf7a70)
- Move create api key function to own file [`984061c`](https://github.com/dherault/serverless-offline/commit/984061cb3f168aa22e29dc9002ffbe2ed5932b0c)
- Add http examples and preliminary supported config definitions [`5688e0a`](https://github.com/dherault/serverless-offline/commit/5688e0aeb124b1d80a1f6befaafbc8907a6e03d7)
- Move create api key function [`6ce0825`](https://github.com/dherault/serverless-offline/commit/6ce08252dcb28c6fc19372532ce13454e662606d)
- Add event sections [`44927fa`](https://github.com/dherault/serverless-offline/commit/44927fa0213ef53d6ef63b4dbbadda2e740c032b)
- Add supported events section in readme [`5592eba`](https://github.com/dherault/serverless-offline/commit/5592eba18e8ca8f6fd8a6e9a794bb8695ec6490d)
- Make mergeOptions private [`e74dbcd`](https://github.com/dherault/serverless-offline/commit/e74dbcd8ecd8c2dc6116a0d2b47e748dbd053023)
- Rename constructor options [`a8b0b65`](https://github.com/dherault/serverless-offline/commit/a8b0b65b65dce0ceec716d9b4a127dbeff544a8a)
- Fix readme links [`56cf6ce`](https://github.com/dherault/serverless-offline/commit/56cf6cec094cd7a372c5b33956f531c3caaa0525)
- Simplify readme [`4cc4b19`](https://github.com/dherault/serverless-offline/commit/4cc4b195d8b6ca19c6ccf082f99ed3610412e234)
- Remove private serverless version field [`e27e215`](https://github.com/dherault/serverless-offline/commit/e27e215c68349204b6f2e0dbbb23810704f190bb)
- Rename options to commandOptions [`59c6b14`](https://github.com/dherault/serverless-offline/commit/59c6b140ef04e41fad71127588fd82b18834b172)
- Add icon legend [`416d138`](https://github.com/dherault/serverless-offline/commit/416d1384644c69d79c06c538a35295e2e4083f79)
- Simplify adding to plugins [`d3e3232`](https://github.com/dherault/serverless-offline/commit/d3e323287b0118248ce11f5b664ee4a4714793d5)
- Add main link to supported config items [`b9745ed`](https://github.com/dherault/serverless-offline/commit/b9745ed57f0e3e08fee1a1f91b3c9d2e3eb4a1dd)
- Move private prop [`a03c4bf`](https://github.com/dherault/serverless-offline/commit/a03c4bf2fc175feaaac6209d057a2d79f7a04f50)
- Add lambda port to Readme [`3187970`](https://github.com/dherault/serverless-offline/commit/31879703783ea90f89a748a485effed5d4a1c129)
- Fix table separator [`cda4f78`](https://github.com/dherault/serverless-offline/commit/cda4f7836e8ed85d1d194375ab2cfe480a613d8a)
- Fix readme [`f6429aa`](https://github.com/dherault/serverless-offline/commit/f6429aab40321804c88752dd054418f85b8101ff)
- Lowercase yaml [`581a7d2`](https://github.com/dherault/serverless-offline/commit/581a7d2c332b56320b155321ac96aefe837022df)
- Remove console log [`9a9d819`](https://github.com/dherault/serverless-offline/commit/9a9d819abae655785c7b855c351da2be7a7acc03)
- Remove comment [`3e4d11d`](https://github.com/dherault/serverless-offline/commit/3e4d11d282e8e996a4bf044894e6649921c82ea5)

#### [v6.0.0-alpha.50](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.49...v6.0.0-alpha.50)

> 28 November 2019

- Use separate http server for lambda.invoke, fixes #843 [`#843`](https://github.com/dherault/serverless-offline/issues/843)
- Move execution time log to lambda function [`7a255c4`](https://github.com/dherault/serverless-offline/commit/7a255c4ed658a455800e354e9183744295c0f469)
- Update deps [`6667b87`](https://github.com/dherault/serverless-offline/commit/6667b873c35200fa2e9e6138ea4f6767ba8f1940)
- Move request id generation to lambda function [`e4e3b5c`](https://github.com/dherault/serverless-offline/commit/e4e3b5ce006270bf4df098d3efc9032b5b2b6f6e)
- Rename runner classes [`6b9066f`](https://github.com/dherault/serverless-offline/commit/6b9066f679c8b63ce61c4c3c63335ad197acd2c0)
- Rename runner classes [`ef4d9e8`](https://github.com/dherault/serverless-offline/commit/ef4d9e81f64be109daa134426f39a42ce89881bc)
- Return Promise [`3fb1c5f`](https://github.com/dherault/serverless-offline/commit/3fb1c5fedf686856275b2df8d47bbd812cc5127b)

#### [v6.0.0-alpha.49](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.48...v6.0.0-alpha.49)

> 27 November 2019

- Add invocation type 'Event' to lambda.invoke, fixes #843 [`#843`](https://github.com/dherault/serverless-offline/issues/843)
- Add preliminary github issue templates [`852a3e9`](https://github.com/dherault/serverless-offline/commit/852a3e9d07d68662f78d45c6c6fc7489b783c4f2)
- Add client context to lambda invoke [`6ddbe41`](https://github.com/dherault/serverless-offline/commit/6ddbe414fde0258f1db0a52a78e1482e08594e08)
- Add preliminary contribution guidelines [`900e1de`](https://github.com/dherault/serverless-offline/commit/900e1de8ec02384edfce5a26f0aa6598fb6e2c12)
- Rename test handler files [`d16f5e0`](https://github.com/dherault/serverless-offline/commit/d16f5e0260bde805904bc327f6853fbab0ed4300)
- Fix lambda invoke with no payload [`f4b433b`](https://github.com/dherault/serverless-offline/commit/f4b433bf43e7a7481f3f15f9221ab011539ce205)
- Refactor setting request id on lambda context [`c81599d`](https://github.com/dherault/serverless-offline/commit/c81599da0586ae4e6e84dd1b7fa89ba712ffbefb)
- Update deps [`67bcbb7`](https://github.com/dherault/serverless-offline/commit/67bcbb7488dbe77f451006f9e29dedacb2beeaca)
- Add test for asyncronous lambda invoke (invocation type 'Event') [`6fcd0be`](https://github.com/dherault/serverless-offline/commit/6fcd0be73ec9a2b3b1347877e68dfef0d1d52648)
- Add comments to github issue templates [`f5a944d`](https://github.com/dherault/serverless-offline/commit/f5a944d01a3dedc704d15c4c951199fa8dfcf407)
- Update deps [`13f76ea`](https://github.com/dherault/serverless-offline/commit/13f76eaddf678e144f1708393ce57ff54347fbdc)
- Use single quotes [`e21f4ac`](https://github.com/dherault/serverless-offline/commit/e21f4ac53616a2dbfb766f6ada85176740f35836)
- Add package.json keywords [`4fb5ed1`](https://github.com/dherault/serverless-offline/commit/4fb5ed158cd2e97d423ed465b72bb49fad96abe4)
- Add set client context on lambda function and lambda context [`2ba2cfe`](https://github.com/dherault/serverless-offline/commit/2ba2cfedc8b45f7f9f9efbba9c10b1b9299f60a9)
- Add temporary support message [`37d4563`](https://github.com/dherault/serverless-offline/commit/37d456334f8f0558d9b3eaa528635e9fba4709a4)
- Fix lambda invoke with no payload [`3c660bb`](https://github.com/dherault/serverless-offline/commit/3c660bb65805957ef71481c97277c0093cae856a)
- Point travis build badge to master [`973694a`](https://github.com/dherault/serverless-offline/commit/973694a00aea156746129f2801c365a0b39a3698)

#### [v6.0.0-alpha.48](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.47...v6.0.0-alpha.48)

> 24 November 2019

- Add lambda invoke example [`4a939e8`](https://github.com/dherault/serverless-offline/commit/4a939e810a863bdd3fef148ae530985ea2428100)
- Use alpha.47 for examples [`6fcdca7`](https://github.com/dherault/serverless-offline/commit/6fcdca73d957df98ac7cd0b661d9dc56df49c664)
- Add http event definition class [`5b200b9`](https://github.com/dherault/serverless-offline/commit/5b200b96e48b4ddb22b563344f7f0ada3709f00f)
- Fix websocket string definition [`b56f9ca`](https://github.com/dherault/serverless-offline/commit/b56f9caf0cd3e46b6ae8a503687dbd0022564112)
- Add additional schedule example [`722c346`](https://github.com/dherault/serverless-offline/commit/722c346ecc609e5897682a24cdf8a09f9f26a25c)
- Refactor event definitions [`54b0401`](https://github.com/dherault/serverless-offline/commit/54b040103ad37249c7e4c1939fdf0ce4c2c050a1)
- Fix schedule string definition [`5223425`](https://github.com/dherault/serverless-offline/commit/52234256eb4d3168c5fc1f7aaba138e7c8086712)
- Rename class [`c3c4cf5`](https://github.com/dherault/serverless-offline/commit/c3c4cf531b2668664ac2cdc86ef22f2380d1d9ec)
- Remove commented code [`c886517`](https://github.com/dherault/serverless-offline/commit/c886517e02fdbfc47560f0a454e440d9d9aca9f2)
- Rename parameter [`ff752c1`](https://github.com/dherault/serverless-offline/commit/ff752c1639235d68592c78c93ba1565d3b7b63a1)

#### [v6.0.0-alpha.47](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.46...v6.0.0-alpha.47)

> 23 November 2019

- Add package.json to event examples [`125dc0c`](https://github.com/dherault/serverless-offline/commit/125dc0cf99441ee1b36d4534156dd5a5bc39d51b)
- Update examples dependencies [`5fa2dc0`](https://github.com/dherault/serverless-offline/commit/5fa2dc022e7e028fbcc7ef23f1f17f14ad479f29)
- Update deps [`47f3d09`](https://github.com/dherault/serverless-offline/commit/47f3d091e3549362402636fb1012333a60fa1674)
- Initial schedule event implementation [`a5c0f60`](https://github.com/dherault/serverless-offline/commit/a5c0f60011a789b7d8a59f30acc60ecd77d0b339)
- Extend schedule event support [`1c29984`](https://github.com/dherault/serverless-offline/commit/1c299846e3d2d963de5f46fbb7340a15055a5740)
- Update deps [`5a6c233`](https://github.com/dherault/serverless-offline/commit/5a6c233085cc1239716aa0b01eb3d9ee7cd9515b)
- Remove size check for unflatten [`64a4b70`](https://github.com/dherault/serverless-offline/commit/64a4b70a32e2473c6ff22453f94ed85dc7d2b8fe)
- Move tests/dev folder to examples/events [`c86a4ef`](https://github.com/dherault/serverless-offline/commit/c86a4efd21d41f07374d1cc83789150d463c98db)
- Use node.js 12.x in examples [`150c8cc`](https://github.com/dherault/serverless-offline/commit/150c8cc5cc0d0207402a97a20793c8aeaf3f060b)
- Fix header type [`5510874`](https://github.com/dherault/serverless-offline/commit/55108746cc2a57cbf452669d0aa4c5e1798b6a2e)
- Use log warning [`778c636`](https://github.com/dherault/serverless-offline/commit/778c636d484b882387291a8e9b32e5eba85f5417)
- Use import statement [`cacab09`](https://github.com/dherault/serverless-offline/commit/cacab0930d35f3ddd945535617349de45f9a7cec)
- Switch destructuring position [`d042f61`](https://github.com/dherault/serverless-offline/commit/d042f617405e7b01315d6ebbf038847c18394107)
- Remove rollup comments [`50b33c3`](https://github.com/dherault/serverless-offline/commit/50b33c3d29de65996b41cc1e6ba0c564f39bb890)
- Raise peer dependency version requirement [`abac840`](https://github.com/dherault/serverless-offline/commit/abac840351c230c0ba474620c87114b113cc2be4)
- Rephrase warning message [`71a0c3c`](https://github.com/dherault/serverless-offline/commit/71a0c3cc9e65d43b1007a27676c3c536cb5ff2a3)
- Rename function [`d3b3901`](https://github.com/dherault/serverless-offline/commit/d3b390189ff002af44154eaf784ada0bb8523ecc)
- Remove useless parameter [`91c7fb1`](https://github.com/dherault/serverless-offline/commit/91c7fb12db5e5dbbebd172ac873794bb77a9ac02)
- Add type commonjs to package.json [`74fcf75`](https://github.com/dherault/serverless-offline/commit/74fcf7596355496669b8f59c190efce1b8a0e088)
- Combine examples into tools [`2a85591`](https://github.com/dherault/serverless-offline/commit/2a855914b57c2186fb4f7efa6bcefcc2165792f1)

#### [v6.0.0-alpha.46](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.45...v6.0.0-alpha.46)

> 21 November 2019

- Fix custom authorizer, use Lambda Function class [`5bb8604`](https://github.com/dherault/serverless-offline/commit/5bb860487d5dc31e589a59f8aba40a88e0b88975)
- Add initial custom authorizer tests [`d334c65`](https://github.com/dherault/serverless-offline/commit/d334c65940a876a43823bb5ebe8a6b660261a025)
- Simplify auth event generation [`89875b3`](https://github.com/dherault/serverless-offline/commit/89875b387547d4c016d8ac1434d3687ca64923f9)
- Use function key as lambda lookup key [`af95c87`](https://github.com/dherault/serverless-offline/commit/af95c8743e3f841f47939e3771f6b9b1e0670b0d)
- Use node.js v12.x by default [`f6fcc19`](https://github.com/dherault/serverless-offline/commit/f6fcc1915565ce907a8f3bd6a31252d4ec4d26fc)
- Reduce test timeout [`0d6cb1c`](https://github.com/dherault/serverless-offline/commit/0d6cb1ce9c6250d61a10b9d7dd6254cf248f4602)

#### [v6.0.0-alpha.45](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.44...v6.0.0-alpha.45)

> 20 November 2019

- Update example deps [`d69b9a2`](https://github.com/dherault/serverless-offline/commit/d69b9a2b51b00341eba99aac058b2c884d149706)
- Update deps [`4ead734`](https://github.com/dherault/serverless-offline/commit/4ead7341595cbd780958ace7cc4e0ca7c76eb72c)
- Edit contributors list [`f658424`](https://github.com/dherault/serverless-offline/commit/f6584240370be44b28796e7965c77f95269923a1)
- Update deps [`7e27fde`](https://github.com/dherault/serverless-offline/commit/7e27fdec1e54c8f6628306370fdca4306bd14569)
- Fix test parameters [`4bb42c0`](https://github.com/dherault/serverless-offline/commit/4bb42c00496b89b5850a0ee5caa8cbdecb16f723)
- Upgrade package-lock.json [`eb264b1`](https://github.com/dherault/serverless-offline/commit/eb264b15d42031089a39d344682a107150cac4f3)
- Add python v3.8 to supported runtimes [`16c4de6`](https://github.com/dherault/serverless-offline/commit/16c4de69600b519e75b149add5ba838e6a2a1306)
- Add nodejs 12.x to supported runtimes [`5102051`](https://github.com/dherault/serverless-offline/commit/51020510e16c54d0c9ddaf24cac7a9a314a4136b)
- Remove useless constructor parameter [`0a4ceb2`](https://github.com/dherault/serverless-offline/commit/0a4ceb2799168b7a3a4485672b7c910e3bb4ae06)

#### [v6.0.0-alpha.44](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.43...v6.0.0-alpha.44)

> 17 November 2019

- Update deps [`569e38f`](https://github.com/dherault/serverless-offline/commit/569e38f03b9537236e0bf14b71e17208729d71cc)
- Update deps [`3c6275b`](https://github.com/dherault/serverless-offline/commit/3c6275b6dfea9039e420a3e79be4abc44403df0e)
- Rename function definition [`ca320e0`](https://github.com/dherault/serverless-offline/commit/ca320e03b7011e823e534200802e3e5493a1293d)
- Update deps [`fe21e1d`](https://github.com/dherault/serverless-offline/commit/fe21e1d345dcebe320e4f20e51c8adbbdafa166d)
- Update deps [`f0c63fe`](https://github.com/dherault/serverless-offline/commit/f0c63fe1820cd2d34b787d64dbc4ae9f25e8de41)
- Fix prettier [`5e573ea`](https://github.com/dherault/serverless-offline/commit/5e573ea98c6d7b5e93940c0e22d66f01ec7b8f95)
- Fix test [`f597f28`](https://github.com/dherault/serverless-offline/commit/f597f28ea6590f5f21cd489fccd60b225d43dc97)
- Temporary remove schedule parameters [`4956230`](https://github.com/dherault/serverless-offline/commit/4956230912f26d40f0fea78ab5fe0dbdbfe4085f)
- Add options.location for serverless webpack compatibility in case of custom authorizer fixes dherault#787 [`df26bb7`](https://github.com/dherault/serverless-offline/commit/df26bb74aa48428a73f731de6c092fd32e68f349)
- Fix prettier [`3edfb57`](https://github.com/dherault/serverless-offline/commit/3edfb57b761c595177b940a4da1f57bf27567de2)
- Fix upgrade notification [`40ea502`](https://github.com/dherault/serverless-offline/commit/40ea502c5a9bface1ba1685f50527dc307443d5a)
- Fix createEvent destructuring bug for websocket [`20f4f42`](https://github.com/dherault/serverless-offline/commit/20f4f42c57fb4c17ee97bc3de116f4ac109aca50)
- Remove node.js version 8.x from support [`50936a0`](https://github.com/dherault/serverless-offline/commit/50936a0344285b8579cf2cd1588ae6a94561d271)

#### [v6.0.0-alpha.43](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.42...v6.0.0-alpha.43)

> 5 November 2019

- [docs] Improve command to test installation [`#831`](https://github.com/dherault/serverless-offline/pull/831)
- Update scenario test deps [`1d6c276`](https://github.com/dherault/serverless-offline/commit/1d6c276c8b89803c719ad119f50497cd022ce759)
- Update deps [`9fb1dc8`](https://github.com/dherault/serverless-offline/commit/9fb1dc887ac978377df9ecf62259c991f1313c72)
- Update deps [`566b895`](https://github.com/dherault/serverless-offline/commit/566b89506bda70bcca0ae75d9e3bfb5ea3ab36be)
- Refactor event modules loading [`76a2057`](https://github.com/dherault/serverless-offline/commit/76a20574a4617068dbceb8fcfb49c1d91bcd0f31)
- Update deps [`6bb339a`](https://github.com/dherault/serverless-offline/commit/6bb339a553535594ad36351c337ecc7fefcd57b5)
- Move end method [`82fa394`](https://github.com/dherault/serverless-offline/commit/82fa394c9fc3b805d20d43317478c408de0c31eb)
- Rewrite plugin instantiation for integration tests [`503fc48`](https://github.com/dherault/serverless-offline/commit/503fc48217ebb38e8d69d858a7e51aa953929225)
- Run integration tests against build [`7189e76`](https://github.com/dherault/serverless-offline/commit/7189e760569330ffe3565778d439abf3eecdeaa3)
- Rename methods [`dca49cd`](https://github.com/dherault/serverless-offline/commit/dca49cd82114630c7b754d53ca3a5bd9f2b2c040)
- Performance, use Promise.all for cleanup [`7037735`](https://github.com/dherault/serverless-offline/commit/703773506055c83259af6ac092742079ec55393d)
- Fix websocket catch-all-route [`8b5df7e`](https://github.com/dherault/serverless-offline/commit/8b5df7eada378b100e0953e7ceaf1147f3486395)
- Add myself (github.com/dimadk24) to contributors [`d3387b4`](https://github.com/dherault/serverless-offline/commit/d3387b4e47d4fe622c9a52a1e842f3d9879e3315)
- Remove useless function bind [`6691bbf`](https://github.com/dherault/serverless-offline/commit/6691bbfdd7886797a9b207b1e94e248e37e1cfad)
- Improve command to test installation [`23dd02c`](https://github.com/dherault/serverless-offline/commit/23dd02ca96825dfc801c51cd2dcae17fa7d8e4da)
- Pass fetch to apollo client for graphql scenario test [`d44142e`](https://github.com/dherault/serverless-offline/commit/d44142ed230d0eb656a33c1b8614635732dfc85a)
- Fix websocket events parsing [`7a0fe92`](https://github.com/dherault/serverless-offline/commit/7a0fe92045a5ffd08b1b96ec9c13bd45acedfbc0)
- Rename additional test file [`b57987e`](https://github.com/dherault/serverless-offline/commit/b57987edd6953e11adb0054daba8d7f35de2ba86)
- Rename test files [`9875fbb`](https://github.com/dherault/serverless-offline/commit/9875fbb1b1f095352b104adf0b40feffaa424b6e)

#### [v6.0.0-alpha.42](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.41...v6.0.0-alpha.42)

> 26 October 2019

- Remove require cache invalidation from README, fixes #793 [`#793`](https://github.com/dherault/serverless-offline/issues/793)
- Add example using serverless-webpack [`95f89f5`](https://github.com/dherault/serverless-offline/commit/95f89f50de17a4e7cc8853f2c6d02236638d6849)
- Add example for usage with nodemon [`a8b743b`](https://github.com/dherault/serverless-offline/commit/a8b743bb5dbbfe353456a3f98ff7f63b6d6f4d9d)
- Add example using @babel/register [`4dd68fb`](https://github.com/dherault/serverless-offline/commit/4dd68fb13e24704b1ad93f68241e199f68ece080)
- Add example using ts-node [`ebe0421`](https://github.com/dherault/serverless-offline/commit/ebe0421e889383e2e26a34d1e917d2e60bdbf376)
- Add example for usage with esm [`eb1f045`](https://github.com/dherault/serverless-offline/commit/eb1f0451df4b8457387f86910021b51fe180e489)
- Add serverless-webpack scenario test [`b778025`](https://github.com/dherault/serverless-offline/commit/b778025236e642ac7a96a6c8aad0d07bfd195ac6)
- Use 'next' (latest alpha) in examples [`7f51680`](https://github.com/dherault/serverless-offline/commit/7f51680427373afc47cf39cc9b1782cc6c0d3747)
- Update deps [`d8a745a`](https://github.com/dherault/serverless-offline/commit/d8a745aef13d01122570f7cd08c8cef03673fb69)
- Remove rollup build [`cc7eb43`](https://github.com/dherault/serverless-offline/commit/cc7eb43b70c824da9b3e8fa153881a41907fd86a)
- Update deps [`7b101dc`](https://github.com/dherault/serverless-offline/commit/7b101dc1c8250b4ded92a892bf9afa4d38a22d88)
- Update deps [`1eb6b4b`](https://github.com/dherault/serverless-offline/commit/1eb6b4bb19680cce7a0f21d2a21e294a434ff589)
- Update deps [`76c077f`](https://github.com/dherault/serverless-offline/commit/76c077f9f766fb1c85f0b0d47af1ee99a8cb5ba1)
- Update deps [`531beda`](https://github.com/dherault/serverless-offline/commit/531beda8fc188cea445027428cba970b8f9f4912)
- Update deps [`52b6d61`](https://github.com/dherault/serverless-offline/commit/52b6d61adacc16c30da3b903d5b5298047c9cc57)
- Update deps [`3082e89`](https://github.com/dherault/serverless-offline/commit/3082e890c7680e023de2ede5c56368cd0dacb374)
- Update deps [`7144f34`](https://github.com/dherault/serverless-offline/commit/7144f34667039a06d865927df5a7d0c85b2c58a4)
- Update deps [`0345d01`](https://github.com/dherault/serverless-offline/commit/0345d018baf9889f56fdc1c81b834e77c0ef39cc)
- Update deps [`452eb36`](https://github.com/dherault/serverless-offline/commit/452eb3655f63bb151fe85367df1e44cc88788e91)
- Rename tests folder (non-unit-tests) [`5e6ab13`](https://github.com/dherault/serverless-offline/commit/5e6ab13ec7d6042638f214a6981f06a70977fbd8)
- Fix babel es-module build [`f6f3cd5`](https://github.com/dherault/serverless-offline/commit/f6f3cd56bc210cae62b676faa274f64bf40b1b2c)
- Move api gateway and api gateway to events folder [`df22f45`](https://github.com/dherault/serverless-offline/commit/df22f45a0676dced63e7d38b9d750dcf31522801)
- Rename classes and fields [`f3082a7`](https://github.com/dherault/serverless-offline/commit/f3082a7e323c060d4d4086bff533b363df7854f3)
- Update deps [`597d404`](https://github.com/dherault/serverless-offline/commit/597d4047e5fa3438b32a7dfff4bc9e93562b72d6)
- Update deps [`578fe63`](https://github.com/dherault/serverless-offline/commit/578fe63ce5771979882b49f5ff3ecaa9582b829a)
- Update deps [`abe66e1`](https://github.com/dherault/serverless-offline/commit/abe66e134c5cfe7b1c1499236b1d2f06888e632d)
- Fix typo [`2fa9aea`](https://github.com/dherault/serverless-offline/commit/2fa9aeaf7a59a1f63426d403f574b45faa35a087)
- Update deps [`73c7d87`](https://github.com/dherault/serverless-offline/commit/73c7d877c61f601a160df65c2023224b3a7995a4)
- Use serverless methods to get function definitions [`5c79075`](https://github.com/dherault/serverless-offline/commit/5c79075c37b11feaa6cf938c6404cfeb8057ccbf)
- Move important section in README [`2bc5ff1`](https://github.com/dherault/serverless-offline/commit/2bc5ff1e0dce1c6987595d552f12ca747b349f9a)
- Pass cli commands through process.argv to serverless test instance [`22b2ccf`](https://github.com/dherault/serverless-offline/commit/22b2ccfd4fa92f19a4e62ad7b01ccc86bae73f1a)
- Add skeleton for schedule event [`ac43b24`](https://github.com/dherault/serverless-offline/commit/ac43b247f60f06bf832cf896b5fb306ba71613e7)
- Simplify lambda context constructor parameters [`6fa2065`](https://github.com/dherault/serverless-offline/commit/6fa206559b8e91f309215c69291d01f1fcf5a1fb)
- Instantiate lambda context in lambda function constructor [`d80db7a`](https://github.com/dherault/serverless-offline/commit/d80db7a77f6576b18116af1978dcfb018eb16021)
- Use hasEvents directly [`f1033c8`](https://github.com/dherault/serverless-offline/commit/f1033c88c44857db9086f40b859484a1ecedfcd3)
- Reference main.js for tests [`1729b00`](https://github.com/dherault/serverless-offline/commit/1729b00291bcd6fe720b4e095a227adc7d36bed4)
- Fix unit tests [`d8c8ad2`](https://github.com/dherault/serverless-offline/commit/d8c8ad296b2ea8e0fd173fc8ed7a5ca8d472ad6d)
- Fix tests, serverless starts plugin already [`4660a97`](https://github.com/dherault/serverless-offline/commit/4660a97782deb31cfe70067f90ce568bf8ac50c1)
- Remove getter/setter [`97c6482`](https://github.com/dherault/serverless-offline/commit/97c6482f4634455f3dcced16a56ec072952a2d90)
- Performance, start servers simultaneously [`79837cb`](https://github.com/dherault/serverless-offline/commit/79837cbac111f6f05e649ca60c50b528f4483484)
- Rename api-gateway folder to http [`4591e02`](https://github.com/dherault/serverless-offline/commit/4591e0283c30a0fe4f1c3a17428ad17232432daf)
- Remove unused parameter [`1153bcc`](https://github.com/dherault/serverless-offline/commit/1153bccfb455ffcb3b7a0b6c0a85ee42fabdb40f)
- Make status public [`207ac27`](https://github.com/dherault/serverless-offline/commit/207ac272df021f5e1c0c784d7f7fb2ed9766addc)
- Reactivate http event condition [`68087be`](https://github.com/dherault/serverless-offline/commit/68087be97b81ec79a50d505b47f35a2006cde152)
- Move decoding and JSON parsing to route handler [`95db51f`](https://github.com/dherault/serverless-offline/commit/95db51f34558c9965122ebed128609d0394a3eb8)
- Don't await server start and stop [`54bb67c`](https://github.com/dherault/serverless-offline/commit/54bb67c962b3113ec9bb87541555e69fe0dec453)
- Add eslint config to examples [`4f3460b`](https://github.com/dherault/serverless-offline/commit/4f3460b8f9ec5bde4c412b4dfe08c3e8f378b3f6)
- Set clientContext and identity to undefined [`63422a7`](https://github.com/dherault/serverless-offline/commit/63422a7f6bf8b2532bab5c770b09b103403a744e)
- Reduce parameter [`afaf233`](https://github.com/dherault/serverless-offline/commit/afaf2333b14879cbd4ce66650c512d4ec914d994)
- Edit Important section links [`f4d2970`](https://github.com/dherault/serverless-offline/commit/f4d2970c00dcbd0b3e09d06619a3d1140c88ea9e)
- Comment out unused private prop [`08cd0a3`](https://github.com/dherault/serverless-offline/commit/08cd0a3b6c8a8da8b6a6e0fddb014ff14d80564b)
- Remove unused props [`3bda4b4`](https://github.com/dherault/serverless-offline/commit/3bda4b475343075bcd0cc873775daa2c13af5931)
- Cleanup [`0637a0a`](https://github.com/dherault/serverless-offline/commit/0637a0af84cded9760ff4abd78dd317ef5e81094)
- Example nits [`ae182e0`](https://github.com/dherault/serverless-offline/commit/ae182e0189cf60c3044f0387f07202cc3a3eb2ed)
- Remove more unused props [`1f10fc4`](https://github.com/dherault/serverless-offline/commit/1f10fc4aa2ba6bf3ec0a32b351dd027106681241)
- Remove dist folder from coverage reports [`9e22001`](https://github.com/dherault/serverless-offline/commit/9e22001b9302dda32b9d32011faab1a21a37fca3)
- Fix windows build [`440e15d`](https://github.com/dherault/serverless-offline/commit/440e15d70d1dfff4de228a9b4c5f195add2d3e5d)
- Order nit [`b39b598`](https://github.com/dherault/serverless-offline/commit/b39b598f4b92b95e932a7db47a6f61ea8207c5a4)
- Spelling fix [`fd342b5`](https://github.com/dherault/serverless-offline/commit/fd342b52c6f0a3a949f219e031cc142d9ee1e6ed)
- Rename api-gateway-websocket folder to websocket [`237e79e`](https://github.com/dherault/serverless-offline/commit/237e79e06c07182d22b30fa66549225b7472f9aa)
- Add node.js v13 to travis [`b39dc8e`](https://github.com/dherault/serverless-offline/commit/b39dc8e94b5c19bc2a284fd6597b7effeb6a244f)
- Remove unused events from lambda invoke test [`15fc8e0`](https://github.com/dherault/serverless-offline/commit/15fc8e02e499aac0d426ab8e259bda83df270513)
- Fix eslint in examples [`7efef36`](https://github.com/dherault/serverless-offline/commit/7efef36c94cb5ab13acbf01913f595c5bdaf1919)

#### [v6.0.0-alpha.41](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.40...v6.0.0-alpha.41)

> 16 September 2019

- Add please-upgrade-node module, fixes #810 [`#810`](https://github.com/dherault/serverless-offline/issues/810)
- Add http server class to api gateway [`c0d67fc`](https://github.com/dherault/serverless-offline/commit/c0d67fca51e1eeda6f8dd1357b7b5d2ea90e7ed4)
- Update deps [`2c907eb`](https://github.com/dherault/serverless-offline/commit/2c907eb517eff7fc1d8eb1f7d461eb719a7a9bea)
- Update scenario deps [`d0695ce`](https://github.com/dherault/serverless-offline/commit/d0695ce274e30210caff9f6770dd1956ad74f850)
- Update deps [`6fddb37`](https://github.com/dherault/serverless-offline/commit/6fddb376375addb8850b559224ebf2b29a2092a8)
- Move invoke handler into controller logic [`8e62f76`](https://github.com/dherault/serverless-offline/commit/8e62f767dd95d027378ee04c6cb98676726fa5f9)
- Rename functionName to functionKey [`40e35dc`](https://github.com/dherault/serverless-offline/commit/40e35dcaadad9e99d266848f135eafc0249c3ce9)
- Add dev bridge with @babel/register [`c2fe7a3`](https://github.com/dherault/serverless-offline/commit/c2fe7a374c5d0b9a755133f94b17f53256ecda18)
- Update deps [`def17f8`](https://github.com/dherault/serverless-offline/commit/def17f8bbe8c9472966974747b0f4240c8fd3eef)
- Create dedicated invoke route for all lambdas [`665f357`](https://github.com/dherault/serverless-offline/commit/665f357a74919edda221bd580499e3130bf6f021)
- Add lambda.invoke test [`30c7297`](https://github.com/dherault/serverless-offline/commit/30c72977b7692ee714b7f9e25badaaabc9d7b397)
- Don't export lambda pool directly, introduce lambda class [`ab57b90`](https://github.com/dherault/serverless-offline/commit/ab57b90d07077ca2ca7741edc693c1d077513d55)
- Move websocket http routes into controller logic [`0e7a076`](https://github.com/dherault/serverless-offline/commit/0e7a076a5825718726ee1455e2943a2043a45f7b)
- Move @babel/core to dev dependencies [`0843fd5`](https://github.com/dherault/serverless-offline/commit/0843fd53a4de3f15649efbde4bc0a3642bdb34b9)
- Move some lambda function pool parameters into constructor [`8d3d085`](https://github.com/dherault/serverless-offline/commit/8d3d085bdd38d221c694ee522980885a6954c387)
- Fix python and ruby detection in tests [`e0ab30f`](https://github.com/dherault/serverless-offline/commit/e0ab30f6df0726e06e09fdd58d69a4924cac767e)
- Rename lambdaName to functionName [`62a52c8`](https://github.com/dherault/serverless-offline/commit/62a52c898c1edd039cef366dce9983e2e26252b4)
- Update deps [`61e989e`](https://github.com/dherault/serverless-offline/commit/61e989e7b353389bfb54809b63a80dda9249e345)
- Fix readme for Lambda.invoke [`f9934a0`](https://github.com/dherault/serverless-offline/commit/f9934a00fe30d80745b4629cf5f7c5c4051c18d0)
- Cleanup [`b0d0d7f`](https://github.com/dherault/serverless-offline/commit/b0d0d7fc7700749f33ee4f0b686db345fc20834a)
- Update deps [`df3a5aa`](https://github.com/dherault/serverless-offline/commit/df3a5aa80e6deac4649ade3c60cbe5e04fe650bb)
- Apply catch-all-route last [`f4335ef`](https://github.com/dherault/serverless-offline/commit/f4335efb88beeb614c057da947d07998e361c339)
- Some cleanup [`5f5c170`](https://github.com/dherault/serverless-offline/commit/5f5c17084ed8359e534583836ac677ff3c00e34f)
- Move get lambda pool closer to first usage [`5eca9cf`](https://github.com/dherault/serverless-offline/commit/5eca9cfe415b5ff698595ca2ebbb89c180688a26)
- Fix lambda cleanup [`864bf7a`](https://github.com/dherault/serverless-offline/commit/864bf7a976866dc2c56b1a667339ea4d1bf75a81)
- Nits [`9a84eec`](https://github.com/dherault/serverless-offline/commit/9a84eec7a3c3c56eca3d3e424bd60dddca9464a1)
- Rename variable [`b9b41f7`](https://github.com/dherault/serverless-offline/commit/b9b41f7a0e75444c2ba0ea36ddc88021efecd034)
- Move variable into block, use const [`f2a4215`](https://github.com/dherault/serverless-offline/commit/f2a4215217df3218859298f47fb68a0e5e7ec0fe)
- Remove comments [`e21388d`](https://github.com/dherault/serverless-offline/commit/e21388d609d2b63ae5450095bce3bb027704af6e)
- Use JSON.stringify for test [`fa2190f`](https://github.com/dherault/serverless-offline/commit/fa2190f1cd11d6e804544361e064905c76627638)
- Fix dev files [`a20929e`](https://github.com/dherault/serverless-offline/commit/a20929e9345bb1816bae69a57fd534566a45abca)
- Remove commented code [`e5d254a`](https://github.com/dherault/serverless-offline/commit/e5d254a27c0be911709e64a4b3e6746887f3d9bd)
- Remove comment [`76c0e4c`](https://github.com/dherault/serverless-offline/commit/76c0e4cb8f8357fb844968cd457864555afc663e)
- Rename file [`bb20eb8`](https://github.com/dherault/serverless-offline/commit/bb20eb80cdf026527cae1b9e7cfe6b9ae9e12c31)
- Add examples placeholder [`5faa2fe`](https://github.com/dherault/serverless-offline/commit/5faa2fe5f90e2b4d363bc33ab891c304286290aa)

#### [v6.0.0-alpha.40](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.39...v6.0.0-alpha.40)

> 12 September 2019

- Avoid setting empty response headers [`#804`](https://github.com/dherault/serverless-offline/issues/804)
- save authorizer data in authorizer property [`2486dd1`](https://github.com/dherault/serverless-offline/commit/2486dd1cea0d8afe0ad3317e071526905f6c1539)
- Update deps [`595b062`](https://github.com/dherault/serverless-offline/commit/595b062cfbb7c774eed044ce54fde03570434a4b)
- Update deps [`6b6d9a7`](https://github.com/dherault/serverless-offline/commit/6b6d9a7fd50f516ba8169982ad4c117bc8c44b07)
- add lambda proxy authorizer enhancedAuthContext [`d00faa0`](https://github.com/dherault/serverless-offline/commit/d00faa0a0bbbfd247b776e9c9176ad57643bd6d2)
- use principalId instead of user [`d4ef30d`](https://github.com/dherault/serverless-offline/commit/d4ef30d73499e4393ba5ff6ca1d6a3fb2c6dd4f4)
- fix: add missing properties in default velocity template [`34dd35d`](https://github.com/dherault/serverless-offline/commit/34dd35da02458048da810a1d618f038a81ee4f75)
- Remove user from credentials (fixes previous cherry-pick commit) [`54d34c7`](https://github.com/dherault/serverless-offline/commit/54d34c7780aaf73735696735b1f4b55456728584)
- fix: don't pass object to serverlessLog [`70790bb`](https://github.com/dherault/serverless-offline/commit/70790bb3018deb930d14725239cd5aeb8c8cf867)

#### [v6.0.0-alpha.39](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.38...v6.0.0-alpha.39)

> 10 September 2019

- Add another style of policyResource [`#805`](https://github.com/dherault/serverless-offline/pull/805)
- Split InvokeLocalRunner into individual classes for Python and Ruby [`ecae518`](https://github.com/dherault/serverless-offline/commit/ecae518874ca5d783a442031c791842357c4bad1)
- Update deps [`bff8c3b`](https://github.com/dherault/serverless-offline/commit/bff8c3bb1a3971800e44350348957a0b0ae60136)
- Update deps [`669b90c`](https://github.com/dherault/serverless-offline/commit/669b90c6be33cf6921d7c3e7ab974f2826d58145)
- Use child process and worker threads only with nodejs runtime [`963f497`](https://github.com/dherault/serverless-offline/commit/963f497ace38a4c411ce78b85d40f08e8bc8b28b)
- Use supported nodejs in runtime condition [`a99e123`](https://github.com/dherault/serverless-offline/commit/a99e123b4e510ebb462c811041522d5068319f52)

#### [v6.0.0-alpha.38](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.37...v6.0.0-alpha.38)

> 8 September 2019

- Fix http code for deleting websocket connection, fixes #803 [`#803`](https://github.com/dherault/serverless-offline/issues/803)
- Fix query string parameters in websocket connect event, fixes #803 [`#803`](https://github.com/dherault/serverless-offline/issues/803)
- Use jsonPath to get websocket route selection expression [`505b378`](https://github.com/dherault/serverless-offline/commit/505b37882489c9036167ad3888f82ff0a4133224)
- cleanup websocket route selection [`5659627`](https://github.com/dherault/serverless-offline/commit/565962709b0e8fac51b1f4cc1114548d1785d428)
- Update deps [`9cee764`](https://github.com/dherault/serverless-offline/commit/9cee764171cae69941ea76cb699a92a284243103)
- Return always null from websocket connection route handlers [`f8fb724`](https://github.com/dherault/serverless-offline/commit/f8fb72405f24a4057b26b9454ec76dec458057be)
- Fix jsonPath [`0724fd9`](https://github.com/dherault/serverless-offline/commit/0724fd9a06e12a832be22f02a004171a6aec8436)
- Fix route selection expression [`08ed963`](https://github.com/dherault/serverless-offline/commit/08ed9638f59abb6c79ec8d9dc91fa1cc9709a185)
- Use websocket constant [`7da619f`](https://github.com/dherault/serverless-offline/commit/7da619f1b3313221deb3f518fec84b9899f64c2e)
- Import order nit [`f4b24d8`](https://github.com/dherault/serverless-offline/commit/f4b24d8ff9326a57f57c9c1dac07366e53fbd309)

#### [v6.0.0-alpha.37](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.36...v6.0.0-alpha.37)

> 7 September 2019

- Move jsonPath to utils [`858da03`](https://github.com/dherault/serverless-offline/commit/858da0374cbe197df1f0818be672899f9a11b074)
- Fix websocket route handling [`13cc1c7`](https://github.com/dherault/serverless-offline/commit/13cc1c759b70bf96ec4ccd0ad422780c027c37e3)
- Use destructuring [`3a47024`](https://github.com/dherault/serverless-offline/commit/3a47024145b22085dcb0ca356a4660d4f8921fa4)
- Fix payload check [`bb362eb`](https://github.com/dherault/serverless-offline/commit/bb362eb343952f6792e4cd9ff00eb0077cfc50e5)
- Add websockets api route selection expression default to constants [`4588056`](https://github.com/dherault/serverless-offline/commit/45880564cbe42c34e6e420bd68cec50bb8a3e4b0)
- Move Buffer.toString to http routes, specify encoding explicitly [`dac6802`](https://github.com/dherault/serverless-offline/commit/dac6802bc1c1d8a33ffa7b9e975f3786d492327c)

#### [v6.0.0-alpha.36](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.35...v6.0.0-alpha.36)

> 7 September 2019

- Fix headers and multi value headers in websocket connect event, fixes #803 [`#803`](https://github.com/dherault/serverless-offline/issues/803)
- Add query params and multi query params to web socket connect event, fixes #803 [`#803`](https://github.com/dherault/serverless-offline/issues/803)
- Add aws-sdk to dev dependencies [`328942a`](https://github.com/dherault/serverless-offline/commit/328942a4be0e984f483f61268aca81e9068f92ae)
- Rewrite header handling in websocket disconnect event [`59c5b0c`](https://github.com/dherault/serverless-offline/commit/59c5b0cf7aade3943a2d9b664c5efacd4f23a14d)
- Shut down api gateway websocket instance [`a352b9d`](https://github.com/dherault/serverless-offline/commit/a352b9dde5ab33c1e088bc31e336eb47014b9157)

#### [v6.0.0-alpha.35](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.34...v6.0.0-alpha.35)

> 6 September 2019

- Fix web socket events, fixes #803 [`#803`](https://github.com/dherault/serverless-offline/issues/803)
- Update deps [`6a440a2`](https://github.com/dherault/serverless-offline/commit/6a440a2b68ec8e5bc0e458fd29d45bc342b3a0de)
- Add @babel/core [`4d601cd`](https://github.com/dherault/serverless-offline/commit/4d601cdf32839a79caa3910230b17ade83c90169)
- Clarify comment [`ae5ce49`](https://github.com/dherault/serverless-offline/commit/ae5ce49dbb4dc61ac2fc7807442b026b8692cda7)

#### [v6.0.0-alpha.34](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.33...v6.0.0-alpha.34)

> 6 September 2019

- Quick and dirty script to fix rollup bug [`babea3c`](https://github.com/dherault/serverless-offline/commit/babea3cc5fbc16b0ac1416d654f260328d0013c5)
- Move worker thread instantiation into constructor [`1adb8e5`](https://github.com/dherault/serverless-offline/commit/1adb8e55eef84824f9aecda6b516e0de424b7b9e)
- Remove passing timeout parameter to handler runner [`015027b`](https://github.com/dherault/serverless-offline/commit/015027ba56eb00c52075238506b140b080392255)
- Remove unused callback parameter [`2350394`](https://github.com/dherault/serverless-offline/commit/23503943678e572d178b77db2d07de863bb29f50)
- Remove unused lambda function pool from websocket server [`4a9ddc5`](https://github.com/dherault/serverless-offline/commit/4a9ddc5c33572606b1ddc48bceabc5310069db84)
- Don't include interop blocks in rolup build [`9665603`](https://github.com/dherault/serverless-offline/commit/9665603b2b5ec78b2275a8908fd0f48b69802b27)

#### [v6.0.0-alpha.33](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.32...v6.0.0-alpha.33)

> 4 September 2019

- Fix rollup bug (workaround) [`69ba20a`](https://github.com/dherault/serverless-offline/commit/69ba20a510fff996da71bf838fc03ebfc4ebf94e)

#### [v6.0.0-alpha.32](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.31...v6.0.0-alpha.32)

> 3 September 2019

- Remove require cache deletion, --skipCacheInvalidation and --cacheInvalidationRegex options, fixes #766, fixes #798, and plenty others [`#766`](https://github.com/dherault/serverless-offline/issues/766) [`#798`](https://github.com/dherault/serverless-offline/issues/798)
- Update deps [`1416eb7`](https://github.com/dherault/serverless-offline/commit/1416eb73a84ec58538c560a4d70e8a7c980a9be0)
- Rename useSeparateProcesses option to useChildProcesses [`e872a4c`](https://github.com/dherault/serverless-offline/commit/e872a4c7435266c27025bcf87b9a3cb156707847)
- Fix dynamic import [`0300ec7`](https://github.com/dherault/serverless-offline/commit/0300ec77378f86d6af4e5c30ac9b032981a7829d)
- Fix import [`efdb89d`](https://github.com/dherault/serverless-offline/commit/efdb89ddc75ecb1ff223c1f346af62c2de27ca35)
- Remove comment [`a3556e2`](https://github.com/dherault/serverless-offline/commit/a3556e203451345e420117fcb05d4977a7a99ee0)

#### [v6.0.0-alpha.31](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.30...v6.0.0-alpha.31)

> 1 September 2019

- Fix rollup build to include worker thread helper and child process helper [`abfe4de`](https://github.com/dherault/serverless-offline/commit/abfe4deee155a25f45bf752148572e19afd3dfb7)

#### [v6.0.0-alpha.30](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.29...v6.0.0-alpha.30)

> 1 September 2019

- Fix rollup build and Object.fromEntries polyfill, fixes #799 [`#799`](https://github.com/dherault/serverless-offline/issues/799)
- Update deps [`3339089`](https://github.com/dherault/serverless-offline/commit/333908999d0a7a752b3a755fbabf08770ce167d2)

#### [v6.0.0-alpha.29](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.28...v6.0.0-alpha.29)

> 1 September 2019

- Refactor api gateway websocket [`afcd48d`](https://github.com/dherault/serverless-offline/commit/afcd48d8c8604df7cd18380be4abe96a753151eb)
- Refactor api gateway [`1ed26f6`](https://github.com/dherault/serverless-offline/commit/1ed26f6e3ca90bc0713b0caf2d32f8ea0fac36b0)
- Remove unused websocket code [`c5fc9c6`](https://github.com/dherault/serverless-offline/commit/c5fc9c6ede5bf34c919108457ec1ddc09d441c6f)
- Remove --prefix option [`b5cca9d`](https://github.com/dherault/serverless-offline/commit/b5cca9dda6b08e5c58308ed7e30afe53d1e69f79)
- Refactor lambda [`ccaa2f6`](https://github.com/dherault/serverless-offline/commit/ccaa2f68f693573831ea2f084a84f5e956e19a1b)
- Remove --preserveTrailingSlash option [`cf0c216`](https://github.com/dherault/serverless-offline/commit/cf0c216a53a654066dce6a88d0aa252f4eebd382)
- Rename websocket method [`f463555`](https://github.com/dherault/serverless-offline/commit/f463555d89c211d74a2b51d60567e3f89ec0b77d)
- Remove unused plugin register [`e94b313`](https://github.com/dherault/serverless-offline/commit/e94b313b1379aa207d0c3ca2f8d05800e6fc2c86)
- Remove unused functionality [`2da304f`](https://github.com/dherault/serverless-offline/commit/2da304f030f5f748bbdae07c2a65d7b088a088c9)
- Fix comments [`c44f064`](https://github.com/dherault/serverless-offline/commit/c44f06449641815296316179a9a8ebd494c418e0)
- Rename websocket method [`c73399c`](https://github.com/dherault/serverless-offline/commit/c73399c3719b21912e6cf51c190bdd2fb0dca55a)
- Fix npm package build [`eb01c2f`](https://github.com/dherault/serverless-offline/commit/eb01c2fe11f05891de350431bdf7b09e6e78a553)
- Add build step to pre-push git hook [`43f9244`](https://github.com/dherault/serverless-offline/commit/43f9244f024202605f2cfdbdb20ab254399ef740)
- Remove async keyword [`18cce75`](https://github.com/dherault/serverless-offline/commit/18cce756a1476d6bf4f88641838b50423ed0aeff)
- Remobe eslint disable line [`f1ba3e8`](https://github.com/dherault/serverless-offline/commit/f1ba3e8c68246b54a2876683ae6b0ca40b09dee1)
- Re-use length [`2f7bdf2`](https://github.com/dherault/serverless-offline/commit/2f7bdf2ed1de153cae00b6a467a7be262abaf459)
- Remove unused field [`b072032`](https://github.com/dherault/serverless-offline/commit/b07203209c561aac3a0ab3274f1b34f769fdff3e)

#### [v6.0.0-alpha.28](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.27...v6.0.0-alpha.28)

> 30 August 2019

- Use es6 modules, add rollup build step [`892a4b8`](https://github.com/dherault/serverless-offline/commit/892a4b8ee6d8b419693206832af4ae0a08270ab2)
- Update deps [`2c5c0ec`](https://github.com/dherault/serverless-offline/commit/2c5c0ece69f8cbe03200ce728f11ec076a283ac8)
- Restructure some event prop assignments [`6281c9e`](https://github.com/dherault/serverless-offline/commit/6281c9e7935a5f680b528cb967a6d6199c399965)
- Fix formatToClfTime parameter [`509b931`](https://github.com/dherault/serverless-offline/commit/509b931b2159d489362aefeda7ef7083a2cbd98a)
- Add more missing lambda proxy integration event props [`3cd8c2b`](https://github.com/dherault/serverless-offline/commit/3cd8c2b76e551ca439b4634adbcc013483a0da4e)
- Fix npm distribution files [`b49a341`](https://github.com/dherault/serverless-offline/commit/b49a3411182a4e44af45a9fdc4242d8404dc8ed0)
- Hook up event.requestTime [`d17227a`](https://github.com/dherault/serverless-offline/commit/d17227a599a450b9e5d47342c0540ef4bec67609)
- Restrict npm package template extension [`1d114e0`](https://github.com/dherault/serverless-offline/commit/1d114e0f929741afd733c807b200cd8e02087567)
- Fix requestContext.path [`afc67f9`](https://github.com/dherault/serverless-offline/commit/afc67f91af5b54c836d0e12e4962ddb6dc9198fe)

#### [v6.0.0-alpha.27](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.26...v6.0.0-alpha.27)

> 30 August 2019

- Add apiKeyId to request context, fixes #797 [`#797`](https://github.com/dherault/serverless-offline/issues/797)
- Move context methods out of LambdaFunction to InProcessHandler, re-use in worker threads [`6a0b4ed`](https://github.com/dherault/serverless-offline/commit/6a0b4ed67e2191d9c6fc53b5032ebc02e677138b)
- Simplify invoke local runner, remove closure [`94f56d7`](https://github.com/dherault/serverless-offline/commit/94f56d7cc85b84ae5ee64f1ef857c43709298c07)
- Simplify childProcessRunner, re-use inProcessRunner in child process [`b76549e`](https://github.com/dherault/serverless-offline/commit/b76549ebac31f1a7001c46d36b6434dd4ec5be8e)
- Split up supported runtimes and export [`bdfd9ca`](https://github.com/dherault/serverless-offline/commit/bdfd9cafea566b1e61483931306df332fefc525f)
- Use Set [`c0eeca2`](https://github.com/dherault/serverless-offline/commit/c0eeca2d57843a109c7e3c9346b2514cadc46518)
- Use high resolution timer [`b606379`](https://github.com/dherault/serverless-offline/commit/b606379b56d2149cbc525758cdc8295ea002f1b7)
- Fix method name [`b8c3993`](https://github.com/dherault/serverless-offline/commit/b8c3993de2183349587d071de5d75e37ec67ab1b)
- Remove 'go' from suported runtimes [`eaec2af`](https://github.com/dherault/serverless-offline/commit/eaec2af75b7e172c278daef6c9dc979b9b041496)

#### [v6.0.0-alpha.26](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.25...v6.0.0-alpha.26)

> 29 August 2019

- Fix, add misc folder to npm package [`0e3c625`](https://github.com/dherault/serverless-offline/commit/0e3c6259b3eac8ebf20a983f5f745b346743384e)

#### [v6.0.0-alpha.25](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.24...v6.0.0-alpha.25)

> 28 August 2019

- Split websocket helpers into separate classes [`82a21cd`](https://github.com/dherault/serverless-offline/commit/82a21cd2a55c5af72acb70267d41729eac622bd2)
- Replace hapi-plugin-websocket with using ws module directly [`f63b9f0`](https://github.com/dherault/serverless-offline/commit/f63b9f0bb28a0329dafa581b1eb1a0a0a1e51299)
- Make doAction an instance method [`b599901`](https://github.com/dherault/serverless-offline/commit/b599901336ade44af0f554cffb267e3f4a5ba6bf)
- Add create method to websocket events [`a61c03c`](https://github.com/dherault/serverless-offline/commit/a61c03c43dad29a28c2b533a2513b0256103137a)
- Rename even more variables [`0d01af4`](https://github.com/dherault/serverless-offline/commit/0d01af418e347635794312e3afad33850ebea62d)
- Rename more variables [`bad1dce`](https://github.com/dherault/serverless-offline/commit/bad1dcee7ad4137a0711da8e2121afec4b3ce578)
- Use Map for websocket routes [`683f2da`](https://github.com/dherault/serverless-offline/commit/683f2da0d1c8babed9d3ba0622fce3fb398a0296)
- Update deps [`eac675b`](https://github.com/dherault/serverless-offline/commit/eac675b68bafda2cb5029c1b48bc3017d8e529c2)
- Use readFile more often [`ababe58`](https://github.com/dherault/serverless-offline/commit/ababe58df3391ddcb7d5d60bae2341edf846a0f3)
- Remove $default route parameter [`192f220`](https://github.com/dherault/serverless-offline/commit/192f220e6fe5c60e20568ce07170a912114a6f8f)
- Rename variable [`86fea11`](https://github.com/dherault/serverless-offline/commit/86fea11decfb6becd8f3e810642415192f9a8c11)
- Some renaming [`0d78009`](https://github.com/dherault/serverless-offline/commit/0d78009fbd75c250410833396a6c056e0401cd75)
- Switch constructor parameters [`f4f7bea`](https://github.com/dherault/serverless-offline/commit/f4f7bea2805a2b2f87a4e151ddbcc3787208e4a6)
- Rename variable [`5b32644`](https://github.com/dherault/serverless-offline/commit/5b3264431918a8f0ce708572d98a462ec22ace66)
- Rename action to webSocketRoutes [`1732c6c`](https://github.com/dherault/serverless-offline/commit/1732c6c36e71b005d6a6cc7e25d792da8515125b)
- Fix missing new operator [`f275f65`](https://github.com/dherault/serverless-offline/commit/f275f65144b430c897d5aaf8ee7edabfc1f0f1c9)
- Remove process.env.IS_OFFLINE [`331f541`](https://github.com/dherault/serverless-offline/commit/331f5418d7c5c9811354a3438388bb098ef4cb38)
- Use static method [`4f6b783`](https://github.com/dherault/serverless-offline/commit/4f6b78381ddc5d429765e607a01a0fa3b319a495)
- Rename parameters [`349341e`](https://github.com/dherault/serverless-offline/commit/349341eecb31710234fea4d2f01ca520c916612c)
- Use exports [`14d79bc`](https://github.com/dherault/serverless-offline/commit/14d79bc7d63ebeede9cb73facaf3395b4831f393)
- Use function statement [`08431a8`](https://github.com/dherault/serverless-offline/commit/08431a8bd571434bd4224f4d110bfe0cd747993f)
- Order nit [`e8cf618`](https://github.com/dherault/serverless-offline/commit/e8cf6180a864c626c4ad48fc2fc771a3bb12ee35)
- Doc fix [`09bf83f`](https://github.com/dherault/serverless-offline/commit/09bf83fd131dcb2a3bee3fd385cdf497e24d6985)
- Add comment to eslint options [`902aa52`](https://github.com/dherault/serverless-offline/commit/902aa52688fc805f5315028cafc5322e36176fe8)

#### [v6.0.0-alpha.24](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.23...v6.0.0-alpha.24)

> 27 August 2019

- Use connectionId and websocket client as map keys [`defae89`](https://github.com/dherault/serverless-offline/commit/defae8973bcb4f699c2d006a21341be05a5d6fd3)
- Add setRequestId method to LambdaFunction [`c52840b`](https://github.com/dherault/serverless-offline/commit/c52840b86ef3237bfb6d2560a7baee148bbcbca0)
- Add websocket dev folder [`4b88a8d`](https://github.com/dherault/serverless-offline/commit/4b88a8d4b0794be86bd9bbf010a932a559fbfd78)
- Simplify, re-use same function [`1a5b392`](https://github.com/dherault/serverless-offline/commit/1a5b392725afdbd84ac08d7cfd17646be65aa990)
- Simplify, re-use instance field [`f0f2a77`](https://github.com/dherault/serverless-offline/commit/f0f2a779aa5237a23e3946fd4f58730bf2a9c11a)
- Remove query string paramters from websocket event [`17370fd`](https://github.com/dherault/serverless-offline/commit/17370fdb4825490e1254bfdaa0e0a3df875e35cf)
- Rename private field [`9fe4a2f`](https://github.com/dherault/serverless-offline/commit/9fe4a2fc5b81793b09c02ebb41527526ed196c21)
- Rename method [`2924949`](https://github.com/dherault/serverless-offline/commit/29249495652aba8383ad01848bd93684f7e465de)
- Order nit [`8b7a3eb`](https://github.com/dherault/serverless-offline/commit/8b7a3ebc992a16aefab947d88943423297352cfb)
- Move polyfills to misc [`4572689`](https://github.com/dherault/serverless-offline/commit/457268978d11b1f1a76ada16c0ba5948c4e3f308)
- Use remove method [`0dc1af4`](https://github.com/dherault/serverless-offline/commit/0dc1af461430d9aa21da1e934d359ad03e1694e2)
- Rename dev service [`de2599d`](https://github.com/dherault/serverless-offline/commit/de2599dd0f75ecf727c895a23bd0d081292cc02e)
- Use function statement [`5399203`](https://github.com/dherault/serverless-offline/commit/5399203c2566cd0fbbf0a80de46b38f069b69204)

#### [v6.0.0-alpha.23](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.22...v6.0.0-alpha.23)

> 27 August 2019

- Fix stdout handling with Python and Ruby, add payload parser, fixes #742 [`#742`](https://github.com/dherault/serverless-offline/issues/742)
- process.env should be available in the handler module scope, fixes #794 [`#794`](https://github.com/dherault/serverless-offline/issues/794)
- Use getter [`b57c7d2`](https://github.com/dherault/serverless-offline/commit/b57c7d2e1447effaab7b4dd64b6657a62ef68407)
- Log billed duration [`87d3d68`](https://github.com/dherault/serverless-offline/commit/87d3d6888491a4c7133f19301788612b0f438eb1)
- Update deps [`8d1882f`](https://github.com/dherault/serverless-offline/commit/8d1882fedcf83dc189955d0dc0462c2979338441)
- Move dev test to http subfolder [`c4b16df`](https://github.com/dherault/serverless-offline/commit/c4b16df578cb98511cd56615f0c3be4c435b6ed3)

#### [v6.0.0-alpha.22](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.21...v6.0.0-alpha.22)

> 26 August 2019

- Use LambdaFunctionPool for web socket events [`5912e88`](https://github.com/dherault/serverless-offline/commit/5912e88739a0cbbcb800a217ea938f619547f066)
- Update deps [`4ba6b9b`](https://github.com/dherault/serverless-offline/commit/4ba6b9be043518f996e934a8d8900894a8746eaa)
- Update deps [`680c4eb`](https://github.com/dherault/serverless-offline/commit/680c4ebb6a3b6f48ddf9bf4ae95df206f9e52e5a)
- AWS test performance, require modules lazy [`2257cb3`](https://github.com/dherault/serverless-offline/commit/2257cb3fde0f163ddc8d25c86cf777f78e652a88)
- Fix env for Ruby handler [`6f0a1b4`](https://github.com/dherault/serverless-offline/commit/6f0a1b4e9b14f54e61211ef82a1a40a6797f2618)
- Cleanup, remove debug log [`308454f`](https://github.com/dherault/serverless-offline/commit/308454f6032c6065e631695f9be5d37d919babbb)

#### [v6.0.0-alpha.21](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.20...v6.0.0-alpha.21)

> 25 August 2019

- Pass env variables to invoke local runner, fixes #792 [`#792`](https://github.com/dherault/serverless-offline/issues/792)
- Remove useless 'stage' constructor parameter from HandlerRunner [`41f96c0`](https://github.com/dherault/serverless-offline/commit/41f96c08f1ccca6b34c9428a0bcf61d42b2fd6e7)
- Make callbackWaitsForEmptyEventLoop a getter/setter [`08b5dee`](https://github.com/dherault/serverless-offline/commit/08b5dee38a637e1646c7069a77c9095fc3189111)
- Fix HandlerRunner constructor parameters and env handling in createAuthScheme [`1956bcc`](https://github.com/dherault/serverless-offline/commit/1956bccba9296b749d0c39dec72c528c0ccb25b1)
- Fix HandlerRunner constructor parameters and env handling in websocket [`0103655`](https://github.com/dherault/serverless-offline/commit/010365580d23059032c8e3c026dd6d2e2531f396)
- Remove unneeded workaround (fixed now) [`0d71a3d`](https://github.com/dherault/serverless-offline/commit/0d71a3d220ba3baebecb766744995e45c43ce598)
- Remove useless 'stage' constructor parameter [`ef167f3`](https://github.com/dherault/serverless-offline/commit/ef167f365edbc3b2752c862a7aa9633136a2e3c5)
- Fix, memoryLimitInMB is a string on AWS [`b4bdf0e`](https://github.com/dherault/serverless-offline/commit/b4bdf0ef5d71556ea36e1a81d58d2e465a38a69f)

#### [v6.0.0-alpha.20](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.19...v6.0.0-alpha.20)

> 24 August 2019

- Add apollo-server-lambda scenario test [`e275fc8`](https://github.com/dherault/serverless-offline/commit/e275fc8f9b39af74e98be45f68260cd304c7ffc0)
- Update deps [`a0bb716`](https://github.com/dherault/serverless-offline/commit/a0bb716e005344c616e2035b0023e18d5499ca56)
- Fix scoping in authMatchPolicyResourceTest [`a7307d2`](https://github.com/dherault/serverless-offline/commit/a7307d2bb9c412e6dcf4ced8351e1a80f13bca0c)
- Remove and fix eslint rule no-shadow [`6b0f98a`](https://github.com/dherault/serverless-offline/commit/6b0f98a2dbec308a5e332a561c1d4dcf1e0dcd1c)
- Remove and fix eslint rule no-use-before-define [`e802dd8`](https://github.com/dherault/serverless-offline/commit/e802dd8a361fc9aec864cd9d0f917bd1ca1c30d6)
- Fix parse headers, add preliminary tests [`e150b56`](https://github.com/dherault/serverless-offline/commit/e150b569dd5ad248c3eec1618849cc21b0ea5293)
- Scenario test cleanup [`1fe6b56`](https://github.com/dherault/serverless-offline/commit/1fe6b56eb01ecbbd74ab1c1fe135ddf46abde824)
- Add dev folder [`b6ae9ae`](https://github.com/dherault/serverless-offline/commit/b6ae9ae425ec999ab004aa251049b9b2870a1b99)
- Remove and fix eslint rule consistent-return [`cad2d0b`](https://github.com/dherault/serverless-offline/commit/cad2d0b8f13fadd8ed112e36b420dd9767165250)
- Move BASE_URL_PLACEHOLDER to constants [`66df094`](https://github.com/dherault/serverless-offline/commit/66df0941f6ae5f5db352ae795910beb5ac762598)
- Remove .editorconfig #40 [`34d171a`](https://github.com/dherault/serverless-offline/commit/34d171a04aca95a952d28b3fe3a4136bcd4e38e6)
- Use process.platform for temporary conditions [`cffdd2e`](https://github.com/dherault/serverless-offline/commit/cffdd2e0d54837aa1f02732941849ace4ac853ee)
- Fix action in debugLog (was used before it was defined) [`5f3ffc1`](https://github.com/dherault/serverless-offline/commit/5f3ffc15c28dadf5b73ff83f6f78c88e12fb6cea)
- Remove template literals [`8a8756d`](https://github.com/dherault/serverless-offline/commit/8a8756da3d025683e96ef580092f44a52c619cc9)
- Move create default api key, avoid circular references [`a9a9c12`](https://github.com/dherault/serverless-offline/commit/a9a9c1295b68e95a456253e7371a3e2bc3fb9534)
- Set context functionVersion to $LATEST [`e9f6522`](https://github.com/dherault/serverless-offline/commit/e9f6522ea12eaba626a4f4cee90569e3da1357e3)
- Fix jest.config.js [`eb92c45`](https://github.com/dherault/serverless-offline/commit/eb92c456dfc6e15c52a69d63e4909922c1bb1879)
- Add benchmark placeholder [`2bf0617`](https://github.com/dherault/serverless-offline/commit/2bf06173b1d6ce04f58ba37369e0fc3e6b9880be)

#### [v6.0.0-alpha.19](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.18...v6.0.0-alpha.19)

> 23 August 2019

- Fix test runs against AWS [`50978a6`](https://github.com/dherault/serverless-offline/commit/50978a68d1a98849c09595ee57d1bea9010bdcc9)
- Remove (and replace) getFunctionOptions [`ab7ff52`](https://github.com/dherault/serverless-offline/commit/ab7ff52f3bb401f69ad8faca2a78e93bf3ab767e)
- Remove functionHelperTest.js [`3d37a3a`](https://github.com/dherault/serverless-offline/commit/3d37a3afab718a2633487f766165913e7526f141)
- Simplify test setup and teardown [`11d5f01`](https://github.com/dherault/serverless-offline/commit/11d5f018361215bc10e1127a44d0d57cd072a8c3)
- Serverless.yml re-ordering nit [`b70d7e6`](https://github.com/dherault/serverless-offline/commit/b70d7e608210769fab62fdb274141d34e6048c10)
- Pass url string to query param parsers [`62042ab`](https://github.com/dherault/serverless-offline/commit/62042ab4d8a084638d125a8eaec8dae65fbeee50)
- Use query parsers in LambdaProxyIntegrationEvent [`ab571a4`](https://github.com/dherault/serverless-offline/commit/ab571a4af871dd4105384fc4a7d65e6da4f1c017)
- Re-organize test helpers [`576a8c1`](https://github.com/dherault/serverless-offline/commit/576a8c14fb2d001bbe3e2ecef3eb41f5e9406ed6)
- Fix spelling [`50e5959`](https://github.com/dherault/serverless-offline/commit/50e5959c9bc286d3d669ce3ab36b3c03d3517d4c)
- Use query parsers in createAuthScheme, remove unused utility functions [`dd1c2ca`](https://github.com/dherault/serverless-offline/commit/dd1c2ca456fee3f71cc64eba9ef57222c3514da9)
- Order nit [`9e4359d`](https://github.com/dherault/serverless-offline/commit/9e4359d3a24fd22fbcd2ebf6c2c726acacf90906)
- Load polyfills on start-up [`bf94f55`](https://github.com/dherault/serverless-offline/commit/bf94f552b84d2d2fe6bf4872709713872ff47290)
- Simplify [`4814242`](https://github.com/dherault/serverless-offline/commit/4814242486a35182743b94d6032851e81ceec7d2)
- Use header parsers in createAuthScheme [`f537c1a`](https://github.com/dherault/serverless-offline/commit/f537c1a51280ef1f92e99ae55b2446f4b7a3b332)
- Cleanup [`680d591`](https://github.com/dherault/serverless-offline/commit/680d59176d62d0fbcfb8bf324ed99dad957ff808)
- Remove rawHeaders condition, it's always an array [`3e0ce01`](https://github.com/dherault/serverless-offline/commit/3e0ce01e32ead3eca3127855367c8e0d7c8ffa91)
- Add additional rawHeader comments, move parsing from constructor to method [`7167670`](https://github.com/dherault/serverless-offline/commit/7167670c6181020414f6001b9194e050e730dc65)
- Remove offlineContext*requestId*-prefix [`53524f4`](https://github.com/dherault/serverless-offline/commit/53524f497681e81fa04dcd771b1ec369fd19b8f7)
- Remove unused utility function [`3a80160`](https://github.com/dherault/serverless-offline/commit/3a801605276e94f91296922372e0b98259cd6924)
- Don't load modules in constructor [`7287e77`](https://github.com/dherault/serverless-offline/commit/7287e7729822d0a688162f8a201573edf19dba11)
- Simplify adding rawHeaders in RequestBuilder [`3cfe7e2`](https://github.com/dherault/serverless-offline/commit/3cfe7e276a1caceff7ebf134b5a3f053687be5ea)
- Fix RequestBuilder, rawHeaders are never null [`c3dfd6c`](https://github.com/dherault/serverless-offline/commit/c3dfd6cda6b54e25218ba52f947c54cc021c3408)
- Rename variable [`9eeca18`](https://github.com/dherault/serverless-offline/commit/9eeca1819901104aaa2682b004433dc5e473d58d)
- Order nit [`e65952e`](https://github.com/dherault/serverless-offline/commit/e65952e452e94976f28655390d80ce78c473b79f)
- Remove unused parameters [`f40c458`](https://github.com/dherault/serverless-offline/commit/f40c458d74b2356c70f2688431ed329b0e17a36b)
- Don't export unflatten [`61209ce`](https://github.com/dherault/serverless-offline/commit/61209ce8de851959a72d612f90d5c10ce969971b)
- Rename test file [`20481f2`](https://github.com/dherault/serverless-offline/commit/20481f231d2e00b14b685b7489814404b8d071c5)

#### [v6.0.0-alpha.18](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.17...v6.0.0-alpha.18)

> 22 August 2019

- Add test setup and teardown [`81974bb`](https://github.com/dherault/serverless-offline/commit/81974bb6f6134c0bb2155b7ad0c4d2971693201a)
- Combine unit tests into old-unit folder [`1a114f7`](https://github.com/dherault/serverless-offline/commit/1a114f73b3dbb71c3d6bfe8f6e954498a25d1927)
- Fix test paths [`f5b2704`](https://github.com/dherault/serverless-offline/commit/f5b2704f83013809611bfce955de15dedfa51a5a)
- Move all python related tests into one folder [`d529d31`](https://github.com/dherault/serverless-offline/commit/d529d31f0763a4229d5a96d84f928756a2c8652d)
- Replace getFunctionOptions from OfflineBuilder [`9792661`](https://github.com/dherault/serverless-offline/commit/9792661b9bfc2a68a00ae4719a130ed02fb1cd3b)
- Load hapi plugins with module [`1919a82`](https://github.com/dherault/serverless-offline/commit/1919a8204fc7eab12d0a2fd371e01097b98240db)
- Fix python 3 test with aws endpoint [`a57cc6d`](https://github.com/dherault/serverless-offline/commit/a57cc6dfa144227f9121249c4c35726639b6210f)
- Rename ServerlessInvokeLocalRunner to InvokeLocalRunner [`a7abd1c`](https://github.com/dherault/serverless-offline/commit/a7abd1c086b3f431eebbb1e58a7a6f03105d3223)
- Combine plugin register [`95d0c32`](https://github.com/dherault/serverless-offline/commit/95d0c3232207b13851ee41df594268863201878f)
- Remove unused props [`c17994c`](https://github.com/dherault/serverless-offline/commit/c17994c3a188d77c579348a09706301de984c67b)
- Add placeholder for scenario tests [`9733de2`](https://github.com/dherault/serverless-offline/commit/9733de20404ea9f048be5744782f4e9acffe408e)

#### [v6.0.0-alpha.17](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.16...v6.0.0-alpha.17)

> 22 August 2019

- Re-introduce invoking ruby handlers [`68fcb83`](https://github.com/dherault/serverless-offline/commit/68fcb8323bb31e1b03b1428a328f6bf475a654e7)
- Fix event and context for ruby handlers [`3ce65f3`](https://github.com/dherault/serverless-offline/commit/3ce65f373391e38c16eab9b89380767496868f97)
- Remove some comments [`6c88697`](https://github.com/dherault/serverless-offline/commit/6c8869785c6f7f150c5d03c89349d08c40d9ad2b)
- Fix, include python and ruby invoke scripts in npm package [`ac78949`](https://github.com/dherault/serverless-offline/commit/ac78949093a8850295487d221d25f135f3818112)
- Unskip ruby test [`13e9c73`](https://github.com/dherault/serverless-offline/commit/13e9c73350ed895b2337a34c836676148eaac824)

#### [v6.0.0-alpha.16](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.15...v6.0.0-alpha.16)

> 21 August 2019

- Pull in code for python local invoke from serverless [`3ed787f`](https://github.com/dherault/serverless-offline/commit/3ed787f708e5c9c17ea82d2a2fa3251b9f5e58f2)
- Add LambdaFunctionPool to better simulate Lambda behavior and keep Lambdas alive [`a6f5486`](https://github.com/dherault/serverless-offline/commit/a6f5486d43a7064a76e9441e6109d757155b238d)
- Fix env handling for in-process, worker threads, child process [`32eafd8`](https://github.com/dherault/serverless-offline/commit/32eafd8f4232bc157ac6a03eea42e591b54c4783)
- Add cleanup for handler runner processes [`a26325a`](https://github.com/dherault/serverless-offline/commit/a26325a55ea0d23cbab24c08556184a5c0048284)
- Fix env population (some items missings) [`257a371`](https://github.com/dherault/serverless-offline/commit/257a371256a40d317e4e1e41b330acb16ec91129)
- Update deps [`17e27ac`](https://github.com/dherault/serverless-offline/commit/17e27acf0ffbc90d280c770b63f03a680f2e3999)
- Create LambdaFunction instance on every invoke, until we have a LambdaFunctionPool [`ec6427f`](https://github.com/dherault/serverless-offline/commit/ec6427fed1ee93bd89bfc53700c229499195c84c)
- Uncomment invoke local python process.env.VIRTUAL_ENV condition [`a77219f`](https://github.com/dherault/serverless-offline/commit/a77219fa6c8cd229691a51390c9be373f3b10529)
- Remove trim-newlines module [`fe6ca6f`](https://github.com/dherault/serverless-offline/commit/fe6ca6f4d79a87aee50d282c04f5ceb93e17f23a)
- Don't use global Buffer, Import from buffer module explicitly [`68b4a97`](https://github.com/dherault/serverless-offline/commit/68b4a978a8da643c6a2708d8619d4d4c1370fcd8)
- Skip python 3 tests on windows for now [`ea79210`](https://github.com/dherault/serverless-offline/commit/ea792103021edc96a72ac45c343e68fc64c37b3c)
- Comment out console.log [`a980fca`](https://github.com/dherault/serverless-offline/commit/a980fca4ac601d865249a044e96ad4d0a1d4c617)
- Use platform from 'os' module [`67d4d6e`](https://github.com/dherault/serverless-offline/commit/67d4d6e5b31b257ee38b05ed36b0d3af50c8e30b)
- Move child ProcessHelperPath into module scope [`43e419c`](https://github.com/dherault/serverless-offline/commit/43e419c66b70eaf2389a202b2baaa29fb0e8b503)
- Some comment clarifications [`953bb94`](https://github.com/dherault/serverless-offline/commit/953bb94c5dbae6f2d8a1c59c5722051411cdae68)

#### [v6.0.0-alpha.15](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.14...v6.0.0-alpha.15)

> 19 August 2019

- Re-add options.location for serverless webpack compatibility, fixes #787 [`#787`](https://github.com/dherault/serverless-offline/issues/787)
- Update deps [`ef2d7c6`](https://github.com/dherault/serverless-offline/commit/ef2d7c6ae3b1075e9141512cb627195cbf2cfd44)
- Fix tests not including lambda name [`b8eaaf4`](https://github.com/dherault/serverless-offline/commit/b8eaaf436cbe88b98d9a7d177bcf78c9ba44b9ed)
- Fix process.env handling [`b16086b`](https://github.com/dherault/serverless-offline/commit/b16086b53f8312f5ee321a02fa4b6e43c6107697)
- Add aws lambda environment variables [`283e4ef`](https://github.com/dherault/serverless-offline/commit/283e4efa60d7f920b663cf72fdc1f429a96d387e)
- Rename private method [`15f1520`](https://github.com/dherault/serverless-offline/commit/15f1520fc53436cbedea4c99afcca61de21ec56c)
- Simplify, set process.env.AWS_REGION [`15aa69f`](https://github.com/dherault/serverless-offline/commit/15aa69ff1c785df825014d6054db3996a74f3145)
- Fix, pass process.env explicitly to worker thread [`44d00fa`](https://github.com/dherault/serverless-offline/commit/44d00fa2f464b2c130dbaeddc82aebdab8cf21a1)
- Fix option.location is undefined [`24b7211`](https://github.com/dherault/serverless-offline/commit/24b7211e4cc5d8172b73ccb0deecd22c3aa162bb)

#### [v6.0.0-alpha.14](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.13...v6.0.0-alpha.14)

> 18 August 2019

- Update deps [`4e091cf`](https://github.com/dherault/serverless-offline/commit/4e091cf5c8d2423e749ade8651003241c266f873)
- Remove velocityContextOptions, remove remaining stageVariables [`a9813da`](https://github.com/dherault/serverless-offline/commit/a9813da5061043e4280cca23c76fb52230edd6c5)
- Pass stage parameter directly to LambdaProxyIntegrationEvent constructor [`bee8b9f`](https://github.com/dherault/serverless-offline/commit/bee8b9f663e2a076c4308c6a9db055e2b41acbf0)
- Fix, pass provider stage in LambdaProxyIntegrationEvent constructor, remove options [`947e3b4`](https://github.com/dherault/serverless-offline/commit/947e3b4c1dfb9053b8037c28381a6b2d09a8ad80)
- Remove stageVariables from LambdaProxyIntegrationEvent [`c060153`](https://github.com/dherault/serverless-offline/commit/c060153f13aed607c02888a3265604ddede4bac0)
- Remove --stage and --region options [`a0f5076`](https://github.com/dherault/serverless-offline/commit/a0f5076b89fae7fdf58dc02161468e8984b7aade)
- Cleanup, remove velocityContextOptions from api gateway constructor [`dc6da2a`](https://github.com/dherault/serverless-offline/commit/dc6da2a0485c2e7cb7d553c3355d93ed0d889a19)
- Fix, pass provider stage to HandlerRunner, ServerlessInvokeLocalRunner [`0fc7a73`](https://github.com/dherault/serverless-offline/commit/0fc7a73103ba1348ad1b3a47c1f4920a5b694ef9)
- Fix, pass provider stage to createAuthScheme [`2063bdc`](https://github.com/dherault/serverless-offline/commit/2063bdc09882e2e8e73fb5e1f4c706d3520c54ab)
- Bugfix, pass missing stage to constructor parameter for HandlerRunner [`6597da0`](https://github.com/dherault/serverless-offline/commit/6597da02fdc8204158e1f85d16f6faaa0c03cc76)
- Fix http event string parsing [`fd9f126`](https://github.com/dherault/serverless-offline/commit/fd9f126d9cce6b88e86a43fd7d67c029e17faadb)
- Remove unused payload field [`e06cf0b`](https://github.com/dherault/serverless-offline/commit/e06cf0ba687f9e641f4ce2792113d8012ed96456)

#### [v6.0.0-alpha.13](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.12...v6.0.0-alpha.13)

> 18 August 2019

- UpdateJSON response detection from stdout in local invocations [`#785`](https://github.com/dherault/serverless-offline/pull/785)
- Log in-process 'handler not found' exception, partially fixes #783 [`#783`](https://github.com/dherault/serverless-offline/issues/783)
- Add initial support for worker threads [`bf78dd4`](https://github.com/dherault/serverless-offline/commit/bf78dd4405f0afefaf4cdab08265a5b09d63acc0)
- Add [skipped] test case for python returning big JSON structure #781 [`7bc44e9`](https://github.com/dherault/serverless-offline/commit/7bc44e9a5fa0921953fddeeeceea642bc0ce0aed)
- updated the way JSON detection happens in the invoke local runner to allow printing of JSON before the final response [`764db3b`](https://github.com/dherault/serverless-offline/commit/764db3b7a45cf2dcc725d706ae3e5a9803162e93)
- Add semver support check for worker threads [`0ff0b1a`](https://github.com/dherault/serverless-offline/commit/0ff0b1aba5e9a13586f1d63f30ac487fa8162c34)
- Switch parameters, reame variables [`3f47b66`](https://github.com/dherault/serverless-offline/commit/3f47b66bc57f0d5f5a22658edafc9e78be5aab63)
- Fix worker thread support with proper message channel implementation [`f1584a9`](https://github.com/dherault/serverless-offline/commit/f1584a93aa104b87ea6f356e00e3e29189182ca8)
- Fix handler module path check, was broken for module not found in handler [`cc48454`](https://github.com/dherault/serverless-offline/commit/cc484542ca9c30b802f57edaf764f3f727804aa4)
- Update deps [`4d5c589`](https://github.com/dherault/serverless-offline/commit/4d5c58965e12389cf550a4e3c01d7ee8b4c51928)
- Simplify, use instance reference [`145d1dc`](https://github.com/dherault/serverless-offline/commit/145d1dc5974b0b63ee9efbef1a3abffa79b8abf9)
- Simplify, remove parameter, pass provider directly [`06246d7`](https://github.com/dherault/serverless-offline/commit/06246d7ef38d95c9c0587c0141fd989917112c22)
- Rename variable [`1d4ba5b`](https://github.com/dherault/serverless-offline/commit/1d4ba5ba3503d1afee01844e4b8ceb7864bfe254)
- Add error log [`1c2036a`](https://github.com/dherault/serverless-offline/commit/1c2036a9606bc82a8877c7ffecf2368ed07adee2)
- Add log warning [`c68aa5f`](https://github.com/dherault/serverless-offline/commit/c68aa5f926522ab008046c148962649cb0eefa43)
- fixed an issue where prints were getting postfixed to the json to parse [`d4c1772`](https://github.com/dherault/serverless-offline/commit/d4c1772d267dc3866d68b7036fdb9aca04f3697e)
- Remove errorLog [`395805e`](https://github.com/dherault/serverless-offline/commit/395805e6c6ae8583a21a21f1022cf2249b428199)
- Comment fix [`c66534f`](https://github.com/dherault/serverless-offline/commit/c66534f1ac6b1e0c2ab37341b26a33531b236328)
- Spelling fix [`dded4a8`](https://github.com/dherault/serverless-offline/commit/dded4a8629cd1b0a6565026425be11708150c164)
- Unskip python big json test #781 [`825a91d`](https://github.com/dherault/serverless-offline/commit/825a91d8a71a5e3d24c98dd756638ae77568773d)
- Nit [`61be290`](https://github.com/dherault/serverless-offline/commit/61be290dbf70ddb0dbbafd308f4f7faeff934801)

#### [v6.0.0-alpha.12](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.11...v6.0.0-alpha.12)

> 16 August 2019

- Update deps [`4e197b1`](https://github.com/dherault/serverless-offline/commit/4e197b1086505bbb7adda6083806273240321172)
- Refactor handler process runners, create individual classes [`25b227a`](https://github.com/dherault/serverless-offline/commit/25b227a6469ba4cc101938d76e327a992fd811b8)
- Initial handler runner refactoring [`a4b2ca8`](https://github.com/dherault/serverless-offline/commit/a4b2ca89126255aecf462543518365c5e9ab1c8a)
- Performance, lazy load process runners [`2e04f94`](https://github.com/dherault/serverless-offline/commit/2e04f94588e9d45c7c8f1301a4fbab71fc164a8d)
- LambdaFunction constructor rewrite [`324ff3d`](https://github.com/dherault/serverless-offline/commit/324ff3d8b952959660d6b520e53b9410df54ba83)
- Performance, lazy load in-process handler [`d102013`](https://github.com/dherault/serverless-offline/commit/d10201322901b67b0e1518b60398516d895f3b2b)
- Use execa for external process (cleans up after itself when parent dies) [`c406fe2`](https://github.com/dherault/serverless-offline/commit/c406fe2e15acf79a4393701ec8aaadacf777bad3)
- Add default runtime fallback [`7a1ddb7`](https://github.com/dherault/serverless-offline/commit/7a1ddb756a70607dc241e5d863ed23c620408be2)
- Simplify condition [`44e60bb`](https://github.com/dherault/serverless-offline/commit/44e60bbe014d477efe85867bf5aea54bfac288d4)
- Create regular expression from options when it's needed [`460fd1a`](https://github.com/dherault/serverless-offline/commit/460fd1a28c43ac73d7ec2eb47c3390745f9c146b)
- Fix creating new handler for each invocation [`4d96513`](https://github.com/dherault/serverless-offline/commit/4d96513cf4832d6216f6704dfe2beea9d74c0ae4)
- Fix cache invalidation regexp options and readme [`105a17e`](https://github.com/dherault/serverless-offline/commit/105a17e2d0895f82d57ee66ee59a357371460bbf)
- Remove useless condition II. [`a806f31`](https://github.com/dherault/serverless-offline/commit/a806f31de3fadf0eeeadef1b5f90f1478bf22c5c)
- Nit, rename variable [`296dbe9`](https://github.com/dherault/serverless-offline/commit/296dbe9341ec708bd1ccfbc92cde1298938dc5ef)
- Fix readme [`ab74cd5`](https://github.com/dherault/serverless-offline/commit/ab74cd580308201534495d45fcc244c4200c8c3e)
- Rename file ipcHelper.js to childProcessHelper.js [`b55e110`](https://github.com/dherault/serverless-offline/commit/b55e1103fc25b7ce0b417b9671b1c676ade3b89b)
- Remove useless condition (new RegExp is always object), also already in option defaults [`ba7c989`](https://github.com/dherault/serverless-offline/commit/ba7c989cfc03421aa043e209572a741ab4421f32)
- Include handler-runner folder in distribution [`6338faa`](https://github.com/dherault/serverless-offline/commit/6338faa3f7c1a969311e507789fe071e105d636e)
- Fix, move ipcHelper.js into folder [`5e92c06`](https://github.com/dherault/serverless-offline/commit/5e92c06baf5859ba055f787e48aca863aa17151e)

#### [v6.0.0-alpha.11](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.10...v6.0.0-alpha.11)

> 15 August 2019

- Create 404 routes last, fixes #782 [`#782`](https://github.com/dherault/serverless-offline/issues/782)
- Update deps [`40cac8f`](https://github.com/dherault/serverless-offline/commit/40cac8f440f150ee164b286d2392b442c3c87ff1)

#### [v6.0.0-alpha.10](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.9...v6.0.0-alpha.10)

> 14 August 2019

- Extract handlers from route object [`e10919d`](https://github.com/dherault/serverless-offline/commit/e10919d5407bfdeacef773b42ec11b8f7552bf3e)
- Update deps [`7201907`](https://github.com/dherault/serverless-offline/commit/72019074990412b1bd303a7bbfb7f87b17408227)
- Add initial support for openapi/swagger documentation [`b0c76d7`](https://github.com/dherault/serverless-offline/commit/b0c76d761c1e8f15fdd0a90da69f12485896b639)
- Update deps [`c7e33d7`](https://github.com/dherault/serverless-offline/commit/c7e33d787991d9617409c4de738102557fa31f2a)
- Cleanup, pass config to constructors, remove method params [`feebe8f`](https://github.com/dherault/serverless-offline/commit/feebe8f13b223674b4d75600cf68e68fb6d70d02)
- Rename hapi specific variables [`cd960aa`](https://github.com/dherault/serverless-offline/commit/cd960aaa69323227b30faaaeb3b2bcdde9f54895)
- Rename Lambda..Event.getEvent to .create [`2169b51`](https://github.com/dherault/serverless-offline/commit/2169b517086e5f41230287a2b6d26b9ef969e937)
- Pass specific event parameters (http, websocket) [`a9e8a77`](https://github.com/dherault/serverless-offline/commit/a9e8a77ea86d0c0bff79abd2dd4cedd8df7d3527)
- Combine constructor paramaters [`619e019`](https://github.com/dherault/serverless-offline/commit/619e019df592e4d91442fcffea7c3c8fb4aa32d8)
- Rename variables [`44cc804`](https://github.com/dherault/serverless-offline/commit/44cc8049fb9b0e5b50460dc9eba567f923c39fdc)
- Make start screen console log less convoluted, hide lambda invoke routes (for now) [`4b73ba5`](https://github.com/dherault/serverless-offline/commit/4b73ba5a48ae1d1ba9f91d826e3ea5123b968239)
- Rename and switch Endpoint constructor params [`616a0a0`](https://github.com/dherault/serverless-offline/commit/616a0a0b2d104282f870a7be738e544c9df54f17)
- Add special logging for http routes [`6bb35a8`](https://github.com/dherault/serverless-offline/commit/6bb35a86750a4acc9eeb248f33fcfa0db2296280)
- Rename LambdaContext.getContext to .create [`b876124`](https://github.com/dherault/serverless-offline/commit/b87612438e9dfeb719b267ae9ef671b8bc1625fc)
- Add v6.x documentation note to README [`c591ef9`](https://github.com/dherault/serverless-offline/commit/c591ef975ed7eb54598d845f24d6005664519ae1)
- Remove useless return parameter [`a9622c7`](https://github.com/dherault/serverless-offline/commit/a9622c7d48a77f5ce577dfcd4d0130ccbcaf955c)
- Move hapiOptions.tags condition [`2e0236d`](https://github.com/dherault/serverless-offline/commit/2e0236d2839b2cc15addb9e33140ba799ab87cbd)
- Add swagger doc title, set version to dummy value [`22d1640`](https://github.com/dherault/serverless-offline/commit/22d1640f6ba3a20c7e5fc7cce5e4b049c7b2b7a3)
- Move variables closer to where they are being used [`1393df4`](https://github.com/dherault/serverless-offline/commit/1393df43daaf9dc626561fe98bf04d0848f69616)
- Add server information to route console log [`9741ecb`](https://github.com/dherault/serverless-offline/commit/9741ecbd1decfdd501afde5b27875ee57d08feb4)
- Apply entity parameter to serverless log [`a1375a5`](https://github.com/dherault/serverless-offline/commit/a1375a5f64427f4372557dd67a46554927e20fba)
- Order nit [`fb6d34a`](https://github.com/dherault/serverless-offline/commit/fb6d34a236fca2d25534bb49eeaf196c35b02c31)
- Remove event reference [`6510136`](https://github.com/dherault/serverless-offline/commit/651013666923e54007344e43ff23d63c8a6c2137)
- Add excluding breaking changes to README note [`6f0aa4e`](https://github.com/dherault/serverless-offline/commit/6f0aa4e18bb13be109b20b499c0522d562e643f5)

#### [v6.0.0-alpha.9](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.8...v6.0.0-alpha.9)

> 13 August 2019

- Return 502 on Error [`#772`](https://github.com/dherault/serverless-offline/pull/772)
- Refactor remaining function helpers, fix tests [`85e0c2c`](https://github.com/dherault/serverless-offline/commit/85e0c2c13dcafde2d3924e807a53174d9398faca)
- Remove addFunctionHTTP from OfflineBuilder [`3ab2a71`](https://github.com/dherault/serverless-offline/commit/3ab2a71edb90a05bd94ea14f723321b26edcbd13)
- Refactor createVelocityContext function to class [`839aaf9`](https://github.com/dherault/serverless-offline/commit/839aaf9796968c054f93e511330f7e673b8e5d7f)
- Added all tests [`cdc7335`](https://github.com/dherault/serverless-offline/commit/cdc733574f4652053c62bd013365a5c9d02133b3)
- Move env merge out of try/catch block [`6d366d3`](https://github.com/dherault/serverless-offline/commit/6d366d316f3dfe00e8802c35e5d85ba606696e7f)
- Remove multiValueHeaders and unproceedHeaders from hapi request object, use utility functions, fix tests [`296af12`](https://github.com/dherault/serverless-offline/commit/296af123c2ae553f41f91ab5b799f5d5ad0a6d84)
- Add unflatten, parseHeaders, parseMultiValueHeaders utility functions [`6e798d1`](https://github.com/dherault/serverless-offline/commit/6e798d1508494fce0aed5b6d2c762d2dc42b9311)
- Fix env handling in lambda functions [`067d1c9`](https://github.com/dherault/serverless-offline/commit/067d1c93570d36a0061017b9d41f02a88cd371a2)
- Remove --noEnvironment option [`4a4a247`](https://github.com/dherault/serverless-offline/commit/4a4a247c5f77277232e07c2fa9d95b3541411c93)
- Add unflaten unit tests [`3ce9fbb`](https://github.com/dherault/serverless-offline/commit/3ce9fbbd617db1d06f0930b5724965ee936cd9e6)
- Add the option to specify endpoint URL for integration tests [`5eec514`](https://github.com/dherault/serverless-offline/commit/5eec5148b07b24069137f59100034624477fcedf)
- Remove --exec option [`0cba415`](https://github.com/dherault/serverless-offline/commit/0cba4157fea7b22c2a3b1b7db5a7723b0158cf45)
- Add shell for LambdaIntegrationEvent class [`d3bc2b6`](https://github.com/dherault/serverless-offline/commit/d3bc2b6aafe54fd06f4e45e5877624c363827222)
- Destructure off namespace [`73bfa54`](https://github.com/dherault/serverless-offline/commit/73bfa543c9d967d294bbfc040e8d085b7afa286d)
- Remove websocket experimental warning [`64b8073`](https://github.com/dherault/serverless-offline/commit/64b80737741b78fe77c0b954e48c3f39d7a0841a)
- Remove Object.assign, use object spread [`6e4659e`](https://github.com/dherault/serverless-offline/commit/6e4659e216dd795b481944caf63f2ebb12aa1ff4)
- Added support for returning 502 on error [`c8f1efb`](https://github.com/dherault/serverless-offline/commit/c8f1efb7795f78c56cad0c78835d8cd02f09a8cb)
- Fixed remaining tests [`46c420a`](https://github.com/dherault/serverless-offline/commit/46c420a897b18ff581ae76fee58a8df12326ad9f)
- Remove static function [`0c127d9`](https://github.com/dherault/serverless-offline/commit/0c127d990ae55cf6d3c1181aac0186228b19445d)
- Added status check for handlerPayload.test.js [`955487c`](https://github.com/dherault/serverless-offline/commit/955487c396acfcb1546a24df6bee87276615a2e4)
- Remove useless try/catch block [`d74a89a`](https://github.com/dherault/serverless-offline/commit/d74a89a112beaf70e2bf0fc34e32e0e9949bf67c)
- Fix lint errors [`c23103d`](https://github.com/dherault/serverless-offline/commit/c23103d115bb1930dc5ca195c6078805f81ec3f6)
- Add Todo comment [`ca2f05a`](https://github.com/dherault/serverless-offline/commit/ca2f05ae67b6c6cc487a9e639868230d09fee251)
- Skipped 4 failing tests in order to update PR [`dca5cf8`](https://github.com/dherault/serverless-offline/commit/dca5cf87fbc1b472034af016eb6eba8302eed43d)
- Move templates to own folder [`d96456a`](https://github.com/dherault/serverless-offline/commit/d96456ae2bbdf8a22537161dcb7498b9b0963278)
- Remove event.isOffline, parity with aws [`aa7fd51`](https://github.com/dherault/serverless-offline/commit/aa7fd511ade5600500dcd2f1047b1d32eaa7a1a6)
- Simplify static function access [`c8f9fb9`](https://github.com/dherault/serverless-offline/commit/c8f9fb94a9d132548ae92aa90bc5e5bb221b30f5)
- Re-enable Ruby and Python tests [`3438c32`](https://github.com/dherault/serverless-offline/commit/3438c32c91eefd960b1e7269744f98d0c9c9bee8)
- Remove private exitCode field [`bc18768`](https://github.com/dherault/serverless-offline/commit/bc187685fd18036518f03f048165f9cf876a896c)
- Skip Ruby test in order to push to origin [`f9192f9`](https://github.com/dherault/serverless-offline/commit/f9192f9693079663e46f74d0023ab5d73cb5839c)
- Skip Python test in order to push to origin [`464e943`](https://github.com/dherault/serverless-offline/commit/464e943a07b1c125598b85829f47efa8ab2eded4)
- Remove --exec option from doc [`4c9432c`](https://github.com/dherault/serverless-offline/commit/4c9432cd2a281df0b357c1ce29ab9453bf4dc9cd)
- Add prebublishOnly npm script [`b082100`](https://github.com/dherault/serverless-offline/commit/b082100059ff4e68b2e1aee09bf5de25f9668154)

#### [v6.0.0-alpha.8](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.7...v6.0.0-alpha.8)

> 11 August 2019

- Move create route for lambda invoke into api gateway [`4e49955`](https://github.com/dherault/serverless-offline/commit/4e499551993b4d375f9bdebe60bf844ed13f6dea)
- Only load and instantiate api gateway and websocket classes when required [`6cd81fc`](https://github.com/dherault/serverless-offline/commit/6cd81fc3979d9d55ca1f7b662d9e297d729e4a3a)
- Add provider to private class fields [`ac3403d`](https://github.com/dherault/serverless-offline/commit/ac3403d1db04291ecc5df9926fd421fe1eb3445b)
- Constructor order nit [`ae6fc5e`](https://github.com/dherault/serverless-offline/commit/ae6fc5e57cd6d3c07cc1c90da9f23ef5c91496d7)
- Move test condition [`6d6cce0`](https://github.com/dherault/serverless-offline/commit/6d6cce04c7979c1bb95c60cbcf9a8dbabf50a567)
- Remove provider from createRoutes parameter, already in constructor [`14d36ed`](https://github.com/dherault/serverless-offline/commit/14d36ed6c423550b2f1bfe77e26fb6f5d36b8aa4)
- Remove --providedRuntime option [`6af4c0a`](https://github.com/dherault/serverless-offline/commit/6af4c0a5463bae231c0559ed718fd7b4cb195aed)
- Pass service directly into constructor [`9440308`](https://github.com/dherault/serverless-offline/commit/9440308080da1ec91d406abd4e43765d7676a60d)
- Rename methods [`ca8e358`](https://github.com/dherault/serverless-offline/commit/ca8e358b70fa120a3a46360ea852af9526e947bf)
- Remove defaultContentType from createRoutes parameter [`a8e1864`](https://github.com/dherault/serverless-offline/commit/a8e18640a0be01679b6bc03e2a59c3e7e54464c4)
- Remove protectedRoutes from createRoutes parameter [`c15f4d4`](https://github.com/dherault/serverless-offline/commit/c15f4d44bc1c37b980f7dbb3094d898c62b0eb62)
- Don't re-export, import directly [`ed42eea`](https://github.com/dherault/serverless-offline/commit/ed42eea9179304cd2143ac8324a845cba541f14d)
- Fix, remove useless code [`e656c81`](https://github.com/dherault/serverless-offline/commit/e656c814d39e7d4d86214344dd9e8ec2d63c730e)

#### [v6.0.0-alpha.7](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.6...v6.0.0-alpha.7)

> 10 August 2019

- Add python3 tests [`3e92169`](https://github.com/dherault/serverless-offline/commit/3e9216947d45e3e9245eeefe4e34cd2f3c37760c)
- Fix eslint no-param-reassign [`ab5b137`](https://github.com/dherault/serverless-offline/commit/ab5b1375652f667777cd4a81f63ddddfd70bc327)
- Add ruby and python detection to utilities [`74500a8`](https://github.com/dherault/serverless-offline/commit/74500a896b4392cd4ac0c2e82c2f80a48a52caf0)
- Fix eslint prefer-object-spread [`ddc253d`](https://github.com/dherault/serverless-offline/commit/ddc253d403aa18901bdb11aad14940248d76d1ad)
- Rename python to python2 tests [`c67bb65`](https://github.com/dherault/serverless-offline/commit/c67bb65ad0e1856cc1b97963d558ffe7db846312)
- Update deps, modify eslintrc [`8e64a6d`](https://github.com/dherault/serverless-offline/commit/8e64a6d9abed157d105d95a363ddd54b8f553957)
- Skip condition for python and ruby tests if executable is not found [`b3931f6`](https://github.com/dherault/serverless-offline/commit/b3931f671af739f9d1a1fb3a82da7e655d3a8640)
- Fix eslint no-multi-assign [`7f53bb5`](https://github.com/dherault/serverless-offline/commit/7f53bb58d50ef82296fcda6a2d2e19c8fd42e8cf)
- Use destructuring [`d50dcad`](https://github.com/dherault/serverless-offline/commit/d50dcade63abf2112de340cd6e78f1c2291ebf69)
- Point serverless.yml test files to package.json to load plugin [`705810c`](https://github.com/dherault/serverless-offline/commit/705810cf55c0fd984dbd03b1a1b4aff92d092004)
- Comment out go support for now [`01645b5`](https://github.com/dherault/serverless-offline/commit/01645b5471b2ff20c7b811e9e3ecd0e65346577e)
- Move eslint rule [`873e782`](https://github.com/dherault/serverless-offline/commit/873e782cbe5cf1bd5314785fd7fd6d2457e9fd98)
- Remove comment [`e9deeaa`](https://github.com/dherault/serverless-offline/commit/e9deeaa3f614cbb1f1b89eab296eaeb63554ac83)

#### [v6.0.0-alpha.6](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.5...v6.0.0-alpha.6)

> 9 August 2019

- Use path to 'serverless' executable, fixes #774 [`#774`](https://github.com/dherault/serverless-offline/issues/774)
- Use execa for spawning process [`efc32c6`](https://github.com/dherault/serverless-offline/commit/efc32c6b77a1455b857e5197af5a693e7c36dbf6)
- Fix python and ruby execution, re-activate tests [`1b5d28a`](https://github.com/dherault/serverless-offline/commit/1b5d28a994c097bfce84aefab328ecbe6ea8208f)
- Add comments [`9fd4a8e`](https://github.com/dherault/serverless-offline/commit/9fd4a8e9422e51643310c36df024b025b76c3f8f)
- Remove --binPath option [`0080d02`](https://github.com/dherault/serverless-offline/commit/0080d02a11e2ccf453f67805bac89ee94246d31e)
- Extend test timeouts for python and ruby [`a4fe078`](https://github.com/dherault/serverless-offline/commit/a4fe078d13e082eaa929a80e2127ccee17b1d323)

#### [v6.0.0-alpha.5](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.4...v6.0.0-alpha.5)

> 9 August 2019

- Remove getFunctionOptions in api gateway, add to LambdaFunction internals [`7e164c0`](https://github.com/dherault/serverless-offline/commit/7e164c02889034cd532a76066ea8bedbd3d3fe1b)
- Order nit [`5f2b565`](https://github.com/dherault/serverless-offline/commit/5f2b56509831905b8fdd82c8ad4851cfc1990d99)
- Apply private fields in LambdaFunction constructor [`16301a5`](https://github.com/dherault/serverless-offline/commit/16301a5bb5487f359e129a340390969bfef7de26)
- Export named functions [`102a1c4`](https://github.com/dherault/serverless-offline/commit/102a1c43f19034247d9447b049a1aba8cb49c088)
- Remove already existing context props [`5cc17ad`](https://github.com/dherault/serverless-offline/commit/5cc17ad1888b253cd791edf766c6559e3c05e1fc)
- Linting, no-param-reassign, assignment to property of function parameter 'functionObj' [`32f5665`](https://github.com/dherault/serverless-offline/commit/32f5665962977d57a5420a2a04d3368280f476c8)
- Order nit [`85e0b68`](https://github.com/dherault/serverless-offline/commit/85e0b68ad5e09d799ef0d0f138c68d8d53e44898)
- Add constant for default memory size [`ea586f0`](https://github.com/dherault/serverless-offline/commit/ea586f090a3270b9af2e307b1d0b09fb01bb9a80)
- Linting, unexpected chained assignment [`f381559`](https://github.com/dherault/serverless-offline/commit/f3815590d58adaef5fb957c5069470e0f911d82a)
- Remove null parameter from fail callback [`b022cf1`](https://github.com/dherault/serverless-offline/commit/b022cf1deb589c5df1c704d9c0103737fc260310)

#### [v6.0.0-alpha.4](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.3...v6.0.0-alpha.4)

> 8 August 2019

- Move createExternalHandler function to own module [`301533b`](https://github.com/dherault/serverless-offline/commit/301533bf6dde11db0892f458b128e8de0deaf893)
- Move runServerlessProxy function to own module [`c0f4ece`](https://github.com/dherault/serverless-offline/commit/c0f4ecec31d66ec8cdbf57d11c71f09a8d575303)
- Update deps [`b615d58`](https://github.com/dherault/serverless-offline/commit/b615d586cb069e9db9bc548b757945190c5e6d16)
- Start up performance, create ipc process on first request [`94f537a`](https://github.com/dherault/serverless-offline/commit/94f537ae4090be9d24acf7cf7a48fab06b3893c5)
- Move function options creation into api gateways [`118fd99`](https://github.com/dherault/serverless-offline/commit/118fd99111831b8438a859dc132ac6476e4a8fb4)
- Apply private LambdaContext fields in constructor [`f141a3f`](https://github.com/dherault/serverless-offline/commit/f141a3f93d2776894db53bab648147e89113de01)
- Pass provider to apigateway services [`aede478`](https://github.com/dherault/serverless-offline/commit/aede478ade6f036264e21abd5f1a182be1645ce0)
- Add utility function to extract handler path and name [`0e5199f`](https://github.com/dherault/serverless-offline/commit/0e5199f08177935957f72b56a94a933c70291d11)
- Make 'private' [`74fbabb`](https://github.com/dherault/serverless-offline/commit/74fbabb46ac3231f1e32e300de688da97b37ae2e)
- Use split utility function for endpoint constructor parameter [`614ef83`](https://github.com/dherault/serverless-offline/commit/614ef83bd5cb71299763d902a88f0fb45cc7d167)
- Use map for handler cache [`895f3fa`](https://github.com/dherault/serverless-offline/commit/895f3fa2f9c43e02e9c537c9b848156d11294873)
- Use map for message callbacks [`3f9a224`](https://github.com/dherault/serverless-offline/commit/3f9a224f346e549980f1c3ed18b1faee8522fee4)
- Remove --location option [`953f485`](https://github.com/dherault/serverless-offline/commit/953f485daa48697912f065b8e51167710f1d08ff)
- Switch parameter order [`6467606`](https://github.com/dherault/serverless-offline/commit/646760627964a0f384dccba61199abc131e7eb2e)
- Use destructuring [`af69a98`](https://github.com/dherault/serverless-offline/commit/af69a98b80568b3d5bbb1771ebb265c7271e4d84)
- Re-export function cache cleanup [`7a72c3b`](https://github.com/dherault/serverless-offline/commit/7a72c3b4704c804c9a4461ec3b56da6018281a2c)
- Rename process to subprocess, for better distinction [`d0005c7`](https://github.com/dherault/serverless-offline/commit/d0005c7912e71805912768fd7e8bd05d37625117)
- Remove ipcProcess env filter [`570c26d`](https://github.com/dherault/serverless-offline/commit/570c26d1973d7c42954458cbadedc484ec3a0a49)
- Rename variables [`a574670`](https://github.com/dherault/serverless-offline/commit/a574670d1258e262ec6dc5dd9c96b457b4ca329a)
- Rename ret to data [`74845c3`](https://github.com/dherault/serverless-offline/commit/74845c3a6051190e18f5afd50985da8bcbd66428)
- Start up performance, require ipc handler module on first request [`a61479b`](https://github.com/dherault/serverless-offline/commit/a61479b6a59ddf735112bfbddffbe7b2a91b44dc)
- Use destructuring [`0d2e378`](https://github.com/dherault/serverless-offline/commit/0d2e378f5aff73dfe1925091e473f580a45d0787)
- Rename done to callback [`cbc600f`](https://github.com/dherault/serverless-offline/commit/cbc600fbff637b5c1749eef3a42848ba7d69a3bf)
- Rename variable [`82cc109`](https://github.com/dherault/serverless-offline/commit/82cc109da47212c4d4e33f97230a233b371304bc)
- Use destructuring for ipcProcess handlerPath [`d4e4252`](https://github.com/dherault/serverless-offline/commit/d4e42520464c824be698782825ed177af33cd1ef)
- Fix python and ruby test handler paths [`48cc409`](https://github.com/dherault/serverless-offline/commit/48cc4092205eedb7a1db9ae5dd485842dca2ea8b)
- Fix missing lambdaName [`39f8206`](https://github.com/dherault/serverless-offline/commit/39f82069517cfc2a66e1b461b0cf6f3f54747591)
- Remove unneeded shim [`2e481d1`](https://github.com/dherault/serverless-offline/commit/2e481d172223cc4ff79b09ed6884d87f305ccb9e)
- Rename python and ruby test files [`c6c7b70`](https://github.com/dherault/serverless-offline/commit/c6c7b704481d6506b05b3c931ee7b16322bdff59)

#### [v6.0.0-alpha.3](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.2...v6.0.0-alpha.3)

> 8 August 2019

- Reduce noise [aka semis] [`96355a4`](https://github.com/dherault/serverless-offline/commit/96355a45e4a1b06bafe53a77e4a967c374fcb893)
- Remove more noise/semis [`742d4b4`](https://github.com/dherault/serverless-offline/commit/742d4b4e5d21c692509326e9d200a0d6f097c2f7)
- Add eslint-config-airbnb-base, eslint-plugin-import, apply recommended settings [`a8940a8`](https://github.com/dherault/serverless-offline/commit/a8940a83399f42dc604e113b62cdfa837c4f3583)
- Move non-unit tests to project root [`25e24a3`](https://github.com/dherault/serverless-offline/commit/25e24a358353390b3db175ac4f29b05fd5f6d7dd)
- Remove more noise [aka semis] [`b646d48`](https://github.com/dherault/serverless-offline/commit/b646d482792b1765f19fc55101968dc31737bd80)
- Fix travis windows build [`7f30205`](https://github.com/dherault/serverless-offline/commit/7f302054d821fecc5be9fdfca3766cdeec6ba83f)
- Use more modern promise example for lambda invoke [`84ca409`](https://github.com/dherault/serverless-offline/commit/84ca40988a1495e1ddeadbb7c01832b7a04de298)
- Fix eslint radix parameter option [`45ddbef`](https://github.com/dherault/serverless-offline/commit/45ddbef2bf8647bd9cb18add14248c9095003050)
- Fix eslint strict mode option [`208fff4`](https://github.com/dherault/serverless-offline/commit/208fff4df8a6b03da2b3f33c5fc317511224691d)
- Restrict file extensions for npm module publisn [`63faaa1`](https://github.com/dherault/serverless-offline/commit/63faaa18fb748ddfdc6fc9fe9f9bd66a4d8dac5f)
- Remove unused eslint env options [`7dd8125`](https://github.com/dherault/serverless-offline/commit/7dd8125fbf57db79d891ecd7a7d3b838e6c025ba)
- Temporary exclude windows from travis test runs [`9ae1822`](https://github.com/dherault/serverless-offline/commit/9ae1822163928c7fc84e036a61781133fd1588eb)

#### [v6.0.0-alpha.2](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.1...v6.0.0-alpha.2)

> 7 August 2019

- Add callbackWaitsForEmptyEventLoop to lambda context, fixes #770 [`#770`](https://github.com/dherault/serverless-offline/issues/770)
- Update deps [`1ae3149`](https://github.com/dherault/serverless-offline/commit/1ae314937994701a912d3fa9d7f6e013d8466c07)
- Add update-notifier module [`4672a94`](https://github.com/dherault/serverless-offline/commit/4672a944917788fd93adab4a61809194d5292afa)
- Use underscore for private fields [`5466ae6`](https://github.com/dherault/serverless-offline/commit/5466ae60daa395f231d6ca8f42848602eb3336c1)
- Fix test variable names [`5945404`](https://github.com/dherault/serverless-offline/commit/5945404dd69261e9bb5b7d2392e1300817a5b3f5)
- Return lambda proxy event instance with getEvent method [`7102a4c`](https://github.com/dherault/serverless-offline/commit/7102a4cd6c7955002c71f1220565f0de24e33d11)
- Use underscore for 'private' methods and fields in websocket class [`8ad8b56`](https://github.com/dherault/serverless-offline/commit/8ad8b56f828667eb27d6c44fecee3ff0b0f0bccb)
- Rename LambdaProxyEvent to LambdaProxyIntegrationEvent [`18fb59f`](https://github.com/dherault/serverless-offline/commit/18fb59f3ac484b157fbdba086aa7b129cc995900)
- Fix LambdaContext property tests, include callbackWaitsForEmptyEventLoop [`e92388c`](https://github.com/dherault/serverless-offline/commit/e92388cb4b438375d93d643371062e1f786a03c9)
- Rename server field [`4d1c95c`](https://github.com/dherault/serverless-offline/commit/4d1c95ca1d95ef069af362739bcb0204f8145265)
- Fix else/if condition [`53326aa`](https://github.com/dherault/serverless-offline/commit/53326aa563438f3e3a58a0e03258b2511f95ebb6)
- Use more destructuring [`845062b`](https://github.com/dherault/serverless-offline/commit/845062b7db689f86cce23576a449e8e22c24c565)
- Add method for registering plugins to websocket [`3f8fffd`](https://github.com/dherault/serverless-offline/commit/3f8fffddf0a6cab80a0dd65838a5d1636162c7fd)
- Use serverlessLog in websocket [`46a2b06`](https://github.com/dherault/serverless-offline/commit/46a2b06a4a7dcddc5e0385f6067eab9468979073)
- Expose server explicitly for testing [`e3e418b`](https://github.com/dherault/serverless-offline/commit/e3e418bf14ee2f7e01434ede9aad737cf3a5b332)
- Rename config to options for websocket routes [`c4f6d93`](https://github.com/dherault/serverless-offline/commit/c4f6d93fbc46424706d9aa4673fee9d4281202c3)
- Rename startServer method to start [`b662180`](https://github.com/dherault/serverless-offline/commit/b6621804eff8fa4656bce930775d588fbcf447f0)
- Make more methods private [`23f93e2`](https://github.com/dherault/serverless-offline/commit/23f93e29c8796f7df1a93c4c431a081a027c0c7e)
- Add stop method to websocket class [`2d2f806`](https://github.com/dherault/serverless-offline/commit/2d2f8068c4d476e015f2983350258211f0a0d5c0)
- Cleanup, remove commented code [`53ae158`](https://github.com/dherault/serverless-offline/commit/53ae15817e593c987dd17f85591987614177d411)
- Add doc references [`e701f6a`](https://github.com/dherault/serverless-offline/commit/e701f6ae8ebe2cfa4de2f485f017ec04f89a0afe)

#### [v6.0.0-alpha.1](https://github.com/dherault/serverless-offline/compare/v6.0.0-alpha.0...v6.0.0-alpha.1)

> 7 August 2019

- Do not remove unhandledRejection listeners as it breaks Serverless [`#767`](https://github.com/dherault/serverless-offline/pull/767)
- Verify runtime at function level, fixes #750 [`#750`](https://github.com/dherault/serverless-offline/issues/750)
- Add LambdaFunction unit tests [`1253130`](https://github.com/dherault/serverless-offline/commit/1253130cee16b4dbad339246187b397846ed0c8e)
- Refactor to Lambda Function class, simplify and combine execution timers with Lambda Context [`3252bbd`](https://github.com/dherault/serverless-offline/commit/3252bbddb9c704733172e407097dbd2e9863fc11)
- Update deps [`a8297d8`](https://github.com/dherault/serverless-offline/commit/a8297d826e26b3c44c530e96e266f6f8bac33b36)
- Add serverlessLog module [`9fa4f3c`](https://github.com/dherault/serverless-offline/commit/9fa4f3c7a90a043d60adbf9411ecf19c5f8c4b53)
- Add LambdaContext unit tests [`043113e`](https://github.com/dherault/serverless-offline/commit/043113edbdaa60f9db5717556c4a4d7cce5c5803)
- Create handler in Lambda Function class [`c987129`](https://github.com/dherault/serverless-offline/commit/c987129b8904f03725f293aca47c026a069b2b60)
- Simplify, combine callback and calls from context [`7b5945e`](https://github.com/dherault/serverless-offline/commit/7b5945ee54e2a2a951606ed8017fd7cd2f243168)
- Rename hapi route config to options [`8ce911a`](https://github.com/dherault/serverless-offline/commit/8ce911a896be98661ddc6ced0336a61824d07222)
- Fix lambda timer calculation [`46ae893`](https://github.com/dherault/serverless-offline/commit/46ae8932d8c2122a57218a053ae6aa85a6e43d7b)
- Rename requestId to awsRequestId [`ffd3754`](https://github.com/dherault/serverless-offline/commit/ffd37545921e7635519dcc7a4070b193b02d8fb6)
- Use static now method on Date object to get time [`325b8fd`](https://github.com/dherault/serverless-offline/commit/325b8fdf559f1fe4b83abdd48fc311e269b6203d)
- Create requestId in LambdaFunctionto, pass to LambdaContext constructor [`9e256cd`](https://github.com/dherault/serverless-offline/commit/9e256cd91edfced0c3b4137e71887b021d27165a)
- Require serverlessLog in authFunctionNameExtractor, remove function parameter [`0e31fe0`](https://github.com/dherault/serverless-offline/commit/0e31fe004271166a4d592904fd221b402c3f464a)
- Move lambda default timeout to constants [`60f476a`](https://github.com/dherault/serverless-offline/commit/60f476aacfc6de11e5a3e5a4bfd9e681eb119670)
- Expose requestId from LambdaFunction [`1f607de`](https://github.com/dherault/serverless-offline/commit/1f607de595a18c1926ca726ee934a46f46f2f9fb)
- Make methods public [`abc3eff`](https://github.com/dherault/serverless-offline/commit/abc3eff3f7f017f5db11fd756eaffaac5e6a705b)
- Remove unused method [`42ed2ce`](https://github.com/dherault/serverless-offline/commit/42ed2ce2deec9219423393a5bfe07b287c106816)
- Simplify more, pass callback as context event handler [`560b29e`](https://github.com/dherault/serverless-offline/commit/560b29e7fd19e6512aa28afb1e98a7be5a6e8376)
- Rename constructor parameter [`caa6cdf`](https://github.com/dherault/serverless-offline/commit/caa6cdf2ec88b6a145d91caa21faa3bc40f72662)
- Remove 'showDuration' flag (execution time will be shown by default) [`a92eeac`](https://github.com/dherault/serverless-offline/commit/a92eeac17f7f3a252bfa083764206df3707975e6)
- Order nit [`c5a0447`](https://github.com/dherault/serverless-offline/commit/c5a04470ee24c7589bf3aa11398b5fa670dca86a)
- Fix spelling [`62c4766`](https://github.com/dherault/serverless-offline/commit/62c47669de1f51b4f018a7a92628ec678c5c036a)
- Remove context awsRequestId addition [`6375176`](https://github.com/dherault/serverless-offline/commit/637517659bc334a618a345e16f8a3b3638484cd0)
- Fix describe and test description [`b468e28`](https://github.com/dherault/serverless-offline/commit/b468e28707222d19321f22560c0205c21c06c3df)
- Do not remove unhandledRejection listeners [`5018283`](https://github.com/dherault/serverless-offline/commit/50182832fea85b4020005b02a240360aa8b2e9fb)
- Pre-initialize fields [`287d458`](https://github.com/dherault/serverless-offline/commit/287d4580b7f9eff7f87c0fa581ac76ac8906de7e)
- Require serverlessLog in createAuthScheme, remove function parameter [`c6e84e4`](https://github.com/dherault/serverless-offline/commit/c6e84e41faca7c7f3ad8065e15aa05d3f183d904)
- Fix awsRequestId in LambdaFunction [`0a0284c`](https://github.com/dherault/serverless-offline/commit/0a0284c684a5261627cd7f2ddb0cd600a86efb6c)
- Order nit [`a5e8bb0`](https://github.com/dherault/serverless-offline/commit/a5e8bb0b92787686b57528a4f54f9cad18136ca1)
- Don't pass null in context.fail call [`11ef1b8`](https://github.com/dherault/serverless-offline/commit/11ef1b8fe8a8d6d91dccf836684d1d00fad86ca5)
- Set serverless peer dependency to v1.48.1 #767 [`ec161e5`](https://github.com/dherault/serverless-offline/commit/ec161e51316bb989e593cb5c1d6606d70cb85d36)
- Remove eslint-disable flag [`83a63c1`](https://github.com/dherault/serverless-offline/commit/83a63c152cfb54834527b09bbbfa5ce42648fb19)

#### [v6.0.0-alpha.0](https://github.com/dherault/serverless-offline/compare/v5.12.1...v6.0.0-alpha.0)

> 4 August 2019

- Fixed undefined and null responseParameter values [`#759`](https://github.com/dherault/serverless-offline/pull/759)
- Response parameters bug fix [`#757`](https://github.com/dherault/serverless-offline/pull/757)
- Update deps, closes #755 [`#755`](https://github.com/dherault/serverless-offline/issues/755)
- Update deps [`0cf05a0`](https://github.com/dherault/serverless-offline/commit/0cf05a0c681c3fca8273f87e3acecaf119e0611d)
- Move callback out of constructor parameter [`cbe30fc`](https://github.com/dherault/serverless-offline/commit/cbe30fca5ec96e7d23cb7c787c875732ff983a10)
- Add process response wrapper [`c2aaea8`](https://github.com/dherault/serverless-offline/commit/c2aaea8b3072110a2f491000b15902869839bd31)
- Add lambda function integration tests [skipped] [`c07ab06`](https://github.com/dherault/serverless-offline/commit/c07ab062b383b953fc0f2b8d4e1cf4f4d4951e03)
- Refactor createLambdaProxyEvent function to LambdaProxyEvent class [`0c237a7`](https://github.com/dherault/serverless-offline/commit/0c237a7df335b6c11e444d90bd7325abf88e2e07)
- Fix default options handling [`0947b1e`](https://github.com/dherault/serverless-offline/commit/0947b1e82eb6ee3a874a445abbe84c6e60a95911)
- Move command options to config [`60ea77e`](https://github.com/dherault/serverless-offline/commit/60ea77e36827f39cf5705f5a63efea7519558b93)
- Update deps [`0dd51e6`](https://github.com/dherault/serverless-offline/commit/0dd51e6ff1a8f7699b93ae5d2d5a1a2bfbdc7dc3)
- Use prettier with README, contributors section [`ee33b97`](https://github.com/dherault/serverless-offline/commit/ee33b97cd2733d7ad57c338b17ea1063db474faa)
- Move callback out of constructor parameter [`64f1fad`](https://github.com/dherault/serverless-offline/commit/64f1fade27dc03134019a13dabc2609a8f1b2aba)
- Rename "key" and "funName" variables to functionName (same thing) [`5b6fc07`](https://github.com/dherault/serverless-offline/commit/5b6fc072e4eee78d581563f1083aa363703d35d3)
- Cleanup gitignore files [`5c5fed0`](https://github.com/dherault/serverless-offline/commit/5c5fed015f3e1e30120bab363ccea67cb6787e20)
- Shorten log method name [`ca0057a`](https://github.com/dherault/serverless-offline/commit/ca0057a7ca8f67f5a3b2261fe1e9d31f9bff780d)
- Consistent use of file extensions and folder/index paths [`281bc71`](https://github.com/dherault/serverless-offline/commit/281bc716df843aa0006e41adcd79a5e43107cca9)
- Run prettier [`3a864aa`](https://github.com/dherault/serverless-offline/commit/3a864aa1d341dd734a533f15ac4c0e50025c2d13)
- Refactor runtime verification, use config [`7538ac4`](https://github.com/dherault/serverless-offline/commit/7538ac4d5492a4173b2ec6012fd99d60dd681707)
- Move defaults to cli options [`9138003`](https://github.com/dherault/serverless-offline/commit/91380030896b8f7f8fc9ea6ec34f08f24ffab949)
- Fix async OfflineBuilder toObject tests [`ff7fe62`](https://github.com/dherault/serverless-offline/commit/ff7fe6210e960d46ccb422a446c459aa9c909b80)
- Use prettier with README [`19cf23f`](https://github.com/dherault/serverless-offline/commit/19cf23f1932d16f5e793d553ec6a851d5ee4b92a)
- Remove timeout feature (will be reimplemented) [`3ec5118`](https://github.com/dherault/serverless-offline/commit/3ec5118d3ff15289b3508efbe4cae44a4ddfedac)
- Add tests for #756, #757 [`0d77c92`](https://github.com/dherault/serverless-offline/commit/0d77c9261d65d7e074888c9d9c19a8468f8b6bb5)
- Add python integration test [skipped] [`3d26a10`](https://github.com/dherault/serverless-offline/commit/3d26a10114324782cc94b9c18a475065cc5900c6)
- Destructure off namespace object [`1868e1d`](https://github.com/dherault/serverless-offline/commit/1868e1dfa1031a1c0f9fa10927b252800af30ccd)
- Use more destructuring [`5cb8f48`](https://github.com/dherault/serverless-offline/commit/5cb8f483f4a00c0c0586cd7e39c0710680885c80)
- Replace offline-endpoint.json with OfflineEndpoint class, remove deep cloning with JSON [`970ff62`](https://github.com/dherault/serverless-offline/commit/970ff626568c4567c82d0b816b89c4b7b3c949fb)
- More order nits [`e7c73dc`](https://github.com/dherault/serverless-offline/commit/e7c73dc3251301d23f26b9ff2e60a5b1fabb7849)
- Remove detecting multiple calls of callback + Promise [`24b59d6`](https://github.com/dherault/serverless-offline/commit/24b59d6a4df1678ab47b6d3d811b90d7032e153b)
- Add ruby integration test [skipped] [`5f4d220`](https://github.com/dherault/serverless-offline/commit/5f4d2204b19bb0062bcba862c083446946e34833)
- Move property into object initializer [`b449511`](https://github.com/dherault/serverless-offline/commit/b4495119458b5b0b3587618f3ebfe614a0a2c8c9)
- Order nit [`fe98571`](https://github.com/dherault/serverless-offline/commit/fe9857159ec65c2004eedf0aecaad1b1b52975d8)
- Rename fun to functionObj [`1924364`](https://github.com/dherault/serverless-offline/commit/19243640c8c665a89cf0e83e6bf315ab5d96ffd0)
- Remove non-required name, exclude lambda invoke proxy from test run (for now) [`d5772f6`](https://github.com/dherault/serverless-offline/commit/d5772f68fbbeea399d9596acb7f26942774f3c58)
- Add deprecated/unsupported runtimes (still working) [`88fecc4`](https://github.com/dherault/serverless-offline/commit/88fecc41e5cb6e7a56ce00dbffac0ef6e7389570)
- Add node-fetch for integration testing [`603197a`](https://github.com/dherault/serverless-offline/commit/603197a63d7690606f961b80174e90a5ad7ebc7f)
- Lint: replace for..in loop [`24cd7fc`](https://github.com/dherault/serverless-offline/commit/24cd7fcfb09ce76059df23da4abee9e8367fad7d)
- Move experimental warning into websocket class [`0154ee3`](https://github.com/dherault/serverless-offline/commit/0154ee39d2d1755e8de73ae1bc42fac4129d23da)
- Move block into condition [`8a5796a`](https://github.com/dherault/serverless-offline/commit/8a5796a0206ec70ecc5e6cf84ba8f49a71981856)
- Rename funName to functionName [`8ae4f82`](https://github.com/dherault/serverless-offline/commit/8ae4f8226ac50fb9ae82d7073280905d30cc9fb6)
- Update deps [`6ae9af3`](https://github.com/dherault/serverless-offline/commit/6ae9af3f14e753bfa7a1779b4d3d90ab106746a0)
- Lint: Function ... expected no return value [`ed04127`](https://github.com/dherault/serverless-offline/commit/ed04127e9cd798409c61ebb78ae4f30f709d1a00)
- Return object from LambdaContext constructor [`5863d26`](https://github.com/dherault/serverless-offline/commit/5863d26cc5d2fcf0e06e7c45fa2c5174124e9976)
- Add tests for #758, #759 [`b72d240`](https://github.com/dherault/serverless-offline/commit/b72d24011f1f539ce398719a3a81a2d33e7048ee)
- Move eslint config rules [`601a693`](https://github.com/dherault/serverless-offline/commit/601a6933a01d23aca262aa47b08ab66753dfcb21)
- Rename variables [`fbd6ae7`](https://github.com/dherault/serverless-offline/commit/fbd6ae7bbe67b51f2b09aeb51bfada629de541d6)
- Refactor LambdaContext constructor parameters [`971a2e6`](https://github.com/dherault/serverless-offline/commit/971a2e6da6307ce9a3736f4c1a538045dd6c74a5)
- Destructure function helpers [`c72a880`](https://github.com/dherault/serverless-offline/commit/c72a880eb1bebd604424dedd51c24e5b1dd85c5a)
- Import nit [`1cd9154`](https://github.com/dherault/serverless-offline/commit/1cd91541d021c8f2c188df040722e8a554f6cf68)
- Use destructuring [`89ce799`](https://github.com/dherault/serverless-offline/commit/89ce799eb594fda25a0d77dba0211f03f551afd7)
- Lint: replace method with function [`72ddb7c`](https://github.com/dherault/serverless-offline/commit/72ddb7c70908ee765eb1a155c47c14f787ff0703)
- Move experimental websocket warning into class [`432cc0a`](https://github.com/dherault/serverless-offline/commit/432cc0a291bf082e2fd2d38ba953d36a9fe612b3)
- Move block into condition [`b3882ce`](https://github.com/dherault/serverless-offline/commit/b3882ce507d83fcbae26d7364c74121824dbe47e)
- Merge with spread [`0943e00`](https://github.com/dherault/serverless-offline/commit/0943e008b4ad0114eefbc9563f9bf7465ccccc65)
- Switch event creation positions, use destructuring [`33c8bf2`](https://github.com/dherault/serverless-offline/commit/33c8bf2ec59e666a114f40ebe7237ebffead8c25)
- Fix LambdaContext constructor parameters [`0eb7d64`](https://github.com/dherault/serverless-offline/commit/0eb7d648b0fd70df754efc059ecc3a10c2a32e28)
- Run prettier [`e9f4b5a`](https://github.com/dherault/serverless-offline/commit/e9f4b5a977cc331b7b6648d7ac1792ad2a2a991a)
- Simplify, use single Promise and async function [`53e46e6`](https://github.com/dherault/serverless-offline/commit/53e46e66bddfd8efa80dbe58ed92469a2a5ed19e)
- Move duration measurement block into callback [`9b2f846`](https://github.com/dherault/serverless-offline/commit/9b2f84630e0426b8d3100cfda06e7a5e26afda8e)
- Lint: more replace for..in loop [`24cf7bb`](https://github.com/dherault/serverless-offline/commit/24cf7bbd8dd81778922a84a59b6fb38972bfe017)
- Refactor start method to use async/await [`70c14b9`](https://github.com/dherault/serverless-offline/commit/70c14b98fa864610a5eebba7fd4318e5dcdc4e16)
- Move register plugins to own method [temp] [`f0d7c40`](https://github.com/dherault/serverless-offline/commit/f0d7c4074e818767e94921deed11223ee2c58c3a)
- Use same function signature for creating events [`cd72792`](https://github.com/dherault/serverless-offline/commit/cd7279223d4d008d944bbe5ea32bfcc5366b6bf7)
- Rename done function to callback [`ecf6c2f`](https://github.com/dherault/serverless-offline/commit/ecf6c2fd23e02e4c05132e72ff53ae3e8f7f1123)
- Don't return server from ApiGateway [`d1a385f`](https://github.com/dherault/serverless-offline/commit/d1a385f6f3eb6510c6f05b385d2a77ad13cdd486)
- Use more destructuring [`177b2d9`](https://github.com/dherault/serverless-offline/commit/177b2d998edccbcc04e0b94738df2ece0632acaa)
- Move duration timer block [`e457f2d`](https://github.com/dherault/serverless-offline/commit/e457f2d929e328a7463a8d63569386364ed75a68)
- Use callback [`137c2cf`](https://github.com/dherault/serverless-offline/commit/137c2cf8069b876f301637d87711e006206c5e6f)
- Simplify [`cc2cd57`](https://github.com/dherault/serverless-offline/commit/cc2cd5792fde0faab533663acb762a4b71dee088)
- Order nit [`c4eff17`](https://github.com/dherault/serverless-offline/commit/c4eff174f000969b9a17de23e24f04e1d1fc7525)
- Lint: replace for..in loop [`d9c84f2`](https://github.com/dherault/serverless-offline/commit/d9c84f2ea217fd224b5704087de82afd4b4fb2f2)
- Rename property [`17b84d9`](https://github.com/dherault/serverless-offline/commit/17b84d930017764cbcc2df24b856e5838314bb3e)
- Rename variable [`1131db9`](https://github.com/dherault/serverless-offline/commit/1131db9b29e7cde603c3e5d15743ad55fce47707)
- Rename variable [`54fe862`](https://github.com/dherault/serverless-offline/commit/54fe8620df9cb55e1bd701a666668ecc46017f9a)
- Use destructuring [`34cc78b`](https://github.com/dherault/serverless-offline/commit/34cc78b4f616cdf971f349b23287e1bd92f35f22)
- Rename variable [`0e1aa3f`](https://github.com/dherault/serverless-offline/commit/0e1aa3f3bb00959c8fe4de87005b45da95c73c33)
- Rename parameter [`70a7338`](https://github.com/dherault/serverless-offline/commit/70a73385ce960a1bf1f517086e94ff4267e6c103)
- Rename function (lambda) name parameter [`5ab0af0`](https://github.com/dherault/serverless-offline/commit/5ab0af0cc8aada6fa809b2706dbc1026095244d4)
- Update deps [`22e7202`](https://github.com/dherault/serverless-offline/commit/22e7202dca5299dd8cbf491d2294716925045de6)
- Update deps [`b32e0e6`](https://github.com/dherault/serverless-offline/commit/b32e0e67921a6c552716d58acf9a2bd0e1298b70)
- Formatting [`22af9fa`](https://github.com/dherault/serverless-offline/commit/22af9faf04b845f5429e00520f2b106bdf06558a)
- Add eslint disable comments [`7928047`](https://github.com/dherault/serverless-offline/commit/79280474645a1ce75a23dee91ddae1dbd5fbb63f)
- Simplify [`89258b7`](https://github.com/dherault/serverless-offline/commit/89258b7d44b9aae566c2f470a0b341dfbe3c1b31)
- Comment out mock restore (appears to be not needed) [`3cee442`](https://github.com/dherault/serverless-offline/commit/3cee442c213edeb195c45cbab3b2123d259c43d7)
- Destructure from JSON namespace [`0acad5c`](https://github.com/dherault/serverless-offline/commit/0acad5c89ce7ee9d3bc51cae966750fd6a748a7a)
- Use variables [`4b80b54`](https://github.com/dherault/serverless-offline/commit/4b80b54abdcbe24571ff189bdb0840b96860c1d1)
- Avoid open handles for test runs [`2259a74`](https://github.com/dherault/serverless-offline/commit/2259a743ca4584d8b39c76c8d651f32383e1590a)
- Lint: replace for..in loop [`7f4eced`](https://github.com/dherault/serverless-offline/commit/7f4eced9719329b07ea762b8da2cdcb4b49da13f)
- Order nit [`171d0e3`](https://github.com/dherault/serverless-offline/commit/171d0e3d809f491b6d8fcc9dfbc75e2f13387864)
- Remove storeOriginalEnvironment method [`1e77c62`](https://github.com/dherault/serverless-offline/commit/1e77c62c435286263c32d696127a22e412e2ee7b)
- Add condition for test runs [`383ccba`](https://github.com/dherault/serverless-offline/commit/383ccbadada1c9f89967b2adfebbc775b904cf6a)
- Use more destructuring [`881434e`](https://github.com/dherault/serverless-offline/commit/881434e0e455416000dfa6b1dffe9e1a05e8df25)
- Rename variable [`d8bf4d0`](https://github.com/dherault/serverless-offline/commit/d8bf4d02417e6287ac6ff4711479708836258753)
- Update deps [`e4955f9`](https://github.com/dherault/serverless-offline/commit/e4955f91d85127ed3d4b4770874c611aa4024da8)
- Replace Promises with async functions [`6b0cd41`](https://github.com/dherault/serverless-offline/commit/6b0cd41822bed2e3c89df0c5a7a948531557eb01)
- Formatting [`d4ed758`](https://github.com/dherault/serverless-offline/commit/d4ed7587c0583e4b439ab73b18f61b1c0f69618c)
- Use async/await to handle promise result [`b515fa1`](https://github.com/dherault/serverless-offline/commit/b515fa1116ed9f054b379f971af2d0c99d33a138)
- Rename property name [`13bb5d5`](https://github.com/dherault/serverless-offline/commit/13bb5d56614dec4c6097f0c9dd3919b5a5e5268e)
- Use braces for non-returning event handlers [`c474c57`](https://github.com/dherault/serverless-offline/commit/c474c57bf8f7b9708dfc01d23aacc7bb13c94014)
- Rename methods [`300d503`](https://github.com/dherault/serverless-offline/commit/300d503f1c442a74e15842372b31e05685cfaec5)
- Make api gateway and websocket instantiation separat [`d767653`](https://github.com/dherault/serverless-offline/commit/d76765395e3c6a6549d696688a07b20e76e13b30)
- Remove underscore from method [`5791f86`](https://github.com/dherault/serverless-offline/commit/5791f86f17b46d14652969a655a6d0eaa581a100)
- Change Endpoint constructor [`c9a8ca1`](https://github.com/dherault/serverless-offline/commit/c9a8ca1680f546674c3d783645b5fa68c4b6bc08)
- Make Endpoint methods "private", call generate in constructor [`9c836ac`](https://github.com/dherault/serverless-offline/commit/9c836ac3d6ad5dd4ddf61bc92185627b426a4016)
- Fix async create websocket [`ec0a9a0`](https://github.com/dherault/serverless-offline/commit/ec0a9a0f6a84cc2afd722d719c4680114b7ae51d)
- Lint: Arrow function expected no return value [`ac833fa`](https://github.com/dherault/serverless-offline/commit/ac833fa526353855080bf9858d46e47a5e0c6c02)
- Add braces [`cf7e6eb`](https://github.com/dherault/serverless-offline/commit/cf7e6eb20c5ef2c28364137a53640b3c0745e925)
- Remove export for createExternalHandler [`abe1be5`](https://github.com/dherault/serverless-offline/commit/abe1be53a1e17495992d47b293863a001aa72b78)
- Simplify [`9d19c88`](https://github.com/dherault/serverless-offline/commit/9d19c8847bb491126da6446d161f39b72822049d)
- Require ServerlessOffline class directly for tests [`e81d3e9`](https://github.com/dherault/serverless-offline/commit/e81d3e931886664b89b78293c3f62fea1fd317fa)
- Add constants to config, move custom property name [`f6a1c40`](https://github.com/dherault/serverless-offline/commit/f6a1c408dea567cebf85deeb4d1e325a0161dec2)
- Cleanup [`5c9d9c7`](https://github.com/dherault/serverless-offline/commit/5c9d9c71ab161d017ac2985b48cdb76aa4261c88)
- Simplify, use ternary, assign directly [`630764a`](https://github.com/dherault/serverless-offline/commit/630764a16696c1c41a45b0bb86556a196ac19785)
- Rename setOptions to mergeOptions, make public [`46de724`](https://github.com/dherault/serverless-offline/commit/46de72481f66c0bc7c27e005f73979d262041955)
- Rename listen method to startServer [`12ccc19`](https://github.com/dherault/serverless-offline/commit/12ccc19738c287b486639ab5370cdc833c14ecf1)
- Remove more underscore from method [`bdd8187`](https://github.com/dherault/serverless-offline/commit/bdd8187a9a3053fa0758947eac678d57afe13196)
- Move hasWebsocketRoutes into websocket class [`561a665`](https://github.com/dherault/serverless-offline/commit/561a66534f412f652672737ea7ccb728370d6f6e)
- Remove underscore from method [`3eb72bd`](https://github.com/dherault/serverless-offline/commit/3eb72bd8ea847d69ef6bc57e3e8c29b48cdaa37d)
- Use destructuring [`09ae4fe`](https://github.com/dherault/serverless-offline/commit/09ae4fe7377721a15f881209212b194d2788e525)
- Use constructor to setup hapi server [`09d424c`](https://github.com/dherault/serverless-offline/commit/09d424c819503b77c55a91ebf3a04fa0a2577303)
- Use async/await to register hapi plugin [`459b69e`](https://github.com/dherault/serverless-offline/commit/459b69e51e2cc8b7d202281caeeb4dd34da4b291)
- Lint: even more replace for..in loop [`cc7d688`](https://github.com/dherault/serverless-offline/commit/cc7d688537101a215419d24d96ccfa1c5e2079ba)
- Remove impossible (or rather unlikely) condition [`980ea0b`](https://github.com/dherault/serverless-offline/commit/980ea0bbe29450b4c66676c175b795f3e4a5da59)
- Pass service directly [`03b65a7`](https://github.com/dherault/serverless-offline/commit/03b65a784b79131eee3f0b6fc4453d710dd49c34)
- Simplify more [`bbe22aa`](https://github.com/dherault/serverless-offline/commit/bbe22aa5f0df03b83f9db7071d801fa73a66a016)
- Use serverlessLog for warning [`d1f95a5`](https://github.com/dherault/serverless-offline/commit/d1f95a554837f70e8ec1868a012043f290ff7ae3)
- Remove space [`2116ddb`](https://github.com/dherault/serverless-offline/commit/2116ddb2b72bfffc1215c06ce77a8d708101fdbe)
- Simplify, call directly [`237ee80`](https://github.com/dherault/serverless-offline/commit/237ee801b1fe1e657a46d7ccada0f68e97a32f8d)
- Contributors list updated [`83b60ac`](https://github.com/dherault/serverless-offline/commit/83b60ac3881d9d806c333294d7329c2a3afc0dbc)
- Reduce complexity [`2f5ce16`](https://github.com/dherault/serverless-offline/commit/2f5ce163c347f180e56ff15c298990ce40760330)
- Simplify loop, remove in-operator [`d35e397`](https://github.com/dherault/serverless-offline/commit/d35e397954cc5cf206b472683234287f6e9ce0de)
- Add server init to websocket class, call from constructor [`a1e5e94`](https://github.com/dherault/serverless-offline/commit/a1e5e94890c0b702b5a0006e8675342f531abdf9)
- Make setupEvents public [`2e4e055`](https://github.com/dherault/serverless-offline/commit/2e4e05500637ba079682b01d3b669fe4e40ab3b4)
- Move env copy block [`0c5808f`](https://github.com/dherault/serverless-offline/commit/0c5808ff8a1099f4a6206b8fc1d783c84854a2a6)
- Destructure loop entries [`7c2a2b1`](https://github.com/dherault/serverless-offline/commit/7c2a2b10fbc5c51f61bd5912933630e915329ef0)
- Use destructuring [`2f514a7`](https://github.com/dherault/serverless-offline/commit/2f514a70466fda7b76f7e67b97d8c96e5aa521eb)
- Use destructuring [`fc7a4d7`](https://github.com/dherault/serverless-offline/commit/fc7a4d7f1de5355e3268950d8e83751a08c70033)
- Fix formatting [`9aa6c6f`](https://github.com/dherault/serverless-offline/commit/9aa6c6fddbb5186e5f4404797dd31896aa3b7fb0)
- Use object spread to merge objects [`af9b9e5`](https://github.com/dherault/serverless-offline/commit/af9b9e55a63f98263cc0a2c0084bf58c80c50734)
- Lint: and more replace for..in loop [`d30f7b5`](https://github.com/dherault/serverless-offline/commit/d30f7b5e395faa3ab2ad30ec52cea67a8ab597fb)
- Add SERVER_SHUTDOWN_TIMEOUT to config constants [`5082a23`](https://github.com/dherault/serverless-offline/commit/5082a239407986e59c3ae149a292cec4a091a7d8)
- Simplify [`6a4284c`](https://github.com/dherault/serverless-offline/commit/6a4284cc50a7bc100f595d4c33991784166338d9)
- Fix provided runtime [`ed2b2c8`](https://github.com/dherault/serverless-offline/commit/ed2b2c8793045730e4ac96aec74cd498385e682b)
- Simplify, use computed property name [`6580afa`](https://github.com/dherault/serverless-offline/commit/6580afad14a5cab3ac7e36278edc43f6005ec6a0)
- Add additional function comment [`5f6bdd5`](https://github.com/dherault/serverless-offline/commit/5f6bdd51a8727d2b7e0458359e76ccde2dc86a20)
- Linting, remove in-operator [`baac4ca`](https://github.com/dherault/serverless-offline/commit/baac4ca0428e929a4d6393133a2a20d31a218311)
- Remove fixed eslint rules [`b2738f7`](https://github.com/dherault/serverless-offline/commit/b2738f771744e2fa729351c7e7f126a6e6863ec0)
- Rename createServer method to init, call in constructor [`3b4ad87`](https://github.com/dherault/serverless-offline/commit/3b4ad87335c7c600252ee1bc408c2420c23adafd)
- Simplify [`2289b42`](https://github.com/dherault/serverless-offline/commit/2289b420b6a3cb4d9a3eb968f810f738d1852d86)
- Simplify object merge [`783141c`](https://github.com/dherault/serverless-offline/commit/783141c4b815aa457f5eacde80a40f97f9c19667)
- Order nit [`e557b33`](https://github.com/dherault/serverless-offline/commit/e557b33115ce68a60641c6515067fe0505393de1)
- Fix options import [`fc50e97`](https://github.com/dherault/serverless-offline/commit/fc50e9752674a71da9eeb30f7c82850feb751dbb)
- Move calls up [`a3f64d3`](https://github.com/dherault/serverless-offline/commit/a3f64d38cf6d4634cb19148a67bd2a477454ea8e)
- Rename method [`963213f`](https://github.com/dherault/serverless-offline/commit/963213f7979e4440af397bc4e8745d1fd32fabb2)
- Nit [`07f43b3`](https://github.com/dherault/serverless-offline/commit/07f43b370758e2d36038208c497c26ad9ae32d72)
- Rename parameter [`5e1d666`](https://github.com/dherault/serverless-offline/commit/5e1d666936f4e141bf02cd496a1823b04f3ba3da)
- Remove redundant parameter [`e86913a`](https://github.com/dherault/serverless-offline/commit/e86913a419aae2a531b024d5c2d7fb4bfb7610ce)
- Add braces for non-returning functions [`18dbe2d`](https://github.com/dherault/serverless-offline/commit/18dbe2d1b3f5ee396c38e9b0bfeaa5a66d53e419)
- Rename function [`4510166`](https://github.com/dherault/serverless-offline/commit/4510166408f54b35cfd9429ad155e949b2368c09)
- More namespace destructuring [`f6ae990`](https://github.com/dherault/serverless-offline/commit/f6ae990dc59a28c255cf7d154b7021b2d642258c)
- Move variable declaration closer to where it is being used [`2012a88`](https://github.com/dherault/serverless-offline/commit/2012a88215cec342c8997c8dc61a4dbefd6b764c)
- Rename another callback parameter [`0069b90`](https://github.com/dherault/serverless-offline/commit/0069b9094ab61487dd24b3f8c055bf3369867576)
- Rename callback parameter [`45cb66c`](https://github.com/dherault/serverless-offline/commit/45cb66cf6a1da321d98735079352bbbeefdeb316)
- Simplify, use Object.entries to traverse functions [`1eaf8b1`](https://github.com/dherault/serverless-offline/commit/1eaf8b1f2a46afce57ed02a780b586fa4a7d4f2b)
- Add some spacing [`e934067`](https://github.com/dherault/serverless-offline/commit/e934067f613d740076a10aaabadca11274d6d092)
- Run tests sequentially [`d46c432`](https://github.com/dherault/serverless-offline/commit/d46c432fc85ee9e33431c660f4f34e2a73e45a39)
- Rename files [`086945d`](https://github.com/dherault/serverless-offline/commit/086945d0c31ffd931f849febb0ffba3e78261b16)
- Add apostrophes [`2c347b8`](https://github.com/dherault/serverless-offline/commit/2c347b818776870756f99c2338db6b682be041c7)
- Fix async createServer call [`6406e1c`](https://github.com/dherault/serverless-offline/commit/6406e1c3067c643089564b013129b0ad71b1b9c1)
- Use array destructuring [`9a54601`](https://github.com/dherault/serverless-offline/commit/9a54601997b8923af02c7170f6050cd5c17e84fe)
- Reword error message (not only cli specific) [`78bd01e`](https://github.com/dherault/serverless-offline/commit/78bd01ea78d7d6e887f6a213a8bcffa844d153a7)
- Bugfix: add missing 'noTimeout' cli option [`46f32ec`](https://github.com/dherault/serverless-offline/commit/46f32ecc4ba466ff5eda9870eab3320a1fa8ecb8)
- Rename variable [`43893a3`](https://github.com/dherault/serverless-offline/commit/43893a35559c1230cdfbb7ee19e01935209d3b62)
- Simplify object merge [`a7685e1`](https://github.com/dherault/serverless-offline/commit/a7685e1d16bed8b30afbba14ff2fabc096f76b6d)
- Rename proxy function [`589e69f`](https://github.com/dherault/serverless-offline/commit/589e69fa617f6f360e6243e98cbdeb54c3fc75c4)
- Fix log formatting [`dc7bf77`](https://github.com/dherault/serverless-offline/commit/dc7bf7735256ccc7675313cb8ca9073ec7c1e349)
- Move debugLog [`3a633d7`](https://github.com/dherault/serverless-offline/commit/3a633d757cb9619f494b10d55eaf8242f07e2d82)
- Websocket: remove unused hapi proxy plugin [`42465bb`](https://github.com/dherault/serverless-offline/commit/42465bba01dbb95832e7ba0bf79a6068c6459c2b)
- Remove unused fields [`94c3442`](https://github.com/dherault/serverless-offline/commit/94c3442a618a112a610f2f644e01bf76cb120f95)
- Combine comments [`456bb3a`](https://github.com/dherault/serverless-offline/commit/456bb3a5bb08f8e59b7f131f2c4d4ac1bca0852b)
- Linting, remove more in-operator [`c77da52`](https://github.com/dherault/serverless-offline/commit/c77da528320e98c8fa1837962b18b95a9166dd2a)
- Fix test description [`6cc1392`](https://github.com/dherault/serverless-offline/commit/6cc1392cf62cd4e1877df49eda67fed0835e1d87)
- Fix awaiting registering plugins [`324d5d8`](https://github.com/dherault/serverless-offline/commit/324d5d82ad111ce9d98ea4bb418f4f0f736e3f5f)
- Order nit [`a3dc82c`](https://github.com/dherault/serverless-offline/commit/a3dc82c63d40dd09fdc5093ca0595295b0cf28ce)
- Move comment [`d19b1a1`](https://github.com/dherault/serverless-offline/commit/d19b1a11a6ff98b109147f079f9f0d1cd9b632d6)
- Pass callback to handler [`55de08f`](https://github.com/dherault/serverless-offline/commit/55de08f77ee3ee8228d8f7f419b116852ae7a88d)
- Extend jest timeout for tests [`f7a0df0`](https://github.com/dherault/serverless-offline/commit/f7a0df03b7dcea47c92469cc0fb6391e8d21d4b2)
- Extend test timeout for integration tests [`00abb9a`](https://github.com/dherault/serverless-offline/commit/00abb9a492848df90f095c25cf7627507ad370bc)
- Unskip integration tests [`42ff7ed`](https://github.com/dherault/serverless-offline/commit/42ff7ededf881c070a6622e9abbca9e14abde9fc)
- Set service path for tests [`fd48e8e`](https://github.com/dherault/serverless-offline/commit/fd48e8e9486ddcf85c0e4b36b948f86d3f568dda)
- Remove eslint flag comments [`4a6e4cb`](https://github.com/dherault/serverless-offline/commit/4a6e4cbc3e34b6cc2a93dd8b7f07dedf236bd030)
- Remove redundant Promise.resolve [`acfe2cd`](https://github.com/dherault/serverless-offline/commit/acfe2cd2114c731d88628129ceffae94e3360760)
- Remove eslint disable comment [`b44bfe4`](https://github.com/dherault/serverless-offline/commit/b44bfe45e4e87dd2a14d6919ffde6966906b0ca6)
- Typo fixed [`038e3ca`](https://github.com/dherault/serverless-offline/commit/038e3ca4aec49ddf636c6e1b496684ff5eeda1ef)
- Switch order of supported node versions [`6b3f2c7`](https://github.com/dherault/serverless-offline/commit/6b3f2c7080c2f048658f64b2ad32b4b133f58e23)
- Add strict mode directive [`5e0f14e`](https://github.com/dherault/serverless-offline/commit/5e0f14e43a508d18764606e4a4b6f419966dc0bd)
- Remove unused fields [`32cd605`](https://github.com/dherault/serverless-offline/commit/32cd60532e08cff1185f666fe5bac967259b4288)
- Fix createExternalHandler reference [`3aa640f`](https://github.com/dherault/serverless-offline/commit/3aa640f71b3020d692bc7e955c93eda19012e44b)
- Destructure custom options [`333bb97`](https://github.com/dherault/serverless-offline/commit/333bb9784006e414d0b3010fe81b725ed0f4ee85)
- Fix export [`51f2d1c`](https://github.com/dherault/serverless-offline/commit/51f2d1cacb32c2bab885491765d0d5732ff65853)
- Order nit [`fb44a17`](https://github.com/dherault/serverless-offline/commit/fb44a17230fd4e560d29397a0acf48a20f729ce1)
- Fix readme for AWS supported runtimes [`2221b40`](https://github.com/dherault/serverless-offline/commit/2221b40e0f5b98a88722f7f0ff8b1ad4d6152b6e)
- Remove comment [`8c4bf67`](https://github.com/dherault/serverless-offline/commit/8c4bf679a4d3004439e778377ad651903f1ad610)
- Remove space [`db8d220`](https://github.com/dherault/serverless-offline/commit/db8d220f7fc2a2ce1e44ed6cc6315df3a62a1ce1)
- Remove comment [`520d1c5`](https://github.com/dherault/serverless-offline/commit/520d1c545c97ffab318d5c8d61775f0be5e043cb)

#### [v5.12.1](https://github.com/dherault/serverless-offline/compare/v5.12.0...v5.12.1)

> 30 November 2019

- check for http event with private: true [`#832`](https://github.com/dherault/serverless-offline/issues/832)
- Update deps [`0be8ad1`](https://github.com/dherault/serverless-offline/commit/0be8ad1e4f137e78862fd32ea71169f152b33687)
- Linting/prettier [`c058fa6`](https://github.com/dherault/serverless-offline/commit/c058fa63f6f044b7b0c3cbb95bfebb2ebb52b791)
- Fix private http events [`9c90c15`](https://github.com/dherault/serverless-offline/commit/9c90c157ae6dbd37b9b6ae1ba6d895d68aee493f)

#### [v5.12.0](https://github.com/dherault/serverless-offline/compare/v5.11.0...v5.12.0)

> 1 October 2019

- Added support for AUTHORIZER env var in lambda integration (v5) [`#817`](https://github.com/dherault/serverless-offline/pull/817)
- Added support for AUTHORIZER env var in lambda integration [`#816`](https://github.com/dherault/serverless-offline/issues/816)
- Update deps [`b2cb18c`](https://github.com/dherault/serverless-offline/commit/b2cb18c1352978b05e57cebd1bf7e6977b999cbc)

#### [v5.11.0](https://github.com/dherault/serverless-offline/compare/v5.10.1...v5.11.0)

> 11 September 2019

- Add another style of policyResource [`#805`](https://github.com/dherault/serverless-offline/pull/805)
- Avoid setting empty response headers [`#804`](https://github.com/dherault/serverless-offline/issues/804)
- Update deps [`c1c6810`](https://github.com/dherault/serverless-offline/commit/c1c6810fc4557c758d2a2be7ba04e4daafb65848)
- fix: save authorizer data in authorizer property [`53d920e`](https://github.com/dherault/serverless-offline/commit/53d920ecdc3c2d3ec772f673e644260fbf71ce67)
- feat: add lambda proxy authorizer enhancedAuthContext [`df38a11`](https://github.com/dherault/serverless-offline/commit/df38a115d332d815b9277298979164c72ac3e1ad)
- fix: add missing properties in default velocity template [`cfe1d54`](https://github.com/dherault/serverless-offline/commit/cfe1d545a972f861451f22d86eb66ab157f84603)
- chore: use principalId instead of user [`ba13812`](https://github.com/dherault/serverless-offline/commit/ba138127c38b237846d4f178f19341f55a88e662)
- fix: don't pass object to serverlessLog [`01d4023`](https://github.com/dherault/serverless-offline/commit/01d40232530d3484f93343b3453e1f4afde0269e)
- Fix, add semi [`51e6605`](https://github.com/dherault/serverless-offline/commit/51e66054ebecacbd25c860be3f3bb9ca13e4c1ad)

#### [v5.10.1](https://github.com/dherault/serverless-offline/compare/v5.10.0...v5.10.1)

> 7 August 2019

- Remove underscore [bad cherry-pick from v6], fixes #771 [`#771`](https://github.com/dherault/serverless-offline/issues/771)

#### [v5.10.0](https://github.com/dherault/serverless-offline/compare/v5.9.0...v5.10.0)

> 7 August 2019

- Update deps [`137b6ec`](https://github.com/dherault/serverless-offline/commit/137b6ecfaea9d6cce787dd0206f88b6e7bc15d54)
- Add update-notifier module [`02412ac`](https://github.com/dherault/serverless-offline/commit/02412ac2dc4bdf9d17cd33f768b89db265fb356f)

#### [v5.9.0](https://github.com/dherault/serverless-offline/compare/v5.8.0...v5.9.0)

> 5 August 2019

- Fixed undefined and null responseParameter values [`2758e2a`](https://github.com/dherault/serverless-offline/commit/2758e2aedd6afb21ca28e75edda48788d5f9552e)
- Do not remove unhandledRejection listeners [`040b064`](https://github.com/dherault/serverless-offline/commit/040b06454db003440448cee301ddf7804487068a)
- Set serverless peer dependency to v1.48.1 #767 [`5c3b493`](https://github.com/dherault/serverless-offline/commit/5c3b493682c55b4137f8b5e6b5286bc6f539e60f)
- Typo fixed [`86f0332`](https://github.com/dherault/serverless-offline/commit/86f0332975cfd240ce9455abe12a4bcb69cfcd1c)
- Contributors list updated [`c48801f`](https://github.com/dherault/serverless-offline/commit/c48801fe7dabb253c8b35208c1db7a22bd7f0d09)

#### [v5.8.0](https://github.com/dherault/serverless-offline/compare/v5.7.3...v5.8.0)

> 17 July 2019

- feat: add go to supported runtimes [`#744`](https://github.com/dherault/serverless-offline/pull/744)
- Support node.js v8.10, closes #741 [`#741`](https://github.com/dherault/serverless-offline/issues/741)
- Update deps [`f09ad2a`](https://github.com/dherault/serverless-offline/commit/f09ad2aeab2b392bfd117943351af9d3dcab6ad7)
- Lint: Define before usage [`a66a50a`](https://github.com/dherault/serverless-offline/commit/a66a50a09ed06bcb5f41aa75751c3ae11144d056)
- Combine destructuring [`d14e57a`](https://github.com/dherault/serverless-offline/commit/d14e57a7d3d77d738aeebc2cbfaa8192b9de20c4)
- Add missing strict mode directives [`8f48bd5`](https://github.com/dherault/serverless-offline/commit/8f48bd5fa612135feffb65eb50581aeb7e248e3b)
- Remove disable lint, use triple eq, guaranteed to be type string [`f7811fc`](https://github.com/dherault/serverless-offline/commit/f7811fc7a4a2260e737687cfbcd1ebb43ef7854e)
- Fix websocket port header [`260be3e`](https://github.com/dherault/serverless-offline/commit/260be3ef31c0fa45f3c7ac64b1b8ae283f4f5031)
- Add links to supported language runtimes [`2c0f4fb`](https://github.com/dherault/serverless-offline/commit/2c0f4fb6735381aa65bd281dde2ac8f2a8a6610f)
- Add Go to Readme [`5fafc7c`](https://github.com/dherault/serverless-offline/commit/5fafc7c2c14cb9d393819dfe88bf4b3bbe614d0e)
- Add missing strict mode directive [`9bbd4b0`](https://github.com/dherault/serverless-offline/commit/9bbd4b0e9dc448e9461df0ba11a4198b03693f66)

#### [v5.7.3](https://github.com/dherault/serverless-offline/compare/v5.7.2...v5.7.3)

> 10 July 2019

- Bugfix for no queryStringParameters, fixes #738 [`#738`](https://github.com/dherault/serverless-offline/issues/738)

#### [v5.7.2](https://github.com/dherault/serverless-offline/compare/v5.7.1...v5.7.2)

> 8 July 2019

- fix: missing base in URL() constructor [`#735`](https://github.com/dherault/serverless-offline/pull/735)
- Add satisfiesVersionRange incl. tests [`e272afd`](https://github.com/dherault/serverless-offline/commit/e272afdc5d00f624ec3366f260fe55bd2bbb9616)
- Use package.json peerDependencies for version verification, show warning, don't throw [`83d4584`](https://github.com/dherault/serverless-offline/commit/83d458473ba5d49fdb1d8f08f367f0b67eea1981)
- Switch test parameter positions [`02018a4`](https://github.com/dherault/serverless-offline/commit/02018a45607810ad93af2fc94c4c1cd888ac4415)
- Use constant for base url placeholder [`c996a94`](https://github.com/dherault/serverless-offline/commit/c996a944fe4c795470b603a750ef6f645f80dd88)
- Rewording, fix spelling [`37c0949`](https://github.com/dherault/serverless-offline/commit/37c0949b9573424ea1db38b8ada080a1aab293bb)
- Fix switched parameters [`23183a7`](https://github.com/dherault/serverless-offline/commit/23183a704a5c3377e1d373c7ac66e85b6a1fd4de)

#### [v5.7.1](https://github.com/dherault/serverless-offline/compare/v5.7.0...v5.7.1)

> 7 July 2019

- Remove package-lock.json from manual tests [`1204dc3`](https://github.com/dherault/serverless-offline/commit/1204dc3b875288e304e69f9e73a25ab8211f621e)
- Partially revert feed4b2 [`f341e8c`](https://github.com/dherault/serverless-offline/commit/f341e8c6e1b362a41f416a55b4c7d076792fcf2c)

#### [v5.7.0](https://github.com/dherault/serverless-offline/compare/v5.6.1...v5.7.0)

> 7 July 2019

- Remove request body validation #589 #604 [`#733`](https://github.com/dherault/serverless-offline/pull/733)
- Remove request body validation #589 [`061e3a6`](https://github.com/dherault/serverless-offline/commit/061e3a63c4f05b2cca8e5396203db2d7b97de01d)
- Refactor lamda context function to class [`95661ca`](https://github.com/dherault/serverless-offline/commit/95661ca3fa222069bcd96c59d06d5aa73db1b083)
- Rename createLambdaProxyContext to createLambdaProxyEvent [`feed4b2`](https://github.com/dherault/serverless-offline/commit/feed4b25799419b85df0104e25b1492a1fd44873)
- Doc deprecate request body validation [`738dd95`](https://github.com/dherault/serverless-offline/commit/738dd951bc6b76e50307f2a8f0cd19e06ba1badc)
- Order flags in readme [`9b13f49`](https://github.com/dherault/serverless-offline/commit/9b13f49bb7c650d01ce06644f0be10b61c6e0f55)
- Add EOL parameter test [`c1f9ff9`](https://github.com/dherault/serverless-offline/commit/c1f9ff9052ec0785b392ad889501ad1fd7374725)
- Remove disableModelValidation flag [`9d90731`](https://github.com/dherault/serverless-offline/commit/9d9073198bd1f968cd1b9fe865ea8deaa0debd14)
- Lint [`e38be0e`](https://github.com/dherault/serverless-offline/commit/e38be0eaaab97af1c0dd7b76e9c7f5076cb9621d)
- Use apostrophe in readme [`99c3cce`](https://github.com/dherault/serverless-offline/commit/99c3cce1fcdeeb1a3d0bf94dccd682ee6dfc7a9e)
- Remove comment [`f391836`](https://github.com/dherault/serverless-offline/commit/f391836b412704afe40c0eab8e833e3d4446847a)
- Remove arrow function closure from test [`95b7b06`](https://github.com/dherault/serverless-offline/commit/95b7b061c459672f90e7df9bb2ba0b39335931e3)

#### [v5.6.1](https://github.com/dherault/serverless-offline/compare/v5.6.0...v5.6.1)

> 6 July 2019

- Revert e8306dd, fixes #723, fixes #728, fixes #730 [`#723`](https://github.com/dherault/serverless-offline/issues/723) [`#728`](https://github.com/dherault/serverless-offline/issues/728) [`#730`](https://github.com/dherault/serverless-offline/issues/730)
- Add serverless and offline plugin to manual test packages, update deps [`535bc6c`](https://github.com/dherault/serverless-offline/commit/535bc6c7898511484ce949ee83378ac272e569fc)
- Prettify [`17a7245`](https://github.com/dherault/serverless-offline/commit/17a724565a41e308880ab415ba4423914e61bc1a)
- Add jest, remove mocha, chai [`bda5040`](https://github.com/dherault/serverless-offline/commit/bda5040c49d0ccc32fe41411c5e7b43ea8f5ac53)
- Convert test cases to jest [`6a1b110`](https://github.com/dherault/serverless-offline/commit/6a1b110642ce587d23d3b120e5c6ebdb683e5eca)
- Remove unused module npm-check [`3f9596b`](https://github.com/dherault/serverless-offline/commit/3f9596ba43c76b77b6b490197372eaae6632b8b0)
- Move Offline class into separate file [`f6f9b5c`](https://github.com/dherault/serverless-offline/commit/f6f9b5c50eed85c69386337c5f403f0aed78e04c)
- Consistent exports of 'default' and 'named' functions [`7d4d79b`](https://github.com/dherault/serverless-offline/commit/7d4d79b10dac8b5b00e0bed7114fdd76432a29be)
- Ordering nits [`dd1bb5a`](https://github.com/dherault/serverless-offline/commit/dd1bb5ac14a5432484d028fac857d391efe93b26)
- Add parseMultiValueQueryStringParameters incl. tests [`90d04d3`](https://github.com/dherault/serverless-offline/commit/90d04d35b65028ca5b4c37b53d45c7a090cde591)
- Ordering nits [`0450e4f`](https://github.com/dherault/serverless-offline/commit/0450e4ffbaf16834dcd1bc12480ee58890b258de)
- Remove sinon, replace with jest mock [`7c09f17`](https://github.com/dherault/serverless-offline/commit/7c09f17c440ac6d6b750820fa5b3d113d9455015)
- More consistent exports of default and named functions, use hoisted functions [`1c869b1`](https://github.com/dherault/serverless-offline/commit/1c869b1324e1694c2bf06903bedf5672091583ba)
- Rename parseQueryStringParameters, fix and combine tests [`3e00fb3`](https://github.com/dherault/serverless-offline/commit/3e00fb3022035ca1749b3dcf3186f444b7479361)
- Add prettier, eslint plugin prettier, eslint config prettier [`399863e`](https://github.com/dherault/serverless-offline/commit/399863e03ed967321dd1251652a40d533012033d)
- Move manual tests into test folder, rename [`c29db42`](https://github.com/dherault/serverless-offline/commit/c29db427badda4533675f010181bfb04e47376c9)
- Move utils to folder [`6699689`](https://github.com/dherault/serverless-offline/commit/6699689a71264b8a2db835f049fb01fdfe388076)
- Move handler into src folder [`6e374ec`](https://github.com/dherault/serverless-offline/commit/6e374ec4ba3dfdd5aa3e486e985764093ff737b1)
- Add parseQueryParameters incl. tests [`8ca29f8`](https://github.com/dherault/serverless-offline/commit/8ca29f8baf252a4b705e091c30adb0bdd366c76a)
- Add utils tests [`201dbbf`](https://github.com/dherault/serverless-offline/commit/201dbbf6ae17dca89f8d8456214357456f8840b3)
- Move formatToClfTime to utils [`f217a9b`](https://github.com/dherault/serverless-offline/commit/f217a9b05f9ec1eff5b9e5237957dc466890b64e)
- Use more destructuring [`6ecbd93`](https://github.com/dherault/serverless-offline/commit/6ecbd939266337723b2bf079a4fe34f8f0012037)
- Remove and fix comments [`7a8d68e`](https://github.com/dherault/serverless-offline/commit/7a8d68e6804e0ad1a8716d6ab7b08d6269bec49c)
- Add more badges: minimum node version and minimum peer dependency version [`f425064`](https://github.com/dherault/serverless-offline/commit/f4250648f142c7401d566536f1a2ebbc87fec9d1)
- Remove unused file [`4c07849`](https://github.com/dherault/serverless-offline/commit/4c078493265e6e5cacbc25b5fa216260abfc2d93)
- Add Object.fromEntries polyfill [`074b447`](https://github.com/dherault/serverless-offline/commit/074b44796bc7b74f4b662e94e591ed68b82acfd6)
- Move velocity templates and json endpoint to config folder [`22631c5`](https://github.com/dherault/serverless-offline/commit/22631c50c8066db6db4c4e8381802c86de8f538a)
- Use parseQueryParameters [`c83980e`](https://github.com/dherault/serverless-offline/commit/c83980e32edbd6d356add59440033258b4e62c9b)
- Destructure isArray from namespace [`f927eba`](https://github.com/dherault/serverless-offline/commit/f927eba39f2ef4e769333f8df62bdfb21947e6a2)
- Remove eslint config from tests folder [`a84a1f1`](https://github.com/dherault/serverless-offline/commit/a84a1f1ff14e2f9cb35a4068ebbe5a45a60d330d)
- Add missing 'use strict' directive [`7052723`](https://github.com/dherault/serverless-offline/commit/7052723ec4141c16fabb1a84d77caa1b95320d6c)
- Fix formatToClfTime tests [`b26dd58`](https://github.com/dherault/serverless-offline/commit/b26dd58799bb4774f6fe401ce225b7c18dfdfe28)
- Destructure off require [`f638740`](https://github.com/dherault/serverless-offline/commit/f638740a96198b0b24cadf2d48def37ae4ccf605)
- Require json endpoint json [`6961f07`](https://github.com/dherault/serverless-offline/commit/6961f07fd193d20d49f02f7b267b7788fa0be588)
- Remove eslint-disable-line prefer-const [`38e8ddd`](https://github.com/dherault/serverless-offline/commit/38e8ddd8781d3f41abac0237dcde585084a4454d)
- Simplify [`e6d2a60`](https://github.com/dherault/serverless-offline/commit/e6d2a60d7b724099535090f2ccc9b9994599b9fc)
- Export class directly [`842bd31`](https://github.com/dherault/serverless-offline/commit/842bd312548717846351188a0af2f8412350aa20)
- Rename class Offline to ServerlessOffline [`9412391`](https://github.com/dherault/serverless-offline/commit/9412391939afb73927e9ee6ca5c6c466460c8914)
- Use destructuring [`8a8771d`](https://github.com/dherault/serverless-offline/commit/8a8771d71d5809056a4a12201320746d8d19aeac)
- Add temporary eslint-disable to manual test cases [`e98fe73`](https://github.com/dherault/serverless-offline/commit/e98fe737c0a32e514c5ca7ceb11414182e6bc4ed)
- Fix unneeded typeof catch check for Promises [`33f8dd3`](https://github.com/dherault/serverless-offline/commit/33f8dd3745fd4c4e857c1ee3c2c830f3ef998f64)
- Remove unused file [`4185ef6`](https://github.com/dherault/serverless-offline/commit/4185ef68f76fe3878be0d130e6065d3364e504df)
- Ordering nit [`a5fc7b9`](https://github.com/dherault/serverless-offline/commit/a5fc7b90d629649d44d5db7f4c1d09a56d849ae0)
- Ordering nit [`550c9f7`](https://github.com/dherault/serverless-offline/commit/550c9f7298fe20454160f31740263b23b79fde3f)
- Fix files for npm publish [`8061a6d`](https://github.com/dherault/serverless-offline/commit/8061a6d70170e68e22140902b9e7ba8a1c180d41)
- Add test script without ignoring console.log [`d08e024`](https://github.com/dherault/serverless-offline/commit/d08e024c6df52bf5168ad33ee01b1c36e60470c1)
- Add test coverage script [`ec31c3d`](https://github.com/dherault/serverless-offline/commit/ec31c3d5f45cc43fc5b5dad137fc08ef5b2b08cb)
- Fix isPlainObject [`01d5e51`](https://github.com/dherault/serverless-offline/commit/01d5e5149b23565ab91ee7b7c8ca3719eb5aea69)
- Fix cli help websocket port [`b73e4d5`](https://github.com/dherault/serverless-offline/commit/b73e4d5e3f70e70015b0324f86ec624516d3ca76)
- Add silent flag to test coverage script [`2415238`](https://github.com/dherault/serverless-offline/commit/241523857ed23b99f773d68d36c63a1dcd361c97)
- Use node.js runtime 10.x [`161ed5d`](https://github.com/dherault/serverless-offline/commit/161ed5d1787682fd41f277f0ece13159cf66c7c9)
- Don't publish test files [`b1163aa`](https://github.com/dherault/serverless-offline/commit/b1163aa738b1b7e5b413553f43a9e9646b0893ef)
- Run tests silent (ignoring console.log) [`6990f05`](https://github.com/dherault/serverless-offline/commit/6990f05a33fd16acbd9c30d39db3e0ceba4f27d5)
- Link to https [`80ae0e6`](https://github.com/dherault/serverless-offline/commit/80ae0e6a8f064728c09dbe021059bc02aeead5bb)
- Fix file extension [`f919642`](https://github.com/dherault/serverless-offline/commit/f919642f722bcf04ebcaa15334d2a3d5738d9142)

#### [v5.6.0](https://github.com/dherault/serverless-offline/compare/v5.5.1...v5.6.0)

> 4 July 2019

- Websocket [`#711`](https://github.com/dherault/serverless-offline/pull/711)
- fix: don't add body and content-type headers to sigv4 [`#729`](https://github.com/dherault/serverless-offline/pull/729)
- close connection on error in $connect action handler [`#726`](https://github.com/dherault/serverless-offline/pull/726)
- Add DELETE route to close a websocket connection [`#725`](https://github.com/dherault/serverless-offline/pull/725)
- Websocket #711 - Fix failing manual WebSocket tests [`#720`](https://github.com/dherault/serverless-offline/pull/720)
- Lint and rename folders [`e54cdc3`](https://github.com/dherault/serverless-offline/commit/e54cdc33da095bebd6c6bf0d2cc502bb7549b072)
- Update deps [`4722294`](https://github.com/dherault/serverless-offline/commit/4722294282d5c278d412a10bd9d78f6ca2a6ba87)
- Add husky [`acbd92e`](https://github.com/dherault/serverless-offline/commit/acbd92e1a11a081da719f018b83c7f681850b46b)
- Update deps [`741287b`](https://github.com/dherault/serverless-offline/commit/741287b454d5202eee2bb31b2b31e52b3899acad)
- lint [`9d84707`](https://github.com/dherault/serverless-offline/commit/9d84707e4fb7d7f2234eb1d8b39bf5ae973c2ffe)
- Remove unused @hapi/cryptiles module [`f85e1ee`](https://github.com/dherault/serverless-offline/commit/f85e1ee07d35727723319a95594b8c41427e13c7)
- Use option to enable websocket feature [`209a95e`](https://github.com/dherault/serverless-offline/commit/209a95e80824e510161034a0574d29cd123d8999)
- Use Lambda context for websocket [`25832c8`](https://github.com/dherault/serverless-offline/commit/25832c81c55322deebbb678ccbc251e705d5cddb)
- Move to nodejs10.x runtime [`0f74255`](https://github.com/dherault/serverless-offline/commit/0f742559ca0c7f142a041e976f002aa6b1c0c29b)
- Rename getUniqueId to createUniqueId [`c3fcc4c`](https://github.com/dherault/serverless-offline/commit/c3fcc4c2cd5a72879a2d4f4e0f04f999740a9a96)
- Add replay last request feature [`9247070`](https://github.com/dherault/serverless-offline/commit/9247070ca41a5046f1f904f69a0143c959d0622a)
- Remove websocket feature toggling [`7f56a18`](https://github.com/dherault/serverless-offline/commit/7f56a18f265ada6afc88939110e96e18a5aa716e)
- Fix maintainers/contributors ordering [`ebad6b4`](https://github.com/dherault/serverless-offline/commit/ebad6b4007c1eeaaed47ccd8127c99a8ada4d42e)
- feat: add @connections DELETE route to close websocket [`27639ae`](https://github.com/dherault/serverless-offline/commit/27639ae95ac132f0a3bededcdc18750b64621719)
- Edit documentation [`6959108`](https://github.com/dherault/serverless-offline/commit/69591080d6057f482d17415195ef04dfd2e626a3)
- chore: add tests for connection close [`e70db4b`](https://github.com/dherault/serverless-offline/commit/e70db4b338385c5d21bf316aebb8ee9e4bb2881c)
- Update deps [`86bcd36`](https://github.com/dherault/serverless-offline/commit/86bcd36c04c3336e4357c0a0aa6aed7632e84bad)
- Add warning for experimental WebSocket support [`1386954`](https://github.com/dherault/serverless-offline/commit/13869545453e9070ed5e0eae2031a054b2f2c313)
- Remove remaining apiGatewayUrl [`373c06f`](https://github.com/dherault/serverless-offline/commit/373c06f801c245b15e1db0e5059b5d6b6407e0a1)
- Remove apiGatewayUrl from websocket event [`c0bea4c`](https://github.com/dherault/serverless-offline/commit/c0bea4c5b63665a069510d0e59d96450207fe079)
- Remove apiGatewayUrl from readme [`bc82f8f`](https://github.com/dherault/serverless-offline/commit/bc82f8fcb5c15a66823db1d4d0560ab4410696fb)
- fix: don't add body and content-type headers to sigv4 for delete call in tests [`f901507`](https://github.com/dherault/serverless-offline/commit/f901507ed70fe8da1fea0544a392c759f2b23be3)
- Fix a test that didn't run correctly on AWS [`d6eae11`](https://github.com/dherault/serverless-offline/commit/d6eae118ef8e0861960d1d8e318322a2fba1fae5)
- Rename variable [`d631458`](https://github.com/dherault/serverless-offline/commit/d6314586d2aed2ec38cca218d4dbaee5d1a8c4de)
- Linting: use const [`b3a3155`](https://github.com/dherault/serverless-offline/commit/b3a3155c5e43a7834bc6689e80b1e4ab576292cf)
- Update docs [`f489781`](https://github.com/dherault/serverless-offline/commit/f48978133fc84c99899e448ad9110a8cf1091cd0)
- Fixed test failing when running offline [`5e19fa6`](https://github.com/dherault/serverless-offline/commit/5e19fa66f2627cf00056c469cbdd4b3becd51e03)
- chore: if an error occurs during the $connect action, close the connection [`b83c123`](https://github.com/dherault/serverless-offline/commit/b83c123939e62a1fbdf41504078e40dec6cc6b16)
- Fix spelling [`e6ed9e3`](https://github.com/dherault/serverless-offline/commit/e6ed9e30b6e5900f951a0788ce8b53d01f4ea8c9)
- Remove apiGatewayUrl from docs, use url + hardcoded port (for now) [`413390e`](https://github.com/dherault/serverless-offline/commit/413390e050b75ae425750043aea3b02a67d81fed)
- fix: add missing printBlankLine method [`d5e14aa`](https://github.com/dherault/serverless-offline/commit/d5e14aab25f3eabcf598204626c7713cda657ae1)
- Add engines metadata to package.json [`1884fb7`](https://github.com/dherault/serverless-offline/commit/1884fb72d960de987ba51bc6adeb1536d5ea64ab)
- Fix travis build lint error [`e73983c`](https://github.com/dherault/serverless-offline/commit/e73983c2171e9b1fcf09d0370fc0667021d8a503)
- Fix spelling [`8896743`](https://github.com/dherault/serverless-offline/commit/8896743cd06d8865a3898614fa80b97e22578fb8)
- Merge master [`b02e874`](https://github.com/dherault/serverless-offline/commit/b02e874a346e1b1201459ed347596450f54e6978)
- Remove upper range of serverless supported peer dependency [`364b4c0`](https://github.com/dherault/serverless-offline/commit/364b4c01ff0592db116a09dfa4b8eb9bc388d51b)
- merge master [`27e1e05`](https://github.com/dherault/serverless-offline/commit/27e1e0565863f906b742fce59ae407b170f5cadd)
- Separate ApiGateway and ApiGatewayWebSockets from Plugin [`193e282`](https://github.com/dherault/serverless-offline/commit/193e28292e724e9278ebe0cdb02b4dfe50490638)
- Added serverless.yml with warning [`66ffe6a`](https://github.com/dherault/serverless-offline/commit/66ffe6ab000823870a2d3c1aadf929a30b25f8b9)
- Run WebSocket endpoint on a different port (http port+1) [`53e9eef`](https://github.com/dherault/serverless-offline/commit/53e9eef19c8fe18e901621a609f41d2f83308dbe)
- Refactor events setup to offline class [`536d1b3`](https://github.com/dherault/serverless-offline/commit/536d1b3fe76808ec93ab4d1bb0b6151374302bd0)
- demo websoket version [`c4811ca`](https://github.com/dherault/serverless-offline/commit/c4811cac25e3f6eca0d80503bf5b27a2ba2b3fc0)
- Added support for queryStringParameters [`e32b9fa`](https://github.com/dherault/serverless-offline/commit/e32b9fa2ab632b29879f5ab7b98846ad91503470)
- Support for websocketsApiRouteSelectionExpression [`02ce0e7`](https://github.com/dherault/serverless-offline/commit/02ce0e7b38a926d7cb2f5f39ef5d731a868711c5)
- Added context and event for connect and disconnect [`4521b88`](https://github.com/dherault/serverless-offline/commit/4521b886be75897eaae13ffd1bf00b9ab02b408a)
- hapi@18 and hapi-plugin-websocket@2 support [`1e559b7`](https://github.com/dherault/serverless-offline/commit/1e559b76805701fc07a5efd051508d3ead161ba3)
- Bug fixes [`1ea68e0`](https://github.com/dherault/serverless-offline/commit/1ea68e0b22fc9f002d40be347aead9243d4f87fb)
- Moved websocket CreateXXX to websocketHelpers.js [`381355b`](https://github.com/dherault/serverless-offline/commit/381355baed0cf80e2a1d8182c7eaf6cef635494a)
- Leftovers from merge [`f527670`](https://github.com/dherault/serverless-offline/commit/f527670cc1e9fe9bffb9beea4468383abc890cc7)
- Added context and event when calling the handler. [`f3cf815`](https://github.com/dherault/serverless-offline/commit/f3cf815e82eebdc9d1ebaa2dc3cf0899f6e76296)
- Merge leftovers [`687f901`](https://github.com/dherault/serverless-offline/commit/687f901514047d02585ac0c7e25efbd2e2edbe99)
- Fix lint errors [`4ec82ad`](https://github.com/dherault/serverless-offline/commit/4ec82ad945c05e3aed785231dfa754ee411c1944)
- Removed the need for require('serverless-offline').AWS [`2f3dfbd`](https://github.com/dherault/serverless-offline/commit/2f3dfbd41dcc988759099afe95e55e9da64bd257)
- GWAPI REST API suppoprt [`602ac7b`](https://github.com/dherault/serverless-offline/commit/602ac7bde7b3f6a32c338cb7bd4924f4c7159410)
- Changed the way to get function to post-to-connection [`c4c6ea6`](https://github.com/dherault/serverless-offline/commit/c4c6ea65a9ee98575a451a0fe29a1ee3afc6a456)
- Fix static AWS = { ... } [`4e61aa5`](https://github.com/dherault/serverless-offline/commit/4e61aa53dd55313912596c9cd6372944aba8f1e8)
- added support for callback() in handler [`b51ddb5`](https://github.com/dherault/serverless-offline/commit/b51ddb532f7fd36d67ff6b8d9076476c86464cd1)
- Order props [`2df8ef8`](https://github.com/dherault/serverless-offline/commit/2df8ef8427271d50a1aaf68631a05d3a09363518)
- Generate collision resistent ids with cuid (project-wide) [`d802dcf`](https://github.com/dherault/serverless-offline/commit/d802dcf95145ec236ebdf030c50e977da6bfe3b0)
- Add websocket port option [`8a699ab`](https://github.com/dherault/serverless-offline/commit/8a699abdf684b9f6d71de969cbd1ae4ff3e5ac88)
- Property order nits [`c51ea7e`](https://github.com/dherault/serverless-offline/commit/c51ea7ec6ed326304296d57878602bbf8c192d62)
- Fix lint errors [`3759b06`](https://github.com/dherault/serverless-offline/commit/3759b0619e7e6d93ff47292f5c2b2646a69ab110)
- Update README about WebSocket [`b6c1095`](https://github.com/dherault/serverless-offline/commit/b6c1095319fe1802a93334234875bbe7e06c7f60)
- Update README with new ways of sending messages to clients [`da8c749`](https://github.com/dherault/serverless-offline/commit/da8c749d3232e2d9d6869174624f92376af5e70b)
- Add formatToClfTime function [`aa4f977`](https://github.com/dherault/serverless-offline/commit/aa4f9770d7c17eb554f8601632261e2b35d7b80a)
- Export on exports [`e855a4a`](https://github.com/dherault/serverless-offline/commit/e855a4a93ead5513a1bbcba7181fe5d37318e39f)
- Extract multi-value-headers function [`53da9c1`](https://github.com/dherault/serverless-offline/commit/53da9c1e0364ff5320c01a724601550b5eee5e60)
- Merge from master and fixes [`6638b73`](https://github.com/dherault/serverless-offline/commit/6638b7317ce7f54bedc6831604f3a32204b9b23e)
- Removed require('aws-sdk/clients/apigatewaymanagementapi'); [`ca34ccb`](https://github.com/dherault/serverless-offline/commit/ca34ccbb5dd0ed3b2094b257bea3541d84cf433b)
- Default timeout is 1000ms and can set timeout value via --timeout= [`10c377d`](https://github.com/dherault/serverless-offline/commit/10c377dac25d520d958b21d38cb0b0615c7275c5)
- remove --useWebsocket options [`a77723e`](https://github.com/dherault/serverless-offline/commit/a77723e3aec4948b9dab39fc08365049d6e035e0)
- Fix http/https --&gt; HTTP [`719a14e`](https://github.com/dherault/serverless-offline/commit/719a14ee6600d21373c758dbd7b334a1019df226)
- Spelling [`7b9c942`](https://github.com/dherault/serverless-offline/commit/7b9c942ee7268756088490f480c7a2d8cb97b18f)
- Fix spelling [`7c34178`](https://github.com/dherault/serverless-offline/commit/7c341783f6a3109b4013502cc7445fba7d7556dc)
- Remove unused options [`fd0637d`](https://github.com/dherault/serverless-offline/commit/fd0637da62b696ff1997435b6a59f2e6c0bd9cbe)
- Fix 2 lint errors [`289e8f5`](https://github.com/dherault/serverless-offline/commit/289e8f5f8ef835f230120cac06beffe275abb910)
- Minor Improved logs [`bca81cd`](https://github.com/dherault/serverless-offline/commit/bca81cdaeac32a23380f50311768cb93880be14c)
- Require on top of file [`5aa2365`](https://github.com/dherault/serverless-offline/commit/5aa23650d7926d5af4a3c6263614fc1602d9ad2a)
- Display correct protocol on listen [`c38a4bc`](https://github.com/dherault/serverless-offline/commit/c38a4bc168a0c72e2f0aedb946a0f18001dd73ba)
- Change minimum serverless peer dep to v1.39.0 for websocket support [`d0fe602`](https://github.com/dherault/serverless-offline/commit/d0fe602128617ee03dc6db0c936e907ff34f4ce0)
- Remove unused this.clients [`ca16506`](https://github.com/dherault/serverless-offline/commit/ca165069377412e343dcd4a1d139208f0808759d)
- Linting [`35a3616`](https://github.com/dherault/serverless-offline/commit/35a361620b33bb30b20177eebcb3916c482c8e10)
- Restructure manual_test_websocket to include more projects [`d45ea7a`](https://github.com/dherault/serverless-offline/commit/d45ea7ae305aafbb6f617a207b2a6f9aa62adae3)
- Add websocket to package.json keywords [`0e3b4d8`](https://github.com/dherault/serverless-offline/commit/0e3b4d8b1abf731ed2dc363f1b4f4ae7ce7b0a5c)
- Update README [`b9b0eef`](https://github.com/dherault/serverless-offline/commit/b9b0eefe72df96ead74bbd1b4f8f016cab91cc03)
- Merge from master: hapi@18 & hapi-plugin-websocket@2 [`96dbd16`](https://github.com/dherault/serverless-offline/commit/96dbd165b987d9fa3f0effff227fb3bb9cf1692b)
- Last commit leftovers [`f9600f8`](https://github.com/dherault/serverless-offline/commit/f9600f870553c4317823e8913b748780e84dc151)
- Merge from upstream/master [`fe4a51d`](https://github.com/dherault/serverless-offline/commit/fe4a51d715f77e5c04672c624b8e64eb60f8d759)

#### [v5.5.1](https://github.com/dherault/serverless-offline/compare/v5.5.0...v5.5.1)

> 2 July 2019

- Fix [`4cfebb8`](https://github.com/dherault/serverless-offline/commit/4cfebb887f0f1f7b018e4592bae7a9055b57feab)
- Update docs [`bea8ccd`](https://github.com/dherault/serverless-offline/commit/bea8ccd3cf14d5463ef60d41ec12607a2a185403)

#### [v5.5.0](https://github.com/dherault/serverless-offline/compare/v5.4.4...v5.5.0)

> 24 June 2019

- [Feature] Output stack trace on failure [`#718`](https://github.com/dherault/serverless-offline/pull/718)
- new feature: output stack trace on failure [`b9b89ca`](https://github.com/dherault/serverless-offline/commit/b9b89caacd14872444207d810c20ef4125c6a6ea)

#### [v5.4.4](https://github.com/dherault/serverless-offline/compare/v5.4.3...v5.4.4)

> 23 June 2019

- Fix #715 Fix expression validator [`#717`](https://github.com/dherault/serverless-offline/pull/717)
- Merge pull request #717 from alebianco/master [`#715`](https://github.com/dherault/serverless-offline/issues/715)
- Fix #715 Fix expression validator [`#715`](https://github.com/dherault/serverless-offline/issues/715)

#### [v5.4.3](https://github.com/dherault/serverless-offline/compare/v5.4.0...v5.4.3)

> 22 June 2019

- fix #655 [`#716`](https://github.com/dherault/serverless-offline/pull/716)
- Fix event.isOffine bug [`#714`](https://github.com/dherault/serverless-offline/pull/714)
- Merge pull request #716 from Raph22/fix-print-out [`#655`](https://github.com/dherault/serverless-offline/issues/655)
- fix #655 [`#655`](https://github.com/dherault/serverless-offline/issues/655)
- Fix event bug when event is null [`8621e2d`](https://github.com/dherault/serverless-offline/commit/8621e2db76c7eb9f4305b83e5111c36b5adbe4fa)

#### [v5.4.0](https://github.com/dherault/serverless-offline/compare/v5.3.3...v5.4.0)

> 20 June 2019

- [FEATURE] Replay last request [`#713`](https://github.com/dherault/serverless-offline/pull/713)
- Fixes [`#708`](https://github.com/dherault/serverless-offline/pull/708)
- Update deps [`ddc0bde`](https://github.com/dherault/serverless-offline/commit/ddc0bde59620a7b83c74f6a7c82d0725304eef3a)
- Replay last request [`2441de7`](https://github.com/dherault/serverless-offline/commit/2441de73430d59c414a11ad1f1cd1d63fce484d3)
- Regen/update package-lock.json [`644cdca`](https://github.com/dherault/serverless-offline/commit/644cdca0bb94d2a532a98d4ccd6307acc6a7b03e)
- Update deps [`4aa6a41`](https://github.com/dherault/serverless-offline/commit/4aa6a41feb93e67396b9b2668a9ae547b97edc36)
- Read json file as string, to create new instances (clone) [`86eb874`](https://github.com/dherault/serverless-offline/commit/86eb874f94603fb9c1ef154c897aabf2ff17e08c)
- Load templates without require.extensions [`72acf5a`](https://github.com/dherault/serverless-offline/commit/72acf5a265c628c3c4b1e6cb8636221408de44c3)
- Remove unneeded async [`82ab573`](https://github.com/dherault/serverless-offline/commit/82ab573e509cb3099e540aeee26ee15922f941ee)
- Use path.resolve [`874e043`](https://github.com/dherault/serverless-offline/commit/874e04338e52ea1fe39da8bcde030ec7f0fe7835)
- Fix spelling [`7ce32a2`](https://github.com/dherault/serverless-offline/commit/7ce32a2d1a9613eb136371fecdfcbf196eeff957)
- Remove JSON.parse+stringify, object is already JSON when required with .json [`cf29d7a`](https://github.com/dherault/serverless-offline/commit/cf29d7afaf4c8bea057b3c3fa8bf21e04e3b8b24)

#### [v5.3.3](https://github.com/dherault/serverless-offline/compare/v5.3.2...v5.3.3)

> 10 June 2019

- Fix bug on empty event [`dad83ab`](https://github.com/dherault/serverless-offline/commit/dad83ab9aea634345b0615b5dbd864104b856cf2)

#### [v5.3.2](https://github.com/dherault/serverless-offline/compare/v5.3.1...v5.3.2)

> 8 June 2019

- Fix request template for invoke integration [`81ae588`](https://github.com/dherault/serverless-offline/commit/81ae588adb105b213e3c23d2f3766d6a67ae11bf)

#### [v5.3.1](https://github.com/dherault/serverless-offline/compare/v5.3.0...v5.3.1)

> 8 June 2019

- Fix requests bug [`#700`](https://github.com/dherault/serverless-offline/pull/700)
- Fix timeout bug for lambda integration [`#699`](https://github.com/dherault/serverless-offline/pull/699)
- Swap License and Contributing sections links in README.md [`24b36c3`](https://github.com/dherault/serverless-offline/commit/24b36c337e6e90b45e6116e2ea363b7819367caf)

#### [v5.3.0](https://github.com/dherault/serverless-offline/compare/v5.2.1...v5.3.0)

> 8 June 2019

#### [v5.2.1](https://github.com/dherault/serverless-offline/compare/v5.2.0...v5.2.1)

> 8 June 2019

- Fix timeout bug for lambda integration [`#699`](https://github.com/dherault/serverless-offline/pull/699)
- Add support for lambda.invoke [`#698`](https://github.com/dherault/serverless-offline/pull/698)
- Use 'strict mode' for commonjs modules [`#692`](https://github.com/dherault/serverless-offline/pull/692)
- Use strict mode for commonjs modules [`2b964fc`](https://github.com/dherault/serverless-offline/commit/2b964fcfe39cf182b28808ae0314dda95ca70237)
- Swap License and Contributing sections links in README.md [`24b36c3`](https://github.com/dherault/serverless-offline/commit/24b36c337e6e90b45e6116e2ea363b7819367caf)
- Add return condition on events collection [`12ddeb9`](https://github.com/dherault/serverless-offline/commit/12ddeb960e65297af3ebe91ba0d29a80f83adc4d)

#### [v5.2.0](https://github.com/dherault/serverless-offline/compare/v5.1.1...v5.2.0)

> 8 June 2019

- Add requestTimeEpoch to requestContext [`#697`](https://github.com/dherault/serverless-offline/pull/697)

#### [v5.1.1](https://github.com/dherault/serverless-offline/compare/v5.1.0...v5.1.1)

> 7 June 2019

- Accept content type json with empty body [`#694`](https://github.com/dherault/serverless-offline/pull/694)
- Add serverless as dev- and peer-dependency [`#691`](https://github.com/dherault/serverless-offline/pull/691)
- package.json files [`#689`](https://github.com/dherault/serverless-offline/pull/689)
- Eslint adjustments [`#687`](https://github.com/dherault/serverless-offline/pull/687)
- Add contributors list [`d973e57`](https://github.com/dherault/serverless-offline/commit/d973e57eeb6bb0716230cf3af711e923c03090af)
- Update deps [`c1fbc22`](https://github.com/dherault/serverless-offline/commit/c1fbc22fa32cafaac9e9f91404a274bbb33f2ff7)
- Lint eslintrc.js [`e03baa4`](https://github.com/dherault/serverless-offline/commit/e03baa4d55ac976adae0ca42940109a93bc150cf)
- Add mocha to eslint environment [`a918be9`](https://github.com/dherault/serverless-offline/commit/a918be990749f5c149d1fb86f552cd6f0b228ad3)
- Add additional keywords to package.json [`3d4d5aa`](https://github.com/dherault/serverless-offline/commit/3d4d5aaa4b90aff11068e53a3b38722d1542ab02)
- Updated package-lock [`02dfa55`](https://github.com/dherault/serverless-offline/commit/02dfa55465e7241315febbf6d29e4a0e8b91e918)
- Swap Contributing and License sections on README [`8ee7a9e`](https://github.com/dherault/serverless-offline/commit/8ee7a9ea57b4a263aeaea02e02118296f8ffd371)
- Delete .npmignore [`255ede1`](https://github.com/dherault/serverless-offline/commit/255ede1e62b6fdbcbfcf7158ae4792f3098ec846)
- Add files section to package.json for npm deployment [`cc71c91`](https://github.com/dherault/serverless-offline/commit/cc71c916ed05d9fabc2c9546dbf00698c7f33502)
- Add .eslintignore [`22ac692`](https://github.com/dherault/serverless-offline/commit/22ac6925a7902681655b0631759860f2558a4458)
- Set payload to empty JSON if no payload is passed. [`0ccae5f`](https://github.com/dherault/serverless-offline/commit/0ccae5f97d6871aa0a3be56f9e1547f435976d56)
- Remove eslint comment section [`81fc761`](https://github.com/dherault/serverless-offline/commit/81fc7619bef0f52999499aedb0b34cd59e4d7050)
- Order nit [`9d02843`](https://github.com/dherault/serverless-offline/commit/9d02843233fbfe67f77d3135923269f44bfaf777)

#### [v5.1.0](https://github.com/dherault/serverless-offline/compare/v5.0.1...v5.1.0)

> 4 June 2019

- Touchup [`#685`](https://github.com/dherault/serverless-offline/pull/685)
- Convert asynchronous mocha tests to use async functions [`#686`](https://github.com/dherault/serverless-offline/pull/686)
- Display funName on --showDuration [`32cd135`](https://github.com/dherault/serverless-offline/commit/32cd13596a0e715434d157527e9d3f17805d2b08)
- Resolve conflicts for #551 [`e32a616`](https://github.com/dherault/serverless-offline/commit/e32a616429511346090cae2cd96480154948ebe5)
- Order cli options [`fe1e5bf`](https://github.com/dherault/serverless-offline/commit/fe1e5bf39927c7d8560ff76b94a28b9b68eca907)
- Remove dirty-chai dependency [`3e182ca`](https://github.com/dherault/serverless-offline/commit/3e182caca25776545188a9e326591902aecb7c9c)
- Use some module loading destructuring [`03dde94`](https://github.com/dherault/serverless-offline/commit/03dde9428c4d6e217be2bdffd5c66803cfcf6ec8)
- More destructuring for tests [`23d9bf8`](https://github.com/dherault/serverless-offline/commit/23d9bf8113f272c0a753b3cc14a2a219c5247ebc)
- Prefix java functions, simplify prototype method replacements [`1e218d0`](https://github.com/dherault/serverless-offline/commit/1e218d07c70f46ac84ff51b096395d11f5c89f7f)
- Order functions and prototype methods alphabetically [`69c6143`](https://github.com/dherault/serverless-offline/commit/69c6143b76ab64058b9d5192fed9b03987314149)
- Order default options [`43e22bf`](https://github.com/dherault/serverless-offline/commit/43e22bf11974cafd26a7b05b3d4b86885ac978cf)
- Create special scope for prototype pollution [`0c4d7d8`](https://github.com/dherault/serverless-offline/commit/0c4d7d8f36d04d18f38d5c01f7fcbd475c5b99f4)
- Simplify prototype access [`800e4f5`](https://github.com/dherault/serverless-offline/commit/800e4f5db79781c9303ccb9f24372b66c9d3e172)
- Use more destructuring [`6e75df9`](https://github.com/dherault/serverless-offline/commit/6e75df9cab39714cd0b41fea787ff6b6b43a033b)
- measure handler call to lambdaContext done [`a7e42b2`](https://github.com/dherault/serverless-offline/commit/a7e42b22dda6410b0b9dd5f9c449d37b2860f5f4)
- Order props and methods on lambda context, add comment regarding prototype [`71dd3cb`](https://github.com/dherault/serverless-offline/commit/71dd3cbb35dffac4edcb662369f433fa693a0125)
- Use destructuring, move to top of function scope [`196a4cf`](https://github.com/dherault/serverless-offline/commit/196a4cfba3ad39c95111db0e780507bad3e92ae8)
- Use more destructuring for tests [`1cfba39`](https://github.com/dherault/serverless-offline/commit/1cfba39cfff08d4723a59106220f4fc0d0b59f21)
- added --showDuration option [`61528ab`](https://github.com/dherault/serverless-offline/commit/61528abc4759052e475cda6dce19a5350ce06490)
- Move default api key generation into utils [`f32729b`](https://github.com/dherault/serverless-offline/commit/f32729b9103d0b671f67917a710fb644147431f6)
- Simplify test case [`ce8baaa`](https://github.com/dherault/serverless-offline/commit/ce8baaa36e4a8c6a443b73c9e373dbcb42785e08)
- Simplify cloning object [`ed54a31`](https://github.com/dherault/serverless-offline/commit/ed54a31ddc2590fb12132bc96914edbfd0349019)
- Use more object.entries [`a8437cd`](https://github.com/dherault/serverless-offline/commit/a8437cd9e6eb8fd5339e745a526bf4473583e0a8)
- fixed lint issues [`85b05fe`](https://github.com/dherault/serverless-offline/commit/85b05fe672d0d396f0a7725548fab07bd8416ce3)
- Use more destructuring [`7423b63`](https://github.com/dherault/serverless-offline/commit/7423b63a000e42c847bf104f47cc111e72b4dc62)
- Use braces in condition for easier debugging [`e1e3359`](https://github.com/dherault/serverless-offline/commit/e1e3359bcab34456a530b410253a484b93a7d6b0)
- Use object.entries for object traversal [`c1e9fd7`](https://github.com/dherault/serverless-offline/commit/c1e9fd7eb2520219fdb66a3170b07bb1df0d50a6)
- Simplify: split once [`306b5d3`](https://github.com/dherault/serverless-offline/commit/306b5d36a9cbef87f5352b3e938b5a6de1870cae)
- Call callback directly [`df8b2cd`](https://github.com/dherault/serverless-offline/commit/df8b2cdaa4c3905e3b3cfa752932868f30e59d14)
- Use more destructuring [`6ccde0d`](https://github.com/dherault/serverless-offline/commit/6ccde0d049a1a111c9e630362b9c8a05dd7b7e6e)
- Use module constant for function timeout, increase to 900 sec (15 min) [`92511e3`](https://github.com/dherault/serverless-offline/commit/92511e31a0479ec82fce317b0b53e80d2eed44e8)
- Rename handler to userHandler, to clearly distinguish between hapi handler and lambda handler [`69a0d20`](https://github.com/dherault/serverless-offline/commit/69a0d205c2680c07e79e011708a689cc10340306)
- Remove more unneeded typeof Promise.catch checks [`d3df347`](https://github.com/dherault/serverless-offline/commit/d3df3476a118f02bd5c2e61812d42519a4ffd9f1)
- Use service reference from instance [`1afa57c`](https://github.com/dherault/serverless-offline/commit/1afa57cd651456ab67284fdb6e77e83b51b74015)
- Use -1 for end of for slice array [`4cd9927`](https://github.com/dherault/serverless-offline/commit/4cd9927baff672714d5011195034e36dba036a4e)
- Replace java contains method with built-in String.prototype.includes [`abb3a8d`](https://github.com/dherault/serverless-offline/commit/abb3a8dc090bbfe31be98b166abca9e617663309)
- Remove condition in createLambdaContext as cb parameter is always a function [`cf8e55d`](https://github.com/dherault/serverless-offline/commit/cf8e55dc17ec3bb9ba479c56392320be6abf2017)
- Remove unneeded typeof 'Promise.catch' condition, Promise spec is satisfied with 'then' [`d969f76`](https://github.com/dherault/serverless-offline/commit/d969f7647509866a17285cc1f83e850cf03dd221)

#### [v5.0.1](https://github.com/dherault/serverless-offline/compare/v5.0.0...v5.0.1)

> 3 June 2019

- Fix server start handling (callback -&gt; promise) [`#684`](https://github.com/dherault/serverless-offline/pull/684)
- Add tests for handlers using async functions [`#681`](https://github.com/dherault/serverless-offline/pull/681)
- Change error message, remove comments [`838809d`](https://github.com/dherault/serverless-offline/commit/838809d88f612658db9997c37055a9cbd045ad1e)

### [v5.0.0](https://github.com/dherault/serverless-offline/compare/v4.9.4...v5.0.0)

> 2 June 2019

- Added claims field to authorizer requestContext for lambda integratio… [`#654`](https://github.com/dherault/serverless-offline/pull/654)
- Remove node.js v11.x (end-of-life) from travis [`#680`](https://github.com/dherault/serverless-offline/pull/680)
- Packages Upgrade [`#673`](https://github.com/dherault/serverless-offline/pull/673)
- skip HEAD routes defined in resources [`#669`](https://github.com/dherault/serverless-offline/pull/669)
- #638 Fix for encoding, aws looks to not do encoding anymore [`#666`](https://github.com/dherault/serverless-offline/pull/666)
- Call cleanup in callback and error handler instead of finally block. [`#665`](https://github.com/dherault/serverless-offline/pull/665)
- Cleanup on a promise continuation when handler is async to fix #659 [`#660`](https://github.com/dherault/serverless-offline/pull/660)
- Fix hooks for sls offline start [`#658`](https://github.com/dherault/serverless-offline/pull/658)
- If there is no body we shouldnt try to parse it [`#656`](https://github.com/dherault/serverless-offline/pull/656)
- A WebSocket test suite for both local and remote AWS endpoint [`#652`](https://github.com/dherault/serverless-offline/pull/652)
- fixes memory leak [`#640`](https://github.com/dherault/serverless-offline/pull/640)
- Fallback to timeout and memorySize from provider [`#647`](https://github.com/dherault/serverless-offline/pull/647)
- Add --binPath to options [`#646`](https://github.com/dherault/serverless-offline/pull/646)
- Travis build: add Windows, macOS, and node.js v10, v11, v12 [`#643`](https://github.com/dherault/serverless-offline/pull/643)
- Update dependencies. [`#639`](https://github.com/dherault/serverless-offline/pull/639)
- Merge pull request #660 from Andorbal/master [`#659`](https://github.com/dherault/serverless-offline/issues/659)
- Perform request cleanup on a promise continuation when handler is async to fix #659 [`#659`](https://github.com/dherault/serverless-offline/issues/659)
- Update deps. [`b78a6b4`](https://github.com/dherault/serverless-offline/commit/b78a6b4e0c1133bc8c6aa0c1ce4e2823d025e1d0)
- - Adding updated package-lock.json [`f3c68f8`](https://github.com/dherault/serverless-offline/commit/f3c68f85e20098943d08736a68b42910db90df44)
- Update lock file [`7805fbd`](https://github.com/dherault/serverless-offline/commit/7805fbd42a2c9688975e3361d476e410232c8bfb)
- Upgrade to hapi 18 [`c5e49cf`](https://github.com/dherault/serverless-offline/commit/c5e49cf8814ec8416c5e79b40449db2015620d48)
- lint [`136bd30`](https://github.com/dherault/serverless-offline/commit/136bd30ca7a9614334b24bd33d632f782ea5c6c9)
- Call cleanup as part of the callback and error handler instead of in the finally block to address another part of #659 [`8581cf5`](https://github.com/dherault/serverless-offline/commit/8581cf5d9377af9593cfee094aebc274018672a8)
- update deps [`18243fb`](https://github.com/dherault/serverless-offline/commit/18243fbdb0a1800f0228c2a9cfca1fa84c3dc765)
- Use eslintrc.js to workaround git/eslint line ending issue on Travis for Windows OS. [`0a49de6`](https://github.com/dherault/serverless-offline/commit/0a49de6b5d0a697896ab219ab5b39519ff71bfde)
- Add a test to verify the fix [`5f7a30e`](https://github.com/dherault/serverless-offline/commit/5f7a30efd9a5a5667ca2c668308c2e4250c69b50)
- Update README.md [`e64eb2d`](https://github.com/dherault/serverless-offline/commit/e64eb2df9540fce5fc8bedd8b837f3c74e9398d6)
- Merge master, fix test cases [`3a8c820`](https://github.com/dherault/serverless-offline/commit/3a8c8207c52ec0ebfe2a6d69d31ee596146181dd)
- Added claims field to authorizer requestContext for lambda integration. It was added in createVelocityContext [`ec3223a`](https://github.com/dherault/serverless-offline/commit/ec3223ab081787ceab449aaa4ab81b0dbe783768)
- Cleanup requests, fixes memory leak. [`6351676`](https://github.com/dherault/serverless-offline/commit/635167643d275a04f732e1ded72cde50a0abe770)
- fix hooks for sls offline start [`43b79dd`](https://github.com/dherault/serverless-offline/commit/43b79dde2938819d9819cedaefe6c572538041ed)
- Remove unused requestId parameter. [`89e6f71`](https://github.com/dherault/serverless-offline/commit/89e6f71e66fa13e8c322e0deac6a3437b486b75c)
- Lint [`576bc24`](https://github.com/dherault/serverless-offline/commit/576bc24e8ffbdd1fc6abbf98d5a133c1fb03a533)
- Adds node.js v10, v11 and v12 to travis build, removes v6 EOL. [`3bfea87`](https://github.com/dherault/serverless-offline/commit/3bfea87b0cafa0f5d48ab747d645339f0d390de9)
- -- Packages Upgrade -- [`85c1484`](https://github.com/dherault/serverless-offline/commit/85c1484366f746841410bb8a1a373213011eefc3)
- update deps [`b0d812d`](https://github.com/dherault/serverless-offline/commit/b0d812d08fb04df08d3acc769a62d84851bb2221)
- Move require child_process to top, combine requiring fork and spawn. [`f822359`](https://github.com/dherault/serverless-offline/commit/f82235948df1c9e191d1b19ea975269685455e3f)
- Fix linting errors [`7c05743`](https://github.com/dherault/serverless-offline/commit/7c05743df98a02412c9a51f83bd999ba1ee75dd9)
- lint .eslintrc.js [`4ee3b74`](https://github.com/dherault/serverless-offline/commit/4ee3b74747ce5f7599f26c4c056695e4e30db2e6)
- Adds Windows and macOS to travis build. [`7a34662`](https://github.com/dherault/serverless-offline/commit/7a346629b895ec401a672d0e08b14293ac190aea)
- Cleanup: Condition will never fulfill. [`638a867`](https://github.com/dherault/serverless-offline/commit/638a867ad20e7b736eda4842f20808b4f420ce54)
- Move require h2o2 from function call to top of file. [`84b9555`](https://github.com/dherault/serverless-offline/commit/84b9555876aa711e4c861965b3bebaa52a1dd224)
- linted [`2d73dfd`](https://github.com/dherault/serverless-offline/commit/2d73dfdd30aebdd72630c995b48ce3e64aeb94e4)
- lint [`d9b19c9`](https://github.com/dherault/serverless-offline/commit/d9b19c9e21da20a39215524a94e14e201425544b)
- cleanup: remove non-existend property '\_called' check. [`33c4316`](https://github.com/dherault/serverless-offline/commit/33c4316a85c3dd9ecdd16027b19da3e1e1f9979f)
- edit eslintrc rules to add "space-infix-ops" [`2a78420`](https://github.com/dherault/serverless-offline/commit/2a7842023aea76acec73c2a05bfba69b72863cbf)
- cleanup [`8ac8df9`](https://github.com/dherault/serverless-offline/commit/8ac8df958dd0683037bee9d211e90bd4ed97fcbe)
- Fix permissions [`a098ff0`](https://github.com/dherault/serverless-offline/commit/a098ff0d26d3e72bb465d589edf7b51bdfd91486)

#### [v4.9.4](https://github.com/dherault/serverless-offline/compare/v4.9.1...v4.9.4)

> 4 April 2019

- Replace deprecated Buffer constructor call with Buffer.from. [`#628`](https://github.com/dherault/serverless-offline/pull/628)
- Fix detection of undefined endpoint response headers [`#624`](https://github.com/dherault/serverless-offline/pull/624)
- Fix stage and region option precedence bug (Closes #338) [`#620`](https://github.com/dherault/serverless-offline/pull/620)
- Merge pull request #620 from gbroques/fix-stage-and-region-option-precedence-bug [`#338`](https://github.com/dherault/serverless-offline/issues/338)
- Fix stage and region option precedence bug (Closes #338) [`#338`](https://github.com/dherault/serverless-offline/issues/338)
- refactor index.js endpointResponseHeaders for inegration lambda [`37d6823`](https://github.com/dherault/serverless-offline/commit/37d6823233eb22e5f6749a55e91b44628c4e2fd2)
- Strict comparison for undefined header check [`2ac2f80`](https://github.com/dherault/serverless-offline/commit/2ac2f803f000c279761e8010d7e44bf9ac34aa34)
- lint [`d21b268`](https://github.com/dherault/serverless-offline/commit/d21b268d57902f833a7fa82be278ef59ed51a270)

#### [v4.9.1](https://github.com/dherault/serverless-offline/compare/v4.8.1...v4.9.1)

> 14 March 2019

- fix #619 [`#619`](https://github.com/dherault/serverless-offline/issues/619)
- add disableModelValidation option [`a8619a6`](https://github.com/dherault/serverless-offline/commit/a8619a66eaa606b9b0e805a24477ff22e55f4b71)

#### [v4.8.1](https://github.com/dherault/serverless-offline/compare/v4.8.0...v4.8.1)

> 6 March 2019

- Feature/resource proxy querystring [`#616`](https://github.com/dherault/serverless-offline/pull/616)
- Fix: Fix linting and docs for PR [`09528bf`](https://github.com/dherault/serverless-offline/commit/09528bf4a737e1fe60fd8dd149b02ffb63edaf21)
- Test: unit test for resource proxy query strings [`3720c70`](https://github.com/dherault/serverless-offline/commit/3720c703a35e4e4f453ef401e98671c679965ca5)
- Test: Add resource route proxy example [`469c445`](https://github.com/dherault/serverless-offline/commit/469c445ff4bfca4afbd2f2ed1dbe67a4ec3cb7bb)
- Feat: add query string support to resource proxy [`432cce6`](https://github.com/dherault/serverless-offline/commit/432cce6794b214c24d754756e70ed6caca7c28f8)

#### [v4.8.0](https://github.com/dherault/serverless-offline/compare/v4.7.0...v4.8.0)

> 6 March 2019

- Deny statements [`#615`](https://github.com/dherault/serverless-offline/pull/615)
- Single character wildcard [`#614`](https://github.com/dherault/serverless-offline/pull/614)
- Only assign a length if its a valid body [`#611`](https://github.com/dherault/serverless-offline/pull/611)
- deny when explicit deny statement is present [`#340`](https://github.com/dherault/serverless-offline/issues/340)
- refactor authMatchPolicyResource to use regular expressions [`#613`](https://github.com/dherault/serverless-offline/issues/613)
- update deps [`fa4ea57`](https://github.com/dherault/serverless-offline/commit/fa4ea5788c52b00be346f4e6237f2e236164292b)
- reorder tests - main ones first, then with additional context [`1049375`](https://github.com/dherault/serverless-offline/commit/10493750a06b1425a261f96e197b34af33def217)
- reorder one test [`acefeb7`](https://github.com/dherault/serverless-offline/commit/acefeb7cda7dac891e12ccecfda69c50b1cfebe1)
- add test for #613 [`7c69192`](https://github.com/dherault/serverless-offline/commit/7c6919234f521bc019d3df4e69e92771935f5dfe)
- add additional test for #340 - when both allow and deny statements present it should deny [`fe7f4c9`](https://github.com/dherault/serverless-offline/commit/fe7f4c9b67f2735148649b233eba82d14f0a4841)
- fix minor typo in test (test correct, log statement wrong) [`76cf769`](https://github.com/dherault/serverless-offline/commit/76cf7699fcfb5ef725b8ea2f0958769ba6b9f43e)

#### [v4.7.0](https://github.com/dherault/serverless-offline/compare/v4.2.1...v4.7.0)

> 26 February 2019

- Add environment variables [`#608`](https://github.com/dherault/serverless-offline/pull/608)
- Fix failing tests on windows [`#606`](https://github.com/dherault/serverless-offline/pull/606)
- Add request validation for lambda integration [`#604`](https://github.com/dherault/serverless-offline/pull/604)
- Fix Scheme creation to not throw on missing auth header [`#601`](https://github.com/dherault/serverless-offline/pull/601)
- Support runtime override for individual functions [`#600`](https://github.com/dherault/serverless-offline/pull/600)
- upgrade eslint and eslint-plugin-import [`#595`](https://github.com/dherault/serverless-offline/pull/595)
- Prevent overriding exported AWS_PROFILE [`#588`](https://github.com/dherault/serverless-offline/pull/588)
- identityValidationExpression support [`#592`](https://github.com/dherault/serverless-offline/pull/592)
- Add request body validation [`#589`](https://github.com/dherault/serverless-offline/pull/589)
- Fix #585 [`#586`](https://github.com/dherault/serverless-offline/pull/586)
- Merge pull request #586 from ThisIsNoZaku/Fix-#585 [`#585`](https://github.com/dherault/serverless-offline/issues/585)
- update eslint and eslint-plugin-import [`03016aa`](https://github.com/dherault/serverless-offline/commit/03016aa372b6fdb77aa324943f14880e9e34898c)
- Add documentation with an example [`e0318ea`](https://github.com/dherault/serverless-offline/commit/e0318eac6f4697b0fd591b526c0b6cc06f107937)
- fix linting [`8820579`](https://github.com/dherault/serverless-offline/commit/882057931feba68c035b1ad25739e4a3ce8ad34d)
- Prevent overriding exported AWS_PROFILE with fake 'dev' explicit credentials when using --noEnvironment option [`4037d1b`](https://github.com/dherault/serverless-offline/commit/4037d1b201a9a1b73d4ec8b2ee80cc04b3bdb850)
- Update index.js [`e533fdf`](https://github.com/dherault/serverless-offline/commit/e533fdf056a12e223ed814a1cd47bcf4d5de7c0c)
- Fixed Lint Issues [`90b27c2`](https://github.com/dherault/serverless-offline/commit/90b27c28e64332fa71bdba864ab70540809c3db4)
- Update index.js [`a3d9beb`](https://github.com/dherault/serverless-offline/commit/a3d9bebc34f471343c3df3a88a5b04d5cad1efd9)
- Update string path use node path lib [`4607c8f`](https://github.com/dherault/serverless-offline/commit/4607c8f5e3af9d156bcf02d7be3561897a1a9b48)
- Update index.js [`b43ac92`](https://github.com/dherault/serverless-offline/commit/b43ac920fd9f46420e1eb07e4d0993ecc0ca7766)
- feat(lambda): add request validation for lambda integration (#369) [`466d448`](https://github.com/dherault/serverless-offline/commit/466d44807e1cc99cd2102bb973f1c30c6ebea90f)
- Fix README [`4b0e2ab`](https://github.com/dherault/serverless-offline/commit/4b0e2ab91ec8ca3b93bd1f2dbb5f0944343d0b3b)
- Fix package version [`b1e6292`](https://github.com/dherault/serverless-offline/commit/b1e6292724c8d44ea0bec2c2f9562593a63bd567)
- Update index.js [`7b906bd`](https://github.com/dherault/serverless-offline/commit/7b906bd46330ac5f777266695f090c77501bf998)
- Update index.js [`aac73a2`](https://github.com/dherault/serverless-offline/commit/aac73a2c3498a6b54dcce0f0dd60da7a2872d8a3)
- Update index.js [`18b1d32`](https://github.com/dherault/serverless-offline/commit/18b1d32d03cd038584c7c6cd2b4d34c1903c663f)
- Update index.js [`e10bc5d`](https://github.com/dherault/serverless-offline/commit/e10bc5dfab8703793bdef20ff6081af4a184a2d5)
- Update index.js [`ec90dee`](https://github.com/dherault/serverless-offline/commit/ec90dee4451158c35af90e96dc3f864cf1792293)
- Update index.js [`77c8975`](https://github.com/dherault/serverless-offline/commit/77c897523eadb6d327335e8607422a4496974a74)
- Update index.js [`2641c04`](https://github.com/dherault/serverless-offline/commit/2641c048806bb7e33d54b072bbffeb96be412533)

#### [v4.2.1](https://github.com/dherault/serverless-offline/compare/v4.2.0...v4.2.1)

> 30 January 2019

- --noEnvironment Upgrade [`#582`](https://github.com/dherault/serverless-offline/pull/582)
- Fix #576: clone endpoint template when creating new endpoints [`#579`](https://github.com/dherault/serverless-offline/pull/579)
- Merge pull request #579 from cspotcode/patch-1 [`#576`](https://github.com/dherault/serverless-offline/issues/576)
- Fix #576: clone endpoint template when creating new endpoints [`#576`](https://github.com/dherault/serverless-offline/issues/576)
- Update index.js [`553075e`](https://github.com/dherault/serverless-offline/commit/553075e8e6a9b383e87cd36612af5dde78fc4207)

#### [v4.2.0](https://github.com/dherault/serverless-offline/compare/v4.1.4...v4.2.0)

> 20 January 2019

- Ensure external handlers are cleaned up on exit [`#577`](https://github.com/dherault/serverless-offline/pull/577)
- Kill external handlers on exit & functionHelper cleanup [`dd576b4`](https://github.com/dherault/serverless-offline/commit/dd576b45da5cddd96ef52ee7769d916a02f818c6)
- Remove spread operator to maintain Node 6 compat [`eedbe25`](https://github.com/dherault/serverless-offline/commit/eedbe254ffaa778abe00fe0463339405bb24e3fa)

#### [v4.1.4](https://github.com/dherault/serverless-offline/compare/v4.1.0...v4.1.4)

> 18 January 2019

- Adding support for SSL cookies and option to enforce them [`#575`](https://github.com/dherault/serverless-offline/pull/575)
- - Fix for cookies [`d34f345`](https://github.com/dherault/serverless-offline/commit/d34f345add56407b9f3de26d24d804d48ccce6eb)
- edit cookie state behavior [`f6ebaf6`](https://github.com/dherault/serverless-offline/commit/f6ebaf65f45a770b9e78a0d41fb8aefc37a5402d)
- Adding options and ssl support for cookies [`bfe83af`](https://github.com/dherault/serverless-offline/commit/bfe83af5cd108d2b2a02026cd56c8e8e35c505b1)
- remove dontPrintOutput and add printOutput option [`35166eb`](https://github.com/dherault/serverless-offline/commit/35166ebe5b9ac39ea3383061efb55850a185f18f)
- edit README [`4bf5f17`](https://github.com/dherault/serverless-offline/commit/4bf5f17b08f867d8cb17f847bb03220301938502)
- edit options [`fd4819d`](https://github.com/dherault/serverless-offline/commit/fd4819d234bec740e500533b244c7fef6b688028)
- - Lint fixes [`7198507`](https://github.com/dherault/serverless-offline/commit/7198507f1b04dd76cae33bcac2b7bbab9c721da1)
- edit travis config [`2d94e28`](https://github.com/dherault/serverless-offline/commit/2d94e289ed481cdc2af9c8decf588ee914dbf336)
- - Fix lint tests 2 [`0b2caf5`](https://github.com/dherault/serverless-offline/commit/0b2caf5919b461333a44348aeefed8e7d1dc1aa7)
- - Fix lint tests [`e988208`](https://github.com/dherault/serverless-offline/commit/e9882086c7c0d76d07e101a559b6259a1e860e9f)
- Update README.md [`55a838d`](https://github.com/dherault/serverless-offline/commit/55a838d87e4aef3219ad54defd94e5493e4f8a53)
- Update README.md [`ee4b0b6`](https://github.com/dherault/serverless-offline/commit/ee4b0b6d151a5ee27341bb387fd81eb09cb1f95a)
- Update README.md [`dd01cfb`](https://github.com/dherault/serverless-offline/commit/dd01cfb8ab385fe041edb911329e7ae6244befb7)

#### [v4.1.0](https://github.com/dherault/serverless-offline/compare/v4.0.0...v4.1.0)

> 16 January 2019

- removes unused @babel/core, @babel-register [`#572`](https://github.com/dherault/serverless-offline/pull/572)
- rebuild package-lock.json [`90e5ec7`](https://github.com/dherault/serverless-offline/commit/90e5ec76291b476fe7eda723e744b8c2236c6fe2)
- add semantic-release configuration [`0ef93dd`](https://github.com/dherault/serverless-offline/commit/0ef93dd6cf355766f7f3b5b6c4579f4919824497)
- add ruby manual test [`2c016fa`](https://github.com/dherault/serverless-offline/commit/2c016fab60e1d0a78020ef25389a7c9314cbf29a)
- add python and ruby support [`af3a5c4`](https://github.com/dherault/serverless-offline/commit/af3a5c4aab4d83ea2834ed0ab55f4e2330196742)
- add python and ruby support [`392e8d5`](https://github.com/dherault/serverless-offline/commit/392e8d5fab8fa5e5fee17d3d8d291ddedffcd498)
- add ruby manual test doc [`5b05347`](https://github.com/dherault/serverless-offline/commit/5b053475b63e8a6e41df29b9b647c7fffa91c41b)
- remove semantic-release [`e361484`](https://github.com/dherault/serverless-offline/commit/e3614845290c145bbe62936b88964d18b2335e73)

### [v4.0.0](https://github.com/dherault/serverless-offline/compare/v3.32.1...v4.0.0)

> 15 January 2019

- remove nested require.cache under functionHelper's children [`#569`](https://github.com/dherault/serverless-offline/pull/569)
- Updating serverless for Set-Cookie HttpOnly, Secure, and SameSite additions in HAPI [`#565`](https://github.com/dherault/serverless-offline/pull/565)
- Updating serverless for Set-Cookie HttpOnly, Secure, and SameSite additions in HAPI (#565) [`#564`](https://github.com/dherault/serverless-offline/issues/564)
- rebuild package.lock [`59a2cde`](https://github.com/dherault/serverless-offline/commit/59a2cde932dd930c96be75102d6042d04a8b8ed7)
- major release, v4 [`81e94b9`](https://github.com/dherault/serverless-offline/commit/81e94b90fee28d22e354a5693caaed4f91cfed7a)
- fix(babel): Removing babel runtime support and usage of lodash [`c5cba66`](https://github.com/dherault/serverless-offline/commit/c5cba66652ddec8e3b73c9fea5d0834aac783ef1)
- handle require cache [`ed77e3c`](https://github.com/dherault/serverless-offline/commit/ed77e3ca9871388c8ec354bfc330f41182e40887)
- fix travis.yml [`2e0a414`](https://github.com/dherault/serverless-offline/commit/2e0a41402469e2ee5f9e24297061feeeea621297)

#### [v3.32.1](https://github.com/dherault/serverless-offline/compare/v3.25.17...v3.32.1)

> 8 January 2019

- Add some requestContext to auth event and fix resouce with colon [`#546`](https://github.com/dherault/serverless-offline/pull/546)
- Support for authorizerId [`#558`](https://github.com/dherault/serverless-offline/pull/558)
- Update hapi, h2o2, boom [`#555`](https://github.com/dherault/serverless-offline/pull/555)
- adds supported and removes unsupported versions of node for travis tests [`#556`](https://github.com/dherault/serverless-offline/pull/556)
- Prevent uncaught error with invalid token [`#548`](https://github.com/dherault/serverless-offline/pull/548)
- Improved emulation of APIG's urlDecode velocity template function [`#526`](https://github.com/dherault/serverless-offline/pull/526)
- add multiValue header and query params to authorizer event and response [`#515`](https://github.com/dherault/serverless-offline/pull/515)
- Change startup log message if noAuth is enabled [`#516`](https://github.com/dherault/serverless-offline/pull/516)
- Add cognito-authentication-provider as header [`#511`](https://github.com/dherault/serverless-offline/pull/511)
- Feature: param to disable cookie validation in hapi.js [`#513`](https://github.com/dherault/serverless-offline/pull/513)
- Fix noAuth option not working [`#506`](https://github.com/dherault/serverless-offline/pull/506)
- added support for multiValueQueryStringParameters [`#507`](https://github.com/dherault/serverless-offline/pull/507)
- add `cacheInvalidationIgnore` option [`#505`](https://github.com/dherault/serverless-offline/pull/505)
- Update README.md [`#501`](https://github.com/dherault/serverless-offline/pull/501)
- use h.state for set-cookie headers [`#495`](https://github.com/dherault/serverless-offline/pull/495)
- Set response headers defined in serverless config [`#494`](https://github.com/dherault/serverless-offline/pull/494)
- use regular expression to split method arn into parts first before parsing path. fixes #560 [`#560`](https://github.com/dherault/serverless-offline/issues/560)
- fix #523 [`#523`](https://github.com/dherault/serverless-offline/issues/523)
- use h.state for set-cookie headers. Fixes #310 [`#310`](https://github.com/dherault/serverless-offline/issues/310)
- update deps: hapi, h2o2, boom [`b3ff428`](https://github.com/dherault/serverless-offline/commit/b3ff428dd2da4c6c32a137aa278693f54050e4fa)
- - Extracted authFunctionName in external function, added unit test [`7e04171`](https://github.com/dherault/serverless-offline/commit/7e04171cff0786f8e615abb908944c87ff85b90d)
- Refactored authFunctionNameExtractor export to support Node5 [`d2128b2`](https://github.com/dherault/serverless-offline/commit/d2128b25dc5b7d5a05d2fd7f08ebbae99bb9474b)
- Set response headers defined in serverless config [`810c6b1`](https://github.com/dherault/serverless-offline/commit/810c6b13edbcdb66def95ca13685fff8bb38c74c)
- fix linting warnings and errors [`a59476b`](https://github.com/dherault/serverless-offline/commit/a59476bb477850a49beba6862b60d78ebca22d99)
- fix linting warnings and errors [`819e78d`](https://github.com/dherault/serverless-offline/commit/819e78db67487c90084e9c7123039358f568d9b9)
- Add failing test for noAuth option [`018497d`](https://github.com/dherault/serverless-offline/commit/018497d6eb6c6902c89f271576fd232ba74bdaa5)
- improved emulation of APIG's decodeUrl velocity template function [`f4831c8`](https://github.com/dherault/serverless-offline/commit/f4831c87f75a99af67d0a9a77776f97b2a3b3816)
- added test for the disableCookieValidation-flag [`9fe7071`](https://github.com/dherault/serverless-offline/commit/9fe7071872e6d5e3d4dccba6f0230e96931bbe97)
- add test for #560 [`789c172`](https://github.com/dherault/serverless-offline/commit/789c17297bb0107a3b914f0f10f52e2568327685)
- Add test coverage for setting multiple cookies [`1a1a7aa`](https://github.com/dherault/serverless-offline/commit/1a1a7aa80896393d7a76a7aa9c9f02808ccb1206)
- add some requestContext to auth event [`2f4f31a`](https://github.com/dherault/serverless-offline/commit/2f4f31ade2eb6cc1b4939781974c6115e32cf1c6)
- added param to disable cookie validation in hapi.js [`5d9a67a`](https://github.com/dherault/serverless-offline/commit/5d9a67a5c460e456e54e5be0967807fcfdee2064)
- Update readme with a custom headers section [`ff9f3b3`](https://github.com/dherault/serverless-offline/commit/ff9f3b32d75d31b964c734bc9b252a06e81fe80f)
- rename cacheInvalidationIgnore to cacheInvalidationRegex [`fb8233a`](https://github.com/dherault/serverless-offline/commit/fb8233ad9cd79a643416004241fa324f63b04e07)
- better fix for #523 - handling of 'arn:aws:execute-api:\*\*' policyResource [`701c383`](https://github.com/dherault/serverless-offline/commit/701c3839d904d54959af3b0a576c21015f827eec)
- add cacheInvalidationIgnore mask [`0d1ae89`](https://github.com/dherault/serverless-offline/commit/0d1ae890efd123f2bf7417238d74b4ae1bcda109)
- fix some linting warnings and update package-lock [`8866024`](https://github.com/dherault/serverless-offline/commit/886602454b69a448125d2b6a67b71bf68876f309)
- fix [`d533ba3`](https://github.com/dherault/serverless-offline/commit/d533ba348490fb66d15fd815c7fe9bf1561687c6)
- fixes test case for hapi v16 update [`0f78b64`](https://github.com/dherault/serverless-offline/commit/0f78b64285db67d23f04521706389412ff68e62c)
- lint [`ba285a6`](https://github.com/dherault/serverless-offline/commit/ba285a64643b85f8e50df77fb030d6468a108bf4)
- support Node 5 [`0e9beb9`](https://github.com/dherault/serverless-offline/commit/0e9beb9f0e1e83dfe30cbe41b057f2972687a118)
- lint [`a44826f`](https://github.com/dherault/serverless-offline/commit/a44826f7a59ea26273c2a8b99af753b2a51da5cf)
- remove ambiguity from cacheInvalidationIgnore default [`52b127f`](https://github.com/dherault/serverless-offline/commit/52b127fd3651ff1062d224a586f7404fc91dacc8)
- Make endpoint base struct status code a number [`4c9f118`](https://github.com/dherault/serverless-offline/commit/4c9f1184f1ad680a841122b5cd84b348598b00c8)
- removes unsupported versions of node for travis tests [`a2a78e8`](https://github.com/dherault/serverless-offline/commit/a2a78e8854ffdb5874e087447620a6ea24da2aa9)
- Fix code style [`adc8d15`](https://github.com/dherault/serverless-offline/commit/adc8d154256b9ca970b29cdf3e6c8491e06810c2)
- Add myself as contributor [`e97ce98`](https://github.com/dherault/serverless-offline/commit/e97ce980ff1545cca3230c0b60ac0bfebce7087b)
- add myself as contributor [`f5c06ed`](https://github.com/dherault/serverless-offline/commit/f5c06ed2c37efa9bbbd9b4832e7fb2fd3d18b66c)
- adds additional supported versions of node for travis tests [`24e9a15`](https://github.com/dherault/serverless-offline/commit/24e9a15638544e6360f2ee9ad7b6b9706ca6c35d)
- Fix protected routes requiring API key even if noAuth option is set [`f96faf1`](https://github.com/dherault/serverless-offline/commit/f96faf11fde64080437f7caf99b0d2d4097aee9d)
- remove node v5 from travis [end-of-life] [`01d2088`](https://github.com/dherault/serverless-offline/commit/01d20885e92217dfb992f7d355e4f8636fe2bb6a)
- Add missing headers to noAuth test case [`bcfdbcd`](https://github.com/dherault/serverless-offline/commit/bcfdbcdb483310209d48acc4d05ddc80c2319c25)
- added contributor [`e81bef9`](https://github.com/dherault/serverless-offline/commit/e81bef989533cfa9c4c0c8c6f127b277a851273e)
- Add me as a contributor :D [`78a647a`](https://github.com/dherault/serverless-offline/commit/78a647a06e5f43f9a4ef46ff2bc37cad1756b6f9)

#### [v3.25.17](https://github.com/dherault/serverless-offline/compare/v3.25.11...v3.25.17)

> 28 September 2018

- Fix async handler support for handlers running in separate processes [`#492`](https://github.com/dherault/serverless-offline/pull/492)
- update outdated "Usage with Babel" section [`#489`](https://github.com/dherault/serverless-offline/pull/489)
- Add AWS_REGION to environment defaults [`#491`](https://github.com/dherault/serverless-offline/pull/491)
- travis: add run lint step to travis configuration, in addition to run… [`#490`](https://github.com/dherault/serverless-offline/pull/490)
- Gracefully shut down hapi server on SIGTERM [`#484`](https://github.com/dherault/serverless-offline/pull/484)
- fix #479 [`#479`](https://github.com/dherault/serverless-offline/issues/479)
- master origin merge + package lock updated [`590484a`](https://github.com/dherault/serverless-offline/commit/590484a4d501147ac9d042b08c42d58124a24759)
- babel ver 7 support added [`84fadf0`](https://github.com/dherault/serverless-offline/commit/84fadf0f8989dfc75ed81fd855d1a2cca9eebe8a)
- package lock updated [`99ff5ff`](https://github.com/dherault/serverless-offline/commit/99ff5ff49f6dfb0c6c294d588753dabc18995309)
- package lock updated [`8a215a5`](https://github.com/dherault/serverless-offline/commit/8a215a5dc70ffbc0e6fa4853d4fb36cbd55589f0)
- set AWS_REGION default from provider [`9209917`](https://github.com/dherault/serverless-offline/commit/9209917929e3b9dc6c01a20111c53aedf7e8fc1a)
- travis: add run lint step to travis configuration, in addition to running test. Fix lint error in index.js. [`e6777fb`](https://github.com/dherault/serverless-offline/commit/e6777fb0265f59f91599a558e7f664cf62954a3d)
- update license [`301039d`](https://github.com/dherault/serverless-offline/commit/301039d9dae0e1e1654351249d51e95042c2b153)
- update package lock [`eaec2ee`](https://github.com/dherault/serverless-offline/commit/eaec2eee894104b2d5f893fdaa769932bf0a5256)
- add travis node versions 8 and 9 [`bb256fd`](https://github.com/dherault/serverless-offline/commit/bb256fdb52b13d243895b848ed4cb823a1da58c2)
- update version in lockfile [`eccd315`](https://github.com/dherault/serverless-offline/commit/eccd315f034e8af1d0e4bae364c08d36407e6ac9)
- package lock updated [`694575b`](https://github.com/dherault/serverless-offline/commit/694575bb8665152103db88d7f2f2c0b5389d2405)
- remove travis node version 4 [`6c94d26`](https://github.com/dherault/serverless-offline/commit/6c94d26a44dfde40e4274e0fd35dd29d48d464f1)

#### [v3.25.11](https://github.com/dherault/serverless-offline/compare/v3.25.4...v3.25.11)

> 6 September 2018

- Update dependencies to fix critical vulnerabilities [`#477`](https://github.com/dherault/serverless-offline/pull/477)
- Added option to set "authorizer"-property using process.env.AUTHORIZER [`#475`](https://github.com/dherault/serverless-offline/pull/475)
- Check if usageIdentifierKey returned by an authorizer is a valid API key [`#441`](https://github.com/dherault/serverless-offline/pull/441)
- Fixed the splitting of handler path and handler name when multiple de… [`#471`](https://github.com/dherault/serverless-offline/pull/471)
- fix: error feedback when using --useSeparateProcesses flag [`#465`](https://github.com/dherault/serverless-offline/pull/465)
- fix: prioritize handler environment variable values over the originals [`#467`](https://github.com/dherault/serverless-offline/pull/467)
- Fix typos in warning [`#462`](https://github.com/dherault/serverless-offline/pull/462)
- adding check to prevent 500 in AWS Lambda when json body is not stringified [`#460`](https://github.com/dherault/serverless-offline/pull/460)
- Minor Readme update to reflect Node v8.10.0 Lambda support [`#458`](https://github.com/dherault/serverless-offline/pull/458)
- add cognito identity id header [`#447`](https://github.com/dherault/serverless-offline/pull/447)
- Fix server startup issue [`#446`](https://github.com/dherault/serverless-offline/pull/446)
- Only call end() from the corresponding lifecycle hook [`#437`](https://github.com/dherault/serverless-offline/pull/437)
- Spelling [`#439`](https://github.com/dherault/serverless-offline/pull/439)
- Fix server startup issue [`#445`](https://github.com/dherault/serverless-offline/issues/445)
- Update dependencies to fix crit vulns [`604d753`](https://github.com/dherault/serverless-offline/commit/604d7531671422d42ab86592e35bbd3d6ef6c4dc)
- Roll back eslint to make Node v4.3.2 happy [`2aaf09c`](https://github.com/dherault/serverless-offline/commit/2aaf09ca24a74b3b20e46f7207befb68dbc69aa5)
- update npm lock file [`664c86d`](https://github.com/dherault/serverless-offline/commit/664c86d773a6b80f13f2c4da024964871524d98a)
- fixing 500 when json body is not stringified [`114ebd5`](https://github.com/dherault/serverless-offline/commit/114ebd5dd8c0c2771e0c1fc06f442078ddf509d0)
- style: resolve quotes, indent, comma-dangle, & semi lint errors [`c89fecf`](https://github.com/dherault/serverless-offline/commit/c89fecfb0b91a8f40ebc1ed43ed1c4400426d0ec)
- Fixed the splitting of handler path and handler name when multiple delimiters (dot) are present in path [`0b0030e`](https://github.com/dherault/serverless-offline/commit/0b0030e82225ef1e4d5d50f88cd32f96fbaf9cb7)
- try/catch process.env.AUTHORIZER parsing [`e93414f`](https://github.com/dherault/serverless-offline/commit/e93414f5027b0ad7ac95e56071ed35c46ecd8122)
- Added README section for Remote authorizers [`45eee0c`](https://github.com/dherault/serverless-offline/commit/45eee0c9e975a56466bef6bb9383bc2061a1afba)
- Update mention of supported Lambda versions to reflect deprecation of Node v4.3.2 and new support of Node v8.10.0, and add relevant link to AWS docs [`c0e9272`](https://github.com/dherault/serverless-offline/commit/c0e92729ca799370ff5bd163a25576e7b4cbbe63)
- lint [`e85bb0f`](https://github.com/dherault/serverless-offline/commit/e85bb0f3d0ed1552bbf0bd03f1d74503de97c122)
- Added option to set "authorizer"-property using env.process.AUTHORIZER [`14f35fb`](https://github.com/dherault/serverless-offline/commit/14f35fb705770b2dd3a88e18f9f4d3e6f20fc44e)
- Fixed the prioritization of environment variables such that the values provided in a given handler take precedence over those defined when the plugin was initialized. [`652c97a`](https://github.com/dherault/serverless-offline/commit/652c97a2d1e5417e0e88d4802d3bc2c7b9ce77e7)
- Bring back correct sigint handling [`61247aa`](https://github.com/dherault/serverless-offline/commit/61247aaa4b3b40e23b43bc4e598ee06692f1ee90)
- spelling pt2 [`eccdcbf`](https://github.com/dherault/serverless-offline/commit/eccdcbf51c7f561346b6aca9987a2f390ee96bc5)
- docs: add --useSeparateProcesses flag to CLI options [`a1ffd9d`](https://github.com/dherault/serverless-offline/commit/a1ffd9d31d48b75461e4cb09cbecc2381f1160f1)

#### [v3.25.4](https://github.com/dherault/serverless-offline/compare/v3.25.3...v3.25.4)

> 6 June 2018

- add protocol to lambda proxy context [`77d7980`](https://github.com/dherault/serverless-offline/commit/77d79808ed5b717ae032baad7391ca67ddbcf378)

#### [v3.25.3](https://github.com/dherault/serverless-offline/compare/v3.25.0...v3.25.3)

> 5 June 2018

- Normalize Hapi queryParameters to be compliant with API Gateway [`#430`](https://github.com/dherault/serverless-offline/pull/430)
- pollute String prototype only when needed [`7925c46`](https://github.com/dherault/serverless-offline/commit/7925c46b528b465ab320866e5fe68e9b751dccb5)
- Normalize hapi queryParameters to be compliant with API Gateway [`884ee6c`](https://github.com/dherault/serverless-offline/commit/884ee6c656e3dcead32fe1503d92907d00e7a9d9)
- enhance javaHelpers [`f568358`](https://github.com/dherault/serverless-offline/commit/f5683588deaa755aa6154bd80c82f3ef3e581f22)
- fix test on node v4 and 5 [`d8cd78a`](https://github.com/dherault/serverless-offline/commit/d8cd78ae1c6a5820e1f0e674f0b5e4f0944d5359)
- enhance javaHelpers [`d14b8d4`](https://github.com/dherault/serverless-offline/commit/d14b8d4b056830277acf7185d9bd64a27838ef39)

#### [v3.25.0](https://github.com/dherault/serverless-offline/compare/v3.24.5...v3.25.0)

> 31 May 2018

- Add myself to contributors [`#425`](https://github.com/dherault/serverless-offline/pull/425)
- Fix eslint issues [`#424`](https://github.com/dherault/serverless-offline/pull/424)
- Add support for async authorizers [`#423`](https://github.com/dherault/serverless-offline/pull/423)

#### [v3.24.5](https://github.com/dherault/serverless-offline/compare/v3.24.4...v3.24.5)

> 30 May 2018

- Show the right waning on promise vs callback conflict. [`#421`](https://github.com/dherault/serverless-offline/pull/421)
- Update lockfile [`#422`](https://github.com/dherault/serverless-offline/pull/422)
- Fix small typo [`#419`](https://github.com/dherault/serverless-offline/pull/419)
- Small typo [`c1905c2`](https://github.com/dherault/serverless-offline/commit/c1905c28d16c6c6447c8dfe0372c3541671f9828)

#### [v3.24.4](https://github.com/dherault/serverless-offline/compare/v3.24.3...v3.24.4)

> 29 May 2018

- add failing unittest [`#417`](https://github.com/dherault/serverless-offline/pull/417)
- add one unit test [`8dfcbc8`](https://github.com/dherault/serverless-offline/commit/8dfcbc8ea00ab1ff81951a3860b844dba11c947e)
- fix failing unit test [`355a9f9`](https://github.com/dherault/serverless-offline/commit/355a9f99b624b854f173678e2658dd3d31e126bd)

#### [v3.24.3](https://github.com/dherault/serverless-offline/compare/3.24.1...v3.24.3)

> 28 May 2018

- Pass provider environment to shell [`#316`](https://github.com/dherault/serverless-offline/pull/316)
- Fix default response template [`#301`](https://github.com/dherault/serverless-offline/pull/301)
- fix content-type header [`9ce00c2`](https://github.com/dherault/serverless-offline/commit/9ce00c2739a813df53767b1b7bdd3638c76bdcca)
- lint [`214e0e7`](https://github.com/dherault/serverless-offline/commit/214e0e78964319cfe569459888316f36a60998df)
- Update index.js [`6d79b27`](https://github.com/dherault/serverless-offline/commit/6d79b27e623dd5f5c844205ba18e14d9821d1788)
- Remove extra blank line [`77b0fe4`](https://github.com/dherault/serverless-offline/commit/77b0fe459685ea2203a35f496710dd79182547a2)

#### [3.24.1](https://github.com/dherault/serverless-offline/compare/v3.24.0...3.24.1)

> 26 May 2018

- Fix Allow statement case sensitivity [`#412`](https://github.com/dherault/serverless-offline/pull/412)
- Fix protected routes [`#414`](https://github.com/dherault/serverless-offline/pull/414)
- Use Response.header rather than Response.headers [`#379`](https://github.com/dherault/serverless-offline/pull/379)
- Changed the way that the response headers are set, and opted to use the [`c82596f`](https://github.com/dherault/serverless-offline/commit/c82596f4745989193f2e9e856b308c3501f7b8a1)
- Make protectedRoutes work with paths that start with / [`302d21e`](https://github.com/dherault/serverless-offline/commit/302d21e279e24bcfd88a50107917030dfee546d0)
- Update the property value for content-type header to allow for appended [`265b228`](https://github.com/dherault/serverless-offline/commit/265b22820b8c5d0fe2cc2951777c9599065b50d1)
- Add to contributors [`a14ee4b`](https://github.com/dherault/serverless-offline/commit/a14ee4b2b61701f2332d92e4178922b00dd571c2)

#### [v3.24.0](https://github.com/dherault/serverless-offline/compare/v3.23.0...v3.24.0)

> 23 May 2018

- Added validation for policy documents [`#348`](https://github.com/dherault/serverless-offline/pull/348)
- read content-type header in a case insensitive manner [`#410`](https://github.com/dherault/serverless-offline/pull/410)
- FIXED: Random requestId generation. [`#307`](https://github.com/dherault/serverless-offline/pull/307)
- lint [`72b834d`](https://github.com/dherault/serverless-offline/commit/72b834d33c2dba403552a10c6dfd6db082fe1360)
- read header in a case insensitive manner [`ddc666c`](https://github.com/dherault/serverless-offline/commit/ddc666c82cd11ae4b9951d0b885c76186b56e5a4)
- lint [`0119079`](https://github.com/dherault/serverless-offline/commit/0119079658fb3e24a1071ce10f4eb83be859d11d)

#### [v3.23.0](https://github.com/dherault/serverless-offline/compare/v3.22.0...v3.23.0)

> 17 May 2018

- Add exposed headers [`#378`](https://github.com/dherault/serverless-offline/pull/378)
- Adding option for CORS Exposed Headers [`db1db5e`](https://github.com/dherault/serverless-offline/commit/db1db5ec239106e6353e0ddc42a292f7e62dad88)
- Fixing accidental deletion in README [`e41799e`](https://github.com/dherault/serverless-offline/commit/e41799ec4ee5a4e8299021c9768f3b906f7224e5)

#### [v3.22.0](https://github.com/dherault/serverless-offline/compare/v3.21.0...v3.22.0)

> 17 May 2018

- skip HEAD routes to avoid HAPI error [`#409`](https://github.com/dherault/serverless-offline/pull/409)
- skip HEAD routes to avoid hapi error [`8c9ce61`](https://github.com/dherault/serverless-offline/commit/8c9ce6117c8127533f2c3cdcb5ca6fc64805a19f)
- v.3.21.1 [`47ce5c9`](https://github.com/dherault/serverless-offline/commit/47ce5c9e72fc3f0dc51d4246eb546f5a2fc10ce1)
- add log message when skipping HEAD routes [`b9167e3`](https://github.com/dherault/serverless-offline/commit/b9167e31811436aac19d4f43559ff9f2d47cec73)

#### [v3.21.0](https://github.com/dherault/serverless-offline/compare/v3.20.3...v3.21.0)

> 12 May 2018

- Add binary support when using lambda integration [`#402`](https://github.com/dherault/serverless-offline/pull/402)
- Option to preserve trailing slash [`#395`](https://github.com/dherault/serverless-offline/pull/395)
- Support another HTTP Proxy methods [`#299`](https://github.com/dherault/serverless-offline/pull/299)
- Pulls in 8.2.1 of jsonwebtoken, this will remove a low severity [`#403`](https://github.com/dherault/serverless-offline/pull/403)
- updated readme [`7608de0`](https://github.com/dherault/serverless-offline/commit/7608de09d33f2b999d7c66f84f484a9dabb229ee)
- Add binary support for binary integration [`50c1318`](https://github.com/dherault/serverless-offline/commit/50c1318dbe143b56739e1cb1b3462112c8616c90)
- add option to preserve trailing slash [`b769838`](https://github.com/dherault/serverless-offline/commit/b769838900cfd882f59f5e79e5cbb76b5b208c2e)
- Replace deprecated 'new Buffer' syntax [`f785a37`](https://github.com/dherault/serverless-offline/commit/f785a379737e352424dfb9bc6bcf4b886350af94)
- fix typo [`15dc27d`](https://github.com/dherault/serverless-offline/commit/15dc27d545d10a946311d44268060b1ada95b15a)
- Update package.json [`c4c01b4`](https://github.com/dherault/serverless-offline/commit/c4c01b4072178df9b49398d3c0e70918ca5b46df)

#### [v3.20.3](https://github.com/dherault/serverless-offline/compare/v3.20.2...v3.20.3)

> 18 April 2018

- Add async handler support for nodejs8.10 runtime [`#398`](https://github.com/dherault/serverless-offline/pull/398)
- Add option to run handlers in separate node processes [`#368`](https://github.com/dherault/serverless-offline/pull/368)

#### [v3.20.2](https://github.com/dherault/serverless-offline/compare/v3.20.1...v3.20.2)

> 12 April 2018

- Adds special encoding for multipart/form-data [`#394`](https://github.com/dherault/serverless-offline/pull/394)
- Adding process.env.\_HANDLER [`#393`](https://github.com/dherault/serverless-offline/pull/393)
- Fixes the case when policy === \* [`#391`](https://github.com/dherault/serverless-offline/pull/391)

#### [v3.20.1](https://github.com/dherault/serverless-offline/compare/v3.20.0...v3.20.1)

> 4 April 2018

- Fix for broken AWS resources [`#386`](https://github.com/dherault/serverless-offline/pull/386)

#### [v3.20.0](https://github.com/dherault/serverless-offline/compare/v3.18.0...v3.20.0)

> 3 April 2018

- Update README with info for changing AWS profile [`#380`](https://github.com/dherault/serverless-offline/pull/380)
- Add support for nodejs8.10 [`#382`](https://github.com/dherault/serverless-offline/pull/382)
- Added support to noEnvironment flag [`#367`](https://github.com/dherault/serverless-offline/pull/367)
- Add support for complex policies with wildcards [`#373`](https://github.com/dherault/serverless-offline/pull/373)
- Improves support authorizer.type == request [`#377`](https://github.com/dherault/serverless-offline/pull/377)
- Fix for lower cased Authorization header not being catered for [`#376`](https://github.com/dherault/serverless-offline/pull/376)
- Add name to contributors based on commit bf8af6282de55aec1628877eec60edacb3729277 [`#366`](https://github.com/dherault/serverless-offline/pull/366)

#### [v3.18.0](https://github.com/dherault/serverless-offline/compare/v3.17.0...v3.18.0)

> 18 February 2018

- Stop stripping newlines and tabs from body [`#337`](https://github.com/dherault/serverless-offline/pull/337)
- improved error logging [`#362`](https://github.com/dherault/serverless-offline/pull/362)
- - handle base64 encoded binary response from aws lambda function [`#358`](https://github.com/dherault/serverless-offline/pull/358)

#### [v3.17.0](https://github.com/dherault/serverless-offline/compare/v3.16.0...v3.17.0)

> 7 February 2018

- Include environment variables defined for the authorizer function when the authorizer function runs. [`#309`](https://github.com/dherault/serverless-offline/pull/309)
- Update README: add usage with flow [`#356`](https://github.com/dherault/serverless-offline/pull/356)
- Adding support for request-type authorizers [`#329`](https://github.com/dherault/serverless-offline/pull/329)
- enforces upper case on method names for protected routes mapping [`#339`](https://github.com/dherault/serverless-offline/pull/339)
- Use header (singular) to follow API Gateway conventions [`#345`](https://github.com/dherault/serverless-offline/pull/345)
- Fix minor typos [`#332`](https://github.com/dherault/serverless-offline/pull/332)
- adding support for request authorizers [`d767fa1`](https://github.com/dherault/serverless-offline/commit/d767fa1899c7e34aacfc18ab25db5ce5db62c3f1)
- updating contributors and moving event.methodArn outside if block [`799a4e9`](https://github.com/dherault/serverless-offline/commit/799a4e9baaa4696f774df47df7c4c0a2ed2a4f4d)
- adding method and path [`aa60421`](https://github.com/dherault/serverless-offline/commit/aa604213fa9e2ffd5c02ff650ff86034e2fc746d)
- Update index.js [`09757c5`](https://github.com/dherault/serverless-offline/commit/09757c5a0fdf89d83308fdb91b455d1e93f9bf12)
- Update README.md [`d3a1ff1`](https://github.com/dherault/serverless-offline/commit/d3a1ff11a7ee3edefc151adee95ed13ae99afa66)
- Include environment variables defined for the authorizer function. [`0910eff`](https://github.com/dherault/serverless-offline/commit/0910effdf067891c6bfd651dd1aa64af3c01be9d)

#### [v3.16.0](https://github.com/dherault/serverless-offline/compare/v3.15.3...v3.16.0)

> 18 September 2017

- Don't swallow error message when creating auth function handler [`#302`](https://github.com/dherault/serverless-offline/pull/302)
- Added --noAuth CLI option to disable Authorizer [`#294`](https://github.com/dherault/serverless-offline/pull/294)
- Added claims field to authorizer requestContext for lambdaProxyContex… [`#292`](https://github.com/dherault/serverless-offline/pull/292)
- removed npm crypto from dependency and used node-native crypto [`#287`](https://github.com/dherault/serverless-offline/pull/287)
- Fix lambda integration returning just newlines for all lambda responses. [`#285`](https://github.com/dherault/serverless-offline/pull/285)
- Increase payload size limit from 1MB default to match AWS 10MB limit. [`#283`](https://github.com/dherault/serverless-offline/pull/283)
- Remove stage prefix from auth event methodArn [`#279`](https://github.com/dherault/serverless-offline/pull/279)
- removed npm crypto from dependency and used npm crypto [`4adba36`](https://github.com/dherault/serverless-offline/commit/4adba36bb9fa9a0b787fec66fa780dd961a12366)
- lint [`34a6ed4`](https://github.com/dherault/serverless-offline/commit/34a6ed446176abb7a5643f5cae2892c383bc5b9a)
- Added claims field to authorizer requestContext for lambdaProxyContext populated with decoded payload from JWT token if Authorization header is spedified to allow testing lambda logic that is based on claims from the token [`9d4a853`](https://github.com/dherault/serverless-offline/commit/9d4a85380c2e1b01ac7d9c51c0c47fce2cbd97ee)
- pass tests [`889b640`](https://github.com/dherault/serverless-offline/commit/889b640b4a1bc40766fd24937bf8b5891697be28)
- update package.lock [`24d13a3`](https://github.com/dherault/serverless-offline/commit/24d13a38d434547ba973ca70b5eae6d160f94d7f)
- Update README.md [`ca5ca87`](https://github.com/dherault/serverless-offline/commit/ca5ca8725ee794cfe3fb8afcc62fb08974f3ce52)
- Adjust request payload size to actual AWS limit. [`7cfc67b`](https://github.com/dherault/serverless-offline/commit/7cfc67b87a6e1302d998b70f24a15754a5cc1181)
- Don't swallow error message [`950ab87`](https://github.com/dherault/serverless-offline/commit/950ab8726f43520814c94ecd76f3c1921067ac14)
- Fix lambda integration returning just newlines. [`6f6a628`](https://github.com/dherault/serverless-offline/commit/6f6a628a611573940b822b2f4d53623fdb7902af)
- Increase payload size limit from 1MB default to 15MB. [`ae9ee97`](https://github.com/dherault/serverless-offline/commit/ae9ee976d7bc0fee061794fa66da9ff0e452d1d3)
- remove rogue console.log [`030e2b2`](https://github.com/dherault/serverless-offline/commit/030e2b2da70dec6df55d8d2bac1b4a83a90948ff)
- Update README.md [`6f12560`](https://github.com/dherault/serverless-offline/commit/6f1256099cf327b4cb2717e3c8d40744a88161e5)
- fix message: removed npm crypto from dependency and used node-native crypto [`7cb78e1`](https://github.com/dherault/serverless-offline/commit/7cb78e15eaa1c40069b644f38053aa4309fc5f73)

#### [v3.15.3](https://github.com/dherault/serverless-offline/compare/v3.15.2...v3.15.3)

> 26 July 2017

- use unprocessed request headers. fixes [`6c2f390`](https://github.com/dherault/serverless-offline/commit/6c2f3906da4571ed54ed8b95bcf417b6b25cb098)

#### [v3.15.2](https://github.com/dherault/serverless-offline/compare/v3.15.1...v3.15.2)

> 26 July 2017

- remove unhandledRejection listener on process [`#255`](https://github.com/dherault/serverless-offline/issues/255)
- lint [`e184bad`](https://github.com/dherault/serverless-offline/commit/e184bad7d488feed21a9a07988ce6f8c58db4767)
- Ensure path parameters are url encoded to match aws behavior [`b38a42b`](https://github.com/dherault/serverless-offline/commit/b38a42b6ef9c7be35b3627cbbc9235aca8e63c50)
- remove rogue console.log [`b809636`](https://github.com/dherault/serverless-offline/commit/b809636a576ae86a6ee0183dc27cd2d4fb1010d3)
- methodArn should contain request.path [`86d9b1c`](https://github.com/dherault/serverless-offline/commit/86d9b1c5dda2ab29cc688cbe29ddc66b5a2be7ab)
- add new contributor [`2d27b04`](https://github.com/dherault/serverless-offline/commit/2d27b042aa039217edecaf0fab54bd4c651a7c6c)

#### [v3.15.1](https://github.com/dherault/serverless-offline/compare/v3.15.0...v3.15.1)

> 15 July 2017

- updates protectedRoutes logic to include request method [`#269`](https://github.com/dherault/serverless-offline/pull/269)
- Add apiId to requestContext [`#267`](https://github.com/dherault/serverless-offline/pull/267)
- edit readme [`4941343`](https://github.com/dherault/serverless-offline/commit/4941343129c2768d1ae92e82c66afe7bb26a3e58)
- updates protectedRoutes logic to include request method in addition to the request path [`ef101c5`](https://github.com/dherault/serverless-offline/commit/ef101c549a0d2eda5162771a578d64680840d7a5)
- lint [`546662d`](https://github.com/dherault/serverless-offline/commit/546662d8fa9e241e59683c5d51a5028b301327e7)
- Update README.md [`75cea43`](https://github.com/dherault/serverless-offline/commit/75cea438d7eab908e3dfdb7ae2b51ced4538e21f)

#### [v3.15.0](https://github.com/dherault/serverless-offline/compare/v3.14.2...v3.15.0)

> 6 July 2017

- edit readme and add lockfile [`6e36fbc`](https://github.com/dherault/serverless-offline/commit/6e36fbc0cd3201bb9e5e2f9c5687dc8850b014ad)
- :wrench: Implement HTTP Proxy [`d46ee4b`](https://github.com/dherault/serverless-offline/commit/d46ee4be4c3d73107d3f85aff182b7993c568b8c)
- fix [`4b70721`](https://github.com/dherault/serverless-offline/commit/4b7072109318ff32e4ca542a1a9feb6fd3ea0010)
- service wide environment variables passed on in authorizer [`4833609`](https://github.com/dherault/serverless-offline/commit/4833609d1cef91fa5814ec3920af1b8f7d5e4507)

#### [v3.14.2](https://github.com/dherault/serverless-offline/compare/v3.14.1...v3.14.2)

> 14 June 2017

- Assign process.env per function calls. [`#254`](https://github.com/dherault/serverless-offline/pull/254)
- Create README.md [`#253`](https://github.com/dherault/serverless-offline/pull/253)
- Assign process.env per function calls. This avoids functions overriding other functions envs [`7489d60`](https://github.com/dherault/serverless-offline/commit/7489d60d646452249384e5d3b3488f9a9b099057)

#### [v3.14.1](https://github.com/dherault/serverless-offline/compare/v3.14.0...v3.14.1)

> 3 June 2017

- Disabling node socket timeout [`#250`](https://github.com/dherault/serverless-offline/pull/250)
- fix typos [`#249`](https://github.com/dherault/serverless-offline/pull/249)
- Add test for default content-type and content-size [`#247`](https://github.com/dherault/serverless-offline/pull/247)
- Add test for default content-type and content-size on lambda-proxy request [`83f5dc9`](https://github.com/dherault/serverless-offline/commit/83f5dc9f961083cd9600d3752b3c7024bb69ff8a)
- Accept statusCode as string or number [`9afa64d`](https://github.com/dherault/serverless-offline/commit/9afa64dcfe40f9836c59bf895ce668f65e512ae1)
- fixing typo [`9e9104f`](https://github.com/dherault/serverless-offline/commit/9e9104f5cdd0f87c1585dafe9c3ae7284267a10a)
- Adding version 7 do .travis.yml because the latest is 8 now [`4c7864f`](https://github.com/dherault/serverless-offline/commit/4c7864f0ecf7f7afc2205b449acc7d47c704a2c7)
- add sgleadow contributor [`cdc2061`](https://github.com/dherault/serverless-offline/commit/cdc206159e3ef5ecb940fe4b0d2dba70a948ece6)
- .Merge branch 'master' of https://github.com/dherault/serverless-offline [`285f395`](https://github.com/dherault/serverless-offline/commit/285f3954e2ad4198d4852da884013bab4de1099c)

#### [v3.14.0](https://github.com/dherault/serverless-offline/compare/v3.13.5...v3.14.0)

> 9 May 2017

- Added support for authorizer type `AWS_IAM` [`#244`](https://github.com/dherault/serverless-offline/pull/244)

#### [v3.13.5](https://github.com/dherault/serverless-offline/compare/v3.13.4...v3.13.5)

> 25 April 2017

- Added ignore the authorizer for the non custom authorizers. [`#241`](https://github.com/dherault/serverless-offline/pull/241)

#### [v3.13.4](https://github.com/dherault/serverless-offline/compare/v3.13.3...v3.13.4)

> 24 April 2017

- fix setting default for identitySource [`#239`](https://github.com/dherault/serverless-offline/pull/239)
- Added short-circuit guard against functions that have no events [`#238`](https://github.com/dherault/serverless-offline/pull/238)
- fix setting default for identitySource [`#207`](https://github.com/dherault/serverless-offline/issues/207)
- lint [`4d48bcb`](https://github.com/dherault/serverless-offline/commit/4d48bcbef961c379579228d4f6337f8498d4424d)
- add new contributor [`f1976bc`](https://github.com/dherault/serverless-offline/commit/f1976bc4a73f25e4cb75d921f02259c197df9027)

#### [v3.13.3](https://github.com/dherault/serverless-offline/compare/v3.13.2...v3.13.3)

> 11 April 2017

- Add support to forbidden access if you deny on custom rule [`#228`](https://github.com/dherault/serverless-offline/pull/228)
- Fake commit for Travis test again [`356872e`](https://github.com/dherault/serverless-offline/commit/356872eb65c4a1c79c67c9a378c4da9a9822a8a2)
- Changes on arn to remove spaces that can crash on grant access [`c3877a1`](https://github.com/dherault/serverless-offline/commit/c3877a168455a03faf6b411d15f7e7b92f44a774)
- Update README.md [`3feaf4b`](https://github.com/dherault/serverless-offline/commit/3feaf4babaf1646188b57ff3f163f202ed1c08ce)

#### [v3.13.2](https://github.com/dherault/serverless-offline/compare/v3.13.1...v3.13.2)

> 4 April 2017

- replaces fat arrows with functions so 'this' refers to global String object [`#227`](https://github.com/dherault/serverless-offline/pull/227)

#### [v3.13.1](https://github.com/dherault/serverless-offline/compare/v3.13.0...v3.13.1)

> 27 March 2017

- app - preventing hapi from parsing payloads; resolves #177. [`#224`](https://github.com/dherault/serverless-offline/pull/224)
- Merge pull request #224 from neverendingqs/app/matchproxyparsing [`#177`](https://github.com/dherault/serverless-offline/issues/177)
- app - preventing hapi from parsing payloads; resolves #177. [`#177`](https://github.com/dherault/serverless-offline/issues/177)

#### [v3.13.0](https://github.com/dherault/serverless-offline/compare/v3.12.0...v3.13.0)

> 23 March 2017

- add support for nodejs6.10 [`#221`](https://github.com/dherault/serverless-offline/pull/221)

#### [v3.12.0](https://github.com/dherault/serverless-offline/compare/v3.11.0...v3.12.0)

> 22 March 2017

- Allow setting options in serverless.yml [`#219`](https://github.com/dherault/serverless-offline/pull/219)
- edit travis config to specify node 4.3.2 [`c11ade7`](https://github.com/dherault/serverless-offline/commit/c11ade7ea97cc2cfa835f15bb103db10856be4a5)

#### [v3.11.0](https://github.com/dherault/serverless-offline/compare/v3.10.3...v3.11.0)

> 19 March 2017

- Fix set environment process [`#216`](https://github.com/dherault/serverless-offline/pull/216)
- Add default identitySource when authorizer is an object [`#215`](https://github.com/dherault/serverless-offline/pull/215)
- Fix on body to be equal on Serverless in AWS Lambda [`#214`](https://github.com/dherault/serverless-offline/pull/214)
- Fix on set env from service environment and add support to function environment [`ac5c823`](https://github.com/dherault/serverless-offline/commit/ac5c823a72637936bc19ea7d8f020a609e118c2f)
- lint [`086186d`](https://github.com/dherault/serverless-offline/commit/086186d24d0cc86a9e69ed32b0977c6e3b8e8939)
- update tests with new default itmeout [`13fc0a1`](https://github.com/dherault/serverless-offline/commit/13fc0a11a6045c099576d000992c4512086b47e5)
- add new contributors to package.json [`64729f9`](https://github.com/dherault/serverless-offline/commit/64729f9821d1bcfb7a0ec556f73fb9ee250e600b)
- set default timeout to 30 seconds [`90861a2`](https://github.com/dherault/serverless-offline/commit/90861a26dc0d3c0375b0218fad34326beb26e7f0)

#### [v3.10.3](https://github.com/dherault/serverless-offline/compare/v3.10.2...v3.10.3)

> 13 March 2017

- Fixes #173 - double parsing request.body [`#212`](https://github.com/dherault/serverless-offline/pull/212)
- Merge pull request #212 from em0ney/master [`#173`](https://github.com/dherault/serverless-offline/issues/173)
- Fixes #173 - double parsing request.body [`#173`](https://github.com/dherault/serverless-offline/issues/173)

#### [v3.10.2](https://github.com/dherault/serverless-offline/compare/v3.10.1...v3.10.2)

> 9 March 2017

- Include resourcePath and httpMethod fields in event.requestContext [`#210`](https://github.com/dherault/serverless-offline/pull/210)

#### [v3.10.1](https://github.com/dherault/serverless-offline/compare/v3.10.0...v3.10.1)

> 7 March 2017

- fix process exit [`#206`](https://github.com/dherault/serverless-offline/pull/206)
- lint [`daa25ed`](https://github.com/dherault/serverless-offline/commit/daa25ed5fac51cf1fcddf550ae3ca42e309a0db4)
- Add myself to contributors [`7499259`](https://github.com/dherault/serverless-offline/commit/74992595bcaeffebbde8b5c606587210bdd74c90)

#### [v3.10.0](https://github.com/dherault/serverless-offline/compare/v3.9.1...v3.10.0)

> 6 March 2017

- Add exec option to execute shell commands in server scope [`#203`](https://github.com/dherault/serverless-offline/pull/203)
- Clean up the code a bit, less function fan-out [`bfcaddf`](https://github.com/dherault/serverless-offline/commit/bfcaddfb96b333c95005e3e63b2d19fba26513b1)
- Add exec option to execute commands in server scope [`3ffda8d`](https://github.com/dherault/serverless-offline/commit/3ffda8da927effb6833e758926ad91104e2ebe51)
- Add a lifecycle hook to shut down the server [`e276fae`](https://github.com/dherault/serverless-offline/commit/e276fae532e063acf1f6a08f001804d2212b92b9)
- Update documentation [`7a7138d`](https://github.com/dherault/serverless-offline/commit/7a7138d684571a9f8a559932b85664eec099f92f)
- If the exec command fails, gracefully exits and returns the command's exit code [`8863ee6`](https://github.com/dherault/serverless-offline/commit/8863ee62a456f44f9731cf7518db4361574f2652)
- Keep the server alive when it's running normally [`586bd40`](https://github.com/dherault/serverless-offline/commit/586bd40b04204c65c190d3578379d68a431a49fd)
- remove console.log in tests [`9e8e1fb`](https://github.com/dherault/serverless-offline/commit/9e8e1fb627e010bc62b726a02917533df93698ae)
- Add TOC item [`c6adc32`](https://github.com/dherault/serverless-offline/commit/c6adc32dc6ad2b3f7f500bee77e2c62461d5547e)
- Remove duplicate resolve() invocation [`1ff476b`](https://github.com/dherault/serverless-offline/commit/1ff476b6c25f0f984cba08a3c590fe3943068d60)

#### [v3.9.1](https://github.com/dherault/serverless-offline/compare/v3.9.0...v3.9.1)

> 28 February 2017

- tweaked identitySource regex to support hyphens [`#201`](https://github.com/dherault/serverless-offline/pull/201)

#### [v3.9.0](https://github.com/dherault/serverless-offline/compare/v3.8.3...v3.9.0)

> 22 February 2017

- Updated lambda proxy to support custom content types - including tests. [`#197`](https://github.com/dherault/serverless-offline/pull/197)
- Update README.md [`#193`](https://github.com/dherault/serverless-offline/issues/193)
- drop CoffeeScript support [`09b99c4`](https://github.com/dherault/serverless-offline/commit/09b99c468591b9c2b8f8ef71a13044e8c32985cc)

#### [v3.8.3](https://github.com/dherault/serverless-offline/compare/v3.8.2...v3.8.3)

> 6 January 2017

- Trailing slash [`#186`](https://github.com/dherault/serverless-offline/pull/186)
- Add Travis Config [`#184`](https://github.com/dherault/serverless-offline/pull/184)
- Add unit test [`83acb82`](https://github.com/dherault/serverless-offline/commit/83acb82e10f4b842b2a5fb5efaa27df3d481d046)
- update travis config [`e4e2912`](https://github.com/dherault/serverless-offline/commit/e4e29125c8b2a0e311d3ba7754ef5366566d9e09)
- edit travis config [`445cdbc`](https://github.com/dherault/serverless-offline/commit/445cdbcb5eb597c6dded15a926651f3c4653fc83)
- Add travis ci conf file [`b53e617`](https://github.com/dherault/serverless-offline/commit/b53e617eae144222f089d34dd100e499f8d123d4)
- Fix fullPath slice [`0b83e5e`](https://github.com/dherault/serverless-offline/commit/0b83e5ea6eb6ddeacfe4133d5d49e23282765157)
- add travis badge to README [`01237a6`](https://github.com/dherault/serverless-offline/commit/01237a6763ca76f9abe44bb7278da2468d9f7dda)
- edit travis config [`44a5899`](https://github.com/dherault/serverless-offline/commit/44a5899859d3c46f969ffc1a8d23249287bda762)
- edit travis config [`af0fbfc`](https://github.com/dherault/serverless-offline/commit/af0fbfcf3947582b05bec5a2f5890e7d4a21f5e3)

#### [v3.8.2](https://github.com/dherault/serverless-offline/compare/v3.8.1...v3.8.2)

> 5 January 2017

- remove rest operator [`bbbc644`](https://github.com/dherault/serverless-offline/commit/bbbc644e6672c7aafd1f02c598f0488c0d14ef2e)

#### [v3.8.1](https://github.com/dherault/serverless-offline/compare/v3.8.0...v3.8.1)

> 5 January 2017

- use strict [`aa6bef3`](https://github.com/dherault/serverless-offline/commit/aa6bef3ac8f24444b889840b0d46d0dcb64feadd)
- add "PR welcome" badge on README [`a8965ad`](https://github.com/dherault/serverless-offline/commit/a8965ada8fbfe02dd04eee1e3b6e220435874699)

#### [v3.8.0](https://github.com/dherault/serverless-offline/compare/v3.7.0...v3.8.0)

> 5 January 2017

- Update from dherault master [`#1`](https://github.com/dherault/serverless-offline/pull/1)
- lint [`dc42b1c`](https://github.com/dherault/serverless-offline/commit/dc42b1cad5df82d6ae6c5c1e2cd65000400304a4)
- update deps [`d5dcbaf`](https://github.com/dherault/serverless-offline/commit/d5dcbafcafd06f73a270d1bfb73c023858b7e546)
- Made api token configurable via new --apiKey cli option [`b746aa8`](https://github.com/dherault/serverless-offline/commit/b746aa87e24b3cf2298b10a414de512ff1ab7aeb)
- Amended readme to refelect single token value for all api keys. Also added lint to npm scripts [`e706a86`](https://github.com/dherault/serverless-offline/commit/e706a8666caf34a1f4c6082f271b29971a0efef3)
- update license for 2017 [`a74d3bc`](https://github.com/dherault/serverless-offline/commit/a74d3bc91dc8e08fd8bb9191eca1425be7fee168)
- Fixed gramatical error [`e127e6c`](https://github.com/dherault/serverless-offline/commit/e127e6c681a703d48738bdf620d2cdc14e38f5de)
- Updated doco [`fa7884c`](https://github.com/dherault/serverless-offline/commit/fa7884c6677effc26fc721c75c2e0f87a3c1e2db)

#### [v3.7.0](https://github.com/dherault/serverless-offline/compare/v3.6.0...v3.7.0)

> 29 December 2016

- Added an option to disable the loading of environment variables [`#181`](https://github.com/dherault/serverless-offline/pull/181)
- Added documentation to Readme and modified package.json [`e0b3732`](https://github.com/dherault/serverless-offline/commit/e0b37327a29a49d03326fb9cb7ad812d25a1152f)

#### [v3.6.0](https://github.com/dherault/serverless-offline/compare/v3.5.7...v3.6.0)

> 19 December 2016

- fixes #161: load environment variables from serverless.yml [`#175`](https://github.com/dherault/serverless-offline/pull/175)
- Merge pull request #175 from demetriusnunes/master [`#161`](https://github.com/dherault/serverless-offline/issues/161)
- fixes #161: load environment variables from serverless.yml [`#161`](https://github.com/dherault/serverless-offline/issues/161)

#### [v3.5.7](https://github.com/dherault/serverless-offline/compare/v3.5.5...v3.5.7)

> 6 December 2016

- #162 Add context object values to event.requestContext.authorizer [`#171`](https://github.com/dherault/serverless-offline/pull/171)
- add context to requestContext.authorizer [`19d7a17`](https://github.com/dherault/serverless-offline/commit/19d7a17fbc1ffa712678b2df64c9fba0f1faa439)
- update contributors [`e4d80ac`](https://github.com/dherault/serverless-offline/commit/e4d80ac6eccab0b33e6c6430b71c3a11ed951edc)

#### [v3.5.5](https://github.com/dherault/serverless-offline/compare/v3.5.4...v3.5.5)

> 5 December 2016

- revert to Hapi 14.2.0. See #168 [`686718f`](https://github.com/dherault/serverless-offline/commit/686718fbe8244d608848fef6b7cf7c9e7e65139f)
- update README [`f3d24c4`](https://github.com/dherault/serverless-offline/commit/f3d24c40966d4c9ec10f0d61028777dc04101f80)

#### [v3.5.4](https://github.com/dherault/serverless-offline/compare/v3.5.3...v3.5.4)

> 1 December 2016

- Use endpoint CORS options to override default ones [`#169`](https://github.com/dherault/serverless-offline/pull/169)
- Respect endpoint CORS settings [`246c242`](https://github.com/dherault/serverless-offline/commit/246c242c02024d76f5f42078c022833b8701d562)
- update README [`25174b7`](https://github.com/dherault/serverless-offline/commit/25174b77608737f84a1059c99f32947d16ff2695)

#### [v3.5.3](https://github.com/dherault/serverless-offline/compare/v3.5.2...v3.5.3)

> 1 December 2016

- revert hapi dep to 15.2.0 [`#168`](https://github.com/dherault/serverless-offline/issues/168)

#### [v3.5.2](https://github.com/dherault/serverless-offline/compare/v3.5.1...v3.5.2)

> 30 November 2016

- solve onflict between 404 route and {proxy+} route [`#167`](https://github.com/dherault/serverless-offline/issues/167)
- add {proxy+} example [`b0f1ac9`](https://github.com/dherault/serverless-offline/commit/b0f1ac932e589f3ded682e1a6e0c42b360deb158)
- update deps [`56b60e2`](https://github.com/dherault/serverless-offline/commit/56b60e23393dbb3d6bb28aa4afd9537d66b30a95)

#### [v3.5.1](https://github.com/dherault/serverless-offline/compare/v3.5.0...v3.5.1)

> 30 November 2016

- fix statusCode bug [`9f39d60`](https://github.com/dherault/serverless-offline/commit/9f39d6035cf44638a4fe8c27003bdbc96387fccf)

#### [v3.5.0](https://github.com/dherault/serverless-offline/compare/v3.4.1...v3.5.0)

> 30 November 2016

- Update Content-Length and Content-Type headers based on the request body [`#164`](https://github.com/dherault/serverless-offline/pull/164)
- Allow use of the `ANY` method. [`#166`](https://github.com/dherault/serverless-offline/pull/166)
- Contextualizing tests [`#159`](https://github.com/dherault/serverless-offline/pull/159)
- Contextualizing lambda integration tests [`8f122b8`](https://github.com/dherault/serverless-offline/commit/8f122b86c1cbba500793d3fd77cb8ae285a59d58)
- Remove moved example [`360d7b4`](https://github.com/dherault/serverless-offline/commit/360d7b41e23242248f49d26f4f3e65f869e3d580)
- Add catch-all route support [`d05ef28`](https://github.com/dherault/serverless-offline/commit/d05ef28629c2cbd38a7bc3edf5ccaf21f77ea9b7)
- Sets the Content-Length header to the JSON stringified length and sets the Content-Type to application/json [`678fd56`](https://github.com/dherault/serverless-offline/commit/678fd561f23d8ca6e623693ed2809e145dccd7b3)
- update README [`3c9db81`](https://github.com/dherault/serverless-offline/commit/3c9db81f6130b747da698f35c203c94828663986)
- Prevent stacktrace to be presented in npm test when SLS_DEBUG is off [`a20ecc3`](https://github.com/dherault/serverless-offline/commit/a20ecc381e87e6d2f175ca1d0d0e0e8b0aa2735f)

#### [v3.4.1](https://github.com/dherault/serverless-offline/compare/v3.4.0...v3.4.1)

> 21 November 2016

- Fix path to authorization handlers [`3982b09`](https://github.com/dherault/serverless-offline/commit/3982b09e9992ff438561f9db50316ce2180298a3)

#### [v3.4.0](https://github.com/dherault/serverless-offline/compare/v3.3.3...v3.4.0)

> 21 November 2016

- Adding the ability to configure the root location of the handler files [`45307b0`](https://github.com/dherault/serverless-offline/commit/45307b03120c13f5d15e952180115cf6637baa13)
- Add dsole as contributor to package.json [`c22e601`](https://github.com/dherault/serverless-offline/commit/c22e6019d20853f2d3f32572ea8f09d6c29756a2)

#### [v3.3.3](https://github.com/dherault/serverless-offline/compare/v3.3.2...v3.3.3)

> 20 November 2016

- Do it the easy way [`82a6141`](https://github.com/dherault/serverless-offline/commit/82a61414d722078c97d887f99275a5b7d118c67b)
- Attempt at proper CORS support [`a598a2e`](https://github.com/dherault/serverless-offline/commit/a598a2e578bb2b4a2ffc31a4a6b8c56212730d30)
- Remove commented code [`38c03ff`](https://github.com/dherault/serverless-offline/commit/38c03ffd663e2ae33304e33939921e12b83549f5)
- Not quite as simple as I thought [`ea108d6`](https://github.com/dherault/serverless-offline/commit/ea108d6d3adf624548067de23feea78c2d1815b4)
- Fix typos [`afc198d`](https://github.com/dherault/serverless-offline/commit/afc198db864bd5b3efae4bb1a4598dc8fcf62fa6)
- Add my name to contributors [`9ad77f2`](https://github.com/dherault/serverless-offline/commit/9ad77f2ad2f25f200cec9e6fecdc6d56c51fe35c)

#### [v3.3.2](https://github.com/dherault/serverless-offline/compare/v3.3.1...v3.3.2)

> 14 November 2016

- Fix headers for lambda-proxy context [`#149`](https://github.com/dherault/serverless-offline/pull/149)
- Fix event authorizer property path in lambda-proxy context [`#148`](https://github.com/dherault/serverless-offline/pull/148)
- update contributors [`f72be1f`](https://github.com/dherault/serverless-offline/commit/f72be1f7d158401d664701bc3f657486c448bbfb)
- Update authorizer property path in lambda-proxy context [`1dfcd10`](https://github.com/dherault/serverless-offline/commit/1dfcd10a5d73bebd17f33fb6e88ffed88f5bb3b4)
- Fix `resource` and `path` simulation for lambda-proxy contexts [`e22507b`](https://github.com/dherault/serverless-offline/commit/e22507b4ac639ec5f6b722227487e5ebced526bd)
- Add a test for correct authorizer property path [`02f7fbb`](https://github.com/dherault/serverless-offline/commit/02f7fbb0fdf0a7209120ee9d266ea79541c36ed0)

#### [v3.3.1](https://github.com/dherault/serverless-offline/compare/v3.3.0...v3.3.1)

> 7 November 2016

- Update authorizer options [`#147`](https://github.com/dherault/serverless-offline/pull/147)
- update docs [`1b0dc30`](https://github.com/dherault/serverless-offline/commit/1b0dc305a834b51cb5f30abb930551818f19dd7a)
- add miltador to contributors list [`d3ff8c6`](https://github.com/dherault/serverless-offline/commit/d3ff8c65194025aee8a3ac8060942c66c2fdcfe3)

#### [v3.3.0](https://github.com/dherault/serverless-offline/compare/v3.2.1...v3.3.0)

> 3 November 2016

- Parsing [XXX] in error messages, to match serverless 1.0 [`#133`](https://github.com/dherault/serverless-offline/pull/133)
- Simple Token Authentication [`#138`](https://github.com/dherault/serverless-offline/pull/138)
- Add ApiKeys Integration Tests [`4e7ffea`](https://github.com/dherault/serverless-offline/commit/4e7ffea4bc123e1eb365980fb408bb4dfd8d5f09)
- Merged with lambda-proxy and unit tests, added some tests to this [`cfe6c3f`](https://github.com/dherault/serverless-offline/commit/cfe6c3fcbcf503942cb3b95ce44322b3bab45056)
- Add APIKey simple authentication [`df25faa`](https://github.com/dherault/serverless-offline/commit/df25faa5c4e885e49a4acf9e4f63340b12a95d20)
- Change ApiKey generation [`a9926e6`](https://github.com/dherault/serverless-offline/commit/a9926e636cd5b54c8cfe9eb93d9d68fd46acbd12)
- Apply Eslint rules and fix styles [`be5bde8`](https://github.com/dherault/serverless-offline/commit/be5bde87957259fdb170e3a54c60f665469d0d27)
- Fix based on comments [`3a9b545`](https://github.com/dherault/serverless-offline/commit/3a9b54586007b3c4f0990c8d51971d1c9d767d12)
- Add function to test api keys [`d0a01f9`](https://github.com/dherault/serverless-offline/commit/d0a01f9a2b9b75c841865ee2c8c380a4215e647a)
- lint [`5c115d7`](https://github.com/dherault/serverless-offline/commit/5c115d7b37eaef288b1c606b7ac0d32491466837)
- Parsing [STATUS] in error messages, to match serverless 1.0 [`8ea618d`](https://github.com/dherault/serverless-offline/commit/8ea618d398cad7e64c9c8f6cd6d64cab81c2e11c)
- Change private function tests [`fdf4d71`](https://github.com/dherault/serverless-offline/commit/fdf4d71c815f0607562939526ad8e3a4871756f5)
- update maintainers [`87e54bb`](https://github.com/dherault/serverless-offline/commit/87e54bba28e028f55c0200d27a077e3811f87d09)
- Add APIKey documentation [`f4c37f3`](https://github.com/dherault/serverless-offline/commit/f4c37f3bf7afa1ad72709e7ba7ae4095dc10a559)
- Fix typo in documentation [`4c02232`](https://github.com/dherault/serverless-offline/commit/4c02232cac33628fff3c56d8dad04ab535467206)
- Fix typo on index.js [`913d084`](https://github.com/dherault/serverless-offline/commit/913d0849a4ee64f8d65ab387f082f08261208b86)

#### [v3.2.1](https://github.com/dherault/serverless-offline/compare/v3.2.0...v3.2.1)

> 30 October 2016

- Fix bug on lambda integration reponse template handling, add test for stageVariables [`419e059`](https://github.com/dherault/serverless-offline/commit/419e05909a33c799fa9f663970730727c5da3b2d)

#### [v3.2.0](https://github.com/dherault/serverless-offline/compare/v3.1.0...v3.2.0)

> 30 October 2016

- Add a OffLineBuilder to shorten test code. Add done callback for inje… [`#7`](https://github.com/dherault/serverless-offline/pull/7)
- Remove JSON.parse from lambda-proxy response management [`#8`](https://github.com/dherault/serverless-offline/pull/8)
- Lambda proxy event [`#6`](https://github.com/dherault/serverless-offline/pull/6)
- Manual event fixed [`#5`](https://github.com/dherault/serverless-offline/pull/5)
- Revert "Lambda Proxy integration" [`#128`](https://github.com/dherault/serverless-offline/pull/128)
- linting and beautifying [`84642b6`](https://github.com/dherault/serverless-offline/commit/84642b60a475e028b396e1e9dc060638efeafe0c)
- Revert "Revert "Merge pull request #117 from leonardoalifraco/lambda-proxy-event"" [`15a9140`](https://github.com/dherault/serverless-offline/commit/15a9140f793969857a436705a0cf85c7463d94bc)
- Add a OffLineBuilder to shorten test code. Add done callback for inject call back in mocha test. [`5445f2f`](https://github.com/dherault/serverless-offline/commit/5445f2f93e601467148785bda2b605103d74d605)
- Added initial integration tests [`bd9628c`](https://github.com/dherault/serverless-offline/commit/bd9628c9b4c5ee220731607bfee2a668808e29e2)
- Added unit tests infrastructure and a few tests [`8429423`](https://github.com/dherault/serverless-offline/commit/842942330735dcf82d21fd4b1bb9e69146e15be9)
- update tests [`7f0723b`](https://github.com/dherault/serverless-offline/commit/7f0723b8007b36a2615c6d64d8ac6fa417edad01)
- lint [`d5388ab`](https://github.com/dherault/serverless-offline/commit/d5388ab491f3525f121acbff6284dc3690bff8af)
- Add tests for functionHelper#getFunctionOptions [`2e7318b`](https://github.com/dherault/serverless-offline/commit/2e7318b23075fe5b7e7214453f8b7441e1871caf)
- Added context to the available integration tests [`fa48b7b`](https://github.com/dherault/serverless-offline/commit/fa48b7b3d568c6a7f28cd49847a9f090006a6f7f)
- Stubbed printBlankLine [`94c027f`](https://github.com/dherault/serverless-offline/commit/94c027fe6990fc4774b2a027e37736eabb17d3a4)
- Added test for utils.nullIfEmpty [`fc4ac02`](https://github.com/dherault/serverless-offline/commit/fc4ac0205129354546d75fe50b2a649c4899156a)
- Test payload and fixed attributes [`e65d4fc`](https://github.com/dherault/serverless-offline/commit/e65d4fc16143e6ef44fb4faefbce0292df970e32)
- Add tests for createLambdaProxyContext with headers [`b877a2f`](https://github.com/dherault/serverless-offline/commit/b877a2f3bf9ef287b57951c48c1a6a489ff85cdd)
- Add test for utils.toPlainOrEmptyObject [`68fd044`](https://github.com/dherault/serverless-offline/commit/68fd044f939b0a0b493684b4151216482abda7c4)
- Add example for lambda integration type in manual test [`eb19a17`](https://github.com/dherault/serverless-offline/commit/eb19a1773f9206e8c211f2772317cb8db7187397)
- edit README [`1991d24`](https://github.com/dherault/serverless-offline/commit/1991d244eaa9606cd2febc4e8ad49c8015ec1171)
- eslint tests [`ed90bb3`](https://github.com/dherault/serverless-offline/commit/ed90bb32a378c23cb8b8c0b07f5e7892759cc2e3)
- Refactor after pull request comments [`e1a1d25`](https://github.com/dherault/serverless-offline/commit/e1a1d257f493c1764d7e43f7a0ed6cd5929b93dc)
- lint [`bb99bac`](https://github.com/dherault/serverless-offline/commit/bb99baccd5ee104115b027fb74e2e9e45e315dba)
- Change describe for context in tests [`0e24140`](https://github.com/dherault/serverless-offline/commit/0e24140d96be2041e403eacebfbcc2aa944afe00)
- Fixed handler and mapping in manual test [`7fd2e4b`](https://github.com/dherault/serverless-offline/commit/7fd2e4b08fa4fb7ee83d468b8e53692c83c0133d)
- Rename tests folder [`d7df730`](https://github.com/dherault/serverless-offline/commit/d7df730407f2c1b45ab35f04e67863532c79ae32)
- eslint src/index.js [`86fb1fd`](https://github.com/dherault/serverless-offline/commit/86fb1fd3eb17aa0062e0f73c9f632ad139b43d32)
- lint [`532ff15`](https://github.com/dherault/serverless-offline/commit/532ff1510771aad05c01d80a384c2327753641f5)
- Updated manual test handler [`f411dee`](https://github.com/dherault/serverless-offline/commit/f411dee6adc57a3c326ceba243f5764aa6e6b3bb)
- Unskipped html integration test [`a6f625c`](https://github.com/dherault/serverless-offline/commit/a6f625c5c6a8eea467f5e91ae6aee5e80101e1a0)
- Ignored .serverless folder in manual test [`b45c755`](https://github.com/dherault/serverless-offline/commit/b45c75561f84c576e74da2fee01d1decd644d55a)
- lint [`18616ba`](https://github.com/dherault/serverless-offline/commit/18616ba232c153c578fafabb12a0f3a02b95ae01)
- Renamed tests/utils to tests/support [`f41a5dc`](https://github.com/dherault/serverless-offline/commit/f41a5dc925191cc2b7d456c764fadd007c05e6bb)
- Added mocha to eslintrc [`e111c4c`](https://github.com/dherault/serverless-offline/commit/e111c4cb92fbc2660efaecdfa38d78fdde203717)
- document --dontPrintOutput [`4ac0cec`](https://github.com/dherault/serverless-offline/commit/4ac0cec7c2c4adbab87c3c33ef1f5195b76cba32)

#### [v3.1.0](https://github.com/dherault/serverless-offline/compare/v3.0.0...v3.1.0)

> 23 October 2016

- Lambda Proxy integration [`#117`](https://github.com/dherault/serverless-offline/pull/117)
- Handle Simple http setup, ex. - http: GET users/index [`#127`](https://github.com/dherault/serverless-offline/pull/127)
- Lambda-proxy fixes [`#4`](https://github.com/dherault/serverless-offline/pull/4)
- Explained integration types in the docs [`#3`](https://github.com/dherault/serverless-offline/pull/3)
- Update lambda proxy event [`#2`](https://github.com/dherault/serverless-offline/pull/2)
- Fix default custom authorizer identitySource to match serverless framework [`#125`](https://github.com/dherault/serverless-offline/pull/125)
- Fix alternative content-type, bug when deploying in production, conte… [`#123`](https://github.com/dherault/serverless-offline/pull/123)
- Support for lambda-proxy integration. [`#1`](https://github.com/dherault/serverless-offline/pull/1)
- remove next_version [`0ea84d8`](https://github.com/dherault/serverless-offline/commit/0ea84d8c25d35e5449f1e2280e6749a4391300a1)
- Revert "Merge pull request #117 from leonardoalifraco/lambda-proxy-event" [`7c981b0`](https://github.com/dherault/serverless-offline/commit/7c981b0a79e75f79dc8c242f767a0a999c054126)
- added lambda-proxy integration. [`b388310`](https://github.com/dherault/serverless-offline/commit/b3883102aaac67d5bb6be25a11a125a81602e7f4)
- Updated docs [`1c16ceb`](https://github.com/dherault/serverless-offline/commit/1c16ceb7a8be484fa6857cbd95c3c22a9d993da6)
- Handling response [`4f8ec4b`](https://github.com/dherault/serverless-offline/commit/4f8ec4b990fbf0f525da3db5c0d22dafe4eabbdd)
- lint [`3e8dd46`](https://github.com/dherault/serverless-offline/commit/3e8dd460231716339575106164aa454e8ec7e01a)
- lint index.js [`7e4f590`](https://github.com/dherault/serverless-offline/commit/7e4f590e9009a0162e2b297d04a8b3bf21d6b5c7)
- mimick #124 [`63fd52a`](https://github.com/dherault/serverless-offline/commit/63fd52a23aa559628fdbd2960215d2dda23f8452)
- lint [`7ae169c`](https://github.com/dherault/serverless-offline/commit/7ae169c893827fc54f71bc20e02c157638857cb6)
- Checked endpoint integration and dispatching lambda proxy event if corresponds [`3e4ebc6`](https://github.com/dherault/serverless-offline/commit/3e4ebc65a166bbb8de3cb43f04dec77b6da48b65)
- lint [`c6209fd`](https://github.com/dherault/serverless-offline/commit/c6209fd55df8f5d4d411171dc1c065ba03d21a16)
- Updated README.md [`39433fd`](https://github.com/dherault/serverless-offline/commit/39433fd82ba61d63267eaeddbe761799dac404d4)
- Lambda-proxy fixes: [`5ab4f6f`](https://github.com/dherault/serverless-offline/commit/5ab4f6f8d5bdfb1bccf234f8e6b3da654938863a)
- Fix alternative content-type, bug when deploying in production, content-type should be declarder as "'text/html'" [`fdd74b8`](https://github.com/dherault/serverless-offline/commit/fdd74b81cf5e7fc8356006d58dcdfdbeb1ad7e6f)
- remove deprecated file [`2e10144`](https://github.com/dherault/serverless-offline/commit/2e10144a98c493f89af9cdb44edc3086310c2e3d)
- lint [`2c93e4f`](https://github.com/dherault/serverless-offline/commit/2c93e4f193fa6af32f701a4e1d43ebf95dbdf5f9)
- only set the request / response templates if http endpoint integration is set to lambda. [`ae30e8d`](https://github.com/dherault/serverless-offline/commit/ae30e8d6a4becf6fab2da13fcf7642ea6da96e4b)
- dontPrintOutput option [`cbad9a8`](https://github.com/dherault/serverless-offline/commit/cbad9a8dff4de01fd78ee9d77c9d24812bdf3b8c)
- added auth header to lambdaProxyContext. [`a23dd23`](https://github.com/dherault/serverless-offline/commit/a23dd2338aa09bac375cc1cf4b0b6855366c0798)
- fix package.json [`650ffbf`](https://github.com/dherault/serverless-offline/commit/650ffbf282b7dea1aed79f3a279a66bb885aa35c)
- Object.assign instead of \_.assign [`8c32373`](https://github.com/dherault/serverless-offline/commit/8c32373afa80b74163464d14fc5b7bfed73d4396)
- fix typo [`8bdcd41`](https://github.com/dherault/serverless-offline/commit/8bdcd412cdd57ab08b7f71d7fb890b933dac6760)
- Typo: application-json -&gt; application/json [`b8b3747`](https://github.com/dherault/serverless-offline/commit/b8b3747aefa80106f05a43f7fdbe82f9da56e3e9)
- Fix default custom authorizer identitySource to match serverless framework default [`76162cb`](https://github.com/dherault/serverless-offline/commit/76162cbc3d2492d5f0dc66b34a6ed8832bbf7aeb)
- Applying JSON.stringify to lambda proxy event body [`7a0fdb4`](https://github.com/dherault/serverless-offline/commit/7a0fdb48a794a65b32466ba9fe6658820cc40647)
- used already defined variable as requested. [`c584ddb`](https://github.com/dherault/serverless-offline/commit/c584ddb31128d94faeb644f438e63ea63d9e7922)
- return json.payload as is. [`ada8b41`](https://github.com/dherault/serverless-offline/commit/ada8b41609e52060893501f439d0e4b54139c685)
- only extract requestTemplate if a lambda integration is set. [`042d86b`](https://github.com/dherault/serverless-offline/commit/042d86bf6df0553590ebfa47270113b87964b8e1)
- added .idea to gitignore to ignore webstorm project settings. [`2fc39f8`](https://github.com/dherault/serverless-offline/commit/2fc39f88a6d08162f86b09ad182a9878390bfe55)
- Update README.md [`dbdb8f4`](https://github.com/dherault/serverless-offline/commit/dbdb8f4c2bcb36f614f8193c94a0a5c05a488f94)

### [v3.0.0](https://github.com/dherault/serverless-offline/compare/v2.8.4...v3.0.0)

> 18 October 2016

- update README.md [`#120`](https://github.com/dherault/serverless-offline/pull/120)
- Refactor to fix undefined custom properties [`#114`](https://github.com/dherault/serverless-offline/pull/114)
- Hacking http reponse template and Content-Type support from serverles… [`#109`](https://github.com/dherault/serverless-offline/pull/109)
- Support stage variables from serverless-plugin-stage-variables [`#113`](https://github.com/dherault/serverless-offline/pull/113)
- No user agent [`#112`](https://github.com/dherault/serverless-offline/pull/112)
- Handle undefined this.httpData.request [`#107`](https://github.com/dherault/serverless-offline/pull/107)
- doc: improve installation instructions [`#100`](https://github.com/dherault/serverless-offline/pull/100)
- Version 1.0 changes [`#1`](https://github.com/dherault/serverless-offline/pull/1)
- fix #121 [`#121`](https://github.com/dherault/serverless-offline/issues/121)
- Fix #77 [`#77`](https://github.com/dherault/serverless-offline/issues/77)
- fix #95 stage vars were removed in RC1 [`#95`](https://github.com/dherault/serverless-offline/issues/95)
- WIP v1.x compatibility [`3e6a5d7`](https://github.com/dherault/serverless-offline/commit/3e6a5d79d554c77ff50e16088a041a27e0295c1d)
- serverless 1.0 adjustment to offline plugin [`668e2b6`](https://github.com/dherault/serverless-offline/commit/668e2b6e206ef9dc3013c1c0a5d775b0269e2e26)
- add manual_test directory [`60f5392`](https://github.com/dherault/serverless-offline/commit/60f539257d1a7230447438a8e57612f2294bf9ad)
- update package.json [`042d6c4`](https://github.com/dherault/serverless-offline/commit/042d6c4b73dc6a0d23d376a7f9b0eb30486c9ce3)
- Write docs [`e979fa1`](https://github.com/dherault/serverless-offline/commit/e979fa1982dedee76345166ed790c8994b0dc481)
- add support for authorizer functions [`ecefd5d`](https://github.com/dherault/serverless-offline/commit/ecefd5d57a5d9fac155f573457fa3f2e6f825fd9)
- Adjust documentation for 1.0 [`707c24d`](https://github.com/dherault/serverless-offline/commit/707c24d6a3a48924dde82013d11f6abdc63424c2)
- write docs [`7cdc45a`](https://github.com/dherault/serverless-offline/commit/7cdc45a80517186114875096432e4c840746bab7)
- ignore idea files [`7388d1b`](https://github.com/dherault/serverless-offline/commit/7388d1bace246ceeeb78a98cae112d8246a4c106)
- update TODO [`83eb636`](https://github.com/dherault/serverless-offline/commit/83eb63602ec938ce4f80858cae6c0972e274dc68)
- lint index.js [`029e8ec`](https://github.com/dherault/serverless-offline/commit/029e8ec1d123fc24badb9fb4374262f99cecaab9)
- refactor code [`6eeebef`](https://github.com/dherault/serverless-offline/commit/6eeebef7153392f714e018052f6a76c8b80bab48)
- update deps [`db2223c`](https://github.com/dherault/serverless-offline/commit/db2223c210298fa5b78f60c63f6b2b4c1a6e4dea)
- default as serverless core [`b41f7e5`](https://github.com/dherault/serverless-offline/commit/b41f7e55301bad3f60a21704739d277aff5db59c)
- remove \_mergeEnvVars [`661731e`](https://github.com/dherault/serverless-offline/commit/661731e69c8de3f6572469d92644c64ee93232a2)
- merge master [`8e9b0e4`](https://github.com/dherault/serverless-offline/commit/8e9b0e4739ccb84b2f3e64bf6c116c3b8010fdc9)
- use printBlankLine helper [`6af1525`](https://github.com/dherault/serverless-offline/commit/6af15252a883e0a440d082ec3d180424868d0566)
- Hacking http reponse template and Content-Type support from serverless.yml file [`4ccd6d3`](https://github.com/dherault/serverless-offline/commit/4ccd6d3104df5ae9def97cd14d1b99e2ad933fc3)
- minor refactor [`74f01ea`](https://github.com/dherault/serverless-offline/commit/74f01ea7f6b7357d1ebd2aef9dcd1ca9ee5828eb)
- Fix to support default configuration (no response configuration) [`5398512`](https://github.com/dherault/serverless-offline/commit/5398512cd452c04a513ccf5a40d1bb931eca9529)
- get function handler path correctly [`dd723be`](https://github.com/dherault/serverless-offline/commit/dd723be60a04324952b8fe12329d629d3f653b81)
- Add --host flag to set IP address other than localhost to hapi [`3a2658b`](https://github.com/dherault/serverless-offline/commit/3a2658b40332599b7f5b55dd325e1f8edd53fc67)
- fix babel integration [`4db6b7c`](https://github.com/dherault/serverless-offline/commit/4db6b7c635d7c686055ff214e9ca32e70ca9653a)
- minor refactor [`fa4e801`](https://github.com/dherault/serverless-offline/commit/fa4e801844894884b32ae939255ed9a48f710ec9)
- default to empty file to fix issues #90 [`e70c9d6`](https://github.com/dherault/serverless-offline/commit/e70c9d6a0ba5abab9b776c3f710bc54e2ece75db)
- default to empty file to fix issues #90 [`d238ca3`](https://github.com/dherault/serverless-offline/commit/d238ca379d519145a7406659f445122eac9e379e)
- readme tweaks [`c918459`](https://github.com/dherault/serverless-offline/commit/c918459029ed4091d3bd54adbf6a291b57007d21)
- clarify that manual step is needed until release [`5cae9ff`](https://github.com/dherault/serverless-offline/commit/5cae9ff9ed612e6de9e45f3c198dd425526403e1)
- isPlainObject refactor for node 6 and lint [`3a80571`](https://github.com/dherault/serverless-offline/commit/3a80571eaf067e7e6bc8f23c23dfc5c10c0ecfe4)
- fix for #106 templates from serverless [`eecf445`](https://github.com/dherault/serverless-offline/commit/eecf445a41303728682ee4fd26ac992bb6a7b516)
- more install instructions changes [`d3d95e2`](https://github.com/dherault/serverless-offline/commit/d3d95e2e04f600cb3c156d9b7bbd1d0411d8467d)
- update .eslintrc [`fad4107`](https://github.com/dherault/serverless-offline/commit/fad410798e8fc5fc28e151e957bcb16ea189d117)
- JSON parse payload issue #99 and issue #96 [`9643e02`](https://github.com/dherault/serverless-offline/commit/9643e02acec4f1c82f1964717edcc5848b5ef413)
- updated lodash dependency [`7e46f8c`](https://github.com/dherault/serverless-offline/commit/7e46f8cbd3c50ff3c34586b711ef540ceb52d112)
- parse JSON request payload [`10cec23`](https://github.com/dherault/serverless-offline/commit/10cec23e3502a6d82ef49e61acd925d7bc5536a2)
- created new v1 branch [`d985238`](https://github.com/dherault/serverless-offline/commit/d985238287f78926b87a89a0b82a130482f71961)
- needed space [`5db9cc9`](https://github.com/dherault/serverless-offline/commit/5db9cc9a86155d221ad4ec663c0c6416ea7f3cd6)
- update README [`4c8e32c`](https://github.com/dherault/serverless-offline/commit/4c8e32c378aeb9c00301e9e180ebef8f3f7ffc40)
- update comments [`18f7d7f`](https://github.com/dherault/serverless-offline/commit/18f7d7fc5d327ea95fdaaafe88594c0ee62192c6)
- Update README.md [`c664cc5`](https://github.com/dherault/serverless-offline/commit/c664cc585af5d243ab6a7c9365ef78bef0db6e26)
- Fix no user-agent header when testing with command line http client [`99ff60c`](https://github.com/dherault/serverless-offline/commit/99ff60c056709b049c260c649460dbe2a98e3150)
- corrected repo reference [`124b97f`](https://github.com/dherault/serverless-offline/commit/124b97f9a61f905889864be1c4f2e61a6851424a)
- Fix for issue #90 as reported by @5inline [`dd3a7bb`](https://github.com/dherault/serverless-offline/commit/dd3a7bb16058dd4e5668e78106569c96f7c2f70b)
- Oops, remove angry console log [`d5d9bc0`](https://github.com/dherault/serverless-offline/commit/d5d9bc01ff47dfa219197a3a94c655520229c7bd)
- add reference back to main project [`c0d8658`](https://github.com/dherault/serverless-offline/commit/c0d8658b82630e7fa1b4745dc46d1c4d771c917b)
- initial merge of 1.0 before cleanup [`73c6ef9`](https://github.com/dherault/serverless-offline/commit/73c6ef97a90c61d9498e732287814b28144c203f)

#### [v2.8.4](https://github.com/dherault/serverless-offline/compare/v2.8.3...v2.8.4)

> 12 September 2016

- Custom Authorization function is initialized with endpoint env-variables [`#98`](https://github.com/dherault/serverless-offline/pull/98)
- Custom Authorization function is initialized with the environmental variables of endpoint function issue fix [`41883e5`](https://github.com/dherault/serverless-offline/commit/41883e5e9c5067a8a35130be727116d422155a9a)

#### [v2.8.3](https://github.com/dherault/serverless-offline/compare/v2.8.1...v2.8.3)

> 23 August 2016

- add reference to plug-in serverless 1.0 branch [`c6ceff5`](https://github.com/dherault/serverless-offline/commit/c6ceff5493150f52fdf83fe5e1a20add62375d0d)

#### [v2.8.1](https://github.com/dherault/serverless-offline/compare/v2.8.0...v2.8.1)

> 16 August 2016

- updated contributors [`e6eb595`](https://github.com/dherault/serverless-offline/commit/e6eb5959e95a39f6a98359fd87dd8544e581b67a)

#### [v2.8.0](https://github.com/dherault/serverless-offline/compare/v2.7.1...v2.8.0)

> 11 August 2016

- Add --host flag to set IP address other than localhost to hapi [`#80`](https://github.com/dherault/serverless-offline/pull/80)
- fix package.json [`#79`](https://github.com/dherault/serverless-offline/pull/79)
- updated README [`7650bcc`](https://github.com/dherault/serverless-offline/commit/7650bcc6edd46ef945f91532cc415dc98c8b031e)

#### [v2.7.1](https://github.com/dherault/serverless-offline/compare/v2.6.2...v2.7.1)

> 30 July 2016

- Also parse a derivative of application/json [`#75`](https://github.com/dherault/serverless-offline/pull/75)
- Expose HAPI's inject function [`#74`](https://github.com/dherault/serverless-offline/pull/74)
- expose hapi inject functionality [`1e88ded`](https://github.com/dherault/serverless-offline/commit/1e88ded4c3ba98097d7ac6355a6b8681561e16d0)
- Also parse application/vnd.api+json [`7f5a6c4`](https://github.com/dherault/serverless-offline/commit/7f5a6c46055998b0d68a4870751d04c6adbf3b80)
- force statusCode to be integer [`9069044`](https://github.com/dherault/serverless-offline/commit/9069044d376167f8360e7963d88e3951d004f3ba)

#### [v2.6.2](https://github.com/dherault/serverless-offline/compare/v2.5.3...v2.6.2)

> 25 July 2016

- Only parse JSON payload [`#73`](https://github.com/dherault/serverless-offline/pull/73)
- Pass json if provided when given empty velocity template [`#66`](https://github.com/dherault/serverless-offline/pull/66)
- -m v2.6.2 [`6c4dca6`](https://github.com/dherault/serverless-offline/commit/6c4dca60738241e809929864d51a84c35ff6d4f1)
- Handle requests without payload or mapping template [`b285d89`](https://github.com/dherault/serverless-offline/commit/b285d892490a2ce246863439ab0b5abccc9bfb1a)

#### [v2.5.3](https://github.com/dherault/serverless-offline/compare/v2.5.1...v2.5.3)

> 15 June 2016

- set principalId on contexts [`#61`](https://github.com/dherault/serverless-offline/pull/61)
- Fixes for #41. Set env variables before calling authorization handler. [`#59`](https://github.com/dherault/serverless-offline/pull/59)
- Typo fix [`#56`](https://github.com/dherault/serverless-offline/pull/56)

#### [v2.5.1](https://github.com/dherault/serverless-offline/compare/v2.5.0...v2.5.1)

> 1 June 2016

- Fixes for #41 [`#51`](https://github.com/dherault/serverless-offline/pull/51)
- Fixed #49, make sure that we wait for handler to call context.done or callback in babel runtime [`#49`](https://github.com/dherault/serverless-offline/issues/49)
- merged PR [`47459bf`](https://github.com/dherault/serverless-offline/commit/47459bf6aca3ae5eaf9fc724a3f2375bce3d58f9)
- lint [`82b082c`](https://github.com/dherault/serverless-offline/commit/82b082cf3a103600beb811121e2b19c8dcc1f0fe)
- Merge with dherault/master [`d1f0a47`](https://github.com/dherault/serverless-offline/commit/d1f0a47a5d3ae15da2e989e276d62513778b0467)
- lint [`bb5ee5c`](https://github.com/dherault/serverless-offline/commit/bb5ee5cf649070f41071376612fee1c34e7eb9dc)
- Support promises in auth function, different auth headers, and pass whole header to event object [`297a26f`](https://github.com/dherault/serverless-offline/commit/297a26f4a9658bea9ae7e9125d172feab794377a)

#### [v2.5.0](https://github.com/dherault/serverless-offline/compare/v2.4.0...v2.5.0)

> 23 May 2016

- WIP - Authorization Function Support [`#47`](https://github.com/dherault/serverless-offline/pull/47)
- Update AWS Lambda versions [`#48`](https://github.com/dherault/serverless-offline/pull/48)
- Added Java-like String functions for better VTL compatibility [`#46`](https://github.com/dherault/serverless-offline/pull/46)
- v2.5 [`24288bf`](https://github.com/dherault/serverless-offline/commit/24288bfc3b9eb98cd70910b78d35f18ea6d8f31b)
- Merge with dherault/master [`5713941`](https://github.com/dherault/serverless-offline/commit/5713941080b96e1bed0ce5993edbd2192a93a331)
- Configure HAPI strategies and schemes for auth endpoints [`23d8476`](https://github.com/dherault/serverless-offline/commit/23d8476b25c420a958b0224ee7c4d16ea6693af8)
- Create one scheme per endpoint, process results of auth function [`70c94d4`](https://github.com/dherault/serverless-offline/commit/70c94d47ada95038a765eed963a6b8e9ef16d1e7)
- Comment code, remove lodash filter and return 403 not 401 as per API Gateway docs [`85076d3`](https://github.com/dherault/serverless-offline/commit/85076d3482427fd0272198f2adf743d6fc863fe0)
- Update Readme with information about security simulation [`d8faafa`](https://github.com/dherault/serverless-offline/commit/d8faafab4d0367c870fefbe6732ed7bef9554559)
- Add error message when principalId not included in response [`b6bcbc0`](https://github.com/dherault/serverless-offline/commit/b6bcbc0df53642cf927ce8962b0034bd97e650c3)
- Remove un-used reference to Boom [`611138c`](https://github.com/dherault/serverless-offline/commit/611138c296292b42fab69a9556ece63698feb31a)
- Merge with dherault/master [`2d2416a`](https://github.com/dherault/serverless-offline/commit/2d2416af04bf77a60b132a3a0db61d42ba0f671d)

#### [v2.4.0](https://github.com/dherault/serverless-offline/compare/v2.3.2...v2.4.0)

> 11 May 2016

- Added CORS options as CLI parameters [`#40`](https://github.com/dherault/serverless-offline/pull/40)
- Added support for parseJson in $util object [`#43`](https://github.com/dherault/serverless-offline/pull/43)
- linting [`26daeb7`](https://github.com/dherault/serverless-offline/commit/26daeb7cd68176db9b751c5325abf0fd59687978)
- lint [`897c051`](https://github.com/dherault/serverless-offline/commit/897c0517308a00c71f2644b0a59947497f6dc1dd)
- Added CORS configuration options to CLI [`05e53bf`](https://github.com/dherault/serverless-offline/commit/05e53bf6f1403543f65a344f5e158770f4a1cd0c)
- Added corsDisallowCredentials CLI argument [`3f50335`](https://github.com/dherault/serverless-offline/commit/3f503351b2128e2066842cc0ff3cb39a5c5a7ade)
- Added .editorconfig [`de99c36`](https://github.com/dherault/serverless-offline/commit/de99c3616bc2de520fd9428c40eb3e4a2c724058)
- Added support for $util object [`d110617`](https://github.com/dherault/serverless-offline/commit/d1106175acdfbb04476f3b900009f718be6ed240)

#### [v2.3.2](https://github.com/dherault/serverless-offline/compare/v2.3.1...v2.3.2)

> 27 April 2016

#### [v2.3.1](https://github.com/dherault/serverless-offline/compare/v2.3...v2.3.1)

> 25 April 2016

#### [v2.3](https://github.com/dherault/serverless-offline/compare/v2.2.10...v2.3)

> 22 April 2016

- laying ground for v2.3 [`ddb03bc`](https://github.com/dherault/serverless-offline/commit/ddb03bc5066fce171740100ad256a68c0c025a8f)
- some progress with 2.3 [`7548839`](https://github.com/dherault/serverless-offline/commit/7548839af258545c4f8806526b667241c25a5d50)
- breaking everything [`82e92f7`](https://github.com/dherault/serverless-offline/commit/82e92f7f78be561763cfed43d7e9eddcc0540a5c)
- v2.3 [`d2a0270`](https://github.com/dherault/serverless-offline/commit/d2a0270d0c8ad8a4119348034398a72e91f44084)
- better stacktraces [`e223fe7`](https://github.com/dherault/serverless-offline/commit/e223fe793eb877db37b4b25674b1404c75e9f69f)

#### [v2.2.10](https://github.com/dherault/serverless-offline/compare/v2.2.9...v2.2.10)

> 11 April 2016

#### [v2.2.9](https://github.com/dherault/serverless-offline/compare/v2.2.8...v2.2.9)

> 8 April 2016

#### [v2.2.8](https://github.com/dherault/serverless-offline/compare/v2.2.7...v2.2.8)

> 7 April 2016

- Adds `node4.3` runtime [`#29`](https://github.com/dherault/serverless-offline/pull/29)
- unsupported runtime warning and 404 route [`8798c3f`](https://github.com/dherault/serverless-offline/commit/8798c3f83c7715c0f097e0dfac247e9b0cd52ef2)

#### [v2.2.7](https://github.com/dherault/serverless-offline/compare/v2.2.6...v2.2.7)

> 4 April 2016

#### [v2.2.6](https://github.com/dherault/serverless-offline/compare/v2.2.5...v2.2.6)

> 1 April 2016

#### [v2.2.5](https://github.com/dherault/serverless-offline/compare/v2.2.4...v2.2.5)

> 1 April 2016

- Normalize request.headers capitalization [`#23`](https://github.com/dherault/serverless-offline/pull/23)
- added getRemainingTimeInMs [`43da984`](https://github.com/dherault/serverless-offline/commit/43da9849edb7b9fd092dcd12bd540a93dde96b5c)
- Update README.md [`3ae6b2b`](https://github.com/dherault/serverless-offline/commit/3ae6b2bb58ab3cc8255689ad860b25634b1668a3)

#### [v2.2.4](https://github.com/dherault/serverless-offline/compare/v2.2.3...v2.2.4)

> 31 March 2016

#### [v2.2.3](https://github.com/dherault/serverless-offline/compare/v2.2.2...v2.2.3)

> 31 March 2016

#### [v2.2.2](https://github.com/dherault/serverless-offline/compare/v2.2.1...v2.2.2)

> 31 March 2016

- readme: add badge [`#20`](https://github.com/dherault/serverless-offline/pull/20)

#### [v2.2.1](https://github.com/dherault/serverless-offline/compare/v2.2.0...v2.2.1)

> 30 March 2016

- edited README [`3ff3719`](https://github.com/dherault/serverless-offline/commit/3ff3719c96bae55cecd8064f78139fed0d917726)

#### [v2.2.0](https://github.com/dherault/serverless-offline/compare/v2.1.1...v2.2.0)

> 30 March 2016

#### [v2.1.1](https://github.com/dherault/serverless-offline/compare/v2.1.0...v2.1.1)

> 26 March 2016

#### [v2.1.0](https://github.com/dherault/serverless-offline/compare/v2.0.1...v2.1.0)

> 26 March 2016

#### [v2.0.1](https://github.com/dherault/serverless-offline/compare/v2.0.0...v2.0.1)

> 23 March 2016

- updated README [`202b01b`](https://github.com/dherault/serverless-offline/commit/202b01b66ab129053449857558ddc52f5fdfb5fd)

### [v2.0.0](https://github.com/dherault/serverless-offline/compare/v1.3.1...v2.0.0)

> 23 March 2016

- about to merge into master [`49bc5a9`](https://github.com/dherault/serverless-offline/commit/49bc5a96300f2a3c2266a27246ddd20e7cbb36dc)
- new sls plugin configuration [`86bb530`](https://github.com/dherault/serverless-offline/commit/86bb530b05c8d4d43b38c2c4622dc517bdb2374a)
- serverless 0.5 ready [`8769f53`](https://github.com/dherault/serverless-offline/commit/8769f537f52ac0f3e2223e85218f54062c7d48d1)

#### [v1.3.1](https://github.com/dherault/serverless-offline/compare/v1.3.0...v1.3.1)

> 21 March 2016

- edited README [`5146618`](https://github.com/dherault/serverless-offline/commit/51466186ff03918f489a63526060e291cfa440c1)

#### [v1.3.0](https://github.com/dherault/serverless-offline/compare/v1.2.7...v1.3.0)

> 18 March 2016

- new docs [`2593ccb`](https://github.com/dherault/serverless-offline/commit/2593ccb1dddd78ae8bd55a84d322c2da145dc028)
- progress on responseParameters [`1d3627b`](https://github.com/dherault/serverless-offline/commit/1d3627b8000c964e594f05c14a7788f6df0c7d4e)

#### [v1.2.7](https://github.com/dherault/serverless-offline/compare/v1.2.6...v1.2.7)

> 15 March 2016

- responseParameters on their way [`9d79db0`](https://github.com/dherault/serverless-offline/commit/9d79db09435fcbf4d8e1d495c19a234b71630306)

#### [v1.2.6](https://github.com/dherault/serverless-offline/compare/v1.2.5...v1.2.6)

> 15 March 2016

#### [v1.2.5](https://github.com/dherault/serverless-offline/compare/v1.2.4...v1.2.5)

> 14 March 2016

#### [v1.2.4](https://github.com/dherault/serverless-offline/compare/v1.2.3...v1.2.4)

> 14 March 2016

#### [v1.2.3](https://github.com/dherault/serverless-offline/compare/v1.2.2...v1.2.3)

> 14 March 2016

- Fix relative directory for importing TLS certs [`#14`](https://github.com/dherault/serverless-offline/pull/14)
- Fix relative TLS cert directory include [`2cf2bd8`](https://github.com/dherault/serverless-offline/commit/2cf2bd8a64947a35f1f406e17065fdd396c9020f)
- Keep httpsDir in userland [`224913e`](https://github.com/dherault/serverless-offline/commit/224913ec90c8b2bec54718f14c3a161644610b10)
- Update instructions for --httpsProtocol [`6fc7ba4`](https://github.com/dherault/serverless-offline/commit/6fc7ba485e60c894e99e35b431a0da3ebdc08806)
- Bump fix version [`2f4d414`](https://github.com/dherault/serverless-offline/commit/2f4d4149c3eac84cc3732f82533b91c8ea66a7db)
- updated README for 0.5 [`c13eea1`](https://github.com/dherault/serverless-offline/commit/c13eea17af57da1e6d91d5eba6364c858e33d75b)

#### [v1.2.2](https://github.com/dherault/serverless-offline/compare/v1.2.1...v1.2.2)

> 11 March 2016

#### [v1.2.1](https://github.com/dherault/serverless-offline/compare/v1.2.0...v1.2.1)

> 11 March 2016

#### [v1.2.0](https://github.com/dherault/serverless-offline/compare/v1.1.0...v1.2.0)

> 10 March 2016

- Support for coffee lambdas [`#10`](https://github.com/dherault/serverless-offline/pull/10)
- README typo fix [`5dc0502`](https://github.com/dherault/serverless-offline/commit/5dc0502cb4bbde563bc24760fdc53f2f38cb6a2f)
- updated README [`75833ce`](https://github.com/dherault/serverless-offline/commit/75833ce67ac30f6174b1fb7a7b07b925b36fa6c6)
- Documentation for coffee [`dbb98a6`](https://github.com/dherault/serverless-offline/commit/dbb98a6cf7673ff461b53c5e9e1bc1fd197266aa)

#### [v1.1.0](https://github.com/dherault/serverless-offline/compare/v1.0.8...v1.1.0)

> 9 March 2016

- updated README [`222e6a4`](https://github.com/dherault/serverless-offline/commit/222e6a4defdf7e692fe36d8b6313b51d6a1c8d38)

#### [v1.0.8](https://github.com/dherault/serverless-offline/compare/v1.0.6...v1.0.8)

> 9 March 2016

- updated README, removed test_project [`88f4891`](https://github.com/dherault/serverless-offline/commit/88f489120966f67ea47181ed90b15242451689af)
- linting [`f179aca`](https://github.com/dherault/serverless-offline/commit/f179aca39b2041d97baeda3f630e076b352adb42)
- updated README [`8c1bae4`](https://github.com/dherault/serverless-offline/commit/8c1bae4a492e6200da1842e5b21ab23df98d843d)

#### [v1.0.6](https://github.com/dherault/serverless-offline/compare/v1.0.5...v1.0.6)

> 8 March 2016

#### [v1.0.5](https://github.com/dherault/serverless-offline/compare/v1.0.4...v1.0.5)

> 8 March 2016

#### [v1.0.4](https://github.com/dherault/serverless-offline/compare/v1.0.3...v1.0.4)

> 5 March 2016

- updated README [`8a50af0`](https://github.com/dherault/serverless-offline/commit/8a50af08a8d4d9b32c0e1087ec60f0e9015d4964)

#### [v1.0.3](https://github.com/dherault/serverless-offline/compare/v1.0.2...v1.0.3)

> 2 March 2016

#### [v1.0.2](https://github.com/dherault/serverless-offline/compare/v1.0.1...v1.0.2)

> 1 March 2016

#### [v1.0.1](https://github.com/dherault/serverless-offline/compare/v1.0.0...v1.0.1)

> 1 March 2016

- v1.0.1, bugfixes [`469836d`](https://github.com/dherault/serverless-offline/commit/469836d803207a455954ca4014e6a83b65af5daa)
- edited README [`25498a4`](https://github.com/dherault/serverless-offline/commit/25498a45d4f8e5659f035488d7486567b9a156ff)

### [v1.0.0](https://github.com/dherault/serverless-offline/compare/0.2.4...v1.0.0)

> 1 March 2016

- 1.0.0! [`3e725cf`](https://github.com/dherault/serverless-offline/commit/3e725cfae27898cb0b4ace195310774646987ea3)
- merged PR from AdrianClyde [`0d28a7e`](https://github.com/dherault/serverless-offline/commit/0d28a7e4e5f13bc5f919f0cde69e832019d69873)
- getting there with velocity templates, wip [`38a4e45`](https://github.com/dherault/serverless-offline/commit/38a4e45b260d101a778cefcb3ed769f1d98d784d)
- added protocol for https local hosting and updated readme [`70ca918`](https://github.com/dherault/serverless-offline/commit/70ca91861688df6b08633e9ec97269068cf4668a)
- merged v1.0.0 [`27b6905`](https://github.com/dherault/serverless-offline/commit/27b69051f5be2d604001618a72aaaa65a2a437ed)
- event object populated from template + timeout [`83df03e`](https://github.com/dherault/serverless-offline/commit/83df03ed85d8608e3632cbbdcc9cef8c8ca4fc7c)
- createLambdaContext and handler error handling [`91424e7`](https://github.com/dherault/serverless-offline/commit/91424e75367990d0da9861c44096dc6d588f7919)
- switching branch, wip [`7f87dbe`](https://github.com/dherault/serverless-offline/commit/7f87dbe08d50abc3c800c42556b86a1b46ed8548)
- beta3 [`df5be06`](https://github.com/dherault/serverless-offline/commit/df5be0649f7f896b17c8e1e05721f64c6268c34c)
- updated README for v1 [`7d5b076`](https://github.com/dherault/serverless-offline/commit/7d5b076998768b6ee84aed0b51d102117eaf70fb)
- package version [`5401a1f`](https://github.com/dherault/serverless-offline/commit/5401a1f3d7301f59fd1e5626cb247e0e358c8473)

#### [0.2.4](https://github.com/dherault/serverless-offline/compare/0.2.3...0.2.4)

> 26 February 2016

- Typo fix [`#4`](https://github.com/dherault/serverless-offline/pull/4)
- Typo fix. You want to pull out the requestTemplate from the dictionary of requestTemplates. rearranged a bit for clarity [`ff9bda3`](https://github.com/dherault/serverless-offline/commit/ff9bda39eccaa3c5a54a52f44e2d6432fe73477a)

#### [0.2.3](https://github.com/dherault/serverless-offline/compare/0.2.1...0.2.3)

> 26 February 2016

- preping things for 1.0 [`5a78ce3`](https://github.com/dherault/serverless-offline/commit/5a78ce31d9143e8f2c0e5e95210cf0a2df4ce365)
- createVelocityContext [`899d653`](https://github.com/dherault/serverless-offline/commit/899d6530201b61f65d5f9ba37c17156f40026d91)
- velocity here we go [`a8f5f55`](https://github.com/dherault/serverless-offline/commit/a8f5f550a714ddbf0a9e2452834a0ebe6272262d)
- updated README.md [`9285e96`](https://github.com/dherault/serverless-offline/commit/9285e96306f6f758e0b47dddf9958e990c5fabff)
- removed 1.0.0 deps for 0.2.3 [`9bdb43e`](https://github.com/dherault/serverless-offline/commit/9bdb43efac7cccddc2ea774f6228250293522f19)

#### [0.2.1](https://github.com/dherault/serverless-offline/compare/0.2.0...0.2.1)

> 23 February 2016

- added kind of test suite [`48b1674`](https://github.com/dherault/serverless-offline/commit/48b167472fa2c1b90e2552039b8d984b45954f6e)

#### [0.2.0](https://github.com/dherault/serverless-offline/compare/0.1.7...0.2.0)

> 22 February 2016

- Apply request templates to an event [`#1`](https://github.com/dherault/serverless-offline/pull/1)
- added ability to use a request template to map data on to the event object [`f041559`](https://github.com/dherault/serverless-offline/commit/f04155979ba85f63d966bc8b2c4f00c2da005550)

#### [0.1.7](https://github.com/dherault/serverless-offline/compare/0.1.6...0.1.7)

> 22 February 2016

#### [0.1.6](https://github.com/dherault/serverless-offline/compare/0.1.5...0.1.6)

> 22 February 2016

#### [0.1.5](https://github.com/dherault/serverless-offline/compare/0.1.4...0.1.5)

> 22 February 2016

#### [0.1.4](https://github.com/dherault/serverless-offline/compare/0.1.3...0.1.4)

> 21 February 2016

- updated README.md [`8e875b4`](https://github.com/dherault/serverless-offline/commit/8e875b4f1a4da40acfcf8bb37c036152dc82b82c)

#### [0.1.3](https://github.com/dherault/serverless-offline/compare/0.1.2...0.1.3)

> 19 February 2016

- Update README.md [`a0c0f35`](https://github.com/dherault/serverless-offline/commit/a0c0f35bbf2c4332b262031713ba9e956995bf62)
- v0.1.3: trailling slash issue [`c350378`](https://github.com/dherault/serverless-offline/commit/c350378fe1498c80dfb38f0d6a80634c6d2576b4)

#### [0.1.2](https://github.com/dherault/serverless-offline/compare/0.1.1...0.1.2)

> 17 February 2016

- better error handling [`42fd6e9`](https://github.com/dherault/serverless-offline/commit/42fd6e9fc821accb2083de354356f036b372c916)

#### [0.1.1](https://github.com/dherault/serverless-offline/compare/0.1.0...0.1.1)

> 17 February 2016

- updated README.md [`21ae6f4`](https://github.com/dherault/serverless-offline/commit/21ae6f43baef02649aeec760418708ab568bfd26)

#### 0.1.0

> 17 February 2016

- refactoring from nopik/serverless-serve [`5a6054c`](https://github.com/dherault/serverless-offline/commit/5a6054c73470322c93c09cd82e4886044064ad57)
- Initial commit [`c62859f`](https://github.com/dherault/serverless-offline/commit/c62859fac2d10cfdfcb46e95dedbb57f0a9fcbc8)
