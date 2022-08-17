#!/usr/bin/env sh

set -e

# cd /serverless-offline && ls -la

apk update
apk add --no-cache docker-cli

npm run start -- --dockerHostServicePath ${HOST_SERVICE_PATH}
