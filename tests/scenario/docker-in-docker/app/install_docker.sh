#!/usr/bin/env sh

set -e

apt-get update
apt-get remove docker
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --batch --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" |
    tee /etc/apt/sources.list.d/docker.list >/dev/null

apt-get update
apt install -y docker-ce-cli docker-compose-plugin

groupadd docker
usermod -aG docker node
