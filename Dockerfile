###################################################
# Stage: base
# 
# This base stage ensures all other stages are using the same base image
# and provides common configuration for all stages, such as the working dir.
###################################################
FROM node:20 AS base
WORKDIR /usr/local/app

###################################################
# Stage: dev
#
# This stage is used for local development. It is expected that the files
# are mounted into the container at runtime, hence there are no COPY
# statements. The default CMD will install the yarn dependencies and then
# start the development server.
#
# This stage is the specified in the compose.yaml file (see the target field).
###################################################
FROM base AS dev
CMD ["yarn", "dev"]

###################################################
# Stage: client-build
#
# This stage builds the client application, producing static HTML, CSS, and
# JS files that can be served by the backend.
#
# This build seeks to optimize the build cache as much as possible by
# installing the dependencies before copying in the main source code.
###################################################
FROM base AS client-build
COPY client/package.json client/yarn.lock ./
RUN --mount=type=cache,id=yarn,target=/root/.yarn yarn install
COPY client/.eslintrc.cjs client/index.html client/vite.config.js ./
COPY client/public ./public
COPY client/src ./src
RUN yarn build

###################################################
# Stage: test
#
# This stage runs the tests on the backend. This is split into a separate
# stage to allow the final image to not have the test dependencies or test
# cases.
###################################################
FROM base AS test
COPY backend/package.json backend/yarn.lock ./
RUN --mount=type=cache,id=yarn,target=/root/.yarn yarn install --frozen-lockfile
COPY backend/spec ./spec
COPY backend/src ./src
RUN yarn test

###################################################
# Stage: final
#
# This stage is intended to be the final "production" image. It sets up the
# backend and copies the built client application from the client-build stage.
#
# It pulls the package.json and yarn.lock from the test stage to ensure that
# the tests run (without this, the test stage would simply be skipped).
###################################################
FROM base AS final
ENV NODE_ENV=production
COPY --from=test /usr/local/app/package.json /usr/local/app/yarn.lock ./
RUN --mount=type=cache,id=yarn,target=/root/.yarn yarn install --production --frozen-lockfile
COPY backend/src ./src
COPY --from=client-build /usr/local/app/dist ./src/static
EXPOSE 3000
CMD ["node", "src/index.js"]