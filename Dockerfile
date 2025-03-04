# Base:
FROM node:22-alpine AS base

RUN apk add --no-cache bash git

USER node

ENV APP_PATH=/home/node/app

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

COPY --chown=node:node package.json package-lock.json tsconfig.json $APP_PATH/

# Development:
FROM base AS development
USER node

RUN npm install

# Production builder:
FROM base AS production_builder
ARG VITE_HOCUSPOCUS_SERVER_URL
ARG VITE_HOCUSPOCUS_SUBDOMAIN
ARG VITE_LEGAL_URL
ARG VITE_PRIVACY_STATEMENT_URL

USER node

# first, copy packages as these are built during the install step
COPY  --chown=node:node packages $APP_PATH/packages

RUN npm ci

COPY  --chown=node:node src $APP_PATH/src
COPY  --chown=node:node public $APP_PATH/public
COPY  --chown=node:node config $APP_PATH/config
COPY  --chown=node:node postcss.config.mjs vite.config.ts index.html $APP_PATH/

RUN npm run build

# Production:
FROM nginxinc/nginx-unprivileged:stable-alpine-slim AS production

COPY --from=production_builder --chown=nginx:nginx /home/node/app/dist /usr/share/nginx/html
COPY --from=production_builder --chown=nginx:nginx /home/node/app/config/nginx/default.conf /etc/nginx/conf.d/default.conf