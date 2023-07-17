# Define the build stage
FROM node:20-alpine as build

WORKDIR /app

RUN npm install -g pnpm

COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN CI=TRUE pnpm install --frozen-lockfile

COPY --chown=node:node . .

RUN pnpm run build

ENV NODE_ENV=production

RUN CI=TRUE pnpm install --frozen-lockfile --prod
RUN pnpm prisma generate

USER node

FROM node:20-alpine as production

WORKDIR /app

RUN apk add bash

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/scripts/wait-for-it.sh ./wait-for-it.sh
COPY --chown=node:node --from=build /app/scripts/start-prod.sh ./start-prod.sh
COPY --chown=node:node --from=build /app/prisma ./prisma
COPY --chown=node:node --from=build /app/package.json ./package.json

RUN chmod +x ./start-prod.sh
RUN chmod +x ./wait-for-it.sh

EXPOSE 3000

CMD ["bash", "./start-prod.sh"]
