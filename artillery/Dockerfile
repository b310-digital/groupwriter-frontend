FROM node:22-bookworm-slim

WORKDIR /home/node/artillery

RUN npx playwright install --with-deps chromium
RUN npm install -g artillery
