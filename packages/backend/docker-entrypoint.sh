#!/bin/sh

cd db
../node_modules/.bin/typeorm-ts-node-commonjs migration:run -d ./typeorm.config.ts
cd ..
node main.js