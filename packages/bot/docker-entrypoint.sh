#!/bin/sh

while IFS='=' read -r var value; do
    if [ -z "$value" ]; then
        unset "$var"
    fi
done < <(env)

node packages/bot/index.js