#!/bin/bash

echo "Starting Offline Server ..."
sls offline --config ./config/serverless.$1.yml
