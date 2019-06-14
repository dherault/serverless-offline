#!/bin/bash

echo "Deploying to Offline ..."
echo "Removing node modules ..."
rm -fr ./node_modules
echo "Instaing node modules ..."
npm i 
echo "Linking serverless-offline ..."
npm link serverless-offline
echo "Copying serverless.yml ..."
cp ./scripts/serverless..yml ./serverless.yml
cat ./scripts/serverless.offline.yml >> ./serverless.yml
echo "Deploying to Offline ..."
sls offline
