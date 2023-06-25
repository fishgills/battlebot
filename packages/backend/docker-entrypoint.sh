#!/bin/sh

cd db
../node_modules/.bin/typeorm migration:run -d ./typeorm.config.ts
cd ..
node main.js