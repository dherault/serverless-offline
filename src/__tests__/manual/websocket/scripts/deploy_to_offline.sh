#!/bin/bash

echo "Deploying to Offline:"
echo "Linking serverless-offline ..."
npm link serverless-offline
echo "Starting Offline Server ..."
sls offline --config ./config/serverless.$1.yml
