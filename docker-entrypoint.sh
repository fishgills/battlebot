#!/bin/sh -eu
echo "starting entrypoint" >&1
ls -al /tmp
node /tmp/dist/main
echo "express started" >&1