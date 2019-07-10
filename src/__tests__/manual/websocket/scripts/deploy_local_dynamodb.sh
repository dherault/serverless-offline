#!/bin/bash

echo "Deploying Local DynamoDB:" 
sls dynamodb start --config ./config/serverless.data.yml