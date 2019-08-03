#!/bin/bash

echo "Deploying Local DynamoDB:" 
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
echo "Installing Local DynamoDB ..."
sls dynamodb install --config ./config/serverless.data.yml
echo "Installing Local Scheme ..."
sls dynamodb start --config ./config/serverless.data.yml