#!/bin/sh -eu
echo "starting entrypoint" >&1
cd /tmp
yarn typeorm -f ./ormconfig-migrations.js migration:show
yarn typeorm -f ./ormconfig-migrations.js migration:run
node main.js
echo "express started" >&1