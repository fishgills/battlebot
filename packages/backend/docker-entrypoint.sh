#!/bin/sh
cd /app/packages/$APP/
yarn typeorm -d ./ormconfig-migrations.js migration:run
node main.js
