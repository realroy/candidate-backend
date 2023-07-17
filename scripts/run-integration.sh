#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh
docker-compose -f ./docker-compose.e2e.yml up -d --force-recreate
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
pnpm prisma migrate dev --name init
vitest --config ./vitest.config.e2e.ts --ui --coverage