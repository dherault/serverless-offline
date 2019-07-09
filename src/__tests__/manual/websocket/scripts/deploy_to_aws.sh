#!/bin/bash

echo "Deploying to AWS:"
echo "Instaing serverless-offline ..."
npm i serverless-offline
echo "Deploying to AWS ..."
sls deploy --config ./config/serverless.$1.yml
