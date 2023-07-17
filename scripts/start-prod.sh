#!/usr/bin/env bash

./wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
./node_modules/.bin/prisma migrate deploy
npm prisma db seed
node ./dist/main.js