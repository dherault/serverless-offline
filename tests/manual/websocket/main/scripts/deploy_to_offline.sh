#!/bin/bash

echo "Deploying to Offline ..."
echo "Instaing node modules ..."
yarn
echo "Linking serverless-offline ..."
yarn link serverless-offline
echo "Copying serverless.yml ..."
cp ./scripts/serverless..yml ./serverless.yml
cat ./scripts/serverless.offline.yml >> ./serverless.yml
echo "Deploying to Offline ..."
yarn start
