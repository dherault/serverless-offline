#!/bin/bash

echo "Deploying to Offline:"
if [ -d "./node_modules/serverless-offline" ]; then 
  if [ ! -L "./node_modules/serverless-offline" ]; then
    echo "Removing serverless-offline ..."
    npm remove serverless-offline
    echo "Linking serverless-offline ..."
    npm link serverless-offline
  else 
    echo "serverless-offline already linked."
  fi
else
  echo "Linking serverless-offline ..."
  npm link serverless-offline
fi
echo "Starting Offline Server ..."
sls offline --config ./config/serverless.$1.yml
