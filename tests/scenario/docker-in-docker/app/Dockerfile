FROM node:16-bullseye-slim

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG UID=1000
ARG GID=1000
RUN groupmod -g ${GID} node && usermod -u ${UID} -g ${GID} node

COPY install_docker.sh .
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && sh install_docker.sh \
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*

USER node
ENV HOME=/home/node
