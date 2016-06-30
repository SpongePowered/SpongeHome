#!/usr/bin/env bash

if [ ! which docker >/dev/null 2>&1 ]; then
  echo You don\'t seem to have "docker" installed.
  exit 1
fi

echo Building dockerfile...
exec docker build --build-arg FASTLY_KEY=${FASTLY_KEY} --build-arg BUILD_NUMBER=${BUILD_NUMBER} --build-arg GIT_BRANCH=${GIT_BRANCH} --build-arg JOB_NAME=${JOB_NAME} --build-arg GIT_COMMIT=${GIT_COMMIT} --build-arg BUILD_TAG=${BUILD_TAG} "$@" .
