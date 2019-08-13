#!/bin/bash

echo "Deploying to AWS ..."
sls deploy --config ./config/serverless.$1.yml
