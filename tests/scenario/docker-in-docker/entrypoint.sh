#!/usr/bin/env sh

set -e

apk update
apk add --no-cache docker-cli
npm run start -- --service-path ${1}
