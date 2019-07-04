# Manual test Node.js

## Installation

In the plugin directory:
`npm link`
`cd manual_test_nodejs`
`npm link serverless-offline`

## Testing signals

`node subprocess.js`

It should stop after 10 seconds with the proper halting message

## Testing resource proxy

`npm start -- --resourceRoutes`
