#!/bin/sh -eu
echo "starting entrypoint" >&1
cd /home/node/app
# yarn typeorm -f ./ormconfig-migrations.js migration:run
node main.js
echo "express started" >&1