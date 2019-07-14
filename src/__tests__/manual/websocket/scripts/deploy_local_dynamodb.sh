#!/bin/bash

echo "Deploying Local DynamoDB:" 
echo "Installing Local DynamoDB ..."
sls dynamodb install --config ./config/serverless.data.yml
echo "Installing Local Scheme ..."
sls dynamodb start --config ./config/serverless.data.yml