#!/bin/bash

echo "Deploying to AWS ..."
echo "Instaing node modules ..."
npm i
echo "Copying serverless.yml ..."
cp ./scripts/serverless..yml ./serverless.yml
cat ./scripts/serverless.aws.yml >> ./serverless.yml
echo "Deploying to AWS ..."
sls deploy
