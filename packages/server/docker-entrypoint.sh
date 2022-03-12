#!/bin/sh -eu
echo "starting entrypoint" >&1
cd /tmp
yarn typeorm -f ./ormconfig-migrations.js migration:run
node --inspect main.js
echo "express started" >&1