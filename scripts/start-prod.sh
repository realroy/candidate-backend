#!/usr/bin/env bash

./wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
./node_modules/.bin/prisma migrate deploy
./node_modules/.bin/prisma db seed
node ./dist/main.js