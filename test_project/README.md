#offline-test

Writting a test suite for this project seemed complicated, 
so in order to test your contributions please run cd in this dir and run `npm run install_all`. 
Then, while running the commands indicated in each section, 
invoke each given methods and compare your result to the reference result.
You don't have to do all of it, just the ones related to your PR.

### Basic tests

#### 1

**description:** Basic testing

**command:** `sls offline start`

**methods:** Get /, Get /test1

**success:** `{ message: "Your Serverless function ran successfully!" }`

#### 2

**description:** Prefix testing

**commands:** `sls offline start -p dev`, `sls offline start -p /dev`, `sls offline start -p dev/`, `sls offline start -p /dev/` 

**methods:** Get /dev, Get /dev/test1

**success:** `{ message: "Your Serverless function ran successfully!" }`


#### 3

**description:** Port testing

**command:** `sls offline start -P 3001` (or whatever port)

**method:** Get /

**success:** `{ message: "Your Serverless function ran successfully!" }`


### Lazy loading tests

#### 4

**description:** function test2 throws when loaded

**command:** `sls offline start`

**method:** Get /test2

**success:** A HTML page displaying `SyntaxError: Unexpected token var`

#### 5

**description:** function test3 is not a function (its a string) so...

**command:** `sls offline start`

**method:** Get /test3

**success:** A HTML page displaying `Handler for function test3 is not a function`


### Context tests

#### 6

**description:** function test4 never calls `context.done` (or succeed or fail)

**command:** `sls offline start`

**method:** Get /test4

**success:** `{"statusCode":503,"error":"Service Unavailable"}` after 3 seconds (timeout)

#### 7

**description:** function test5 call `context.fail` but no `errorPattern` is provided in the endpoint.

**command:** `sls offline start`

**method:** Get /test5

**success:** `{"errorMessage":"Oh no!","errorType":"Error","stackTrace":[...]}` and statusCode 200

#### 8

**description:** function test6 call `context.fail` and an `errorPattern` is provided in the endpoint.

**command:** `sls offline start`

**method:** Get /test6

**success:** `{"errorMessage":"400 Oh no!","errorType":"Error","stackTrace":[...]}` and statusCode 400
