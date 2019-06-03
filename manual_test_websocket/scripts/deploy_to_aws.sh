#!/bin/bash

echo "Deploying to AWS ..."
echo "Removing node modules ..."
rm -fr ./node_modules
echo "Instaing aws-sdk ..."
npm i aws-sdk
echo "Copying serverless.yml ..."
cp ./scripts/serverless..yml ./serverless.yml
cat ./scripts/serverless.aws.yml >> ./serverless.yml
echo "Deploying to AWS ..."
sls deploy
