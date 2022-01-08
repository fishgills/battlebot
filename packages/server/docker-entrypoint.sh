#!/bin/sh -eu
echo "starting entrypoint" >&1
node /tmp/dist/main
echo "express started" >&1