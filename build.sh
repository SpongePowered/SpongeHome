#!/usr/bin/env bash

if [ ! which docker >/dev/null 2>&1 ]; then
  echo You don\'t seem to have "docker" installed.
  exit 1
fi

echo Building dockerfile...
exec docker build "$@" .

