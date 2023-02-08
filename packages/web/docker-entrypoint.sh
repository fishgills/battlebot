#!/bin/sh -eu
mkdir /next
cd /next
cp /app/packages/web/public /next/public
cp /app/packages/web/dist/standalone/* /next/
cp /app/packages/web/dist/static/* /next/static
cp /app/packages/web/node_modules/* /next/node_modules/