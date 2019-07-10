#!/bin/bash

echo "Deploying to AWS:"
if [ -d "./node_modules/serverless-offline" ]; then 
  if [ -L "./node_modules/serverless-offline" ]; then
    echo "Unlinking serverless-offline ..."
    npm unlink serverless-offline
    echo "Installing serverless-offline ..."
    npm i serverless-offline --no-save
  else 
    echo "serverless-offline already installed."
  fi
else
  echo "Installing serverless-offline ..."
  npm i serverless-offline --no-save
fi
echo "Deploying to AWS ..."
sls deploy --config ./config/serverless.$1.yml
