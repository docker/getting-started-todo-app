FROM node:20-alpine AS base
WORKDIR /usr/local/app

FROM base AS dev
CMD ["yarn", "dev"]

FROM base AS final
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
CMD ["node", "src/index.js"]