#!/usr/bin/env bash

# This script is used by Travis in order to trigger an automated build in Docker Hub.
if [[ $TRAVIS_BRANCH == "8.x-2.x" ]] && [[ $TRAVIS_PULL_REQUEST == "false" ]]
then
  curl -H "Content-Type: application/json" --data '{"build": true}' -X POST https://registry.hub.docker.com/u/drupalwxt/site-wxt/trigger/$DOCKERHUB_TOKEN/
fi
