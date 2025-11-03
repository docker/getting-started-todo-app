###################################################
# Stage: base
# 
# This base stage ensures all other stages are using the same base image
# and provides common configuration for all stages, such as the working dir.
###################################################
FROM node:20 AS base
WORKDIR /usr/local/app

################## CLIENT STAGES ##################

###################################################
# Stage: client-base
#
# This stage is used as the base for the client-dev and client-build stages,
# since there are common steps needed for each.
###################################################
FROM base AS client-base
COPY client/package.json client/yarn.lock ./
RUN --mount=type=cache,id=yarn,target=/usr/local/share/.cache/yarn \
    yarn install
COPY client/.eslintrc.cjs client/index.html client/vite.config.js ./
COPY client/public ./public
COPY client/src ./src

###################################################
# Stage: client-dev
# 
# This stage is used for development of the client application. It sets 
# the default command to start the Vite development server.
###################################################
FROM client-base AS client-dev
CMD ["yarn", "dev"]

###################################################
# Stage: client-build
#
# This stage builds the client application, producing static HTML, CSS, and
# JS files that can be served by the backend.
###################################################
FROM client-base AS client-build
RUN yarn build

###################################################
# Stage: client-prod
#
# This stage builds the client application and serves it with Nginx.
###################################################
FROM nginx:1.25
COPY --from=client-build /usr/local/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

###################################################
################  BACKEND STAGES  #################
###################################################

###################################################
# Stage: backend-base
#
# This stage is used as the base for the backend-dev and test stages, since
# there are common steps needed for each.
###################################################
FROM base AS backend-dev
COPY backend/package.json backend/yarn.lock ./
RUN --mount=type=cache,id=yarn,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile
COPY backend/spec ./spec
COPY backend/src ./src
CMD ["yarn", "dev"]

###################################################
# Stage: test
#
# This stage runs the tests on the backend. This is split into a separate
# stage to allow the final image to not have the test dependencies or test
# cases.
###################################################
FROM backend-dev AS test
RUN yarn test