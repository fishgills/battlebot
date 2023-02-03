#!/bin/sh
echo "starting entrypoint" >&1
cd /app/packages/$APP/
yarn typeorm -d ./ormconfig-migrations.js migration:run
node main.js
