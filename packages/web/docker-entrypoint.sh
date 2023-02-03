#!/bin/sh -eu
echo "starting entrypoint" >&1
cd /app/packages/web
node server.js
echo "nextjs started" >&1